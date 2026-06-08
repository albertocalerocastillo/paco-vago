import Reveal from '../../ui/Reveal/RevealComponent';

export default function LocalComponent() {
  return (
    <section id="local" className="py-24 px-6 bg-stone-50">
      <Reveal className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Foto del local */}
          <div className="relative group overflow-hidden rounded-sm shadow-2xl">
            <img
              src="/tienda.jpg"
              alt="Paco Vago junto a la Puerta de Sevilla, Carmona"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Marco ámbar decorativo */}
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
                Sobre la fachada todavía pueden leerse las pintadas históricas de la antigua
                <span className="italic"> Cooperativa Olivarera</span>: <span className="font-semibold">"Aceites"</span>,
                <span className="font-semibold"> "Aceitunas"</span>, <span className="font-semibold">"Exportación"</span>.
                Es nuestro pequeño testimonio del Carmona del siglo XX.
              </p>
              <p>
                Cruzar el arco y entrar en nuestra tienda es, literalmente, dar un paseo por
                cien años de historia.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
