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

// Solo se vende online a península. El resto se presupuesta a mano porque el
// transporte cuesta bastante más y depende del destino.
export const ZONAS_SIN_VENTA_ONLINE = ['Baleares', 'Canarias', 'Ceuta', 'Melilla'];

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
