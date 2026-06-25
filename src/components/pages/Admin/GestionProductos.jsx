import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// Minúsculas + sin acentos, para buscar "atun" y que encuentre "atún".
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Gestión de productos del panel de admin (2c.2 + 2c.3 + orden).
 * Lista las categorías con sus productos y permite editar, crear, borrar y
 * reordenar (flechas ▲▼), guardando cada cambio en Supabase.
 */
export default function GestionProductos() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [migrando, setMigrando] = useState(null); // null | { hechas, total, errores, done }
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, titulo, descripcion, tags, orden, productos(id, nombre, descripcion, foto, disponible, orden)')
        .order('orden', { ascending: true });

      if (error) setError(error.message);
      else setCategorias(data || []);
      setCargando(false);
    })();
  }, []);

  const añadirProducto = (catId, nuevo) =>
    setCategorias(cats =>
      cats.map(c => (c.id === catId ? { ...c, productos: [...(c.productos || []), nuevo] } : c))
    );

  const quitarProducto = (catId, prodId) =>
    setCategorias(cats =>
      cats.map(c =>
        c.id === catId ? { ...c, productos: (c.productos || []).filter(p => p.id !== prodId) } : c
      )
    );

  const actualizarCategoria = (catId, campos) =>
    setCategorias(cats => cats.map(c => (c.id === catId ? { ...c, ...campos } : c)));

  // Intercambia el orden de un producto con su vecino (dir: -1 sube, +1 baja)
  const moverProducto = async (catId, prodId, dir) => {
    const cat = categorias.find(c => c.id === catId);
    if (!cat) return;
    const orden = (cat.productos || []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    const i = orden.findIndex(p => p.id === prodId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= orden.length) return;

    const a = orden[i];
    const b = orden[j];
    const ordenA = a.orden ?? i;
    const ordenB = b.orden ?? j;

    // Optimista: reflejamos el cambio en local ya
    setCategorias(cats =>
      cats.map(c =>
        c.id !== catId
          ? c
          : {
              ...c,
              productos: c.productos.map(p =>
                p.id === a.id ? { ...p, orden: ordenB } : p.id === b.id ? { ...p, orden: ordenA } : p
              ),
            }
      )
    );

    const [r1, r2] = await Promise.all([
      supabase.from('productos').update({ orden: ordenB }).eq('id', a.id),
      supabase.from('productos').update({ orden: ordenA }).eq('id', b.id),
    ]);
    if (r1.error || r2.error) window.alert('Error al reordenar. Recarga la página.');
  };

  // Intercambia el orden de una categoría con su vecina (dir: -1 sube, +1 baja)
  const moverCategoria = async (catId, dir) => {
    const orden = categorias.slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    const i = orden.findIndex(c => c.id === catId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= orden.length) return;

    const a = orden[i];
    const b = orden[j];
    const ordenA = a.orden ?? i;
    const ordenB = b.orden ?? j;

    setCategorias(cats =>
      cats.map(c =>
        c.id === a.id ? { ...c, orden: ordenB } : c.id === b.id ? { ...c, orden: ordenA } : c
      )
    );

    const [r1, r2] = await Promise.all([
      supabase.from('categorias').update({ orden: ordenB }).eq('id', a.id),
      supabase.from('categorias').update({ orden: ordenA }).eq('id', b.id),
    ]);
    if (r1.error || r2.error) window.alert('Error al reordenar categorías. Recarga la página.');
  };

  // Salta a la sección de una categoría
  const irA = (catId) => {
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Migra (una sola vez) las fotos que aún viven en /fotos/ a Supabase Storage.
  const migrarFotos = async () => {
    const pendientes = [];
    categorias.forEach(c =>
      (c.productos || []).forEach(p => {
        if (p.foto && p.foto.startsWith('/fotos/')) pendientes.push({ catId: c.id, p });
      })
    );
    if (pendientes.length === 0) {
      window.alert('No hay fotos antiguas que migrar. Todo está ya en Storage.');
      return;
    }
    if (!window.confirm(`Se migrarán ${pendientes.length} fotos a Storage. ¿Continuar?`)) return;

    let hechas = 0;
    let errores = 0;
    setMigrando({ hechas, total: pendientes.length, errores, done: false });

    for (const { catId, p } of pendientes) {
      try {
        const resp = await fetch(p.foto);
        if (!resp.ok) throw new Error('imagen no encontrada');
        const blob = await resp.blob();
        const ext = (p.foto.split('.').pop() || 'jpg').toLowerCase();
        const ruta = `mig-${p.id}-${Date.now()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from('productos')
          .upload(ruta, blob, { cacheControl: '3600', upsert: false, contentType: blob.type || undefined });
        if (upErr) throw upErr;

        const { data } = supabase.storage.from('productos').getPublicUrl(ruta);
        const { error: dbErr } = await supabase.from('productos').update({ foto: data.publicUrl }).eq('id', p.id);
        if (dbErr) throw dbErr;

        setCategorias(cats =>
          cats.map(c =>
            c.id === catId
              ? { ...c, productos: c.productos.map(x => (x.id === p.id ? { ...x, foto: data.publicUrl } : x)) }
              : c
          )
        );
        hechas++;
      } catch {
        errores++;
      }
      setMigrando({ hechas, total: pendientes.length, errores, done: false });
    }
    setMigrando({ hechas, total: pendientes.length, errores, done: true });
  };

  if (cargando) return <p className="text-stone-500">Cargando productos…</p>;
  if (error) return <p className="text-red-700">Error al cargar: {error}</p>;

  const cats = categorias.slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  // ¿Quedan fotos antiguas (/fotos/) sin migrar? Solo entonces tiene sentido Mantenimiento.
  const hayFotosAntiguas = categorias.some(c =>
    (c.productos || []).some(p => p.foto && p.foto.startsWith('/fotos/'))
  );

  // Búsqueda: filtra productos por nombre/descripción (sin acentos)
  const q = normaliza(busqueda.trim());
  const buscando = q.length > 0;
  const coincide = (p) => normaliza(`${p.nombre || ''} ${p.descripcion || ''}`).includes(q);
  const catsVisibles = buscando ? cats.filter(c => (c.productos || []).some(coincide)) : cats;

  return (
    <div>
      {/* Zona fija: buscador + índice de categorías */}
      <div className="sticky top-0 z-20 -mx-6 px-6 py-3 mb-8 bg-stone-100/95 backdrop-blur border-b border-stone-200 space-y-3">
        <div className="relative">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full border border-stone-300 px-3 py-2 pr-8 focus:outline-none focus:border-amber-700"
          />
          {buscando && (
            <button
              onClick={() => setBusqueda('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>
          )}
        </div>
        {!buscando && (
          <nav className="flex gap-2 overflow-x-auto [scrollbar-width:thin]">
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => irA(cat.id)}
                className="shrink-0 text-sm px-3 py-1 rounded-full bg-white border border-stone-300 text-stone-700 hover:border-amber-700 hover:text-amber-700 whitespace-nowrap transition-colors"
              >
                {cat.titulo}
              </button>
            ))}
          </nav>
        )}
      </div>

      {buscando && catsVisibles.length === 0 && (
        <p className="text-stone-500">No hay productos que coincidan con “{busqueda}”.</p>
      )}

      <div className="space-y-10">
        {catsVisibles.map((cat, i) => (
          <CategoriaSeccion
            key={cat.id}
            categoria={cat}
            busqueda={buscando ? q : ''}
            coincide={coincide}
            esPrimera={i === 0}
            esUltima={i === catsVisibles.length - 1}
            onCreado={(nuevo) => añadirProducto(cat.id, nuevo)}
            onBorrado={(prodId) => quitarProducto(cat.id, prodId)}
            onMover={(prodId, dir) => moverProducto(cat.id, prodId, dir)}
            onActualizada={(campos) => actualizarCategoria(cat.id, campos)}
            onMoverCategoria={(dir) => moverCategoria(cat.id, dir)}
          />
        ))}
      </div>

      {/* Mantenimiento: solo si quedan fotos antiguas por migrar (o mientras se migran) */}
      {(hayFotosAntiguas || migrando) && (
      <div className="mt-16 pt-6 border-t border-stone-200">
        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Mantenimiento</h3>
        <p className="text-sm text-stone-500 mb-3">
          Pasa las fotos antiguas (las que están en <code>/fotos/</code>) al almacenamiento de
          Supabase. Es una tarea de una sola vez; las fotos nuevas ya van directas a Storage.
        </p>
        <button
          onClick={migrarFotos}
          disabled={migrando && !migrando.done}
          className="border border-stone-400 hover:border-amber-700 hover:text-amber-700 disabled:opacity-40 text-stone-700 px-4 py-1.5 text-sm uppercase tracking-wider transition-colors"
        >
          {migrando && !migrando.done ? 'Migrando…' : 'Migrar fotos antiguas a Storage'}
        </button>
        {migrando && !migrando.done && (
          <p className="text-sm mt-2 text-stone-600">Migrando {migrando.hechas} de {migrando.total}…</p>
        )}
        {migrando && migrando.done && (
          <div className="text-sm mt-2 text-stone-600 flex items-center gap-3 flex-wrap">
            <span>
              Listo: {migrando.hechas} migradas{migrando.errores ? `, ${migrando.errores} con error` : ''}.
              Recarga para ver todo uniforme.
            </span>
            <button
              onClick={() => window.location.reload()}
              className="border border-stone-400 hover:border-amber-700 hover:text-amber-700 text-stone-700 px-3 py-1 text-xs uppercase tracking-wider transition-colors"
            >
              Recargar
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

/* ── Sección de una categoría (cabecera + alta + lista) ───── */
function CategoriaSeccion({ categoria, busqueda, coincide, esPrimera, esUltima, onCreado, onBorrado, onMover, onActualizada, onMoverCategoria }) {
  const [añadiendo, setAñadiendo] = useState(false);
  const [editando, setEditando] = useState(false);
  const buscando = !!busqueda;
  const productos = (categoria.productos || []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const visibles = buscando ? productos.filter(coincide) : productos;

  return (
    <section id={`cat-${categoria.id}`} className="scroll-mt-24">
      <div className="flex items-center justify-between border-b border-stone-300 pb-2 mb-4 gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2 min-w-0">
          {!buscando && (
            <span className="flex flex-col shrink-0">
              <button
                onClick={() => onMoverCategoria(-1)}
                disabled={esPrimera}
                aria-label="Subir categoría"
                className="leading-none text-xs text-stone-400 hover:text-amber-700 disabled:opacity-30 disabled:hover:text-stone-400"
              >
                ▲
              </button>
              <button
                onClick={() => onMoverCategoria(1)}
                disabled={esUltima}
                aria-label="Bajar categoría"
                className="leading-none text-xs text-stone-400 hover:text-amber-700 disabled:opacity-30 disabled:hover:text-stone-400"
              >
                ▼
              </button>
            </span>
          )}
          <span className="truncate">{categoria.titulo}</span>
          <span className="text-stone-400 text-sm font-normal shrink-0">
            {' · '}{buscando ? `${visibles.length} de ${productos.length}` : `${productos.length} productos`}
          </span>
        </h2>
        {!buscando && (
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setEditando(e => !e)}
              className="text-stone-500 hover:text-stone-800 text-sm font-semibold transition-colors"
            >
              {editando ? 'Cancelar' : 'Editar'}
            </button>
            <button
              onClick={() => setAñadiendo(a => !a)}
              className="text-amber-700 hover:text-amber-800 text-sm font-semibold transition-colors"
            >
              {añadiendo ? 'Cancelar' : '+ Añadir producto'}
            </button>
          </div>
        )}
      </div>

      {!buscando && editando && (
        <CategoriaEditor
          categoria={categoria}
          onGuardado={(campos) => { onActualizada(campos); setEditando(false); }}
        />
      )}

      {!buscando && añadiendo && (
        <NuevoProducto
          categoria={categoria}
          onCreado={(nuevo) => { onCreado(nuevo); setAñadiendo(false); }}
        />
      )}

      {visibles.length === 0 ? (
        <p className="text-stone-400 text-sm italic">Sin productos todavía.</p>
      ) : (
        <div className="space-y-4">
          {visibles.map((p, i) => (
            <ProductoFila
              key={p.id}
              producto={p}
              mostrarOrden={!buscando}
              esPrimero={i === 0}
              esUltimo={i === visibles.length - 1}
              onBorrado={() => onBorrado(p.id)}
              onMover={(dir) => onMover(p.id, dir)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Fila editable de un producto ─────────────────────────── */
function ProductoFila({ producto, mostrarOrden = true, esPrimero, esUltimo, onBorrado, onMover }) {
  const [nombre, setNombre] = useState(producto.nombre || '');
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [foto, setFoto] = useState(producto.foto || '');
  const [disponible, setDisponible] = useState(producto.disponible);
  const [estado, setEstado] = useState('idle'); // idle | guardando | guardado | error
  const [borrando, setBorrando] = useState(false);

  const modificado =
    nombre !== (producto.nombre || '') ||
    descripcion !== (producto.descripcion || '') ||
    foto !== (producto.foto || '') ||
    disponible !== producto.disponible;

  const guardar = async () => {
    setEstado('guardando');
    const { error } = await supabase
      .from('productos')
      .update({ nombre, descripcion, foto: foto || null, disponible })
      .eq('id', producto.id);

    if (error) {
      setEstado('error');
    } else {
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.foto = foto;
      producto.disponible = disponible;
      setEstado('guardado');
      setTimeout(() => setEstado('idle'), 2000);
    }
  };

  const borrar = async () => {
    if (!window.confirm(`¿Borrar "${producto.nombre}"? No se puede deshacer.`)) return;
    setBorrando(true);
    const { error } = await supabase.from('productos').delete().eq('id', producto.id);
    if (error) {
      setBorrando(false);
      window.alert('Error al borrar: ' + error.message);
    } else {
      onBorrado();
    }
  };

  return (
    <div className="bg-white border border-stone-200 p-4 flex gap-3">
      {/* Flechas de orden (ocultas durante la búsqueda) */}
      {mostrarOrden && (
        <div className="flex flex-col justify-center gap-1 shrink-0">
          <button
            onClick={() => onMover(-1)}
            disabled={esPrimero}
            aria-label="Subir"
            className="w-7 h-7 flex items-center justify-center border border-stone-300 text-stone-600 hover:border-amber-700 hover:text-amber-700 disabled:opacity-30 disabled:hover:border-stone-300 disabled:hover:text-stone-600 transition-colors"
          >
            ▲
          </button>
          <button
            onClick={() => onMover(1)}
            disabled={esUltimo}
            aria-label="Bajar"
            className="w-7 h-7 flex items-center justify-center border border-stone-300 text-stone-600 hover:border-amber-700 hover:text-amber-700 disabled:opacity-30 disabled:hover:border-stone-300 disabled:hover:text-stone-600 transition-colors"
          >
            ▼
          </button>
        </div>
      )}

      <SubirFoto foto={foto} onSubida={setFoto} />

      <div className="flex-1 min-w-0">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full font-semibold border border-stone-300 px-2 py-1 mb-2 focus:outline-none focus:border-amber-700"
        />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          placeholder="Descripción…"
          className="w-full text-sm text-stone-600 border border-stone-300 px-2 py-1 resize-y focus:outline-none focus:border-amber-700"
        />

        <div className="flex items-center justify-between mt-2 gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
            />
            Disponible (visible en la web)
          </label>

          <div className="flex items-center gap-3">
            {estado === 'guardado' && <span className="text-green-700 text-sm">✓ Guardado</span>}
            {estado === 'error' && <span className="text-red-700 text-sm">Error al guardar</span>}
            <button
              onClick={borrar}
              disabled={borrando}
              className="text-red-700 hover:text-red-800 disabled:opacity-40 px-3 py-1.5 text-sm uppercase tracking-wider transition-colors"
            >
              {borrando ? 'Borrando…' : 'Borrar'}
            </button>
            <button
              onClick={guardar}
              disabled={!modificado || estado === 'guardando'}
              className="bg-stone-900 hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-stone-900 text-stone-50 px-4 py-1.5 text-sm uppercase tracking-wider transition-colors"
            >
              {estado === 'guardando' ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Formulario para añadir un producto ───────────────────── */
function NuevoProducto({ categoria, onCreado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const crear = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const ordenes = (categoria.productos || []).map(p => p.orden ?? 0);
    const orden = (ordenes.length ? Math.max(...ordenes) : 0) + 1;

    const { data, error } = await supabase
      .from('productos')
      .insert({
        categoria_id: categoria.id,
        nombre,
        descripcion: descripcion || null,
        foto: foto || null,
        disponible: true,
        orden,
      })
      .select()
      .single();

    setGuardando(false);
    if (error) {
      setError(error.message);
      return;
    }
    onCreado(data);
  };

  return (
    <form onSubmit={crear} className="bg-stone-50 border border-dashed border-stone-300 p-4 space-y-3 mb-4">
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        placeholder="Nombre del producto"
        className="w-full font-semibold border border-stone-300 px-2 py-1 focus:outline-none focus:border-amber-700"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={2}
        placeholder="Descripción (opcional)"
        className="w-full text-sm text-stone-600 border border-stone-300 px-2 py-1 resize-y focus:outline-none focus:border-amber-700"
      />
      <div className="flex items-center gap-3">
        <SubirFoto foto={foto} onSubida={setFoto} />
        <span className="text-xs text-stone-400">Foto del producto (opcional)</span>
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="bg-stone-900 hover:bg-amber-700 disabled:opacity-40 text-stone-50 px-4 py-1.5 text-sm uppercase tracking-wider transition-colors"
      >
        {guardando ? 'Creando…' : 'Crear producto'}
      </button>
    </form>
  );
}

/* ── Subir / cambiar la foto (Supabase Storage) ───────────── */
function SubirFoto({ foto, onSubida }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const subir = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Límite razonable para no llenar el almacenamiento gratis
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen supera 5 MB.');
      e.target.value = '';
      return;
    }

    setSubiendo(true);
    setError(null);

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const ruta = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage.from('productos').upload(ruta, file, {
      cacheControl: '3600',
      upsert: false,
    });

    setSubiendo(false);
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (upErr) {
      setError(upErr.message);
      return;
    }

    const { data } = supabase.storage.from('productos').getPublicUrl(ruta);
    onSubida(data.publicUrl);
  };

  return (
    <div className="shrink-0 w-20">
      {foto ? (
        <img src={foto} alt="" className="w-20 h-20 object-cover rounded-sm border border-stone-200" />
      ) : (
        <div className="w-20 h-20 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center text-stone-400 text-xs">
          Sin foto
        </div>
      )}
      <label className="mt-1 block text-center text-xs text-amber-700 hover:text-amber-800 cursor-pointer">
        {subiendo ? 'Subiendo…' : foto ? 'Cambiar' : 'Subir foto'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={subir}
          disabled={subiendo}
        />
      </label>
      {error && <p className="text-red-700 text-[11px] mt-1 leading-tight">{error}</p>}
    </div>
  );
}

/* ── Editar una categoría (título, descripción, etiquetas) ── */
function CategoriaEditor({ categoria, onGuardado }) {
  const [titulo, setTitulo] = useState(categoria.titulo || '');
  const [descripcion, setDescripcion] = useState(categoria.descripcion || '');
  const [tags, setTags] = useState((categoria.tags || []).join(', '));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const campos = { titulo, descripcion: descripcion || null, tags: tagsArr };

    const { error } = await supabase.from('categorias').update(campos).eq('id', categoria.id);
    setGuardando(false);
    if (error) {
      setError(error.message);
      return;
    }
    onGuardado({ titulo, descripcion, tags: tagsArr });
  };

  return (
    <form onSubmit={guardar} className="bg-stone-50 border border-dashed border-stone-300 p-4 space-y-3 mb-4">
      <div>
        <label className="block text-sm text-stone-600 mb-1">Título</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full font-semibold border border-stone-300 px-2 py-1 focus:outline-none focus:border-amber-700"
        />
      </div>
      <div>
        <label className="block text-sm text-stone-600 mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full text-sm text-stone-600 border border-stone-300 px-2 py-1 resize-y focus:outline-none focus:border-amber-700"
        />
      </div>
      <div>
        <label className="block text-sm text-stone-600 mb-1">Etiquetas (separadas por comas)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Jamones, Quesos, Conservas…"
          className="w-full text-sm border border-stone-300 px-2 py-1 focus:outline-none focus:border-amber-700"
        />
        <p className="text-xs text-stone-400 mt-1">Son los pequeños chips que aparecen en la tarjeta de la categoría.</p>
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={guardando}
        className="bg-stone-900 hover:bg-amber-700 disabled:opacity-40 text-stone-50 px-4 py-1.5 text-sm uppercase tracking-wider transition-colors"
      >
        {guardando ? 'Guardando…' : 'Guardar categoría'}
      </button>
    </form>
  );
}
