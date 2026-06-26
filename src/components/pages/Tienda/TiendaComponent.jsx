import { useState, useMemo } from 'react';
import { useCategorias } from '../../../hooks/useCategorias';
import Reveal from '../../ui/Reveal/RevealComponent';
import TiendaHeader from './TiendaHeader';
import ProductoCard from './ProductoCard';

// Minúsculas + sin acentos, para buscar "atun" y que encuentre "atún".
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Página de Tienda (/tienda) — listado de productos en rejilla, con filtro
 * por categoría y buscador. Cada tarjeta lleva a su ficha.
 */
export default function TiendaComponent() {
  const categorias = useCategorias();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState(null); // null = todas

  // Aplana todos los productos añadiendo su categoría
  const productos = useMemo(
    () =>
      categorias.flatMap(c =>
        (c.productos || []).map(p => ({ ...p, categoria: c.titulo }))
      ),
    [categorias]
  );

  const q = normaliza(busqueda.trim());
  const visibles = productos.filter(p => {
    if (categoriaSel && p.categoria !== categoriaSel) return false;
    if (q && !normaliza(`${p.nombre} ${p.desc || ''} ${p.categoria}`).includes(q)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <TiendaHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Cabecera de sección, al estilo de la home */}
        <div className="text-center mb-10">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Tienda online</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Nuestros productos</h1>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Lo mejor de Paco Vago, a un clic. ¿No ves el precio de alguno? Pulsa{' '}
            <span className="font-semibold">Me interesa</span> y te informamos por WhatsApp.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative max-w-xl mx-auto mb-6">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full bg-white border border-stone-300 px-4 py-3 pr-9 focus:outline-none focus:border-amber-700 transition-colors"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro por categoría */}
        <div className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-10 [scrollbar-width:thin]">
          <Chip activo={!categoriaSel} onClick={() => setCategoriaSel(null)}>Todas</Chip>
          {categorias.map(c => (
            <Chip key={c.titulo} activo={categoriaSel === c.titulo} onClick={() => setCategoriaSel(c.titulo)}>
              {c.titulo}
            </Chip>
          ))}
        </div>

        {/* Rejilla de productos */}
        {visibles.length === 0 ? (
          <p className="text-stone-500 text-center">No hay productos que coincidan.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {visibles.map((p, i) => (
              <Reveal key={`${p.categoria}-${p.nombre}-${i}`} delay={(i % 4) * 70} className="h-full">
                <ProductoCard producto={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Chip de filtro ───────────────────────────────────────── */
function Chip({ activo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-sm px-3 py-1 rounded-full border whitespace-nowrap transition-colors ${
        activo
          ? 'bg-stone-900 text-stone-50 border-stone-900'
          : 'bg-white text-stone-700 border-stone-300 hover:border-amber-700 hover:text-amber-700'
      }`}
    >
      {children}
    </button>
  );
}
