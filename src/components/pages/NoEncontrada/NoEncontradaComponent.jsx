import { Link } from 'react-router-dom';
import { useSeo } from '../../../hooks/useSeo';
import NavComponent from '../../layout/Nav/NavComponent';
import FooterComponent from '../../layout/Footer/FooterComponent';

/**
 * Página para direcciones que no existen.
 *
 * Sin esto, una dirección mal escrita no encajaba con ninguna ruta y React no
 * pintaba nada: el visitante se encontraba el cajón del mini-carrito flotando
 * sobre una página en blanco, porque ese componente vive fuera de las rutas.
 *
 * Pasa más de lo que parece: enlaces viejos, direcciones copiadas a medias en
 * WhatsApp, o Google guardando una ficha de un producto que ya se quitó.
 */
export default function NoEncontradaComponent() {
  useSeo({
    titulo: 'Página no encontrada | Paco Vago',
    descripcion: 'Esta dirección no existe. Vuelve a la portada o a la tienda online.',
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif flex flex-col">
      <NavComponent />

      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-lg">
          <p className="text-7xl font-bold text-amber-700 mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Esta página no existe</h1>
          <p className="text-stone-600 leading-relaxed mb-8">
            Puede que el enlace esté mal escrito o que el producto ya no esté a la venta.
            En la tienda seguro que encuentras lo que buscabas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 px-6 py-3 uppercase text-sm tracking-widest transition-colors"
            >
              Ir a la tienda
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-stone-300 hover:border-amber-700 px-6 py-3 uppercase text-sm tracking-widest transition-colors"
            >
              Volver a la portada
            </Link>
          </div>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
}
