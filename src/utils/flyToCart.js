/**
 * Anima una miniatura del producto "volando" en arco desde su foto hasta el
 * icono del carrito (id="cart-icon"), con un giro suave. Al aterrizar, hace
 * que el icono del carrito dé un saltito. Puro DOM, respeta reduced-motion.
 */
export function flyToCart(sourceEl) {
  if (!sourceEl) return;
  const target = document.getElementById('cart-icon');
  if (!target) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const s = sourceEl.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const size = 80;

  const clone = sourceEl.cloneNode(true);
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${s.left + s.width / 2 - size / 2}px`,
    top: `${s.top + s.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'cover',
    borderRadius: '9999px',
    border: '3px solid #fafaf9',
    boxShadow: '0 12px 28px rgba(0,0,0,0.30)',
    zIndex: '60',
    pointerEvents: 'none',
    margin: '0',
  });
  document.body.appendChild(clone);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);

  const animacion = clone.animate(
    [
      { transform: 'translate(0px, 0px) scale(1) rotate(0deg)', opacity: 1, offset: 0 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 100}px) scale(0.75) rotate(10deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.12) rotate(20deg)`, opacity: 0.3, offset: 1 },
    ],
    { duration: 1000, easing: 'cubic-bezier(0.45, 0, 0.25, 1)', fill: 'forwards' }
  );

  const finalizar = () => {
    clone.remove();
    // Saltito del carrito justo al aterrizar
    target.classList.remove('cart-bump');
    void target.offsetWidth; // reinicia la animación si se repite rápido
    target.classList.add('cart-bump');
    setTimeout(() => target.classList.remove('cart-bump'), 450);
  };

  animacion.onfinish = finalizar;
  animacion.oncancel = () => clone.remove();
  setTimeout(() => { if (clone.isConnected) finalizar(); }, 1300); // backstop
}
