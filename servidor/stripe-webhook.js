import { zonaFueraDePeninsula } from '../src/data/envios.js';
import { json } from './http.js';
import { verificarAvisoStripe, lineasCobradas, supabaseRest } from './ligero.js';

/**
 * Aviso de Stripe cuando un pago se completa. Aquí es donde un pedido existe
 * de verdad: la página de "gracias" solo significa que el navegador volvió, y
 * un cliente puede cerrarla antes de que cargue.
 *
 * EL CUERPO, TAL CUAL. Para comprobar la firma hace falta el cuerpo EXACTAMENTE
 * como llegó, byte a byte, y por eso se lee con request.text() y no como JSON.
 * (En el entorno Node de Vercel, Vercel se lo leía y troceaba antes que
 * nosotros y la firma nunca validaba: costó un arreglo.)
 *
 * Sin librerías (ver servidor/ligero.js): la firma se comprueba con el
 * criptográfico estándar siguiendo la receta de Stripe, y Stripe y Supabase se
 * llaman con fetch. Probado con scripts/probar-webhook.js: firma buena, firma
 * falsa y aviso repetido.
 *
 * Tres cosas que no son opcionales:
 *
 * 1. FIRMA. Esta dirección es pública: cualquiera puede mandarle un "te han
 *    pagado 500 €". Solo Stripe sabe firmar, y sin firma válida no se guarda nada.
 *
 * 2. DUPLICADOS. Stripe reintenta el aviso si tardamos o fallamos, así que el
 *    mismo pago puede llegar varias veces. La columna stripe_session_id es
 *    única: el segundo intento choca y se responde OK sin duplicar el pedido.
 *
 * 3. RESPONDER 200 si la firma es buena. Si devolvemos error, Stripe reintenta
 *    durante días. Un fallo nuestro al guardar se registra en el log y se
 *    rescata a mano; que Stripe insista no lo arregla.
 */

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

export default async function stripeWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
  }

  const faltan = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    .filter(v => !env[v]);
  if (faltan.length) {
    console.error('Webhook sin configurar. Faltan:', faltan.join(', '));
    return new Response('Webhook sin configurar', { status: 500 });
  }

  // ── 1. Comprobar que el aviso viene de Stripe ───────────────
  let evento;
  try {
    const crudo = await request.text();
    evento = await verificarAvisoStripe(
      crudo,
      request.headers.get('stripe-signature'),
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('Firma del webhook no válida:', e.message);
    return new Response('Firma no válida', { status: 400 });
  }

  // Solo interesan los pagos completados. El resto se acepta y se ignora, para
  // que Stripe no reintente avisos que no usamos.
  const interesan = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  if (!interesan.includes(evento.type)) {
    return json({ recibido: true, ignorado: evento.type });
  }

  const sesion = evento.data.object;

  // Con Bizum o transferencia el pago puede quedar pendiente un rato. Si aún no
  // está pagado no se guarda: ya llegará el aviso de async_payment_succeeded.
  if (sesion.payment_status !== 'paid') {
    return json({ recibido: true, pendiente: sesion.payment_status });
  }

  const m = sesion.metadata || {};

  try {
    // ── 2. Qué se cobró exactamente, según Stripe ─────────────
    const lineItems = await lineasCobradas(env.STRIPE_SECRET_KEY, sesion.id);

    // metadata.productos viene como "3x1,36x2": de ahí salen los ids.
    const idsPorNombre = new Map();
    const idsPedidos = String(m.productos || '')
      .split(',')
      .filter(Boolean)
      .map(par => Number(par.split('x')[0]))
      .filter(Number.isInteger);

    const supabase = supabaseRest(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    if (idsPedidos.length) {
      const { data: productos } = await supabase.select(
        'productos', 'id,nombre', { id: `in.(${idsPedidos.join(',')})` }
      );
      for (const p of productos || []) idsPorNombre.set(p.nombre, p.id);
    }

    // ── 3. Redes de seguridad ─────────────────────────────────
    // No deberían saltar nunca: la dirección se valida antes de cobrar y las
    // cuentas las hace el servidor. Pero si algo se cuela, el pedido queda
    // marcado para que nadie lo prepare a ciegas.
    const cp = m.env_cp || '';
    const fuera = zonaFueraDePeninsula(cp);
    if (fuera) console.error('Pedido cobrado fuera de península:', m.referencia, cp, fuera);

    const total = sesion.amount_total / 100;
    const porte = Number(m.porte);
    const subtotal = Number(m.subtotal);

    const cuadra = Number.isFinite(porte) && Number.isFinite(subtotal)
      && Math.abs(subtotal + porte - total) < 0.01;
    if (!cuadra) console.error('Descuadre en el pedido', m.referencia, { subtotal, porte, total });

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

    const { error } = await supabase.insert('pedidos', pedido);

    if (error) {
      // 23505 = clave duplicada. Es el aviso repetido de Stripe, no un fallo:
      // el pedido ya estaba guardado y no hay que tocarlo.
      if (error.code === '23505') {
        return json({ recibido: true, repetido: true });
      }
      console.error('No se pudo guardar el pedido', pedido.referencia, error.message);
      return json({ recibido: true, guardado: false });
    }

    console.log('Pedido guardado:', pedido.referencia, pedido.total, 'EUR', pedido.estado);
    return json({ recibido: true, referencia: pedido.referencia });
  } catch (e) {
    console.error('Error procesando el pago', m.referencia, e.message);
    return json({ recibido: true, guardado: false });
  }
}
