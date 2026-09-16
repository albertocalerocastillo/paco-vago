import { useState, useEffect } from 'react';
import { CreditCard, Lock, WhatsAppIcon } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';
import { whatsappLink } from '../../../data/contacto';
import { cpValido, zonaFueraDePeninsula } from '../../../data/envios';

const CP_GUARDADO = 'pacovago_cp';

/**
 * Código postal + botón de pago.
 *
 * El código postal se pide AQUÍ, antes de cobrar, porque a Canarias y Baleares
 * no se envía desde la web. Si lo dejáramos para la pantalla de Stripe, el
 * cliente pagaría y solo después descubriría que no le mandamos el pedido.
 *
 * Al pulsar, el servidor crea el cobro y devuelve un enlace de Stripe. La web
 * nunca ve los datos de la tarjeta.
 */
export default function PagarConTarjeta() {
  const { items } = useCarrito();
  const [cp, setCp] = useState(() => {
    try {
      return localStorage.getItem(CP_GUARDADO) || '';
    } catch {
      return '';
    }
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CP_GUARDADO, cp);
    } catch {
      /* almacenamiento no disponible: da igual, es una comodidad */
    }
  }, [cp]);

  const zona = zonaFueraDePeninsula(cp);
  const cpListo = cpValido(cp) && !zona;

  const pagar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/crear-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cp: cp.trim(),
          items: items
            .filter(x => Number.isInteger(Number(x.id)))
            .map(x => ({ id: Number(x.id), cantidad: x.cantidad })),
        }),
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok || !datos.url) {
        setError(datos.error || 'No hemos podido iniciar el pago. Inténtalo de nuevo.');
        setEnviando(false);
        return;
      }

      // A partir de aquí manda Stripe. No vaciamos el carrito todavía: si el
      // cliente se arrepiente y vuelve atrás, se lo encuentra tal cual lo dejó.
      window.location.href = datos.url;
    } catch {
      setError('No hemos podido conectar. Revisa tu conexión e inténtalo otra vez.');
      setEnviando(false);
    }
  };

  return (
    <div className="mt-6 bg-white border border-stone-200 p-4">
      <label htmlFor="cp" className="block text-sm text-stone-600 mb-2">
        ¿A qué código postal lo enviamos?
      </label>

      <input
        id="cp"
        type="text"
        inputMode="numeric"
        maxLength={5}
        value={cp}
        onChange={(e) => setCp(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="41410"
        className="w-32 border border-stone-300 px-3 py-2 text-lg tracking-widest focus:outline-none focus:border-amber-700"
      />

      {zona ? (
        <div className="mt-4 text-sm">
          <p className="text-stone-700 mb-3">
            Todavía no enviamos a <strong>{zona}</strong> desde la web: el transporte hay que
            presupuestarlo aparte. Escríbenos y te decimos lo que cuesta.
          </p>
          <a
            href={whatsappLink(`Hola, quiero hacer un pedido con envío a ${zona} (CP ${cp}). ¿Me decís el precio del envío?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <WhatsAppIcon size={17} /> Preguntar por WhatsApp
          </a>
        </div>
      ) : (
        <>
          <button
            onClick={pagar}
            disabled={!cpListo || enviando || items.length === 0}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-stone-50 font-semibold px-6 py-3 uppercase text-sm tracking-widest transition-colors"
          >
            <CreditCard size={18} />
            {enviando ? 'Abriendo el pago…' : 'Pagar con tarjeta o Bizum'}
          </button>

          {!cpListo && !enviando && (
            <p className="text-xs text-stone-400 mt-2">
              Escribe tu código postal para continuar.
            </p>
          )}

          <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mt-3">
            <Lock size={12} /> Pago seguro. Los datos de la tarjeta no pasan por esta web.
          </p>
        </>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border-l-4 border-red-700 px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
