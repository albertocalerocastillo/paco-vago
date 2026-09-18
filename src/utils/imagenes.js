/**
 * Pide las fotos del tamaño en el que se van a ver.
 *
 * Las fotos de producto están en Supabase Storage y pesan entre 300 y 600 KB
 * cada una, porque se subieron tal cual salieron de la cámara o del móvil.
 * Enseñarlas a 128 px descargando 600 KB es tirar los datos del cliente: la
 * portada llegaba a pedir 11 MB de imágenes.
 *
 * Supabase sabe redimensionarlas al vuelo: basta cambiar `/object/public/` por
 * `/render/image/public/` y pedir el tamaño. Medido en una foto real de
 * 1500x2000: 311 KB el original, 24 KB pedida a 400.
 *
 * ⚠️ HAY QUE PEDIR LAS DOS MEDIDAS Y `resize=contain`. Pidiendo solo el ancho,
 * Supabase estrecha la foto pero le deja el alto original: una de 1500x2000
 * devolvía 400x2000, o sea una tira deformada. Con `contain` y las dos medidas
 * la foto cabe dentro del cuadro respetando su proporción.
 *
 * Las imágenes que NO son de Supabase (el logo, las fotos de `public/fotos`)
 * se devuelven tal cual: no hay nada que las transforme.
 */

// Lado mayor en píxeles REALES de descarga. La foto cabrá dentro de un cuadro
// de este tamaño respetando su proporción. Van al doble de lo que ocupan en
// pantalla para que no se vean borrosas en móviles de pantalla fina.
export const ANCHOS = {
  miniatura: 200,   // carrito y mini-carrito (se ven a ~64 px)
  tarjeta: 400,     // rejilla de la tienda y carruseles (se ven a ~200 px)
  ficha: 900,       // foto grande de la ficha de producto
  ampliada: 1600,   // al pulsar para ver la foto a pantalla completa
};

/**
 * @param {string} url    Dirección original de la imagen.
 * @param {number} lado   Lado mayor de descarga, de ANCHOS.
 * @param {number} calidad 1-100. 75 es el punto donde deja de notarse a simple vista.
 * @returns {string} La dirección a usar en el `src`.
 */
export function imagen(url, lado = ANCHOS.tarjeta, calidad = 75) {
  if (typeof url !== 'string' || !url) return url;

  // Solo Supabase Storage sabe hacer esto.
  if (!url.includes('/storage/v1/object/public/')) return url;

  const transformada = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  const separador = transformada.includes('?') ? '&' : '?';
  // `contain` = cabe dentro del cuadro sin deformarse ni recortarse. El recorte
  // para rellenar la tarjeta ya lo hace el CSS con object-cover, como siempre.
  return `${transformada}${separador}width=${lado}&height=${lado}&resize=contain&quality=${calidad}`;
}
