import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categorias as categoriasEstaticas } from '../data/categorias';
import * as Icons from '../theme/icons';

/**
 * Traduce una fila de la BD (categorias + productos) al "molde" que usan los
 * componentes: { icon (componente), titulo, desc, items, productos:[{src,nombre,desc}] }.
 */
function mapearCategoria(cat) {
  const productos = (cat.productos || [])
    .filter(p => p.disponible !== false)   // oculta los marcados como no disponibles
    .slice()
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map(p => ({
      id: p.id,
      src: p.foto,
      nombre: p.nombre,
      desc: p.descripcion || undefined,
      precio: p.precio ?? null,
    }));

  return {
    icon: Icons[cat.icono] || null,   // 'Wheat' -> componente Wheat
    titulo: cat.titulo,
    desc: cat.descripcion || '',
    items: cat.tags || [],
    productos,
  };
}

/**
 * Devuelve el catálogo de categorías.
 * Arranca con el catálogo estático (render inmediato, sin parpadeos) y, si
 * Supabase está configurado y responde, lo reemplaza por los datos de la BD.
 * Ante cualquier fallo (sin credenciales, error de red, BD vacía) se queda
 * con el estático: la web nunca se rompe.
 */
export function useCategorias() {
  const [categorias, setCategorias] = useState(categoriasEstaticas);

  useEffect(() => {
    if (!supabase) return; // sin credenciales -> seguimos con el estático
    let cancelado = false;

    (async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('slug, titulo, icono, descripcion, tags, orden, productos(id, nombre, descripcion, foto, orden, disponible, precio)')
        .order('orden', { ascending: true });

      if (cancelado) return;
      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase: usando catálogo estático.', error.message);
        return; // fallback al estático
      }
      setCategorias(data.map(mapearCategoria));
    })();

    return () => { cancelado = true; };
  }, []);

  return categorias;
}
