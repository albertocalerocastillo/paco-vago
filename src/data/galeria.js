import { categorias } from './categorias';

/**
 * Galería automática: se construye sola a partir de TODOS los productos
 * de todas las categorías. Cada foto que añadas a un producto aparece
 * aquí sin tocar nada más.
 *
 * Las fotos se intercalan por categoría (round-robin) para que no salgan
 * todas las de la misma categoría seguidas.
 */

// Fotos "de ambiente" que no son un producto concreto (surtido, tienda…).
const EXTRAS = [
  { src: '/fotos/latas-1.jpg', alt: 'Gran surtido de conservas en Paco Vago' }
];

// Agrupa las fotos de producto por categoría
const grupos = categorias.map(cat =>
  (cat.productos || []).map(p => ({ src: p.src, alt: `${p.nombre} · Paco Vago` }))
);

// Intercala: 1ª de cada categoría, luego 2ª de cada una, etc.
const intercaladas = [];
const maxLen = grupos.reduce((m, g) => Math.max(m, g.length), 0);
for (let i = 0; i < maxLen; i++) {
  for (const g of grupos) {
    if (g[i]) intercaladas.push(g[i]);
  }
}

export const galeria = [...intercaladas, ...EXTRAS];
