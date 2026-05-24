import { Phone } from 'lucide-react';
import { categorias } from '../../../data/categorias';
import { TELEFONO_HREF, TELEFONO } from '../../../data/contacto';

export default function ProductosComponent() {
  return (
    <section id="productos" className="py-24 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <div className="text-center mb-16">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Qué encontrarás</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Tenemos de todo</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Desde lo más tradicional hasta lo que ni te imaginas. Si no lo tenemos, te lo conseguimos.
          </p>
        </div>

        {/* Grid de categorías */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="group bg-white p-8 border border-stone-200 hover:border-amber-700 transition-all hover:shadow-xl cursor-pointer"
              >
                <Icon
                  className="text-amber-700 mb-4 group-hover:scale-110 transition-transform"
                  size={40}
                  strokeWidth={1.5}
                />
                <h3 className="text-2xl font-bold mb-3">{cat.titulo}</h3>
                <p className="text-stone-600 mb-4 text-sm leading-relaxed">{cat.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <span key={item} className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA llamada directa */}
        <div className="mt-12 text-center">
          <p className="text-stone-600 mb-6">
            ¿No ves lo que buscas? Llámanos y te lo conseguimos.
          </p>
          <a
            href={TELEFONO_HREF}
            className="inline-flex items-center gap-3 bg-stone-900 hover:bg-amber-700 text-stone-50 px-8 py-4 uppercase text-sm tracking-widest transition-colors"
          >
            <Phone size={18} /> Llámanos · {TELEFONO}
          </a>
        </div>
      </div>
    </section>
  );
}
