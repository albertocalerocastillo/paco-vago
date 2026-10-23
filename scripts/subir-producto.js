/**
 * Sube un producto nuevo de una vez: la foto al almacén de Supabase y la fila
 * a la tabla `productos`. Para no ir uno a uno por el panel cuando llegan
 * muchos a la vez.
 *
 * Uso:
 *   node scripts/subir-producto.js nuevos-productos/producto.json
 *
 * El JSON:
 *   {
 *     "foto": "nuevos-productos/gilda.jpg",   // jpg, png o webp
 *     "nombre": "Gildas Lopyleo Matrimonio · 6 uds",
 *     "descripcion": "…",
 *     "precio": 9.95,                         // null = sin precio (botón WhatsApp)
 *     "peso": 0.5,                            // kg con caja; null = botón WhatsApp
 *     "categoria": "gourmet",                 // slug de la categoría
 *     "despues_de": 37                        // opcional: id tras el que colocarlo
 *   }
 *
 * Sin "despues_de" va al final de su categoría. Con él, se mete justo detrás y
 * se corre una posición el resto, igual que haría el ▲▼ del panel.
 *
 * Usa la service_role del .env (se salta los permisos): solo para uso local.
 */

import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { cargarEnv } from './cargar-env.js';

cargarEnv();
const URL_SB = process.env.VITE_SUPABASE_URL;
const CLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_SB || !CLAVE) {
  console.error('Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env');
  process.exit(1);
}

const TIPOS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const cab = { apikey: CLAVE, Authorization: `Bearer ${CLAVE}` };

async function rest(ruta, opciones = {}) {
  const r = await fetch(`${URL_SB}/rest/v1/${ruta}`, {
    ...opciones,
    headers: { ...cab, 'Content-Type': 'application/json', Prefer: 'return=representation', ...opciones.headers },
  });
  const cuerpo = await r.json().catch(() => null);
  if (!r.ok) throw new Error(`${ruta}: ${cuerpo?.message || r.status}`);
  return cuerpo;
}

const datos = JSON.parse(readFileSync(process.argv[2], 'utf8'));
for (const campo of ['foto', 'nombre', 'categoria']) {
  if (!datos[campo]) throw new Error(`Falta "${campo}" en el JSON`);
}

// ── Categoría ─────────────────────────────────────────────────
const [categoria] = await rest(`categorias?select=id,titulo&slug=eq.${encodeURIComponent(datos.categoria)}`);
if (!categoria) throw new Error(`No existe la categoría "${datos.categoria}"`);

// ── Que no esté ya (por si se lanza dos veces) ────────────────
const repetido = await rest(`productos?select=id&nombre=eq.${encodeURIComponent(datos.nombre)}`);
if (repetido.length) {
  console.error(`Ya existe un producto llamado "${datos.nombre}" (id ${repetido[0].id}). No subo nada.`);
  process.exit(1);
}

// ── Foto al almacén ───────────────────────────────────────────
const ext = extname(datos.foto).toLowerCase();
const tipo = TIPOS[ext];
if (!tipo) throw new Error(`Formato de foto no admitido: ${ext}`);
const ruta = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext === '.jpeg' ? '.jpg' : ext}`;
const subida = await fetch(`${URL_SB}/storage/v1/object/productos/${ruta}`, {
  method: 'POST',
  headers: { ...cab, 'Content-Type': tipo, 'Cache-Control': '3600', 'x-upsert': 'false' },
  body: readFileSync(datos.foto),
});
if (!subida.ok) throw new Error(`No se pudo subir la foto: ${await subida.text()}`);
const foto = `${URL_SB}/storage/v1/object/public/productos/${ruta}`;

// ── Posición en la categoría ──────────────────────────────────
const enCategoria = await rest(`productos?select=id,orden&categoria_id=eq.${categoria.id}&order=orden`);
let orden;
if (datos.despues_de) {
  const ancla = enCategoria.find(p => p.id === datos.despues_de);
  if (!ancla) throw new Error(`El producto ${datos.despues_de} no está en ${categoria.titulo}`);
  orden = ancla.orden + 1;
  // Se corren de atrás adelante para no chocar con nada.
  for (const p of enCategoria.filter(p => p.orden >= orden).reverse()) {
    await rest(`productos?id=eq.${p.id}`, { method: 'PATCH', body: JSON.stringify({ orden: p.orden + 1 }) });
  }
} else {
  orden = Math.max(0, ...enCategoria.map(p => p.orden)) + 1;
}

// ── Producto ──────────────────────────────────────────────────
const [nuevo] = await rest('productos', {
  method: 'POST',
  body: JSON.stringify({
    categoria_id: categoria.id,
    nombre: datos.nombre,
    descripcion: datos.descripcion || null,
    foto,
    precio: datos.precio ?? null,
    peso: datos.peso ?? null,
    disponible: true,
    orden,
  }),
});

const comprable = nuevo.precio != null && Number(nuevo.peso) > 0;
console.log(`✓ ${nuevo.nombre} (id ${nuevo.id}) en ${categoria.titulo}, posición ${orden}`);
console.log(`  ${comprable ? 'Se puede COMPRAR online' : 'Sale con botón de WhatsApp (falta precio o peso)'}`);
console.log(`  https://pacovago.es/tienda/producto/${nuevo.id}`);
