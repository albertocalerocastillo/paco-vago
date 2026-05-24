import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/34954140871';

export default function WhatsAppButtonComponent() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl z-40 transition-all hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
