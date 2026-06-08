import { useEffect } from 'react';
import { X } from '../../../theme/icons';

/**
 * Visor de foto a pantalla completa (lightbox) reutilizable.
 * Se cierra con la X, tocando el fondo o con la tecla Escape.
 */
export default function LightboxComponent({ src, alt, titulo, desc, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada${titulo ? `: ${titulo}` : ''}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        aria-label="Cerrar"
      >
        <X size={36} />
      </button>
      <figure onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
        />
        {(titulo || desc) && (
          <figcaption className="text-stone-200 mt-4 text-center">
            {titulo && <span className="block text-lg font-semibold">{titulo}</span>}
            {desc && <span className="text-sm text-stone-400">{desc}</span>}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
