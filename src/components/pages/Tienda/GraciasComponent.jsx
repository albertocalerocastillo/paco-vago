import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, WhatsAppIcon } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';
import { useSeo } from '../../../hooks/useSeo';
import { whatsappLink } from '../../../data/contacto';
import TiendaHeader from './TiendaHeader';
import FooterComponent from '../../layout/Footer/FooterComponent';

/**
 * Página a la que Stripe devuelve al cliente tras pagar (/tienda/gracias).
 *
 * Aquí se vacía el carrito: es el primer momento en que sabemos que la compra
 * salió adelante. Aun así el texto no promete que el cobro esté confirmado,
 * porque quien lo confirma de verdad es el aviso que Stripe manda al servidor.
 */
export default function GraciasComponent() {
  useSeo({ ruta: '/tienda/gracias', titulo: 'Pedido recibido | Paco Vago', noindex: true });

  const [params] = useSearchParams();
  const referencia = params.get('ref');
  const { vaciar } = useCarrito();

  useEffect(() => {
    vaciar();
  }, [vaciar]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif flex flex-col">
      <TiendaHeader />

      <div className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto mb-6">
          <Check size={32} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">¡Gracias por tu pedido!</h1>

        <p className="text-stone-600 leading-relaxed mb-6">
          Hemos recibido tu compra y ya la estamos preparando. Te llega un correo con el
          resumen en unos minutos; si no lo ves, mira en la carpeta de spam.
        </p>

        {referencia && (
          <div className="inline-block bg-white border border-stone-200 px-6 py-4 mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-1">Tu referencia</p>
            <p className="text-2xl font-bold tracking-wider">{referencia}</p>
          </div>
        )}

        <p className="text-stone-600 leading-relaxed mb-8">
          El pedido sale de la tienda en <strong>2 a 5 días laborables</strong>. Si necesitas
          cambiar algo o tienes cualquier duda, escríbenos con esa referencia y lo miramos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappLink(
              referencia
                ? `Hola, os escribo por mi pedido ${referencia}.`
                : 'Hola, os escribo por un pedido que acabo de hacer en la web.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            <WhatsAppIcon size={18} /> Escribirnos por WhatsApp
          </a>
          <Link
            to="/tienda"
            className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 px-6 py-3 uppercase text-sm tracking-widest transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}
