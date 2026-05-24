import { useState, useEffect } from 'react';

/**
 * Devuelve true cuando el scroll vertical supera el umbral indicado.
 * @param {number} threshold - Píxeles a partir de los cuales se activa (por defecto 50).
 */
export function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
