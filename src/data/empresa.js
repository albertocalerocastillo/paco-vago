/**
 * Datos identificativos / fiscales del titular de la tienda.
 *
 * ⚠️  HUECOS POR RELLENAR (datos del tío): los campos cuyo valor empieza por
 *     "[" son PLACEHOLDERS y deben sustituirse por los datos reales ANTES de
 *     activar el cobro con tarjeta. Son obligatorios por ley (LSSI-CE y RGPD)
 *     para poder vender online y emitir factura.
 *
 *     Lo que hay que pedirle al tío:
 *       - Nombre y apellidos (autónomo) o razón social (si es S.L.).
 *       - NIF (autónomo) o CIF (sociedad).
 *       - Domicilio fiscal completo (calle, nº, CP, localidad, provincia).
 *       - Email de contacto para clientes (puede ser uno nuevo, p. ej.
 *         tienda@paco-vago.es cuando haya dominio).
 *       - Si está dado de alta en el Registro Mercantil (solo sociedades) y,
 *         en su caso, tomo/folio/hoja.
 *       - Datos de IVA/factura: ver `condiciones-de-venta`.
 *
 *     Toda página legal lee de aquí: con cambiar este fichero se actualizan
 *     las cuatro a la vez.
 */

// Marca un dato como pendiente de recibir del tío. El componente <Dato/> lo
// resalta en amarillo para que sea imposible publicar olvidándose de rellenarlo.
const PEND = (etiqueta) => `[${etiqueta}]`;

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

  // ── PENDIENTES (sustituir por los datos reales del tío) ─────────────
  titular: PEND('Nombre y apellidos o razón social'),
  nif: PEND('NIF / CIF'),
  domicilio: PEND('Domicilio fiscal completo: calle, nº, CP, Carmona (Sevilla)'),
  email: PEND('Email de contacto'),
  // Solo si es sociedad mercantil (S.L., etc.). Si es autónomo, dejar vacío.
  registroMercantil: PEND('Datos del Registro Mercantil — solo si es sociedad'),
};

// true si algún dato obligatorio sigue siendo un placeholder.
export const datosPendientes = Object.values(EMPRESA).some(
  (v) => typeof v === 'string' && v.startsWith('[')
);

// Fecha de última revisión de los textos legales (se muestra en cada página).
// Actualízala cuando cambie el contenido legal.
export const LEGAL_ACTUALIZADO = '29 de junio de 2026';
