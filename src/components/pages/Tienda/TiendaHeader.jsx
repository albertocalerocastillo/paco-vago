import { Link } from 'react-router-dom';
import { ShoppingCart } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';

/**
 * Cabecera común de todas las páginas de la tienda (listado, ficha, carrito).
 * Logo → tienda, enlace a la web informativa y carrito con contador.
 */
export default function TiendaHeader() {
  const { cantidadTotal } = useCarrito();

  return (
    <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <Link to="/tienda" className="font-bold text-lg tracking-tight">Paco Vago</Link>
      <div className="flex items-center gap-5">
        <Link to="/" className="text-sm text-stone-600 hover:text-amber-700 transition-colors hidden sm:inline">
          ← Volver a la web
        </Link>
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
  );
}
