/**
 * Datos identificativos / fiscales del titular de la tienda.
 *
 * Datos reales confirmados por el titular el 16 de septiembre de 2026
 * (WhatsApp). Es autónomo (persona física): factura a su nombre con su NIF,
 * por lo que NO hay datos de Registro Mercantil.
 *
 * Toda página legal lee de aquí: con cambiar este fichero se actualizan
 * las cuatro a la vez.
 */

export const EMPRESA = {
  // ── Datos ya conocidos ──────────────────────────────────────────────
  nombreComercial: 'Paco Vago',
  rotulo: 'Paco Vago · Puerta de Sevilla',
  localidad: 'Carmona',
  provincia: 'Sevilla',
  telefono: '954 14 08 71',
  whatsapp: '615 323 072',
  web: 'https://paco-vago.vercel.app',
  fundacion: 1924,

  // ── Datos fiscales del titular (confirmados 16/09/2026) ────────────
  titular: 'José Antonio López Ruiz',
  nif: '47336029M',
  domicilio: 'C/ Puerta de Sevilla 5, 41410 Carmona (Sevilla)',
  email: 'pacovagopuertasevilla@gmail.com',
  // Autónomo, no sociedad mercantil: no procede inscripción registral.
  registroMercantil: '',
};

// true si algún dato obligatorio sigue siendo un placeholder.
export const datosPendientes = Object.values(EMPRESA).some(
  (v) => typeof v === 'string' && v.startsWith('[')
);

// Fecha de última revisión de los textos legales (se muestra en cada página).
// Actualízala cuando cambie el contenido legal.
export const LEGAL_ACTUALIZADO = '19 de octubre de 2026';
