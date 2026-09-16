import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { zonaFueraDePeninsula } from '../src/data/envios.js';

/**
 * Aviso de Stripe cuando un pago se completa. Aquí es donde un pedido existe
 * de verdad: la página de "gracias" solo significa que el navegador volvió, y
 * un cliente puede cerrarla antes de que cargue.
 *
 * Tres cosas que no son opcionales:
 *
 * 1. FIRMA. Esta dirección es pública: cualquiera puede mandarle un "te han
 *    pagado 500 €". Solo Stripe sabe firmar, y sin firma válida no se guarda
 *    nada. Para comprobarla hace falta el cuerpo EN CRUDO, por eso se apaga el
 *    troceado automático de Vercel.
 *
 * 2. DUPLICADOS. Stripe reintenta el aviso si tardamos o fallamos, así que el
 *    mismo pago puede llegar varias veces. La columna stripe_session_id es
 *    única: el segundo intento choca y se responde OK sin duplicar el pedido.
 *
 * 3. RESPONDER RÁPIDO Y SIEMPRE 200 si la firma es buena. Si devolvemos error,
 *    Stripe reintenta durante días. Un fallo nuestro guardando se registra en
 *    el log, no se le echa a Stripe.
 */

export const config = { api: { bodyParser: false } };

/** Lee el cuerpo tal cual llegó, sin interpretarlo. */
async function cuerpoEnCrudo(req) {
  const trozos = [];
  for await (const trozo of req) trozos.push(trozo);
  return Buffer.concat(trozos);
}

/** Convierte lo que cobró Stripe en las líneas que guardamos del pedido. */
function lineasDelPedido(lineItems, idsPorNombre) {
  return (lineItems?.data || []).map(l => ({
    producto_id: idsPorNombre.get(l.description) ?? null,
    nombre: l.description,
    cantidad: l.quantity,
    precio: (l.amount_total / 100) / (l.quantity || 1),
    importe: l.amount_total / 100,
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const faltan = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    .filter(v => !process.env[v]);
  if (faltan.length) {
    console.error('Webhook sin configurar. Faltan:', faltan.join(', '));
    return res.status(500).send('Webhook sin configurar');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // ── 1. Comprobar que el aviso viene de Stripe ───────────────
  let evento;
  try {
    const crudo = await cuerpoEnCrudo(req);
    evento = stripe.webhooks.constructEvent(
      crudo,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('Firma del webhook no válida:', e.message);
    return res.status(400).send('Firma no válida');
  }

  // Solo nos interesan los pagos completados. El resto se acepta y se ignora,
  // para que Stripe no reintente avisos que no usamos.
  const interesan = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  if (!interesan.includes(evento.type)) {
    return res.status(200).json({ recibido: true, ignorado: evento.type });
  }

  const sesion = evento.data.object;

  // Con Bizum o transferencia el pago puede quedar pendiente un rato. Si aún no
  // está pagado, no se guarda: ya llegará el aviso de async_payment_succeeded.
  if (sesion.payment_status !== 'paid') {
    return res.status(200).json({ recibido: true, pendiente: sesion.payment_status });
  }

  const m = sesion.metadata || {};

  try {
    // ── 2. Qué se cobró exactamente, según Stripe ─────────────
    const lineItems = await stripe.checkout.sessions.listLineItems(sesion.id, { limit: 100 });

    // metadata.productos viene como "3x1,36x2": sirve para recuperar los ids.
    const idsPorNombre = new Map();
    const idsPedidos = String(m.productos || '')
      .split(',')
      .filter(Boolean)
      .map(par => Number(par.split('x')[0]))
      .filter(Number.isInteger);

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );

    if (idsPedidos.length) {
      const { data: productos } = await supabase
        .from('productos')
        .select('id, nombre')
        .in('id', idsPedidos);
      for (const p of productos || []) idsPorNombre.set(p.nombre, p.id);
    }

    // ── 3. Red de seguridad de la zona ────────────────────────
    // No deberia saltar nunca: la direccion se valida antes de cobrar. Pero si
    // algo se cuela, el pedido queda marcado para que nadie lo prepare a ciegas.
    const cp = m.env_cp || '';
    const fuera = zonaFueraDePeninsula(cp);
    if (fuera) {
      console.error('Pedido cobrado fuera de península:', m.referencia, cp, fuera);
    }

    const total = sesion.amount_total / 100;
    const porte = Number(m.porte);
    const subtotal = Number(m.subtotal);

    // Si las cuentas no cuadran con lo que cobró Stripe, tampoco se da por bueno.
    const cuadra = Number.isFinite(porte) && Number.isFinite(subtotal)
      && Math.abs(subtotal + porte - total) < 0.01;
    if (!cuadra) {
      console.error('Descuadre en el pedido', m.referencia, { subtotal, porte, total });
    }

    const pedido = {
      referencia: m.referencia || `PV-${sesion.id.slice(-8).toUpperCase()}`,
      stripe_session_id: sesion.id,
      estado: fuera || !cuadra ? 'revisar' : 'pagado',
      email: sesion.customer_details?.email || null,
      nombre: m.env_nombre || sesion.customer_details?.name || null,
      telefono: sesion.customer_details?.phone || null,
      direccion: {
        calle: m.env_calle || '',
        piso: m.env_piso || '',
        cp,
        localidad: m.env_localidad || '',
        provincia: m.env_provincia || '',
      },
      lineas: lineasDelPedido(lineItems, idsPorNombre),
      subtotal: Number.isFinite(subtotal) ? subtotal : total,
      porte: Number.isFinite(porte) ? porte : 0,
      total,
      peso_total: Number(m.peso_total) || null,
      quiere_factura: m.factura === 'si',
      nif: m.nif || null,
      nota: m.nota || null,
      pagado_en: new Date().toISOString(),
    };

    const { error } = await supabase.from('pedidos').insert(pedido);

    if (error) {
      // 23505 = clave duplicada. Es el aviso repetido de Stripe, no un fallo:
      // el pedido ya estaba guardado y no hay que tocarlo.
      if (error.code === '23505') {
        return res.status(200).json({ recibido: true, repetido: true });
      }
      console.error('No se pudo guardar el pedido', pedido.referencia, error.message);
      // 200 a propósito: el dinero ya está cobrado y que Stripe reintente no
      // arregla un fallo nuestro. Queda en el log para rescatarlo a mano.
      return res.status(200).json({ recibido: true, guardado: false });
    }

    console.log('Pedido guardado:', pedido.referencia, pedido.total, 'EUR', pedido.estado);
    return res.status(200).json({ recibido: true, referencia: pedido.referencia });
  } catch (e) {
    console.error('Error procesando el pago', m.referencia, e.message);
    return res.status(200).json({ recibido: true, guardado: false });
  }
}
