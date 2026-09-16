// Con extensión .js a propósito: este fichero lo importa también la función
// serverless, y Node exige la extensión aunque Vite la perdone.
import { cpValido, provinciaDeCP } from './provincias.js';

// Se reexporta para que quien ya importaba cpValido desde aquí siga funcionando.
export { cpValido, provinciaDeCP };

/**
 * Gastos de envío. Tarifa del titular (confirmada el 16/09/2026), por tramos
 * de peso y con el IVA ya incluido.
 *
 * El peso que cuenta es el del producto YA EMBALADO, con su caja: es lo que
 * cobra el transportista. Cada producto guarda el suyo en `productos.peso`.
 */

// Tramos en kg. El límite es inclusivo: 5,000 kg paga 7,50 €; 5,001 ya paga 12 €.
export const TRAMOS = [
  { hasta: 5, precio: 7.5 },
  { hasta: 10, precio: 12 },
  { hasta: 15, precio: 18 },
  { hasta: Infinity, precio: 25 },
];

// Fuera de península el transporte cuesta bastante más y depende del destino,
// así que no se vende online: se presupuesta por WhatsApp. Se reconoce por los
// dos primeros dígitos del código postal, los mismos que dan la provincia.
const PREFIJOS_FUERA_DE_PENINSULA = ['07', '35', '38', '51', '52'];

// Solo para mostrar al cliente.
export const ZONAS_SIN_VENTA_ONLINE = ['Baleares', 'Canarias', 'Ceuta', 'Melilla'];

/**
 * Si el código postal cae fuera de península, devuelve el nombre de su
 * provincia ('Las Palmas', 'Baleares'...). Si es península o el CP no vale, null.
 */
export function zonaFueraDePeninsula(cp) {
  if (!cpValido(cp)) return null;
  const prefijo = String(cp).trim().slice(0, 2);
  return PREFIJOS_FUERA_DE_PENINSULA.includes(prefijo) ? provinciaDeCP(cp) : null;
}

/**
 * Porte que corresponde a un peso total, en euros.
 * Devuelve null si el peso no es utilizable (0, negativo o desconocido),
 * para que quien llame distinga "envío gratis" de "aún no se puede calcular".
 */
export function calcularPorte(pesoKg) {
  const n = Number(pesoKg);
  if (!Number.isFinite(n) || n <= 0) return null;
  return TRAMOS.find(t => n <= t.hasta).precio;
}

/**
 * Formatea un peso en kg para enseñarlo. Ej: 5.5 -> "5,5 kg".
 */
export function formatoPeso(pesoKg) {
  const n = Number(pesoKg);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n)} kg`;
}

/**
 * ¿Se puede comprar este producto por la web?
 * Hace falta precio (para cobrar) Y peso (para calcular el porte). Si le falta
 * cualquiera de los dos, la web ofrece el botón de WhatsApp. Así el catálogo
 * crece solo con lo que el titular ha cerrado, sin comprometerse con nada.
 */
export function esComprable(producto) {
  return producto?.precio != null && Number(producto?.peso) > 0;
}
