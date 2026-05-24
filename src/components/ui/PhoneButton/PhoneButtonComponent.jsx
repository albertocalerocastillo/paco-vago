import { Phone } from 'lucide-react';
import { TELEFONO_HREF } from '../../../data/contacto';

/**
 * Botón flotante de llamada directa.
 * Al pulsarlo en móvil, abre la app de teléfono y marca solo.
 */
export default function PhoneButtonComponent() {
  return (
    <a
      href={TELEFONO_HREF}
      className="fixed bottom-6 right-6 bg-amber-700 hover:bg-amber-600 text-white p-4 rounded-full shadow-2xl z-40 transition-all hover:scale-110"
      aria-label="Llamar a Paco Vago"
    >
      <Phone size={28} />
    </a>
  );
}
