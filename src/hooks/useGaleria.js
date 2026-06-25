import { useMemo } from 'react';
import { useCategorias } from './useCategorias';

// Fotos "de ambiente" que no son un producto concreto (surtido, tienda…).
// No están en la BD: viven aquí.
const EXTRAS = [
  { src: '/fotos/latas-1.jpg', alt: 'Gran surtido de conservas en Paco Vago' },
];

/**
 * Galería automática: se construye a partir de TODOS los productos de todas
 * las categorías (que vienen de Supabase vía useCategorias, con fallback al
 * catálogo estático). Las fotos se intercalan por categoría (round-robin)
 * para que no salgan todas las de la misma categoría seguidas.
 */
export function useGaleria() {
  const categorias = useCategorias();

  return useMemo(() => {
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

    return [...intercaladas, ...EXTRAS];
  }, [categorias]);
}
