/**
 * Datos de contacto centralizados.
 * Si cambia algún teléfono, red social o dirección, solo se modifica aquí.
 */

export const TELEFONO = '954 14 08 71';
export const TELEFONO_TEL = '+34954140871';
export const TELEFONO_HREF = `tel:${TELEFONO_TEL}`;

export const WHATSAPP = '615 323 072';
export const WHATSAPP_NUM = '34615323072'; // formato internacional sin signos
// Mensaje que aparece ya escrito al abrir el chat (el cliente solo pulsa enviar)
export const WHATSAPP_MENSAJE = 'Hola, os escribo desde la web de Paco Vago. Quería preguntaros por...';
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

// Enlace de WhatsApp preguntando por un producto concreto (mensaje ya escrito).
// Si se pasa un precio formateado, lo incluye en el mensaje.
export const whatsappProducto = (nombre, precioTexto) => {
  const ref = precioTexto ? `${nombre} (${precioTexto})` : nombre;
  const mensaje = `Hola, me interesa este producto de Paco Vago: ${ref}. ¿Me podéis informar?`;
  return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(mensaje)}`;
};

export const DIRECCION = {
  calle: 'Puerta de Sevilla',
  ciudad: 'Carmona',
  provincia: 'Sevilla'
};

export const REDES_SOCIALES = {
  instagram: {
    handle: '@paco_vago_puerta_sevilla',
    url: 'https://www.instagram.com/paco_vago_puerta_sevilla'
  },
  tiktok: {
    handle: '@paco.vago.puerta',
    url: 'https://www.tiktok.com/@paco.vago.puerta'
  }
};
