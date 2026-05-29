import { WhatsAppIcon } from '../../../theme/icons';
import { WHATSAPP_HREF } from '../../../data/contacto';

/**
 * Botón circular de WhatsApp.
 * El posicionamiento lo gestiona FloatingActions (contenedor).
 */
export default function WhatsAppButtonComponent() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
      aria-label="Escribir por WhatsApp a Paco Vago"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
