/**
 * Pide las fotos del tamaño en el que se van a ver.
 *
 * Las fotos de producto están en Supabase Storage y pesan entre 250 y 600 KB
 * cada una, porque se subieron tal cual salieron del móvil. Supabase sabe
 * redimensionarlas al vuelo: basta cambiar `/object/public/` por
 * `/render/image/public/` y pedir el tamaño.
 *
 * ── DOS TRAMPAS QUE YA COSTARON UN ARREGLO CADA UNA ──
 *
 * 1. HAY QUE PEDIR SIEMPRE LAS DOS MEDIDAS. Pidiendo solo `width`, Supabase
 *    estrecha la foto pero le deja el alto original: una de 1500x2000 volvía
 *    como 400x2000, una tira deformada que la tarjeta recortaba dejando un
 *    zoom brutal.
 *
 * 2. EN UN HUECO CUADRADO MANDA EL LADO CORTO. Una tarjeta de 288x288 con
 *    `object-cover` necesita que el lado MENOR de la foto llegue a 288. Pedir
 *    `contain` a 400 devolvía 400x267 en las apaisadas: el alto se quedaba
 *    corto, el navegador estiraba y se veía borroso. Por eso los huecos
 *    cuadrados piden el recorte ya hecho (`cover`), no `contain`.
 *
 * Los tamaños van holgados a propósito: la foto del producto ES el producto y
 * aquí pesa más que se vea bien que ahorrar unos kilobytes.
 */

// Lado en píxeles REALES de descarga, al doble de lo que ocupan en pantalla
// para que se vean nítidas en pantallas de alta densidad.
export const ANCHOS = {
  miniatura: 300,   // carrito y mini-carrito (se ven a ~64 px)
  tarjeta: 800,     // rejilla de la tienda y carruseles (se ven hasta ~420 px)
  ficha: 1600,      // foto grande de la ficha de producto
};

/**
 * @param {string} url  Dirección original de la imagen.
 * @param {number} lado Lado de descarga, de ANCHOS.
 * @param {object} opciones
 * @param {boolean} opciones.recorte true (por defecto) para huecos cuadrados:
 *        devuelve la foto ya recortada al cuadrado, que es lo que se ve.
 *        false para que quepa entera respetando su proporción.
 * @param {number} opciones.calidad 1-100.
 * @returns {string} La dirección a usar en el `src`.
 */
export function imagen(url, lado = ANCHOS.tarjeta, { recorte = true, calidad = 85 } = {}) {
  if (typeof url !== 'string' || !url) return url;

  // Solo Supabase Storage sabe hacer esto. El logo y las fotos de public/fotos
  // se devuelven tal cual.
  if (!url.includes('/storage/v1/object/public/')) return url;

  const transformada = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  const separador = transformada.includes('?') ? '&' : '?';
  const modo = recorte ? 'cover' : 'contain';
  return `${transformada}${separador}width=${lado}&height=${lado}&resize=${modo}&quality=${calidad}`;
}

/**
 * Para ver la foto a pantalla completa: se devuelve el ORIGINAL, sin tocar.
 * Es el único sitio donde el visitante está mirando la foto por la foto, así
 * que no se le escatima; y solo se descarga si pulsa.
 */
export function imagenOriginal(url) {
  return url;
}
