import { useRef } from 'react';
import { ChevronRight, TikTokIcon, InstagramIcon } from '../../../theme/icons';
import { videos } from '../../../data/videos';
import { REDES_SOCIALES } from '../../../data/contacto';
import Reveal from '../../ui/Reveal/RevealComponent';

// Tarjetas de "seguir" (perfiles)
const PERFILES = [
  {
    nombre: 'Instagram',
    handle: REDES_SOCIALES.instagram.handle,
    url: REDES_SOCIALES.instagram.url,
    Icon: InstagramIcon
  },
  {
    nombre: 'TikTok',
    handle: REDES_SOCIALES.tiktok.handle,
    url: REDES_SOCIALES.tiktok.url,
    Icon: TikTokIcon
  }
];

function IconoRed({ red, ...props }) {
  return red === 'instagram' ? <InstagramIcon {...props} /> : <TikTokIcon {...props} />;
}

export default function SiguenosComponent() {
  const trackRef = useRef(null);

  const desplazar = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section id="redes" className="py-24 px-6 bg-amber-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <Reveal className="text-center mb-12">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Síguenos</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">En vídeo y en redes</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-700 max-w-2xl mx-auto">
            Cada día subimos novedades, productos y la vida en la tienda. Toca un vídeo para verlo.
          </p>
        </Reveal>

        {/* Carrusel de vídeos */}
        <div className="relative">
          <button
            onClick={() => desplazar(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors -ml-2"
            aria-label="Vídeos anteriores"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {videos.map((video, i) => (
              <a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative snap-center shrink-0 w-48 sm:w-56 aspect-[9/16] overflow-hidden rounded-lg bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 flex flex-col items-center justify-center text-center"
                aria-label={`Ver vídeo en ${video.red === 'instagram' ? 'Instagram' : 'TikTok'}`}
              >
                {video.portada && (
                  <img
                    src={video.portada}
                    alt="Vídeo de Paco Vago"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col items-center gap-3 px-4">
                  <IconoRed red={video.red} size={34} className="text-white" />
                  <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors">
                    <ChevronRight size={26} className="text-stone-900 ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-4 inset-x-0 z-10 text-white text-xs font-semibold uppercase tracking-wider">
                  Ver en {video.red === 'instagram' ? 'Instagram' : 'TikTok'}
                </span>
              </a>
            ))}
          </div>

          <button
            onClick={() => desplazar(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors -mr-2"
            aria-label="Más vídeos"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <p className="md:hidden text-center text-sm text-stone-500 mt-2">Desliza para ver más →</p>

        {/* Botones de seguir perfiles */}
        <div className="grid sm:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
          {PERFILES.map(({ nombre, handle, url, Icon }) => (
            <a
              key={nombre}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-8 hover:shadow-xl transition-all border border-stone-200 text-center"
            >
              <Icon className="mx-auto mb-4 text-stone-900 group-hover:text-amber-700 transition-colors" size={44} />
              <h3 className="text-xl font-bold mb-1">{nombre}</h3>
              <p className="text-stone-600 text-sm">{handle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
