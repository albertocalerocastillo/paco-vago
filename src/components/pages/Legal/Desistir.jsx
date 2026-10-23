import { useState } from 'react';
import { Link } from 'react-router-dom';
import LegalLayout, { Dato } from './LegalLayout';
import { EMPRESA } from '../../../data/empresa';

/**
 * Función de desistimiento online (Directiva UE 2023/2673, aplicable desde el
 * 19/06/2026). La ley pide tres cosas, y por eso la página es así:
 *
 * 1. Un acceso visible, rotulado "desistir del contrato" (enlace del pie y de
 *    las páginas legales).
 * 2. Pedir solo lo justo: nombre, qué pedido y dónde mandar la confirmación.
 *    El motivo NO se pide: desistir no necesita justificación.
 * 3. Un botón final rotulado "confirmar desistimiento" y, al pulsarlo, acuse
 *    de recibo con la fecha y la hora.
 */
export default function Desistir() {
  const [datos, setDatos] = useState({ nombre: '', email: '', pedido: '', productos: '', comentario: '', web: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [justificante, setJustificante] = useState(null);

  const cambiar = (campo) => (e) => setDatos(d => ({ ...d, [campo]: e.target.value }));

  const confirmar = async (e) => {
    e.preventDefault();
    setErrorGeneral(null);
    setEnviando(true);
    try {
      const r = await fetch('/api/desistimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const respuesta = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErrores(respuesta.errores || {});
        setErrorGeneral(respuesta.error || 'No hemos podido registrarlo. Escríbenos por email, vale igual.');
        return;
      }
      setErrores({});
      setJustificante({ ...respuesta, ...datos });
      window.scrollTo(0, 0);
    } catch {
      setErrorGeneral('No hay conexión. Inténtalo de nuevo o escríbenos por email, vale igual.');
    } finally {
      setEnviando(false);
    }
  };

  if (justificante) return <Justificante j={justificante} />;

  const campo = 'w-full border border-stone-300 bg-white px-3 py-2 focus:outline-none focus:border-amber-700';

  return (
    <LegalLayout
      titulo="Desistir del contrato"
      intro="Si has comprado en la tienda online, puedes desistir de la compra en los 14 días naturales siguientes a recibirla, sin dar explicaciones. Rellena estos datos y pulsa «Confirmar desistimiento»."
    >
      <form onSubmit={confirmar} noValidate className="space-y-5">
        <Campo etiqueta="Nombre y apellidos" error={errores.nombre}>
          <input className={campo} value={datos.nombre} onChange={cambiar('nombre')} autoComplete="name" maxLength={80} required />
        </Campo>
        <Campo etiqueta="Email" ayuda="Aquí te confirmaremos que lo hemos recibido." error={errores.email}>
          <input type="email" className={campo} value={datos.email} onChange={cambiar('email')} autoComplete="email" maxLength={120} required />
        </Campo>
        <Campo etiqueta="Número de pedido" ayuda="Empieza por PV-. Lo tienes en la confirmación de la compra." error={errores.pedido}>
          <input className={`${campo} uppercase`} value={datos.pedido} onChange={cambiar('pedido')} maxLength={20} required />
        </Campo>
        <Campo etiqueta="¿Qué productos devuelves? (opcional)" ayuda="Si lo dejas en blanco, entendemos que desistes del pedido entero.">
          <textarea className={campo} rows={2} value={datos.productos} onChange={cambiar('productos')} maxLength={500} />
        </Campo>
        <Campo etiqueta="Comentario (opcional)">
          <textarea className={campo} rows={2} value={datos.comentario} onChange={cambiar('comentario')} maxLength={500} />
        </Campo>

        {/* Trampa para robots: invisible para las personas. */}
        <input type="text" name="web" value={datos.web} onChange={cambiar('web')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        {errorGeneral && (
          <p className="text-sm text-red-700 bg-red-50 border-l-4 border-red-700 px-3 py-2">{errorGeneral}</p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full sm:w-auto bg-stone-900 hover:bg-amber-700 disabled:bg-stone-300 text-stone-50 font-semibold px-6 py-3 uppercase text-sm tracking-widest transition-colors"
        >
          {enviando ? 'Enviando…' : 'Confirmar desistimiento'}
        </button>
      </form>

      <p className="mt-8 text-sm text-stone-500">
        También puedes desistir escribiendo a <Dato valor={EMPRESA.email} />, llamando al {EMPRESA.telefono} o
        con el <Link to="/legal/devoluciones">modelo de formulario</Link>. Más detalles sobre plazos, reembolso y
        excepciones en la <Link to="/legal/devoluciones">política de devoluciones</Link>.
      </p>
    </LegalLayout>
  );
}

function Campo({ etiqueta, ayuda, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-stone-800 mb-1">{etiqueta}</span>
      {children}
      {ayuda && !error && <span className="block text-xs text-stone-500 mt-1">{ayuda}</span>}
      {error && <span className="block text-xs text-red-700 mt-1">{error}</span>}
    </label>
  );
}

/** Acuse de recibo: lo que se ha registrado, con fecha y hora. Se puede imprimir o guardar en PDF. */
function Justificante({ j }) {
  const cuando = new Date(j.creado_en).toLocaleString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return (
    <LegalLayout titulo="Desistimiento recibido" intro="Hemos registrado tu desistimiento. Guarda este justificante.">
      <div className="border border-stone-300 bg-white px-5 py-4">
        <ul>
          <li><strong>Justificante:</strong> {j.referencia}</li>
          <li><strong>Recibido el:</strong> {cuando}</li>
          <li><strong>Pedido:</strong> {String(j.pedido).toUpperCase()}</li>
          <li><strong>Nombre:</strong> {j.nombre}</li>
          <li><strong>Email:</strong> {j.email}</li>
          <li><strong>Productos:</strong> {j.productos || 'El pedido entero'}</li>
        </ul>
        <p className="mb-0">
          Destinatario: {EMPRESA.titular} ({EMPRESA.nombreComercial}), NIF {EMPRESA.nif}, {EMPRESA.domicilio}.
        </p>
      </div>
      <p className="mt-6">
        Te hemos enviado este justificante a <strong>{j.email}</strong> (mira también en spam) y te escribiremos para decirte cómo devolver el producto.
        El reembolso se hace en un máximo de 14 días naturales desde hoy, por el mismo medio de pago.
      </p>
      <button
        onClick={() => window.print()}
        className="mt-2 border border-stone-400 px-5 py-2.5 uppercase text-sm tracking-widest hover:border-amber-700 transition-colors print:hidden"
      >
        Imprimir o guardar en PDF
      </button>
    </LegalLayout>
  );
}
