import { Phone } from '../../../theme/icons';
import { TELEFONO_HREF } from '../../../data/contacto';

/**
 * Botón circular de llamada directa.
 * El posicionamiento lo gestiona FloatingActions (contenedor).
 */
export default function PhoneButtonComponent() {
  return (
    <a
      href={TELEFONO_HREF}
      className="bg-amber-700 hover:bg-amber-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
      aria-label="Llamar a Paco Vago"
    >
      <Phone size={28} />
    </a>
  );
}
