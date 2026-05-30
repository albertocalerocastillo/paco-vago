import { galeria } from '../../../data/galeria';

export default function GaleriaComponent() {
  return (
    <section id="galeria" className="py-24 px-6 bg-stone-100">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <div className="text-center mb-16">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Galería</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">La tienda por dentro</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Un vistazo a lo que vas a encontrar al cruzar la Puerta de Sevilla.
          </p>
        </div>

        {/* Cuadrícula de fotos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {galeria.map((foto, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-sm bg-stone-200"
            >
              <img
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
