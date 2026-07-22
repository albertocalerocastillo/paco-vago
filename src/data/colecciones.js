/**
 * Colecciones destacadas para comprar online.
 *
 * Cada colección enseña UNA foto "de grupo" en la home (sección "Cómpralo
 * online"). Al pulsarla lleva a la tienda (/tienda) ya filtrada por `buscar`,
 * de modo que salen todos los tamaños/variantes de golpe (p. ej. los tres
 * formatos de aceite) sin ensuciar la home con fotos casi iguales.
 *
 * Para añadir una colección nueva (miel, licores, conservas…): copia un
 * bloque y ajusta:
 *   - foto     → una foto "de grupo" bonita (en public/fotos, sin ñ ni acentos).
 *   - buscar   → texto que debe casar con el NOMBRE de esos productos en la
 *                tienda. Ej.: si los aceites se llaman "AOVE de Carmona 5 L",
 *                "2 L" y "1 L", con buscar 'AOVE de Carmona' salen los tres.
 *   - cta      → texto del botón (opcional; por defecto "Comprar").
 *
 * Si el array queda vacío, la sección no se muestra.
 */
export const COLECCIONES = [
  {
    id: 'aceite',
    titulo: 'Aceite de oliva de Carmona',
    subtitulo: 'AOVE virgen extra · formatos de 1 L, 2 L y 5 L',
    foto: '/fotos/aceite.jpg',
    buscar: 'AOVE de Carmona',
    cta: 'Comprar aceite',
  },
];

// Minúsculas + sin acentos (para comparar nombres sin fallar por tildes).
const normaliza = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** ¿Este producto pertenece a ESTA colección concreta? (casa por nombre). */
export const productoEnColeccion = (nombre, col) =>
  normaliza(nombre).includes(normaliza(col.buscar));

/**
 * ¿Este producto está representado por alguna colección? Se usa en el panel de
 * "Tenemos de todo": los productos de una colección (p. ej. los tres aceites)
 * NO se listan sueltos; en su lugar la home enseña UNA tarjeta de grupo (con la
 * foto general) que lleva a la tienda ya filtrada. Casa igual que el buscador.
 */
export const enColeccion = (nombre) =>
  COLECCIONES.some((c) => productoEnColeccion(nombre, c));
