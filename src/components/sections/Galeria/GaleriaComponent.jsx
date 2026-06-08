import { useRef, useState, useEffect } from 'react';
import { ChevronRight, X } from '../../../theme/icons';
import { galeria } from '../../../data/galeria';
import Reveal from '../../ui/Reveal/RevealComponent';

export default function GaleriaComponent() {
  const trackRef = useRef(null);
  const [seleccionada, setSeleccionada] = useState(null);

  const desplazar = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  // Cerrar el lightbox con la tecla Escape + bloquear scroll de fondo
  useEffect(() => {
    if (!seleccionada) return;
    const onKey = (e) => { if (e.key === 'Escape') setSeleccionada(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [seleccionada]);

  return (
    <section id="galeria" className="py-24 px-6 bg-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <Reveal className="text-center mb-12">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Galería</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">La tienda por dentro</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Un vistazo a lo que vas a encontrar al cruzar la Puerta de Sevilla.
          </p>
        </Reveal>

        {/* Carrusel */}
        <div className="relative">

          {/* Flecha izquierda (solo ordenador) */}
          <button
            onClick={() => desplazar(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors -ml-2"
            aria-label="Ver fotos anteriores"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>

          {/* Pista deslizable */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galeria.map((foto, i) => (
              <button
                key={i}
                onClick={() => setSeleccionada(foto)}
                className="group relative snap-center shrink-0 w-72 sm:w-80 aspect-square overflow-hidden rounded-sm bg-stone-200 cursor-pointer"
                aria-label={`Ampliar foto: ${foto.alt}`}
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>

          {/* Flecha derecha (solo ordenador) */}
          <button
            onClick={() => desplazar(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors -mr-2"
            aria-label="Ver más fotos"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Pista de "desliza" (solo móvil) */}
        <p className="md:hidden text-center text-sm text-stone-500 mt-2">
          Desliza para ver más →
        </p>
      </div>

      {/* LIGHTBOX: foto a pantalla completa */}
      {seleccionada && (
        <div
          onClick={() => setSeleccionada(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
        >
          <button
            onClick={() => setSeleccionada(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={36} />
          </button>
          <img
            src={seleccionada.src}
            alt={seleccionada.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
