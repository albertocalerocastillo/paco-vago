import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Lock, WhatsAppIcon } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';
import { whatsappLink } from '../../../data/contacto';
import { provinciaDeCP } from '../../../data/provincias';
import { zonaFueraDePeninsula } from '../../../data/envios';
import { validarDireccion } from '../../../data/direccion';

const GUARDADO = 'pacovago_envio';

const VACIA = {
  nombre: '', calle: '', piso: '', cp: '', localidad: '',
  nota: '', quiereFactura: false, nif: '',
};

/**
 * Datos de envío + botón de pago.
 *
 * La dirección la pedimos AQUÍ y no en la pantalla de Stripe. Stripe solo sabe
 * filtrar por país, y España incluye Canarias: si se la pidiéramos a él, un
 * cliente podría escribir un código postal de península para que le saliera el
 * botón y luego poner una dirección canaria al pagar. Como la recogemos
 * nosotros y le decimos a Stripe que no la pregunte, no hay por dónde colarse.
 */
export default function DatosDeEnvio() {
  const { items, setCpEnvio, repartoLocal } = useCarrito();
  const [datos, setDatos] = useState(() => {
    try {
      return { ...VACIA, ...JSON.parse(localStorage.getItem(GUARDADO) || '{}') };
    } catch {
      return VACIA;
    }
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(GUARDADO, JSON.stringify(datos));
    } catch {
      /* almacenamiento no disponible: solo se pierde la comodidad de recordarlo */
    }
  }, [datos]);

  // El carrito necesita el CP para el porte (en Carmona el reparto es gratis).
  useEffect(() => {
    setCpEnvio(datos.cp);
  }, [datos.cp, setCpEnvio]);

  // Al tocar un campo se borra su error: molesta menos que insistir en rojo.
  const set = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setDatos(d => ({ ...d, [campo]: valor }));
    setErrores(err => (err[campo] ? { ...err, [campo]: undefined } : err));
  };

  // Al salir de un campo se comprueba SOLO ese campo, y solo si tiene algo
  // escrito: asi el NIF mal tecleado avisa al momento, pero pasar de largo por
  // un campo vacio no te pinta la pagina de rojo antes de tiempo.
  const comprobar = (campo) => () => {
    if (!String(datos[campo] ?? '').trim()) return;
    const { errores: fallos } = validarDireccion(datos);
    setErrores(err => ({ ...err, [campo]: fallos[campo] }));
  };

  const provincia = provinciaDeCP(datos.cp);
  const zona = zonaFueraDePeninsula(datos.cp);

  const pagar = async () => {
    const revision = validarDireccion(datos);
    if (!revision.ok) {
      setErrores(revision.errores);
      return;
    }

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const respuesta = await fetch('/api/crear-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direccion: revision.direccion,
          items: items
            .filter(x => Number.isInteger(Number(x.id)))
            .map(x => ({ id: Number(x.id), cantidad: x.cantidad })),
        }),
      });

      const cuerpo = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok || !cuerpo.url) {
        setErrorGeneral(cuerpo.error || 'No hemos podido iniciar el pago. Inténtalo de nuevo.');
        setEnviando(false);
        return;
      }

      // A partir de aquí manda Stripe. El carrito no se vacía todavía: si el
      // cliente se arrepiente y vuelve atrás, se lo encuentra tal cual.
      window.location.href = cuerpo.url;
    } catch {
      setErrorGeneral('No hemos podido conectar. Revisa tu conexión e inténtalo otra vez.');
      setEnviando(false);
    }
  };

  const campo = 'w-full border border-stone-300 px-3 py-2 focus:outline-none focus:border-amber-700';
  const malo = 'border-red-600 bg-red-50';

  // Funcion, no componente: si fuera un componente declarado aqui dentro, React
  // lo recrearia en cada pintada y perderia su estado.
  const aviso = (de) =>
    errores[de] ? <p className="text-xs text-red-700 mt-1">{errores[de]}</p> : null;

  return (
    <div className="mt-8 bg-white border border-stone-200 p-5">
      <h2 className="text-xl font-bold mb-1">¿Dónde te lo enviamos?</h2>
      <p className="text-sm text-stone-500 mb-5">Solo enviamos a península.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm text-stone-600 mb-1">
            Nombre y apellidos de quien recibe
          </label>
          <input id="nombre" value={datos.nombre} onChange={set('nombre')} onBlur={comprobar('nombre')} autoComplete="name"
            placeholder="María García López"
            className={`${campo} ${errores.nombre ? malo : ''}`} />
          {aviso('nombre')}
        </div>

        <div>
          <label htmlFor="calle" className="block text-sm text-stone-600 mb-1">Calle y número</label>
          <input id="calle" value={datos.calle} onChange={set('calle')} onBlur={comprobar('calle')} autoComplete="address-line1"
            placeholder="Calle Prim 12"
            className={`${campo} ${errores.calle ? malo : ''}`} />
          {aviso('calle')}
        </div>

        <div>
          <label htmlFor="piso" className="block text-sm text-stone-600 mb-1">
            Piso, puerta, escalera <span className="text-stone-400">(opcional)</span>
          </label>
          <input id="piso" value={datos.piso} onChange={set('piso')} autoComplete="address-line2"
            placeholder="3º B" className={campo} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="cp" className="block text-sm text-stone-600 mb-1">Código postal</label>
            <input id="cp" value={datos.cp} inputMode="numeric" maxLength={5} autoComplete="postal-code"
              onChange={(e) => {
                const limpio = e.target.value.replace(/[^0-9]/g, '');
                setDatos(d => ({ ...d, cp: limpio }));
                setErrores(err => (err.cp ? { ...err, cp: undefined } : err));
              }}
              placeholder="41410"
              onBlur={comprobar('cp')}
              className={`${campo} tracking-widest ${errores.cp ? malo : ''}`} />
          </div>
          <div className="col-span-2">
            <label htmlFor="localidad" className="block text-sm text-stone-600 mb-1">Localidad</label>
            <input id="localidad" value={datos.localidad} onChange={set('localidad')} onBlur={comprobar('localidad')}
              autoComplete="address-level2" placeholder="Carmona"
              className={`${campo} ${errores.localidad ? malo : ''}`} />
          </div>
        </div>
        {aviso('cp')}
        {aviso('localidad')}

        {provincia && !zona && (
          <p className="text-sm text-stone-500 -mt-2">
            Provincia: <strong className="text-stone-700">{provincia}</strong>
          </p>
        )}

        {repartoLocal && (
          <p className="text-sm text-green-800 bg-green-50 border-l-4 border-green-600 px-3 py-2">
            🚲 <strong>Estás en Carmona: te lo llevamos nosotros, gratis.</strong> Te avisamos para
            quedar en la hora de entrega.
          </p>
        )}

        <div>
          <label htmlFor="nota" className="block text-sm text-stone-600 mb-1">
            ¿Algo que debamos saber? <span className="text-stone-400">(opcional)</span>
          </label>
          <textarea id="nota" value={datos.nota} onChange={set('nota')} rows={2}
            placeholder="Dejarlo en portería, llamar antes de subir…"
            className={`${campo} resize-y`} />
        </div>

        <div className="border-t border-stone-200 pt-4">
          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
            <input type="checkbox" checked={datos.quiereFactura} onChange={set('quiereFactura')} />
            Quiero factura
          </label>

          {datos.quiereFactura && (
            <div className="mt-3">
              <label htmlFor="nif" className="block text-sm text-stone-600 mb-1">
                NIF o CIF para la factura
              </label>
              <input id="nif" value={datos.nif} onChange={set('nif')} onBlur={comprobar('nif')} maxLength={12}
                placeholder="12345678Z"
                className={`${campo} sm:w-56 uppercase ${errores.nif ? malo : ''}`} />
              {aviso('nif')}
            </div>
          )}
        </div>
      </div>

      {zona ? (
        <div className="mt-6 border-t border-stone-200 pt-5 text-sm">
          <p className="text-stone-700 mb-3">
            Todavía no enviamos a <strong>{zona}</strong> desde la web: el transporte hay que
            presupuestarlo aparte. Escríbenos y te decimos lo que cuesta.
          </p>
          <a
            href={whatsappLink(`Hola, quiero hacer un pedido con envío a ${zona} (CP ${datos.cp}). ¿Me decís el precio del envío?`)}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <WhatsAppIcon size={17} /> Preguntar por WhatsApp
          </a>
        </div>
      ) : (
        <div className="mt-6 border-t border-stone-200 pt-5">
          <button
            onClick={pagar}
            disabled={enviando || items.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-stone-50 font-semibold px-6 py-3 uppercase text-sm tracking-widest transition-colors"
          >
            <CreditCard size={18} />
            {/* Bizum: "aprobación pendiente" en Stripe (23/10/2026). Cuando lo aprueben,
                volver a poner 'Pagar con tarjeta o Bizum' y el texto de Condiciones. */}
            {enviando ? 'Abriendo el pago…' : 'Pagar con tarjeta'}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400 mt-3">
            <Lock size={12} /> Pago seguro. Los datos de la tarjeta no pasan por esta web.
          </p>
          {/* Antes de pagar el cliente tiene que tener a mano las condiciones, el
              desistimiento y la privacidad (RDL 1/2007, art. 97 y 98). */}
          <p className="text-xs text-stone-500 text-center mt-2 leading-relaxed">
            Al pagar aceptas las{' '}
            <Link to="/legal/condiciones-de-venta" target="_blank" className="underline hover:text-amber-700">condiciones de venta</Link>.
            Tienes 14 días para desistir (<Link to="/legal/devoluciones" target="_blank" className="underline hover:text-amber-700">devoluciones</Link>).
            Tratamos tus datos según la{' '}
            <Link to="/legal/privacidad" target="_blank" className="underline hover:text-amber-700">política de privacidad</Link>.
          </p>
        </div>
      )}

      {errorGeneral && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-700 px-3 py-2">
          {errorGeneral}
        </p>
      )}
    </div>
  );
}
