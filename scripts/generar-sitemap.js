/**
 * Regenera `public/sitemap.xml` leyendo el catálogo de Supabase.
 *
 * El sitemap es la lista de páginas que le damos a Google. El anterior tenía
 * una sola línea (la portada) y estaba fechado en mayo de 2025, de antes de que
 * existiera la tienda: Google no tenía forma de enterarse de que hay fichas de
 * producto.
 *
 * Se genera con un script y no a mano porque el titular va metiendo productos
 * por el panel; mantenido a mano se quedaría viejo a la semana.
 *
 * Uso:  npm run sitemap
 *
 * Hay que volver a lanzarlo (y desplegar) cuando se añadan o quiten productos.
 */

import { writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { cargarEnv } from './cargar-env.js';

cargarEnv();

const SITIO = process.env.SITIO_PUBLICO || 'https://paco-vago.vercel.app';
const SALIDA = 'public/sitemap.xml';

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = process.env;
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el .env');
  process.exit(1);
}

const hoy = new Date().toISOString().slice(0, 10);

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

// Solo lo que de verdad tiene página propia y es visible. Los productos
// ocultos con `disponible = false` no existen para el visitante, así que
// tampoco deben estar aquí.
const { data: productos, error } = await supabase
  .from('productos')
  .select('id, nombre, creado_en, disponible')
  .eq('disponible', true)
  .order('id');

if (error) {
  console.error('No se ha podido leer el catálogo:', error.message);
  process.exit(1);
}

// Carrito, gracias y panel se quedan fuera a propósito: van con noindex.
const paginas = [
  { ruta: '/', prioridad: '1.0', frecuencia: 'monthly', fecha: hoy },
  { ruta: '/tienda', prioridad: '0.9', frecuencia: 'weekly', fecha: hoy },
  ...productos.map(p => ({
    ruta: `/tienda/producto/${p.id}`,
    prioridad: '0.8',
    frecuencia: 'monthly',
    fecha: (p.creado_en || hoy).slice(0, 10),
    nombre: p.nombre,
  })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paginas.map(p => [
    '  <url>',
    `    <loc>${SITIO}${p.ruta}</loc>`,
    `    <lastmod>${p.fecha}</lastmod>`,
    `    <changefreq>${p.frecuencia}</changefreq>`,
    `    <priority>${p.prioridad}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

writeFileSync(SALIDA, xml, 'utf8');

console.log(`${SALIDA} regenerado: ${paginas.length} páginas`);
console.log(`  portada + tienda + ${productos.length} fichas de producto`);
console.log('\nRecuerda desplegar para que Google vea el sitemap nuevo.');
