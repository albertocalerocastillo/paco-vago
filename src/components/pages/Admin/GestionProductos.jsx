import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

/**
 * Gestión de productos del panel de admin (2c.2).
 * Lista las categorías con sus productos y permite editar nombre, descripción
 * y disponibilidad, guardando cada cambio en Supabase.
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

  if (cargando) return <p className="text-stone-500">Cargando productos…</p>;
  if (error) return <p className="text-red-700">Error al cargar: {error}</p>;

  return (
    <div className="space-y-10">
      {categorias.map((cat) => {
        const productos = (cat.productos || []).slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
        return (
          <section key={cat.id}>
            <h2 className="text-xl font-bold border-b border-stone-300 pb-2 mb-4">
              {cat.titulo}
              <span className="text-stone-400 text-sm font-normal"> · {productos.length} productos</span>
            </h2>

            {productos.length === 0 ? (
              <p className="text-stone-400 text-sm italic">Sin productos todavía.</p>
            ) : (
              <div className="space-y-4">
                {productos.map((p) => (
                  <ProductoFila key={p.id} producto={p} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

/* ── Fila editable de un producto ─────────────────────────── */
function ProductoFila({ producto }) {
  const [nombre, setNombre] = useState(producto.nombre || '');
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [disponible, setDisponible] = useState(producto.disponible);
  const [estado, setEstado] = useState('idle'); // idle | guardando | guardado | error

  // ¿Hay cambios sin guardar respecto al valor original?
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
      // Sincroniza el "original" para que deje de marcar modificado
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.disponible = disponible;
      setEstado('guardado');
      setTimeout(() => setEstado('idle'), 2000);
    }
  };

  return (
    <div className="bg-white border border-stone-200 p-4 flex gap-4">
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

        <div className="flex items-center justify-between mt-2">
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
