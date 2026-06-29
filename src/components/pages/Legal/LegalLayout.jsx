import { Link } from 'react-router-dom';
import TiendaHeader from '../Tienda/TiendaHeader';
import FooterComponent from '../../layout/Footer/FooterComponent';
import { datosPendientes, LEGAL_ACTUALIZADO } from '../../../data/empresa';

/**
 * Muestra un dato de la empresa. Si todavía es un placeholder (empieza por "["),
 * lo resalta en amarillo para que NUNCA se publique sin rellenar.
 */
export function Dato({ valor }) {
  const pendiente = typeof valor === 'string' && valor.startsWith('[');
  if (!pendiente) return <span className="font-semibold text-stone-800">{valor}</span>;
  return (
    <mark className="bg-amber-200 text-amber-900 font-semibold px-1 rounded-sm" title="Dato pendiente de rellenar">
      {valor}
    </mark>
  );
}

/**
 * Maqueta común de las páginas legales (aviso legal, privacidad, condiciones,
 * devoluciones). Cabecera de tienda + texto centrado y legible + pie.
 *
 * Las clases [&_h2]/[&_p]… estilan el contenido (children) sin que cada
 * documento tenga que repetir clases en cada etiqueta.
 */
export default function LegalLayout({ titulo, intro, children }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <TiendaHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Aviso de borrador: solo visible mientras falten datos fiscales del tío */}
        {datosPendientes && (
          <div className="mb-8 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Borrador.</strong> Esta página tiene datos pendientes de rellenar
            (resaltados en <mark className="bg-amber-200 px-1 rounded-sm">amarillo</mark>).
            No publicar ni activar el cobro hasta completarlos en{' '}
            <code className="text-xs">src/data/empresa.js</code>.
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{titulo}</h1>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-6">
          Última actualización: {LEGAL_ACTUALIZADO}
        </p>

        {intro && <p className="text-stone-600 mb-8 leading-relaxed">{intro}</p>}

        <article
          className="
            leading-relaxed text-stone-700
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-stone-900 [&_h2]:mt-10 [&_h2]:mb-3
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-stone-900 [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
            [&_a]:text-amber-700 [&_a]:underline hover:[&_a]:text-amber-800
          "
        >
          {children}
        </article>

        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/legal/aviso-legal" className="text-stone-500 hover:text-amber-700">Aviso legal</Link>
          <Link to="/legal/privacidad" className="text-stone-500 hover:text-amber-700">Privacidad</Link>
          <Link to="/legal/condiciones-de-venta" className="text-stone-500 hover:text-amber-700">Condiciones de venta</Link>
          <Link to="/legal/devoluciones" className="text-stone-500 hover:text-amber-700">Devoluciones</Link>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}
