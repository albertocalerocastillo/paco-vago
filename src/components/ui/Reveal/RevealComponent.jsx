import { useRef, useState, useEffect } from 'react';

/**
 * Envuelve contenido para que aparezca con fade-in + deslizamiento
 * cuando entra en pantalla (una sola vez). Usa IntersectionObserver,
 * por lo que es muy ligero y fluido también en móvil.
 *
 * @param {number} delay - Retardo en ms (para aparición escalonada).
 */
export default function RevealComponent({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback de seguridad: sin soporte de IntersectionObserver, mostrar ya.
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    // Si ya está dentro de la pantalla al cargar, revelar directamente.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect(); // solo una vez
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
