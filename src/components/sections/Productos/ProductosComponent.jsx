import { useState, useEffect, useRef } from 'react';
import { Phone, X, ChevronRight } from '../../../theme/icons';
import { categorias } from '../../../data/categorias';
import { TELEFONO_HREF, TELEFONO } from '../../../data/contacto';

export default function ProductosComponent() {
  const [abierta, setAbierta] = useState(null); // categoría seleccionada (modal)
  const trackRef = useRef(null);

  const desplazar = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  // Cerrar con Escape + bloquear scroll de fondo
  useEffect(() => {
    if (!abierta) return;
    const onKey = (e) => { if (e.key === 'Escape') setAbierta(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierta]);

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
            const tieneFotos = cat.fotos && cat.fotos.length > 0;
            return (
              <div
                key={i}
                onClick={() => tieneFotos && setAbierta(cat)}
                className={`group bg-white border border-stone-200 transition-all overflow-hidden flex flex-col ${
                  tieneFotos ? 'hover:border-amber-700 hover:shadow-xl cursor-pointer' : ''
                }`}
              >
                {/* Cabecera: foto si existe, si no el icono */}
                {tieneFotos ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.fotos[0]}
                      alt={cat.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <Icon className="absolute top-4 left-4 text-white drop-shadow" size={28} strokeWidth={1.5} />
                    {/* contador de fotos */}
                    <span className="absolute bottom-3 right-3 text-xs bg-black/55 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {cat.fotos.length} fotos · ver
                    </span>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-stone-100">
                    <Icon className="text-amber-700" size={56} strokeWidth={1.25} />
                  </div>
                )}

                {/* Contenido */}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-3">{cat.titulo}</h3>
                  <p className="text-stone-600 mb-4 text-sm leading-relaxed line-clamp-3">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cat.items.slice(0, 5).map(item => (
                      <span key={item} className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
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

      {/* PANEL DE DETALLE DE CATEGORÍA */}
      {abierta && (
        <div
          onClick={() => setAbierta(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${abierta.titulo}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-50 w-full sm:max-w-3xl max-h-[92vh] sm:rounded-lg overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Carrusel de fotos */}
            <div className="relative shrink-0">
              <button
                onClick={() => setAbierta(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
              <div
                ref={trackRef}
                className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {abierta.fotos.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${abierta.titulo} ${idx + 1}`}
                    className="snap-center shrink-0 w-full h-64 sm:h-80 object-cover"
                  />
                ))}
              </div>

              {/* Flechas (solo cuando hay más de una foto) */}
              {abierta.fotos.length > 1 && (
                <>
                  <button
                    onClick={() => desplazar(-1)}
                    className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors"
                    aria-label="Foto anterior"
                  >
                    <ChevronRight className="rotate-180" size={22} />
                  </button>
                  <button
                    onClick={() => desplazar(1)}
                    className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs bg-black/55 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    {abierta.fotos.length} fotos
                  </span>
                </>
              )}
            </div>

            {/* Info */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <h3 className="text-3xl font-bold mb-3">{abierta.titulo}</h3>
              <p className="text-stone-600 mb-5 leading-relaxed">{abierta.desc}</p>
              <div className="flex flex-wrap gap-2">
                {abierta.items.map(item => (
                  <span key={item} className="text-sm bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>

              <a
                href={TELEFONO_HREF}
                className="mt-6 inline-flex items-center gap-2 text-amber-700 hover:text-amber-600 font-semibold transition-colors"
              >
                <Phone size={16} /> Pregúntanos · {TELEFONO}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
