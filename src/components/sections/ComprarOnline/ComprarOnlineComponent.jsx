import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from '../../../theme/icons';
import { COLECCIONES } from '../../../data/colecciones';
import Reveal from '../../ui/Reveal/RevealComponent';

/**
 * Sección "Cómpralo online": tarjetas-colección con foto de grupo que llevan
 * a la tienda ya filtrada (ver src/data/colecciones.js). Es el puente entre la
 * web informativa y la tienda: una sola foto bonita → todos los formatos.
 */
export default function ComprarOnlineComponent() {
  if (!COLECCIONES.length) return null;

  return (
    <section id="comprar-online" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <Reveal className="text-center mb-14">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Ya en la tienda online</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Cómpralo online</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Elige una selección y te la llevamos a casa. Y lo que no veas, nos lo pides por WhatsApp.
          </p>
        </Reveal>

        {/* Tarjetas de colección */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {COLECCIONES.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 90} className="h-full">
              <Link
                to={`/tienda?q=${encodeURIComponent(c.buscar)}`}
                aria-label={c.cta || `Comprar ${c.titulo}`}
                className="group relative block h-72 overflow-hidden border border-stone-200 hover:border-amber-700 hover:shadow-xl transition-all"
              >
                <img
                  src={c.foto}
                  alt={c.titulo}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-stone-50">
                  <h3 className="text-2xl font-bold leading-tight drop-shadow">{c.titulo}</h3>
                  {c.subtitulo && <p className="text-stone-200 text-sm mt-1.5 drop-shadow">{c.subtitulo}</p>}
                  <span className="mt-4 inline-flex items-center gap-2 self-start bg-amber-700 group-hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 uppercase tracking-wider transition-colors">
                    <ShoppingBag size={16} /> {c.cta || 'Comprar'} <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
