/**
 * Anima una miniatura del producto "volando" desde su foto hasta el icono del
 * carrito (elemento con id="cart-icon"). Puro DOM, sin dependencias.
 * Respeta "prefers-reduced-motion".
 */
export function flyToCart(sourceEl) {
  if (!sourceEl) return;
  const target = document.getElementById('cart-icon');
  if (!target) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const s = sourceEl.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const size = 72;

  const clone = sourceEl.cloneNode(true);
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${s.left + s.width / 2 - size / 2}px`,
    top: `${s.top + s.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    borderRadius: '9999px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
    zIndex: '60',
    pointerEvents: 'none',
    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease-in',
  });
  document.body.appendChild(clone);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  // Forzar reflow para que la transición arranque desde el origen
  // eslint-disable-next-line no-unused-expressions
  clone.offsetWidth;
  requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.15)`;
    clone.style.opacity = '0.2';
  });

  const limpiar = () => clone.remove();
  clone.addEventListener('transitionend', limpiar, { once: true });
  setTimeout(limpiar, 1000); // por si acaso
}
