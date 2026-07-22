import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, X, ChevronRight, WhatsAppIcon, ShoppingCart } from '../../../theme/icons';
import { useCategorias } from '../../../hooks/useCategorias';
import { TELEFONO_HREF, TELEFONO, whatsappProducto } from '../../../data/contacto';
import { COLECCIONES, enColeccion, productoEnColeccion } from '../../../data/colecciones';
import { formatoPrecio } from '../../../utils/formato';
import Reveal from '../../ui/Reveal/RevealComponent';

export default function ProductosComponent() {
  const catalogo = useCategorias();               // catálogo (Supabase con fallback al estático)
  // En el panel, los productos de una colección (p. ej. los 3 aceites) NO se
  // listan sueltos: se sustituyen por UNA tarjeta de grupo con la foto general,
  // cuyo botón lleva a la tienda ya filtrada. Así se ve que hay aceite en
  // Gourmet, pero sin repetir 3 fotos casi iguales.
  const categorias = useMemo(
    () =>
      catalogo.map((c) => {
        // Recorremos en orden: los productos sueltos se mantienen; el primer
        // producto de una colección se sustituye por su tarjeta de grupo (foto
        // general → tienda filtrada) EN SU SITIO, y los demás de esa colección
        // se saltan. Así el aceite queda donde estaba, sin repetir fotos.
        const puestas = new Set();
        const productos = [];
        for (const p of c.productos || []) {
          const col = COLECCIONES.find((co) => productoEnColeccion(p.nombre, co));
          if (!col) { productos.push(p); continue; }
          if (puestas.has(col.id)) continue;         // ya hay tarjeta de grupo
          puestas.add(col.id);
          productos.push({
            id: null,
            src: col.foto,
            nombre: col.titulo,
            desc: col.subtitulo,
            precio: null,
            coleccion: col,   // marca: el botón enlaza a /tienda?q=… (no a una ficha)
          });
        }
        return { ...c, productos };
      }),
    [catalogo]
  );
  const [abierta, setAbierta] = useState(null);   // categoría seleccionada (panel)
  const [ampliada, setAmpliada] = useState(null); // foto ampliada (lightbox)
  const trackRef = useRef(null);

  const desplazar = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const cerrarPanel = () => { setAmpliada(null); setAbierta(null); };

  // Cerrar con Escape (primero la foto ampliada, luego el panel) + bloquear scroll
  useEffect(() => {
    if (!abierta) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (ampliada) setAmpliada(null);
      else setAbierta(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [abierta, ampliada]);

  return (
    <section id="productos" className="py-24 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <Reveal className="text-center mb-16">
          <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Qué encontrarás</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Tenemos de todo</h2>
          <div className="w-24 h-px bg-amber-700 mx-auto mb-6"></div>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Desde lo más tradicional hasta lo que ni te imaginas. Si no lo tenemos, te lo conseguimos.
          </p>
        </Reveal>

        {/* Grid de categorías */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat, i) => {
            const Icon = cat.icon;
            const tieneProductos = cat.productos && cat.productos.length > 0;
            return (
              <Reveal
                key={i}
                delay={(i % 3) * 90}
                className="h-full"
              >
              <div
                onClick={() => tieneProductos && setAbierta(cat)}
                className={`group bg-white border border-stone-200 transition-all overflow-hidden flex flex-col h-full ${
                  tieneProductos ? 'hover:border-amber-700 hover:shadow-xl cursor-pointer' : ''
                }`}
              >
                {/* Cabecera: foto del primer producto si hay, si no el icono */}
                {tieneProductos ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.productos[0].src}
                      alt={cat.titulo}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <Icon className="absolute top-4 left-4 text-white drop-shadow" size={28} strokeWidth={1.5} />
                    <span className="absolute bottom-3 right-3 text-xs bg-black/55 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {cat.productos.length} productos · ver
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
              </Reveal>
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
          onClick={cerrarPanel}
          className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${abierta.titulo}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-stone-50 w-full sm:max-w-3xl max-h-[92vh] sm:rounded-lg overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Carrusel de productos */}
            <div className="relative shrink-0">
              <button
                onClick={cerrarPanel}
                className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={22} />
              </button>
              <div
                ref={trackRef}
                className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {abierta.productos.map((p, idx) => (
                  <div key={idx} className="relative snap-center shrink-0 w-full">
                    <img
                      src={p.src}
                      alt={p.nombre}
                      onClick={() => setAmpliada(p)}
                      className="w-full h-64 sm:h-80 object-cover cursor-zoom-in"
                    />
                    {/* Nombre del producto sobre la foto + precio + CTA de WhatsApp */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 pointer-events-none">
                      <p className="text-white text-lg font-bold leading-tight">{p.nombre}</p>
                      {p.desc && <p className="text-stone-200 text-sm">{p.desc}</p>}
                      {formatoPrecio(p.precio) && (
                        <p className="text-amber-300 text-lg font-bold mt-1">{formatoPrecio(p.precio)}</p>
                      )}
                      {p.coleccion ? (
                        <Link
                          to={`/tienda?q=${encodeURIComponent(p.coleccion.buscar)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="pointer-events-auto mt-3 inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          <ShoppingCart size={16} /> {p.coleccion.cta || 'Comprar'}
                        </Link>
                      ) : p.precio != null && p.id != null ? (
                        <Link
                          to={`/tienda/producto/${p.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="pointer-events-auto mt-3 inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          <ShoppingCart size={16} /> Comprar
                        </Link>
                      ) : (
                        <a
                          href={whatsappProducto(p.nombre, formatoPrecio(p.precio))}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="pointer-events-auto mt-3 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          <WhatsAppIcon size={16} /> Me interesa
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Flechas (solo cuando hay más de un producto) */}
              {abierta.productos.length > 1 && (
                <>
                  <button
                    onClick={() => desplazar(-1)}
                    className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors"
                    aria-label="Producto anterior"
                  >
                    <ChevronRight className="rotate-180" size={22} />
                  </button>
                  <button
                    onClick={() => desplazar(1)}
                    className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg text-stone-800 hover:text-amber-700 transition-colors"
                    aria-label="Producto siguiente"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <span className="absolute top-3 left-3 text-xs bg-black/55 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    {abierta.productos.length} productos
                  </span>
                </>
              )}
            </div>

            {/* Info de la categoría */}
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

      {/* LIGHTBOX: foto de producto a pantalla completa (encima del panel) */}
      {ampliada && (
        <div
          onClick={() => setAmpliada(null)}
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${ampliada.nombre}`}
        >
          <button
            onClick={() => setAmpliada(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={36} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
            <img
              src={ampliada.src}
              alt={ampliada.nombre}
              className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl"
            />
            <figcaption className="text-stone-200 mt-4 text-center flex flex-col items-center">
              <span className="block text-lg font-semibold">{ampliada.nombre}</span>
              {ampliada.desc && <span className="text-sm text-stone-400">{ampliada.desc}</span>}
              {formatoPrecio(ampliada.precio) && (
                <span className="block text-amber-300 text-xl font-bold mt-2">{formatoPrecio(ampliada.precio)}</span>
              )}
              {ampliada.coleccion ? (
                <Link
                  to={`/tienda?q=${encodeURIComponent(ampliada.coleccion.buscar)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  <ShoppingCart size={18} /> {ampliada.coleccion.cta || 'Comprar en la tienda'}
                </Link>
              ) : ampliada.precio != null && ampliada.id != null ? (
                <Link
                  to={`/tienda/producto/${ampliada.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  <ShoppingCart size={18} /> Comprar en la tienda
                </Link>
              ) : (
                <a
                  href={whatsappProducto(ampliada.nombre, formatoPrecio(ampliada.precio))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  <WhatsAppIcon size={18} /> Me interesa este producto
                </a>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
