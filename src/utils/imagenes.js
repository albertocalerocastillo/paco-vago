/**
 * Pide las fotos del tamaño en el que se van a ver.
 *
 * Las fotos de producto están en Supabase Storage y pesan entre 300 y 600 KB
 * cada una, porque se subieron tal cual salieron de la cámara o del móvil.
 * Enseñarlas a 128 px descargando 600 KB es tirar los datos del cliente: la
 * portada llegaba a pedir 11 MB de imágenes.
 *
 * Supabase sabe redimensionarlas al vuelo: basta cambiar `/object/public/` por
 * `/render/image/public/` y añadir el ancho. Medido en una foto real:
 * 312 KB el original, 117 KB pedida a 400 px.
 *
 * Las imágenes que NO son de Supabase (el logo, las fotos de `public/fotos`)
 * se devuelven tal cual: no hay nada que las transforme.
 */

// Anchos en píxeles REALES de descarga. Van al doble de lo que ocupan en
// pantalla para que no se vean borrosas en móviles de pantalla fina.
export const ANCHOS = {
  miniatura: 200,   // carrito y mini-carrito (se ven a ~64 px)
  tarjeta: 400,     // rejilla de la tienda y carruseles (se ven a ~200 px)
  ficha: 900,       // foto grande de la ficha de producto
  ampliada: 1600,   // al pulsar para ver la foto a pantalla completa
};

/**
 * @param {string} url    Dirección original de la imagen.
 * @param {number} ancho  Ancho de descarga deseado, de ANCHOS.
 * @param {number} calidad 1-100. 75 es el punto donde deja de notarse a simple vista.
 * @returns {string} La dirección a usar en el `src`.
 */
export function imagen(url, ancho = ANCHOS.tarjeta, calidad = 75) {
  if (typeof url !== 'string' || !url) return url;

  // Solo Supabase Storage sabe hacer esto.
  if (!url.includes('/storage/v1/object/public/')) return url;

  const transformada = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  const separador = transformada.includes('?') ? '&' : '?';
  return `${transformada}${separador}width=${ancho}&quality=${calidad}`;
}
