import { ChevronRight } from '../../../theme/icons';
import { scrollToSection } from '../../../utils/scroll';

export default function HeroComponent() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Imagen de fondo: tienda en la Puerta de Sevilla */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/tienda.jpg)' }}
      ></div>

      {/* Overlay oscuro para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/60 to-stone-900/85"></div>

      {/* Toque cálido (gradientes ámbar muy sutiles) */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(217,119,6,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(120,53,15,0.5) 0%, transparent 50%)'
        }}
      ></div>

      {/* Contenido central */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="text-amber-300 text-sm uppercase tracking-[0.4em] mb-6 opacity-95 drop-shadow-lg">
          Puerta de Sevilla · Carmona
        </div>

        <h1 className="text-7xl md:text-9xl font-bold text-stone-50 mb-4 tracking-tight drop-shadow-2xl">
          Paco Vago
        </h1>

        <div className="w-24 h-px bg-amber-400 mx-auto mb-6"></div>

        <p className="text-xl md:text-2xl text-stone-100 italic mb-2 font-light drop-shadow-lg">
          "La tienda que tiene de todo,
        </p>
        <p className="text-xl md:text-2xl text-stone-100 italic mb-10 font-light drop-shadow-lg">
          y si no lo tienen, se lo inventan o te lo consiguen"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('productos')}
            className="bg-amber-700 hover:bg-amber-600 text-stone-50 px-8 py-4 uppercase text-sm tracking-widest transition-all hover:scale-105 shadow-xl"
          >
            Ver productos
          </button>
          <button
            onClick={() => scrollToSection('visitanos')}
            className="border border-stone-200/80 text-stone-100 hover:bg-stone-50 hover:text-stone-900 px-8 py-4 uppercase text-sm tracking-widest transition-all backdrop-blur-sm"
          >
            Cómo llegar
          </button>
        </div>
      </div>

      {/* Flecha animada */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-200 animate-bounce">
        <ChevronRight className="rotate-90 drop-shadow-lg" size={32} />
      </div>
    </section>
  );
}
