import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';

/**
 * Cabecera común de todas las páginas de la tienda (listado, ficha, carrito).
 * Barra superior de marca + sello (logo) + carrito (abre el mini-carrito).
 */
export default function TiendaHeader() {
  const { cantidadTotal, abrirCarrito } = useCarrito();
  const [bump, setBump] = useState(false);
  const prev = useRef(cantidadTotal);

  // Saltito del icono cuando sube la cantidad
  useEffect(() => {
    if (cantidadTotal > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 400);
      prev.current = cantidadTotal;
      return () => clearTimeout(t);
    }
    prev.current = cantidadTotal;
  }, [cantidadTotal]);

  return (
    <>
      {/* Barra superior de marca (se va al hacer scroll) */}
      <div className="bg-amber-800 text-amber-50 text-center text-[11px] sm:text-xs uppercase tracking-[0.25em] py-2 px-4">
        Envíos a toda España · La tienda que tiene de todo desde 1924
      </div>

      {/* Cabecera fija */}
      <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/tienda" className="flex items-center gap-3" aria-label="Tienda Paco Vago">
          <img
            src="/logo.png"
            alt="Paco Vago · Desde 1924"
            className="h-11 w-11 rounded-full object-cover ring-1 ring-amber-700/30 shadow"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight">Paco Vago</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Tienda online</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className="text-sm text-stone-600 hover:text-amber-700 transition-colors">
            <span className="sm:hidden">← Web</span>
            <span className="hidden sm:inline">← Volver a la web</span>
          </Link>
          <button
            id="cart-icon"
            onClick={abrirCarrito}
            className={`relative text-stone-700 hover:text-amber-700 transition-colors ${bump ? 'cart-bump' : ''}`}
            aria-label="Ver carrito"
          >
            <ShoppingCart size={24} />
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}
