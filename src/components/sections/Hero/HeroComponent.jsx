import { ChevronRight } from 'lucide-react';
import { scrollToSection } from '../../../utils/scroll';

export default function HeroComponent() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Fondo con gradiente y texturas */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(217,119,6,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(180,83,9,0.3) 0%, transparent 50%)'
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.05) 35px, rgba(255,255,255,0.05) 70px)'
          }}
        ></div>
      </div>

      {/* Contenido central */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="text-amber-300 text-sm uppercase tracking-[0.4em] mb-6 opacity-90">
          Puerta de Sevilla · Carmona
        </div>

        <h1 className="text-7xl md:text-9xl font-bold text-stone-50 mb-4 tracking-tight">
          Paco Vago
        </h1>

        <div className="w-24 h-px bg-amber-400 mx-auto mb-6"></div>

        <p className="text-xl md:text-2xl text-stone-200 italic mb-2 font-light">
          "La tienda que tiene de todo,
        </p>
        <p className="text-xl md:text-2xl text-stone-200 italic mb-10 font-light">
          y si no lo tienen, se lo inventan o te lo consiguen"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('productos')}
            className="bg-amber-700 hover:bg-amber-600 text-stone-50 px-8 py-4 uppercase text-sm tracking-widest transition-all hover:scale-105"
          >
            Ver productos
          </button>
          <button
            onClick={() => scrollToSection('visitanos')}
            className="border border-stone-300 text-stone-100 hover:bg-stone-50 hover:text-stone-900 px-8 py-4 uppercase text-sm tracking-widest transition-all"
          >
            Cómo llegar
          </button>
        </div>
      </div>

      {/* Flecha animada */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-300 animate-bounce">
        <ChevronRight className="rotate-90" size={32} />
      </div>
    </section>
  );
}
