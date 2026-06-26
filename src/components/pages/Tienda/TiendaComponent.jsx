import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppIcon, ShoppingCart } from '../../../theme/icons';
import { useCategorias } from '../../../hooks/useCategorias';
import { useCarrito } from '../../../hooks/useCarrito';
import { whatsappProducto } from '../../../data/contacto';
import { formatoPrecio } from '../../../utils/formato';

// Minúsculas + sin acentos, para buscar "atun" y que encuentre "atún".
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Página de Tienda (/tienda) — primer ladrillo de la tienda online.
 * Listado de productos en rejilla, con filtro por categoría y buscador.
 * De momento sin carrito: cada producto enlaza a WhatsApp ("Me interesa").
 * Los productos con precio lo muestran; cuando montemos el carrito, esos
 * pasarán a "Añadir al carrito".
 */
export default function TiendaComponent() {
  const categorias = useCategorias();
  const { cantidadTotal } = useCarrito();
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
      {/* Cabecera de la tienda */}
      <header className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="font-bold text-lg">Paco Vago</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-stone-600 hover:text-amber-700 transition-colors hidden sm:inline">← Volver a la web</Link>
          <Link to="/tienda/carrito" className="relative text-stone-700 hover:text-amber-700 transition-colors" aria-label="Ver carrito">
            <ShoppingCart size={24} />
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Tienda</h1>
        <p className="text-stone-600 mb-6">
          Nuestros productos. ¿No ves el precio de alguno? Pulsa <span className="font-semibold">Me interesa</span> y te informamos por WhatsApp.
        </p>

        {/* Buscador */}
        <div className="relative mb-4">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full border border-stone-300 px-3 py-2 pr-8 focus:outline-none focus:border-amber-700"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro por categoría */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 [scrollbar-width:thin]">
          <Chip activo={!categoriaSel} onClick={() => setCategoriaSel(null)}>Todas</Chip>
          {categorias.map(c => (
            <Chip key={c.titulo} activo={categoriaSel === c.titulo} onClick={() => setCategoriaSel(c.titulo)}>
              {c.titulo}
            </Chip>
          ))}
        </div>

        {/* Rejilla de productos */}
        {visibles.length === 0 ? (
          <p className="text-stone-500">No hay productos que coincidan.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibles.map((p, i) => (
              <ProductoCard key={`${p.categoria}-${p.nombre}-${i}`} producto={p} />
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

/* ── Tarjeta de producto ──────────────────────────────────── */
function ProductoCard({ producto: p }) {
  const { añadir } = useCarrito();
  const [añadido, setAñadido] = useState(false);
  const precio = formatoPrecio(p.precio);
  const comprable = p.precio != null;

  const añadirAlCarrito = () => {
    añadir(p);
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1500);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-sm overflow-hidden flex flex-col">
      <div className="aspect-square bg-stone-100">
        {p.src ? (
          <img src={p.src} alt={p.nombre} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">Sin foto</div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-wider text-amber-700">{p.categoria}</span>
        <h3 className="font-semibold text-sm leading-tight mt-0.5">{p.nombre}</h3>
        {p.desc && <p className="text-xs text-stone-500 line-clamp-2 mt-1">{p.desc}</p>}

        <div className="mt-auto pt-3">
          {precio && <p className="text-amber-700 font-bold mb-2">{precio}</p>}
          {comprable ? (
            <button
              onClick={añadirAlCarrito}
              className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 text-sm font-semibold py-2 rounded-full transition-colors"
            >
              <ShoppingCart size={15} /> {añadido ? 'Añadido ✓' : 'Añadir al carrito'}
            </button>
          ) : (
            <a
              href={whatsappProducto(p.nombre, precio)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-full transition-colors"
            >
              <WhatsAppIcon size={15} /> Me interesa
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
