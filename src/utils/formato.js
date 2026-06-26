/**
 * Formatea un número como precio en euros (es-ES). Ej: 8.5 -> "8,50 €".
 * Devuelve null si el valor no es un número válido.
 */
export function formatoPrecio(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  if (Number.isNaN(n)) return null;
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}
