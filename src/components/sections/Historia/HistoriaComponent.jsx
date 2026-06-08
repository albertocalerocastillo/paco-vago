import { useState } from 'react';
import Reveal from '../../ui/Reveal/RevealComponent';
import Lightbox from '../../ui/Lightbox/LightboxComponent';

const hitos = [
  {
    anyo: '1924',
    texto: (
      <>
        El abuelo de Paco llegó a Carmona desde <span className="font-semibold">Bailén (Jaén)</span> buscando trabajo.
        Le gustó el pueblo y decidió quedarse y establecerse por su cuenta. Así nació Paco Vago.
      </>
    )
  },
  {
    anyo: '···',
    texto: (
      <>
        El negocio pasó a sus tres hijos: <span className="font-semibold">Blas, Paco y Antonio</span>. Más tarde,
        la gerencia quedó en manos de Paco y su cuñado Manolo, que mantuvieron viva la esencia de la
        tienda durante décadas.
      </>
    )
  },
  {
    anyo: '2025',
    texto: (
      <>
        <span className="font-semibold">José Antonio López</span> tomó el relevo. Aquel pupilo que entró con 16 años
        en la tienda recogió el traspaso del negocio con 38, sumando experiencia y juventud para escribir el
        siguiente capítulo de esta historia centenaria.
      </>
    )
  }
];

const RETRATOS = [
  {
    src: '/fotos/paco.jpg',
    alt: 'Francisco "Paco" Vago trabajando en la tienda',
    titulo: 'Francisco "Paco" Vago',
    desc: 'Toda una vida tras el mostrador, con mucho amor'
  },
  {
    src: '/fotos/duenos.jpg',
    alt: 'Paco Vago y José Antonio en el mostrador de la tienda',
    titulo: 'Paco y José Antonio',
    desc: 'El relevo, en el mostrador de siempre'
  }
];

export default function HistoriaComponent() {
  const [ampliada, setAmpliada] = useState(null);
  return (
    <section id="historia" className="py-24 px-6 bg-stone-100">
      <div className="max-w-4xl mx-auto">

        {/* Cabecera */}
        <Reveal className="text-center mb-16">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Nuestra historia</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Un siglo en Carmona</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto"></div>
        </Reveal>

        {/* Línea temporal */}
        <div className="space-y-8 text-lg leading-relaxed text-stone-700">
          {hitos.map(({ anyo, texto }) => (
            <div key={anyo} className="flex gap-6 items-start">
              <div className="text-5xl font-bold text-amber-700 min-w-[100px]">{anyo}</div>
              <p>{texto}</p>
            </div>
          ))}
        </div>

        {/* Retratos de los dueños (ampliables) */}
        <Reveal className="mt-16">
          <div className="grid sm:grid-cols-2 gap-6">
            {RETRATOS.map((foto) => (
              <figure
                key={foto.src}
                onClick={() => setAmpliada(foto)}
                className="group relative overflow-hidden rounded-sm shadow-2xl cursor-zoom-in"
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-12 pointer-events-none">
                  <span className="text-white text-lg font-bold leading-tight">{foto.titulo}</span>
                  <span className="block text-stone-200 text-sm">{foto.desc} · toca para ampliar</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-2 text-right">
            Fotos: Eze García · La Voz del Sur
          </p>
        </Reveal>

        {/* Cita destacada */}
        <div className="mt-12 p-8 bg-stone-50 border-l-4 border-amber-700 italic text-xl text-stone-700 text-center">
          Cuatro generaciones cuidando de Carmona desde la Puerta de Sevilla.
        </div>
      </div>

      {ampliada && (
        <Lightbox
          src={ampliada.src}
          alt={ampliada.alt}
          titulo={ampliada.titulo}
          desc={`${ampliada.desc} · Foto: La Voz del Sur`}
          onClose={() => setAmpliada(null)}
        />
      )}
    </section>
  );
}
