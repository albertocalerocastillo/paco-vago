import { useState } from 'react';
import Reveal from '../../ui/Reveal/RevealComponent';
import Lightbox from '../../ui/Lightbox/LightboxComponent';

// Fotos del interior (se muestran como dúo y son ampliables)
const INTERIOR = [
  {
    src: '/fotos/panoramica.jpg',
    alt: 'Interior de la tienda Paco Vago, vista panorámica desde la sala de ventas',
    titulo: 'La tienda que tiene de todo',
    desc: 'Un siglo de historia entre sus estanterías'
  },
  {
    src: '/fotos/utensilios.jpg',
    alt: 'Cajas con la nomenclatura escrita a mano de cuatro generaciones en Paco Vago',
    titulo: 'Un caos en armonía',
    desc: 'La nomenclatura de cuatro generaciones'
  },
  {
    src: '/fotos/maderas.jpg',
    alt: 'Cajas legendarias de mercería con etiquetas escritas a mano en Paco Vago',
    titulo: 'Cajas legendarias',
    desc: 'Maderas, especias y solera en el tiempo'
  }
];

// Producciones de cine y TV rodadas en la tienda / su fachada
const RODAJES = [
  { titulo: 'Manolete', tipo: 'Película', detalle: 'Con Penélope Cruz y Adrien Brody' },
  { titulo: 'La Peste', tipo: 'Serie · Movistar+', detalle: 'Ambientada en la Sevilla del XVI' },
  { titulo: 'La chica invisible', tipo: 'Serie', detalle: 'Rodada en Carmona' }
];

export default function LocalComponent() {
  const [ampliada, setAmpliada] = useState(null);

  return (
    <section id="local" className="py-24 px-6 bg-stone-50">
      <Reveal className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Foto de la fachada */}
          <div className="relative group overflow-hidden rounded-sm shadow-2xl">
            <img
              src="/tienda.jpg"
              alt="Paco Vago junto a la Puerta de Sevilla, Carmona"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 border border-amber-700/0 group-hover:border-amber-700/50 transition-colors pointer-events-none"></div>
          </div>

          {/* Texto */}
          <div>
            <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">El local</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Pegados a la <span className="text-amber-700">Puerta de Sevilla</span>
            </h2>
            <div className="w-24 h-px bg-amber-700 mb-8"></div>

            <div className="space-y-5 text-lg leading-relaxed text-stone-700">
              <p>
                La tienda está literalmente <span className="font-semibold">incrustada en la muralla</span>,
                a los pies del arco romano de la Puerta de Sevilla — la entrada monumental al casco
                histórico de Carmona.
              </p>
              <p>
                Las letras de <span className="font-semibold">"Aceites · Aceitunas · Cooperativa Olivarera"</span>
                que ves en la fachada tienen una historia curiosa: son herencia del rodaje de la película
                <span className="italic"> Manolete</span>. El equipo las pintó como "Cooperativa Olivarera
                Cordobesa" y nosotros decidimos conservarlas —quitando lo de "cordobesa"— como guiño y porque,
                además, aquí siempre se han vendido buenos aceites.
              </p>
              <p>
                Cruzar el arco y entrar en nuestra tienda es, literalmente, dar un paseo por
                cien años de historia.
              </p>
            </div>
          </div>
        </div>

        {/* Fotos del interior (ampliables al pulsar) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {INTERIOR.map((foto) => (
            <figure
              key={foto.src}
              onClick={() => setAmpliada(foto)}
              className="group relative overflow-hidden rounded-sm shadow-2xl cursor-zoom-in"
            >
              <img
                src={foto.src}
                alt={foto.alt}
                className="w-full h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-12 pointer-events-none">
                <span className="text-white text-lg font-bold">{foto.titulo}</span>
                <span className="block text-stone-200 text-sm">{foto.desc} · toca para ampliar</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Han rodado aquí: cine y televisión */}
        <div className="mt-16 bg-stone-900 text-stone-50 rounded-sm p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="text-amber-400 text-sm uppercase tracking-[0.4em] mb-3">🎬 Escenario de cine y TV</div>
            <h3 className="text-2xl md:text-3xl font-bold">También han rodado aquí</h3>
            <p className="text-stone-400 mt-3 max-w-2xl mx-auto text-sm">
              Nuestra fachada y la tienda han sido escenario de cine y televisión.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {RODAJES.map((r) => (
              <div key={r.titulo} className="text-center border border-stone-700/60 rounded-sm p-5">
                <div className="text-amber-400 text-xs uppercase tracking-widest mb-2">{r.tipo}</div>
                <div className="text-xl font-bold mb-1">{r.titulo}</div>
                <div className="text-stone-400 text-sm">{r.detalle}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {ampliada && (
        <Lightbox
          src={ampliada.src}
          alt={ampliada.alt}
          titulo={ampliada.titulo}
          desc={ampliada.desc}
          onClose={() => setAmpliada(null)}
        />
      )}
    </section>
  );
}
