import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Sube al principio al cambiar de página.
 *
 * En una web como esta el navegador NO recarga al cambiar de sección: solo se
 * sustituye el contenido, y la posición del desplazamiento se queda donde
 * estaba. Si estabas al final de la portada y pulsabas "Comprar online",
 * aterrizabas en mitad de la tienda. Igual con el carrito y al saltar entre las
 * páginas legales.
 *
 * TRES DETALLES QUE IMPORTAN:
 *
 * 1. El salto es INSTANTÁNEO a propósito. La web tiene `scroll-behavior: smooth`
 *    en el CSS, y sin forzarlo verías la página nueva "viajando" desde abajo.
 *
 * 2. Con el botón de ATRÁS no se toca nada. El navegador ya devuelve al
 *    visitante justo donde lo dejó, y pisarlo sería quitarle esa comodidad.
 *
 * 3. Si la dirección lleva ancla (#historia), se va a esa sección en vez de
 *    arriba: es lo que el enlace pedía.
 */
export default function IrArribaComponent() {
  const { pathname, hash } = useLocation();
  const tipoDeNavegacion = useNavigationType();

  useEffect(() => {
    if (tipoDeNavegacion === 'POP') return;

    if (hash) {
      const destino = document.querySelector(hash);
      if (destino) {
        destino.scrollIntoView();
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash, tipoDeNavegacion]);

  return null;
}
