import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, WhatsAppIcon } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';
import { whatsappLink } from '../../../data/contacto';
import { formatoPrecio } from '../../../utils/formato';
import TiendaHeader from '../Tienda/TiendaHeader';
import FooterComponent from '../../layout/Footer/FooterComponent';

/**
 * Página del carrito (/tienda/carrito).
 * Resumen de la compra con cantidades y total. Mientras no exista el pago
 * con tarjeta, se puede "Hacer el pedido por WhatsApp" (manda la lista entera).
 */
export default function CarritoComponent() {
  const { items, cambiarCantidad, quitar, vaciar, total } = useCarrito();

  const mensajePedido = () => {
    const lineas = items.map(
      x => `• ${x.cantidad} x ${x.nombre}${x.precio ? ` (${formatoPrecio(x.precio)})` : ''}`
    );
    return `Hola, quiero hacer este pedido en Paco Vago:\n${lineas.join('\n')}\n\nTotal: ${formatoPrecio(total)}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <TiendaHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="text-stone-600">
            <p className="mb-4">Tu carrito está vacío.</p>
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 px-6 py-3 uppercase text-sm tracking-widest transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map(x => (
                <div key={x.id} className="bg-white border border-stone-200 p-3 flex gap-3 items-center">
                  {x.foto && <img src={x.foto} alt={x.nombre} className="w-16 h-16 object-cover shrink-0 rounded-sm" />}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold leading-tight">{x.nombre}</p>
                    {x.precio != null && <p className="text-sm text-stone-500">{formatoPrecio(x.precio)} / ud.</p>}
                  </div>

                  {/* Cantidad */}
                  <div className="flex items-center border border-stone-300 shrink-0">
                    <button
                      onClick={() => cambiarCantidad(x.id, x.cantidad - 1)}
                      aria-label="Quitar una unidad"
                      className="w-8 h-8 flex items-center justify-center hover:text-amber-700"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="w-8 text-center text-sm">{x.cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(x.id, x.cantidad + 1)}
                      aria-label="Añadir una unidad"
                      className="w-8 h-8 flex items-center justify-center hover:text-amber-700"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Subtotal línea */}
                  <div className="w-20 text-right shrink-0 font-semibold text-sm">
                    {formatoPrecio((Number(x.precio) || 0) * x.cantidad)}
                  </div>

                  <button
                    onClick={() => quitar(x.id)}
                    aria-label={`Quitar ${x.nombre}`}
                    className="text-stone-400 hover:text-red-700 shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-300">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold">{formatoPrecio(total)}</span>
            </div>

            {/* Acciones */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappLink(mensajePedido())}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <WhatsAppIcon size={18} /> Hacer el pedido por WhatsApp
              </a>
              <button
                onClick={vaciar}
                className="text-stone-500 hover:text-red-700 text-sm transition-colors"
              >
                Vaciar carrito
              </button>
            </div>

            <p className="text-xs text-stone-400 mt-4">
              El pago con tarjeta llegará pronto. De momento confirmas el pedido por WhatsApp y
              acordáis el pago y el envío.
            </p>
          </>
        )}
      </div>

      <FooterComponent />
    </div>
  );
}
