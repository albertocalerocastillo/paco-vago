import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppIcon, ShoppingCart } from '../../../theme/icons';
import { useCarrito } from '../../../hooks/useCarrito';
import { whatsappProducto } from '../../../data/contacto';
import { formatoPrecio } from '../../../utils/formato';

/**
 * Tarjeta de producto del listado. La foto y el nombre llevan a la ficha;
 * el botón añade al carrito (si tiene precio) o abre WhatsApp.
 */
export default function ProductoCard({ producto: p }) {
  const { añadir } = useCarrito();
  const [añadido, setAñadido] = useState(false);
  const precio = formatoPrecio(p.precio);
  const comprable = p.precio != null;
  const ficha = p.id != null ? `/tienda/producto/${p.id}` : null;

  const añadirAlCarrito = () => {
    añadir(p);
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1500);
  };

  const Foto = (
    <div className="aspect-square bg-stone-100 overflow-hidden">
      {p.src ? (
        <img
          src={p.src}
          alt={p.nombre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">Sin foto</div>
      )}
    </div>
  );

  return (
    <div className="group bg-white border border-stone-200 hover:border-amber-700 hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
      {ficha ? <Link to={ficha} aria-label={p.nombre}>{Foto}</Link> : Foto}

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-[0.2em] text-amber-700">{p.categoria}</span>
        {ficha ? (
          <Link to={ficha} className="font-bold text-base leading-tight mt-1 hover:text-amber-700 transition-colors">
            {p.nombre}
          </Link>
        ) : (
          <h3 className="font-bold text-base leading-tight mt-1">{p.nombre}</h3>
        )}
        {p.desc && <p className="text-sm text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">{p.desc}</p>}

        <div className="mt-auto pt-4">
          {precio && <p className="text-xl font-bold text-stone-900 mb-3">{precio}</p>}
          {comprable ? (
            <button
              onClick={añadirAlCarrito}
              className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 text-sm font-semibold py-2.5 uppercase tracking-wider transition-colors"
            >
              <ShoppingCart size={15} /> {añadido ? 'Añadido ✓' : 'Añadir'}
            </button>
          ) : (
            <a
              href={whatsappProducto(p.nombre, precio)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 uppercase tracking-wider transition-colors"
            >
              <WhatsAppIcon size={15} /> Me interesa
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
