import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, WhatsAppIcon } from '../../../theme/icons';
import { useCategorias } from '../../../hooks/useCategorias';
import { useCarrito } from '../../../hooks/useCarrito';
import { whatsappProducto } from '../../../data/contacto';
import { formatoPrecio } from '../../../utils/formato';
import TiendaHeader from './TiendaHeader';
import ProductoCard from './ProductoCard';
import FooterComponent from '../../layout/Footer/FooterComponent';

/**
 * Ficha de producto (/tienda/producto/:id).
 * Foto grande ampliable, info, cantidad, añadir al carrito y relacionados.
 */
export default function ProductoDetalleComponent() {
  const { id } = useParams();
  const categorias = useCategorias();
  const { añadir } = useCarrito();

  const [cantidad, setCantidad] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [añadido, setAñadido] = useState(false);

  // Busca el producto por id y su categoría
  const { producto, categoria, relacionados, catalogoCargado } = useMemo(() => {
    let producto = null;
    let categoria = null;
    for (const c of categorias) {
      const encontrado = (c.productos || []).find(p => String(p.id) === String(id));
      if (encontrado) {
        producto = encontrado;
        categoria = c;
        break;
      }
    }
    const relacionados = categoria
      ? (categoria.productos || []).filter(p => String(p.id) !== String(id)).slice(0, 4)
      : [];
    const catalogoCargado = categorias.some(c => (c.productos || []).some(p => p.id != null));
    return { producto, categoria, relacionados, catalogoCargado };
  }, [categorias, id]);

  // Cerrar zoom con Escape
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => { if (e.key === 'Escape') setZoom(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoom]);

  if (!producto) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
        <TiendaHeader />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-stone-600 mb-6">
            {catalogoCargado ? 'No hemos encontrado este producto.' : 'Cargando…'}
          </p>
          {catalogoCargado && (
            <Link to="/tienda" className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 px-6 py-3 uppercase text-sm tracking-widest transition-colors">
              Volver a la tienda
            </Link>
          )}
        </div>
      </div>
    );
  }

  const precio = formatoPrecio(producto.precio);
  const comprable = producto.precio != null;

  const añadirAlCarrito = () => {
    añadir(producto, cantidad);
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1800);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <TiendaHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Migas de pan */}
        <nav className="text-sm text-stone-500 mb-6">
          <Link to="/tienda" className="hover:text-amber-700">Tienda</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-700">{categoria?.titulo}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Foto */}
          <div>
            <button
              onClick={() => producto.src && setZoom(true)}
              className="block w-full aspect-square bg-stone-100 overflow-hidden cursor-zoom-in group"
              aria-label="Ampliar foto"
            >
              {producto.src ? (
                <img src={producto.src} alt={producto.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">Sin foto</div>
              )}
            </button>
            {producto.src && <p className="text-xs text-stone-400 mt-2 text-center">Pulsa la foto para ampliar</p>}
          </div>

          {/* Información */}
          <div className="flex flex-col">
            <span className="text-amber-700 text-sm uppercase tracking-[0.3em] mb-3">{categoria?.titulo}</span>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{producto.nombre}</h1>
            {producto.desc && <p className="text-stone-600 leading-relaxed mb-6">{producto.desc}</p>}

            {precio ? (
              <p className="text-3xl font-bold text-stone-900 mb-6">{precio}</p>
            ) : (
              <p className="text-stone-500 mb-6">Pregúntanos el precio por WhatsApp.</p>
            )}

            {comprable ? (
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Cantidad */}
                <div className="flex items-center border border-stone-300 self-start">
                  <button onClick={() => setCantidad(n => Math.max(1, n - 1))} aria-label="Menos" className="w-11 h-11 flex items-center justify-center hover:text-amber-700">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center">{cantidad}</span>
                  <button onClick={() => setCantidad(n => n + 1)} aria-label="Más" className="w-11 h-11 flex items-center justify-center hover:text-amber-700">
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={añadirAlCarrito}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 font-semibold px-8 py-3 uppercase text-sm tracking-widest transition-colors"
                >
                  <ShoppingCart size={18} /> {añadido ? 'Añadido ✓' : 'Añadir al carrito'}
                </button>
              </div>
            ) : (
              <a
                href={whatsappProducto(producto.nombre, precio)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 uppercase text-sm tracking-widest transition-colors self-start"
              >
                <WhatsAppIcon size={18} /> Me interesa
              </a>
            )}
          </div>
        </div>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">También en {categoria?.titulo}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {relacionados.map(rp => (
                <ProductoCard key={rp.id} producto={{ ...rp, categoria: categoria?.titulo }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterComponent />

      {/* Lightbox / zoom */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada: ${producto.nombre}`}
        >
          <button onClick={() => setZoom(false)} className="absolute top-4 right-4 text-white/80 hover:text-white" aria-label="Cerrar">
            <X size={36} />
          </button>
          <img
            src={producto.src}
            alt={producto.nombre}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[88vh] object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
