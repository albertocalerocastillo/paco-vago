import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { imagen, ANCHOS } from '../../../utils/imagenes';
import { formatoPrecio } from '../../../utils/formato';
import { X, Plus, Search, ChevronUp, ChevronDown, Pencil, ImagePlus, EyeOff, Trash2 } from '../../../theme/icons';

// Minúsculas + sin acentos, para buscar "atun" y que encuentre "atún".
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// "9,95" o "9.95" → 9.95 · "" → null · algo que no es número → NaN
const leerDecimal = (txt) => {
  const t = String(txt ?? '').trim().replace(',', '.');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};
// 9.95 → "9,95" para enseñarlo como se escribe en España
const escribirDecimal = (n) => (n == null ? '' : String(n).replace('.', ','));

const ordenar = (lista) => lista.slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

/** En qué situación está un producto en la web, para enseñarlo de un vistazo. */
function situacion(p) {
  if (!p.disponible) return { texto: 'Oculto', clase: 'bg-stone-100 text-stone-500 border-stone-300' };
  if (p.precio != null && Number(p.peso) > 0) return { texto: 'Se vende online', clase: 'bg-green-50 text-green-800 border-green-300' };
  return { texto: 'Solo WhatsApp', clase: 'bg-amber-50 text-amber-800 border-amber-300' };
}

/**
 * Gestión de productos del panel (/admin).
 *
 * Pensada para el MÓVIL y para alguien que no es informático: una lista clara
 * (foto, nombre, precio y si se vende o no) y, al tocar un producto, una ficha
 * a pantalla completa con cajas grandes. Antes cada producto era un formulario
 * abierto y en el móvil no se podía ni pulsar "Guardar".
 */
export default function GestionProductos() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  // Qué hay abierto: { tipo: 'producto', producto, catId } | { tipo: 'nuevo', catId } | { tipo: 'categoria', catId }
  const [abierto, setAbierto] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('id, titulo, descripcion, tags, orden, productos(id, nombre, descripcion, foto, disponible, precio, peso, orden)')
        .order('orden', { ascending: true });

      if (error) setError(error.message);
      else setCategorias(data || []);
      setCargando(false);
    })();
  }, []);

  // ── Cambios en el estado local tras guardar en Supabase ──────
  const cambiarProductos = (catId, fn) =>
    setCategorias(cats => cats.map(c => (c.id === catId ? { ...c, productos: fn(c.productos || []) } : c)));

  const productoGuardado = (catId, id, campos) =>
    cambiarProductos(catId, ps => ps.map(p => (p.id === id ? { ...p, ...campos } : p)));
  const productoCreado = (catId, nuevo) => cambiarProductos(catId, ps => [...ps, nuevo]);
  const productoBorrado = (catId, id) => cambiarProductos(catId, ps => ps.filter(p => p.id !== id));
  const categoriaGuardada = (catId, campos) =>
    setCategorias(cats => cats.map(c => (c.id === catId ? { ...c, ...campos } : c)));

  // Intercambia el orden de un producto con su vecino (dir: -1 sube, +1 baja)
  const moverProducto = async (catId, prodId, dir) => {
    const cat = categorias.find(c => c.id === catId);
    const lista = ordenar(cat?.productos || []);
    const i = lista.findIndex(p => p.id === prodId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= lista.length) return;
    const [a, b] = [lista[i], lista[j]];
    const [ordenA, ordenB] = [a.orden ?? i, b.orden ?? j];

    cambiarProductos(catId, ps =>
      ps.map(p => (p.id === a.id ? { ...p, orden: ordenB } : p.id === b.id ? { ...p, orden: ordenA } : p))
    );
    const [r1, r2] = await Promise.all([
      supabase.from('productos').update({ orden: ordenB }).eq('id', a.id),
      supabase.from('productos').update({ orden: ordenA }).eq('id', b.id),
    ]);
    if (r1.error || r2.error) window.alert('No se ha podido cambiar el orden. Recarga la página.');
  };

  // Intercambia el orden de una categoría con su vecina
  const moverCategoria = async (catId, dir) => {
    const lista = ordenar(categorias);
    const i = lista.findIndex(c => c.id === catId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= lista.length) return;
    const [a, b] = [lista[i], lista[j]];
    const [ordenA, ordenB] = [a.orden ?? i, b.orden ?? j];

    setCategorias(cats =>
      cats.map(c => (c.id === a.id ? { ...c, orden: ordenB } : c.id === b.id ? { ...c, orden: ordenA } : c))
    );
    const [r1, r2] = await Promise.all([
      supabase.from('categorias').update({ orden: ordenB }).eq('id', a.id),
      supabase.from('categorias').update({ orden: ordenA }).eq('id', b.id),
    ]);
    if (r1.error || r2.error) window.alert('No se ha podido cambiar el orden. Recarga la página.');
  };

  const irA = (catId) => {
    document.getElementById(`cat-${catId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (cargando) return <p className="text-stone-500">Cargando productos…</p>;
  if (error) return <p className="text-red-700">Error al cargar: {error}</p>;

  const cats = ordenar(categorias);
  const q = normaliza(busqueda.trim());
  const buscando = q.length > 0;
  const coincide = (p) => normaliza(`${p.nombre || ''} ${p.descripcion || ''}`).includes(q);
  const catsVisibles = buscando ? cats.filter(c => (c.productos || []).some(coincide)) : cats;

  const todos = cats.flatMap(c => c.productos || []);
  const enVenta = todos.filter(p => situacion(p).texto === 'Se vende online').length;

  // Datos frescos del producto abierto (por si cambió el orden detrás)
  const catAbierta = abierto && cats.find(c => c.id === abierto.catId);
  const prodAbierto =
    abierto?.tipo === 'producto' && (catAbierta?.productos || []).find(p => p.id === abierto.producto.id);
  const listaAbierta = catAbierta ? ordenar(catAbierta.productos || []) : [];
  const posAbierta = prodAbierto ? listaAbierta.findIndex(p => p.id === prodAbierto.id) : -1;

  return (
    <div>
      {/* Resumen + buscador + índice (fijo bajo la cabecera) */}
      <p className="text-sm text-stone-500 -mt-3 mb-3">
        {todos.length} productos · <span className="text-green-800">{enVenta} se venden online</span>
      </p>

      <div className="sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-6 bg-stone-100/95 backdrop-blur border-b border-stone-200 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full h-12 rounded-lg border border-stone-300 bg-white pl-10 pr-10 text-base focus:outline-none focus:border-amber-700"
          />
          {buscando && (
            <button
              onClick={() => setBusqueda('')}
              aria-label="Borrar la búsqueda"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {!buscando && (
          <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => irA(cat.id)}
                className="shrink-0 h-9 px-4 rounded-full bg-white border border-stone-300 text-sm text-stone-700 hover:border-amber-700 hover:text-amber-700 whitespace-nowrap transition active:scale-95"
              >
                {cat.titulo}
                <span className="text-stone-400 ml-1.5">{(cat.productos || []).length}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {buscando && catsVisibles.length === 0 && (
        <p className="text-stone-500">No hay productos que coincidan con “{busqueda}”.</p>
      )}

      <div className="space-y-10">
        {catsVisibles.map((cat) => {
          const productos = ordenar(cat.productos || []);
          const visibles = buscando ? productos.filter(coincide) : productos;
          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-44">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-300 pb-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {cat.titulo}
                  <span className="text-stone-400 text-sm font-normal ml-2">
                    {buscando ? `${visibles.length} de ${productos.length}` : `${productos.length} ${productos.length === 1 ? 'producto' : 'productos'}`}
                  </span>
                </h2>
                {!buscando && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAbierto({ tipo: 'categoria', catId: cat.id })}
                      className="h-10 px-3 inline-flex items-center gap-1.5 rounded-lg text-sm text-stone-600 hover:bg-stone-200 transition active:scale-95"
                    >
                      <Pencil size={16} /> Categoría
                    </button>
                    <button
                      onClick={() => setAbierto({ tipo: 'nuevo', catId: cat.id })}
                      className="h-10 px-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold transition active:scale-95"
                    >
                      <Plus size={16} /> Añadir
                    </button>
                  </div>
                )}
              </div>

              {visibles.length === 0 ? (
                <p className="text-stone-400 text-sm italic">Sin productos todavía.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {visibles.map((p, i) => (
                    <TarjetaProducto
                      key={p.id}
                      retraso={Math.min(i, 8) * 35}
                      producto={p}
                      onAbrir={() => setAbierto({ tipo: 'producto', producto: p, catId: cat.id })}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* ── Ventanas ─────────────────────────────────────────── */}
      {prodAbierto && (
        <EditorProducto
          key={prodAbierto.id}
          producto={prodAbierto}
          posicion={{ actual: posAbierta + 1, total: listaAbierta.length }}
          onMover={(dir) => moverProducto(abierto.catId, prodAbierto.id, dir)}
          onGuardado={(campos) => productoGuardado(abierto.catId, prodAbierto.id, campos)}
          onBorrado={() => { productoBorrado(abierto.catId, prodAbierto.id); setAbierto(null); }}
          onCerrar={() => setAbierto(null)}
        />
      )}
      {abierto?.tipo === 'nuevo' && catAbierta && (
        <EditorProducto
          categoria={catAbierta}
          onCreado={(nuevo) => { productoCreado(catAbierta.id, nuevo); setAbierto(null); }}
          onCerrar={() => setAbierto(null)}
        />
      )}
      {abierto?.tipo === 'categoria' && catAbierta && (
        <EditorCategoria
          categoria={catAbierta}
          posicion={{ actual: cats.findIndex(c => c.id === catAbierta.id) + 1, total: cats.length }}
          onMover={(dir) => moverCategoria(catAbierta.id, dir)}
          onGuardado={(campos) => { categoriaGuardada(catAbierta.id, campos); setAbierto(null); }}
          onCerrar={() => setAbierto(null)}
        />
      )}
    </div>
  );
}

/* ── Tarjeta de la lista ──────────────────────────────────── */
function TarjetaProducto({ producto: p, onAbrir, retraso = 0 }) {
  const sit = situacion(p);
  return (
    <button
      onClick={onAbrir}
      style={{ animationDelay: `${retraso}ms` }}
      className={`animate-entrar group text-left bg-white border border-stone-200 rounded-lg p-3 flex gap-3 items-center transition duration-200 hover:border-amber-700 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:shadow-none ${
        p.disponible ? '' : 'opacity-60'
      }`}
    >
      {p.foto ? (
        <img
          src={imagen(p.foto, ANCHOS.miniatura)}
          alt=""
          loading="lazy"
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shrink-0 bg-stone-100"
        />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md shrink-0 bg-stone-100 flex items-center justify-center text-stone-400">
          <ImagePlus size={22} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug line-clamp-2">{p.nombre}</p>
        <p className="text-lg font-bold mt-0.5">
          {p.precio != null ? formatoPrecio(p.precio) : <span className="text-stone-400 text-sm font-normal">Sin precio</span>}
        </p>
        <span className={`inline-flex items-center gap-1 text-xs border rounded px-1.5 py-0.5 mt-1 ${sit.clase}`}>
          {!p.disponible && <EyeOff size={12} />}
          {sit.texto}
        </span>
      </div>
      <Pencil size={18} className="text-stone-300 shrink-0 self-start transition-colors group-hover:text-amber-700" />
    </button>
  );
}

/* ── Ventana: a pantalla completa en el móvil, centrada en escritorio ──
 * En el móvil sube desde abajo como una hoja (igual que en las apps); en
 * pantallas grandes aparece con un pequeño zoom. Al cerrarse hace lo contrario,
 * y solo cuando termina la animación avisa con onCerrado.
 *
 * - puedeCerrar(): opcional; si devuelve false no se cierra (cambios sin guardar).
 * - controlRef: ref donde la ventana deja su función cerrar(), para que quien la
 *   usa pueda cerrarla con animación (p. ej. tras guardar).
 */
function Ventana({ titulo, puedeCerrar, onCerrado, controlRef, pie, children }) {
  const [saliendo, setSaliendo] = useState(false);

  const cerrar = useCallback((forzar = false) => {
    if (!forzar && puedeCerrar && !puedeCerrar()) return;
    setSaliendo(true);
    setTimeout(onCerrado, 220);
  }, [puedeCerrar, onCerrado]);

  useEffect(() => {
    if (controlRef) controlRef.current = cerrar;
  }, [controlRef, cerrar]);

  // Cierra con Escape y no deja que se mueva la página de detrás
  useEffect(() => {
    const tecla = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', tecla);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', tecla);
      document.body.style.overflow = antes;
    };
  }, [cerrar]);

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={titulo}>
      <div
        className={`absolute inset-0 bg-stone-900/50 hidden sm:block ${saliendo ? 'animate-fundido-fuera' : 'animate-fundido'}`}
        onClick={() => cerrar()}
      />
      <div
        className={`relative bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl shadow-xl flex flex-col ${
          saliendo ? 'animate-bajar-hoja sm:animate-zoom-salir' : 'animate-subir-hoja sm:animate-zoom-entrar'
        }`}
      >
        <div className="h-14 shrink-0 px-4 sm:px-6 flex items-center justify-between border-b border-stone-200">
          <h2 className="font-bold text-lg truncate">{titulo}</h2>
          <button
            onClick={() => cerrar()}
            aria-label="Cerrar"
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 active:scale-90 transition"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">{children}</div>
        {pie && (
          <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-stone-200 bg-stone-50 sm:rounded-b-xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {pie}
          </div>
        )}
      </div>
    </div>
  );
}

const claseCaja =
  'w-full h-12 rounded-lg border border-stone-300 px-3 text-base bg-white focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20';

function Campo({ etiqueta, ayuda, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-stone-700 mb-1">{etiqueta}</span>
      {children}
      {error ? (
        <span className="block text-sm text-red-700 mt-1">{error}</span>
      ) : (
        ayuda && <span className="block text-xs text-stone-500 mt-1">{ayuda}</span>
      )}
    </label>
  );
}

/* ── Editar o crear un producto ───────────────────────────── */
function EditorProducto({ producto, categoria, posicion, onMover, onGuardado, onCreado, onBorrado, onCerrar }) {
  const nuevo = !producto;
  const inicial = {
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    foto: producto?.foto || '',
    precio: escribirDecimal(producto?.precio),
    peso: escribirDecimal(producto?.peso),
    disponible: producto ? producto.disponible : true,
  };
  const [f, setF] = useState(inicial);
  const [estado, setEstado] = useState('idle'); // idle | guardando | guardado | error
  const [errorTexto, setErrorTexto] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const controlRef = useRef(null); // cerrar() de la ventana, con animación
  const resultado = useRef(null); // qué avisar al terminar de cerrarse

  const set = (campo) => (e) => setF(x => ({ ...x, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const precio = leerDecimal(f.precio);
  const peso = leerDecimal(f.peso);
  const errores = {
    nombre: f.nombre.trim() ? null : 'Pon un nombre.',
    precio: Number.isNaN(precio) ? 'Escribe solo el número, por ejemplo 9,95' : null,
    peso: Number.isNaN(peso) ? 'Escribe solo el número, por ejemplo 0,5' : null,
  };
  const hayErrores = Object.values(errores).some(Boolean);
  const modificado = JSON.stringify(f) !== JSON.stringify(inicial);
  const seVende = f.disponible && precio != null && !Number.isNaN(precio) && peso > 0;

  const puedeCerrar = () =>
    !modificado || estado === 'guardado' || window.confirm('Tienes cambios sin guardar. ¿Salir sin guardar?');

  // Cuando la ventana ha terminado de cerrarse, se avisa de lo que pasó.
  const cerrado = () => {
    const r = resultado.current;
    if (r?.creado) onCreado(r.creado);
    else if (r?.borrado) onBorrado();
    else onCerrar();
  };

  const guardar = async () => {
    if (hayErrores) return;
    setEstado('guardando');
    setErrorTexto(null);
    const campos = {
      nombre: f.nombre.trim(),
      descripcion: f.descripcion.trim() || null,
      foto: f.foto || null,
      precio,
      peso,
      disponible: f.disponible,
    };

    if (nuevo) {
      const ordenes = (categoria.productos || []).map(p => p.orden ?? 0);
      const { data, error } = await supabase
        .from('productos')
        .insert({ ...campos, categoria_id: categoria.id, orden: (ordenes.length ? Math.max(...ordenes) : 0) + 1 })
        .select()
        .single();
      if (error) { setEstado('error'); setErrorTexto(error.message); return; }
      setEstado('guardado');
      resultado.current = { creado: data };
      setTimeout(() => controlRef.current?.(true), 500);
      return;
    }

    const { error } = await supabase.from('productos').update(campos).eq('id', producto.id);
    if (error) { setEstado('error'); setErrorTexto(error.message); return; }
    onGuardado(campos);
    setEstado('guardado');
    setTimeout(() => controlRef.current?.(true), 700);
  };

  const borrar = async () => {
    if (!window.confirm(`¿Borrar "${producto.nombre}" para siempre? Si solo quieres que no se vea, quita "Se ve en la web".`)) return;
    setBorrando(true);
    const { error } = await supabase.from('productos').delete().eq('id', producto.id);
    if (error) {
      setBorrando(false);
      window.alert('No se ha podido borrar: ' + error.message);
      return;
    }
    resultado.current = { borrado: true };
    controlRef.current?.(true);
  };

  const pie = (
    <div className="flex items-center gap-3">
      {!nuevo && (
        <button
          onClick={borrar}
          disabled={borrando}
          className="h-12 px-3 inline-flex items-center gap-1.5 rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-40 transition active:scale-95"
        >
          <Trash2 size={18} /> <span className="hidden sm:inline">{borrando ? 'Borrando…' : 'Borrar'}</span>
        </button>
      )}
      <span className="flex-1 text-sm text-right">
        {estado === 'guardado' && <span className="inline-block animate-pop text-green-700 font-semibold">✓ Guardado</span>}
        {estado === 'error' && <span className="text-red-700">No se ha podido guardar</span>}
      </span>
      <button
        onClick={guardar}
        disabled={hayErrores || (!nuevo && !modificado) || estado === 'guardando'}
        className="h-12 px-8 rounded-lg bg-stone-900 hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-stone-900 text-stone-50 font-semibold transition active:scale-[0.97]"
      >
        {estado === 'guardando' ? 'Guardando…' : nuevo ? 'Crear producto' : 'Guardar'}
      </button>
    </div>
  );

  return (
    <Ventana
      titulo={nuevo ? `Nuevo producto en ${categoria.titulo}` : 'Editar producto'}
      puedeCerrar={puedeCerrar}
      onCerrado={cerrado}
      controlRef={controlRef}
      pie={pie}
    >
      <div className="space-y-5">
        <SubirFoto foto={f.foto} onSubida={(url) => setF(x => ({ ...x, foto: url }))} />

        <Campo etiqueta="Nombre" error={errores.nombre && f.nombre !== inicial.nombre ? errores.nombre : null}>
          <input value={f.nombre} onChange={set('nombre')} className={`${claseCaja} font-semibold`} />
        </Campo>

        <Campo etiqueta="Descripción" ayuda="Corta y con gancho: es lo que se lee en la tienda.">
          <textarea
            value={f.descripcion}
            onChange={set('descripcion')}
            rows={3}
            className={`${claseCaja} h-auto py-2 resize-y`}
          />
        </Campo>

        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Precio (€)" error={errores.precio}>
            <input value={f.precio} onChange={set('precio')} inputMode="decimal" placeholder="Ej. 9,95" className={claseCaja} />
          </Campo>
          <Campo etiqueta="Peso con caja (kg)" error={errores.peso}>
            <input value={f.peso} onChange={set('peso')} inputMode="decimal" placeholder="Ej. 0,5" className={claseCaja} />
          </Campo>
        </div>

        <label className="flex items-center justify-between gap-4 p-3 rounded-lg border border-stone-200 cursor-pointer">
          <span>
            <span className="block font-semibold">Se ve en la web</span>
            <span className="block text-xs text-stone-500">Quítalo si se ha agotado: no se borra, solo se oculta.</span>
          </span>
          <input type="checkbox" checked={f.disponible} onChange={set('disponible')} className="sr-only peer" />
          <span className="relative w-12 h-7 shrink-0 rounded-full bg-stone-300 peer-checked:bg-green-600 transition-colors after:absolute after:top-1 after:left-1 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
        </label>

        <p className={`text-sm rounded-lg px-3 py-2 transition-colors duration-300 ${seVende ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
          {!f.disponible
            ? 'Oculto: no aparece en la web.'
            : seVende
              ? '✓ Se puede comprar online, con su envío calculado por el peso.'
              : 'Saldrá con el botón de WhatsApp. Para venderlo online hacen falta precio y peso.'}
        </p>

        {!nuevo && posicion && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-stone-50">
            <span className="text-sm text-stone-600">
              Posición en la tienda: <strong>{posicion.actual}</strong> de {posicion.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onMover(-1)}
                disabled={posicion.actual <= 1}
                aria-label="Subir de posición"
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:border-amber-700 disabled:opacity-30 transition active:scale-90"
              >
                <ChevronUp size={20} />
              </button>
              <button
                onClick={() => onMover(1)}
                disabled={posicion.actual >= posicion.total}
                aria-label="Bajar de posición"
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:border-amber-700 disabled:opacity-30 transition active:scale-90"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        )}

        {errorTexto && <p className="text-sm text-red-700">{errorTexto}</p>}
      </div>
    </Ventana>
  );
}

/* ── Subir / cambiar la foto (Supabase Storage) ───────────── */
function SubirFoto({ foto, onSubida }) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const input = useRef(null);

  const subir = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    // Lo mismo que acepta el almacén (ver supabase/storage.sql). Se comprueba
    // aquí para dar el aviso en cristiano en vez del error en inglés de Supabase.
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Solo fotos JPG, PNG o WebP. Si es una foto de iPhone (HEIC), guárdala antes como JPG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto pesa más de 5 MB. Prueba a hacerla más pequeña.');
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
    if (upErr) {
      setError(upErr.message);
      return;
    }
    const { data } = supabase.storage.from('productos').getPublicUrl(ruta);
    onSubida(data.publicUrl);
  };

  return (
    <div className="flex items-center gap-4">
      {foto ? (
        <img key={foto} src={imagen(foto, ANCHOS.miniatura)} alt="" className="animate-entrar w-28 h-28 object-cover rounded-lg border border-stone-200 shrink-0" />
      ) : (
        <div className="w-28 h-28 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
          <ImagePlus size={28} />
        </div>
      )}
      <div>
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={subiendo}
          className="h-11 px-4 inline-flex items-center gap-2 rounded-lg border border-stone-300 text-sm font-semibold hover:border-amber-700 hover:text-amber-700 disabled:opacity-50 transition active:scale-95"
        >
          <ImagePlus size={18} />
          {subiendo ? 'Subiendo…' : foto ? 'Cambiar foto' : 'Poner foto'}
        </button>
        <p className="text-xs text-stone-500 mt-1">Desde el móvil puedes hacerla con la cámara.</p>
        {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={subir} />
    </div>
  );
}

/* ── Editar una categoría ─────────────────────────────────── */
function EditorCategoria({ categoria, posicion, onMover, onGuardado, onCerrar }) {
  const controlRef = useRef(null);
  const guardadoCon = useRef(null);
  const [titulo, setTitulo] = useState(categoria.titulo || '');
  const [descripcion, setDescripcion] = useState(categoria.descripcion || '');
  const [tags, setTags] = useState((categoria.tags || []).join(', '));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const guardar = async () => {
    if (!titulo.trim()) return;
    setGuardando(true);
    setError(null);
    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const campos = { titulo: titulo.trim(), descripcion: descripcion.trim() || null, tags: tagsArr };
    const { error } = await supabase.from('categorias').update(campos).eq('id', categoria.id);
    setGuardando(false);
    if (error) {
      setError(error.message);
      return;
    }
    guardadoCon.current = campos;
    controlRef.current?.(true);
  };

  const pie = (
    <div className="flex justify-end">
      <button
        onClick={guardar}
        disabled={guardando || !titulo.trim()}
        className="h-12 px-8 rounded-lg bg-stone-900 hover:bg-amber-700 disabled:opacity-40 text-stone-50 font-semibold transition active:scale-[0.97]"
      >
        {guardando ? 'Guardando…' : 'Guardar'}
      </button>
    </div>
  );

  return (
    <Ventana
      titulo={`Categoría: ${categoria.titulo}`}
      controlRef={controlRef}
      onCerrado={() => (guardadoCon.current ? onGuardado(guardadoCon.current) : onCerrar())}
      pie={pie}
    >
      <div className="space-y-5">
        <Campo etiqueta="Título">
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={`${claseCaja} font-semibold`} />
        </Campo>
        <Campo etiqueta="Descripción">
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={`${claseCaja} h-auto py-2 resize-y`} />
        </Campo>
        <Campo etiqueta="Etiquetas" ayuda="Separadas por comas. Son los chips pequeños de la tarjeta de la categoría en la portada.">
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Jamones, Quesos, Conservas…" className={claseCaja} />
        </Campo>

        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-stone-50">
          <span className="text-sm text-stone-600">
            Posición en la portada: <strong>{posicion.actual}</strong> de {posicion.total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onMover(-1)}
              disabled={posicion.actual <= 1}
              aria-label="Subir categoría"
              className="w-11 h-11 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:border-amber-700 disabled:opacity-30 transition active:scale-90"
            >
              <ChevronUp size={20} />
            </button>
            <button
              onClick={() => onMover(1)}
              disabled={posicion.actual >= posicion.total}
              aria-label="Bajar categoría"
              className="w-11 h-11 flex items-center justify-center rounded-lg border border-stone-300 bg-white hover:border-amber-700 disabled:opacity-30 transition active:scale-90"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>
    </Ventana>
  );
}
