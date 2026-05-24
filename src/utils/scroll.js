/**
 * Hace scroll suave hasta el elemento con el id indicado.
 * @param {string} id - ID del elemento destino.
 */
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
