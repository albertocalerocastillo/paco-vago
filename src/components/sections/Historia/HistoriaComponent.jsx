import Reveal from '../../ui/Reveal/RevealComponent';

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

export default function HistoriaComponent() {
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

        {/* Cita destacada */}
        <div className="mt-16 p-8 bg-stone-50 border-l-4 border-amber-700 italic text-xl text-stone-700 text-center">
          Cuatro generaciones cuidando de Carmona desde la Puerta de Sevilla.
        </div>
      </div>
    </section>
  );
}
