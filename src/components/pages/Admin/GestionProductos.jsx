import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

/**
 * Gestión de productos del panel de admin (2c.2 + 2c.3 + orden).
 * Lista las categorías con sus productos y permite editar, crear, borrar y
 * reordenar (flechas ▲▼), guardando cada cambio en Supabase.
 */
export default function GestionProductos() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, titulo, orden, productos(id, nombre, descripcion, foto, disponible, orden)')
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

  if (cargando) return <p className="text-stone-500">Cargando productos…</p>;
  if (error) return <p className="text-red-700">Error al cargar: {error}</p>;

  return (
    <div className="space-y-10">
      {categorias.map((cat) => (
        <CategoriaSeccion
          key={cat.id}
          categoria={cat}
          onCreado={(nuevo) => añadirProducto(cat.id, nuevo)}
          onBorrado={(prodId) => quitarProducto(cat.id, prodId)}
          onMover={(prodId, dir) => moverProducto(cat.id, prodId, dir)}
        />
      ))}
    </div>
  );
}

/* ── Sección de una categoría (cabecera + alta + lista) ───── */
function CategoriaSeccion({ categoria, onCreado, onBorrado, onMover }) {
  const [añadiendo, setAñadiendo] = useState(false);
  const productos = (categoria.productos || []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  return (
    <section>
      <div className="flex items-center justify-between border-b border-stone-300 pb-2 mb-4 gap-3">
        <h2 className="text-xl font-bold">
          {categoria.titulo}
          <span className="text-stone-400 text-sm font-normal"> · {productos.length} productos</span>
        </h2>
        <button
          onClick={() => setAñadiendo(a => !a)}
          className="shrink-0 text-amber-700 hover:text-amber-800 text-sm font-semibold transition-colors"
        >
          {añadiendo ? 'Cancelar' : '+ Añadir producto'}
        </button>
      </div>

      {añadiendo && (
        <NuevoProducto
          categoria={categoria}
          onCreado={(nuevo) => { onCreado(nuevo); setAñadiendo(false); }}
        />
      )}

      {productos.length === 0 ? (
        <p className="text-stone-400 text-sm italic">Sin productos todavía.</p>
      ) : (
        <div className="space-y-4">
          {productos.map((p, i) => (
            <ProductoFila
              key={p.id}
              producto={p}
              esPrimero={i === 0}
              esUltimo={i === productos.length - 1}
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
function ProductoFila({ producto, esPrimero, esUltimo, onBorrado, onMover }) {
  const [nombre, setNombre] = useState(producto.nombre || '');
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [disponible, setDisponible] = useState(producto.disponible);
  const [estado, setEstado] = useState('idle'); // idle | guardando | guardado | error
  const [borrando, setBorrando] = useState(false);

  const modificado =
    nombre !== (producto.nombre || '') ||
    descripcion !== (producto.descripcion || '') ||
    disponible !== producto.disponible;

  const guardar = async () => {
    setEstado('guardando');
    const { error } = await supabase
      .from('productos')
      .update({ nombre, descripcion, disponible })
      .eq('id', producto.id);

    if (error) {
      setEstado('error');
    } else {
      producto.nombre = nombre;
      producto.descripcion = descripcion;
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
      {/* Flechas de orden */}
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

      {producto.foto && (
        <img src={producto.foto} alt={nombre} className="w-20 h-20 object-cover shrink-0 rounded-sm" />
      )}

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
    <form onSubmit={crear} className="bg-stone-50 border border-dashed border-stone-300 p-4 space-y-2 mb-4">
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
      <input
        value={foto}
        onChange={(e) => setFoto(e.target.value)}
        placeholder="Ruta de la foto, ej: /fotos/mi-foto.jpg (opcional)"
        className="w-full text-sm border border-stone-300 px-2 py-1 focus:outline-none focus:border-amber-700"
      />
      <p className="text-xs text-stone-400">
        De momento la foto debe existir ya en <code>public/fotos/</code>. La subida de imágenes
        llegará en el siguiente paso.
      </p>

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
