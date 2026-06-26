import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingCart } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';
import { formatoPrecio } from '../../../utils/formato';

/**
 * Mini-carrito: panel lateral que se desliza por la derecha al añadir un
 * producto. Se monta una vez (en el provider) y está disponible en toda la web.
 */
export default function MiniCarrito() {
  const { items, total, abierto, cerrarCarrito, cambiarCantidad, quitar } = useCarrito();

  // Cerrar con Escape + bloquear scroll de fondo mientras está abierto
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => { if (e.key === 'Escape') cerrarCarrito(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierto, cerrarCarrito]);

  return (
    <div className={`fixed inset-0 z-50 font-serif ${abierto ? '' : 'pointer-events-none'}`} aria-hidden={!abierto}>
      {/* Fondo */}
      <div
        onClick={cerrarCarrito}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${abierto ? 'opacity-100' : 'opacity-0'}`}
      ></div>

      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-stone-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          abierto ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <span className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart size={20} /> Tu carrito
          </span>
          <button onClick={cerrarCarrito} aria-label="Cerrar" className="text-stone-500 hover:text-stone-800">
            <X size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-stone-500 px-6 text-center">
            Tu carrito está vacío.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(x => (
                <div key={x.id} className="flex gap-3 items-center">
                  {x.foto && <img src={x.foto} alt={x.nombre} className="w-14 h-14 object-cover shrink-0 rounded-sm" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate">{x.nombre}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center border border-stone-300">
                        <button onClick={() => cambiarCantidad(x.id, x.cantidad - 1)} aria-label="Menos" className="w-7 h-7 flex items-center justify-center hover:text-amber-700">
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm">{x.cantidad}</span>
                        <button onClick={() => cambiarCantidad(x.id, x.cantidad + 1)} aria-label="Más" className="w-7 h-7 flex items-center justify-center hover:text-amber-700">
                          <Plus size={13} />
                        </button>
                      </div>
                      <button onClick={() => quitar(x.id)} aria-label={`Quitar ${x.nombre}`} className="text-stone-400 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold shrink-0">
                    {formatoPrecio((Number(x.precio) || 0) * x.cantidad)}
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-stone-200 px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <span>Total</span>
                <span className="text-xl font-bold">{formatoPrecio(total)}</span>
              </div>
              <Link
                to="/tienda/carrito"
                onClick={cerrarCarrito}
                className="block w-full text-center bg-stone-900 hover:bg-amber-700 text-stone-50 py-3 uppercase text-sm tracking-widest transition-colors"
              >
                Ver carrito
              </Link>
              <button
                onClick={cerrarCarrito}
                className="block w-full text-center text-stone-500 hover:text-stone-800 text-sm mt-3 transition-colors"
              >
                Seguir comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
