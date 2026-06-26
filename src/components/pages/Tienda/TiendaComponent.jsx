import { useState, useMemo } from 'react';
import { Truck, MapPin, WhatsAppIcon } from '../../../theme/icons';
import { useCategorias } from '../../../hooks/useCategorias';
import Reveal from '../../ui/Reveal/RevealComponent';
import TiendaHeader from './TiendaHeader';
import ProductoCard from './ProductoCard';
import FooterComponent from '../../layout/Footer/FooterComponent';

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

      {/* Hero de la tienda (misma receta visual que la home) */}
      <section className="relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/tienda.jpg)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/75 via-stone-900/65 to-stone-900/90"></div>
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(217,119,6,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(120,53,15,0.5) 0%, transparent 50%)',
          }}
        ></div>
        <div className="relative z-10 text-center px-6 pt-20 pb-28 sm:pt-24 sm:pb-32 max-w-3xl mx-auto">
          <div className="text-amber-300 text-sm uppercase tracking-[0.4em] mb-5 drop-shadow-lg">Tienda online</div>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-50 mb-5 tracking-tight drop-shadow-2xl">Nuestros productos</h1>
          <div className="w-24 h-px bg-amber-400 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-stone-100 italic font-light drop-shadow-lg">
            Lo mejor de Paco Vago, a un clic.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Buscador flotante sobre el hero */}
        <div className="relative z-10 -mt-8 sm:-mt-10 max-w-xl mx-auto mb-8">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full bg-white border border-stone-200 shadow-lg px-5 py-4 pr-10 focus:outline-none focus:border-amber-700 transition-colors"
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

        {/* Banda de confianza */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-stone-600 text-sm border-y border-stone-200 py-4 mb-8">
          <span className="inline-flex items-center gap-2"><Truck size={18} className="text-amber-700" /> Envíos a toda España</span>
          <span className="inline-flex items-center gap-2"><MapPin size={18} className="text-amber-700" /> Productos de Carmona</span>
          <span className="inline-flex items-center gap-2"><WhatsAppIcon size={17} /> Atención por WhatsApp</span>
        </div>

        {/* Filtro por categoría */}
        <div className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-10 [scrollbar-width:thin]">
          <Chip activo={!categoriaSel} onClick={() => setCategoriaSel(null)}>Todas</Chip>
          {categorias.map(c => {
            const Icon = c.icon;
            return (
              <Chip key={c.titulo} activo={categoriaSel === c.titulo} onClick={() => setCategoriaSel(c.titulo)}>
                {Icon && <Icon size={14} strokeWidth={1.75} />}
                {c.titulo}
              </Chip>
            );
          })}
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

      <FooterComponent />
    </div>
  );
}

/* ── Chip de filtro ───────────────────────────────────────── */
function Chip({ activo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
        activo
          ? 'bg-stone-900 text-stone-50 border-stone-900'
          : 'bg-white text-stone-700 border-stone-300 hover:border-amber-700 hover:text-amber-700'
      }`}
    >
      {children}
    </button>
  );
}
