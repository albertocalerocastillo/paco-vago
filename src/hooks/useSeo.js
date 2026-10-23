import { useEffect } from 'react';

/**
 * Pone el título, la descripción y el canonical propios de cada página.
 *
 * POR QUÉ HACE FALTA: la web se dibuja entera en el navegador, así que el
 * servidor manda siempre el mismo `index.html` para todas las rutas. Sin esto,
 * la tienda y la ficha del aceite le llegan a Google con el título de la
 * portada y un canonical que apunta a la portada, que es tanto como decirle
 * "esto es la misma página, quédate solo con la home". Resultado: la ficha del
 * producto no existe como resultado de búsqueda.
 *
 * MODIFICA las etiquetas que ya están en index.html en vez de añadir otras.
 * Si añadiéramos, habría dos <title> y Google se queda con el primero, que es
 * justo el que queremos cambiar.
 *
 * LIMITACIÓN CONOCIDA: esto ocurre con JavaScript, o sea después de que la
 * página cargue. Google lo ejecuta y lo lee, pero más tarde y con menos
 * garantías que si viniera ya escrito del servidor. Si dentro de unas semanas
 * Search Console no muestra las fichas indexadas, el paso siguiente es
 * generar las páginas de antemano (prerenderizado).
 */

export const SITIO = 'https://pacovago.es';

export const SEO_POR_DEFECTO = {
  titulo: 'Paco Vago | Tienda Centenaria en Carmona, Sevilla | Desde 1924',
  descripcion:
    'Tienda Paco Vago en la Puerta de Sevilla, Carmona. Desde 1924 ofrecemos gourmet, jamones, quesos, moda flamenca, artesanía, mercería, bodega y mucho más. ☎ 954 14 08 71',
  imagen: `${SITIO}/tienda.jpg`,
};

/** Busca una etiqueta del head y la crea solo si no existía. */
function etiqueta(selector, crear) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = crear();
    document.head.appendChild(el);
  }
  return el;
}

function ponerMeta(nombre, contenido, porPropiedad = false) {
  if (!contenido) return;
  const atributo = porPropiedad ? 'property' : 'name';
  const el = etiqueta(`meta[${atributo}="${nombre}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(atributo, nombre);
    return m;
  });
  el.setAttribute('content', contenido);
}

/**
 * @param {string}  titulo       Título completo de la pestaña y del resultado de Google.
 * @param {string}  descripcion  El párrafo que sale bajo el enlace en Google.
 * @param {string}  ruta         Ruta de esta página, empezando por "/". Da el canonical.
 * @param {string}  imagen       URL absoluta de la imagen para WhatsApp y redes.
 * @param {boolean} noindex      true en páginas que NO deben salir en Google.
 */
export function useSeo({ titulo, descripcion, ruta, imagen, noindex = false } = {}) {
  useEffect(() => {
    const t = titulo || SEO_POR_DEFECTO.titulo;
    const d = descripcion || SEO_POR_DEFECTO.descripcion;
    const img = imagen || SEO_POR_DEFECTO.imagen;
    const url = SITIO + (ruta || '/');

    document.title = t;
    ponerMeta('description', d);
    ponerMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    const canonical = etiqueta('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    canonical.setAttribute('href', url);

    // Lo que se ve al compartir el enlace por WhatsApp, que aquí es por donde
    // se va a compartir casi todo.
    ponerMeta('og:title', t, true);
    ponerMeta('og:description', d, true);
    ponerMeta('og:url', url, true);
    ponerMeta('og:image', img, true);
    ponerMeta('twitter:title', t);
    ponerMeta('twitter:description', d);
    ponerMeta('twitter:image', img);
  }, [titulo, descripcion, ruta, imagen, noindex]);
}

/**
 * Añade al head un bloque de datos estructurados (JSON-LD).
 *
 * Es información invisible para el visitante que le dice a Google qué es esta
 * página. En una ficha de producto, es lo que hace que en los resultados de
 * búsqueda salga el precio debajo del enlace en vez de solo texto.
 *
 * Se borra al salir de la página: si no, al navegar de una ficha a otra se
 * irían acumulando y Google vería varios productos en la misma página.
 *
 * @param {object|null} datos  El objeto schema.org, o null para no poner nada.
 */
export function useDatosEstructurados(datos) {
  // El JSON se calcula fuera del efecto para que sirva de dependencia: así el
  // bloque solo se rehace cuando cambia el contenido de verdad.
  const json = datos ? JSON.stringify(datos) : null;

  useEffect(() => {
    if (!json) return undefined;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = json;
    document.head.appendChild(el);
    return () => el.remove();
  }, [json]);
}
