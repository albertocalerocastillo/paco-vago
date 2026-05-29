import WhatsAppButtonComponent from '../WhatsAppButton/WhatsAppButtonComponent';
import PhoneButtonComponent from '../PhoneButton/PhoneButtonComponent';

/**
 * Contenedor de los botones de acción flotantes (esquina inferior derecha).
 * Apila WhatsApp y teléfono verticalmente para que no se solapen.
 */
export default function FloatingActionsComponent() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <WhatsAppButtonComponent />
      <PhoneButtonComponent />
    </div>
  );
}
