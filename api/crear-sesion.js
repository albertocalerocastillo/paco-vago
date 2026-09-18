import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { calcularPorte } from '../src/data/envios.js';
import { provinciaDeCP } from '../src/data/provincias.js';
import { validarDireccion } from '../src/data/direccion.js';

/**
 * Crea la sesión de pago de Stripe y devuelve el enlace al que mandar al cliente.
 *
 * REGLA DE ORO: aquí no nos creemos NADA de lo que manda el navegador salvo qué
 * productos quiere y cuántos. Los precios y los pesos se leen de la base de datos
 * y el porte se recalcula aquí. Si nos fiáramos del carrito, cualquiera podría
 * abrir las herramientas del navegador, ponerse el aceite a 1 € y pagar eso.
 */

const MAX_LINEAS = 30;      // productos distintos en un pedido
const MAX_UNIDADES = 20;    // unidades de un mismo producto
const SITIO_PUBLICO = process.env.SITIO_URL || 'https://paco-vago.vercel.app';

/**
 * A donde devolver al cliente despues de pagar.
 *
 * En local se usa el puerto por el que ha entrado de verdad: si no, arrancando
 * `vercel dev` en otro puerto, Stripe devuelve al de la variable de entorno y
 * el cliente aterriza en una pagina que no existe. Ya paso una vez.
 *
 * La cabecera Host SOLO se cree cuando dice localhost. En produccion se usa
 * siempre SITIO_URL, que es fijo: fiarse del Host ahi permitiria que alguien
 * mandara al cliente a otro sitio tras pagar.
 */
function baseDelSitio(req) {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const esLocal = host === 'localhost' || host.startsWith('localhost:') || host.startsWith('127.0.0.1:');
  if (!esLocal) return SITIO_PUBLICO;
  const protocolo = req.headers['x-forwarded-proto'] || 'http';
  return `${protocolo}://${host}`;
}

/** Referencia corta y legible para el cliente y para buscar el pedido. Ej: PV-K3F9A2B */
function nuevaReferencia() {
  const tiempo = Date.now().toString(36).toUpperCase().slice(-5);
  const azar = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `PV-${tiempo}${azar}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const faltan = ['STRIPE_SECRET_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
    .filter(v => !process.env[v]);
  if (faltan.length) {
    console.error('Faltan variables de entorno:', faltan.join(', '));
    return res.status(500).json({ error: 'El pago no está configurado todavía.' });
  }

  const { items, direccion } = req.body || {};

  // ── Direccion de envio ──────────────────────────────────────
  // Se valida ENTERA aqui, con las mismas reglas que en el formulario. Lo del
  // navegador es una cortesia para el cliente; esto es lo que decide, porque
  // es lo unico que nadie puede saltarse editando la pagina.
  const revision = validarDireccion(direccion);
  if (!revision.ok) {
    const primero = Object.values(revision.errores)[0];
    return res.status(400).json({ error: primero, errores: revision.errores });
  }
  const envio = revision.direccion;

  // ── Lo que pide el navegador ────────────────────────────────
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío.' });
  }
  if (items.length > MAX_LINEAS) {
    return res.status(400).json({ error: 'El pedido tiene demasiados productos distintos.' });
  }

  const pedidas = new Map();
  for (const item of items) {
    const id = Number(item?.id);
    const cantidad = Number(item?.cantidad);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Hay un producto que no reconocemos.' });
    }
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_UNIDADES) {
      return res.status(400).json({ error: `Las cantidades deben ir de 1 a ${MAX_UNIDADES} unidades.` });
    }
    pedidas.set(id, (pedidas.get(id) || 0) + cantidad);
  }

  // ── La verdad: precios y pesos de la base de datos ──────────
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, precio, peso, foto')
    .in('id', [...pedidas.keys()])
    .eq('disponible', true);

  if (error) {
    console.error('Supabase:', error.message);
    return res.status(502).json({ error: 'No hemos podido consultar el catálogo. Inténtalo en un minuto.' });
  }

  const lineasStripe = [];
  const idsResumen = [];
  let subtotal = 0;
  let pesoTotal = 0;

  for (const [id, cantidad] of pedidas) {
    const producto = (productos || []).find(p => p.id === id);
    if (!producto) {
      return res.status(409).json({ error: 'Alguno de los productos ya no está disponible. Revisa el carrito.' });
    }

    const precio = Number(producto.precio);
    const peso = Number(producto.peso);
    if (!(precio > 0) || !(peso > 0)) {
      return res.status(409).json({
        error: `"${producto.nombre}" no se puede comprar por la web ahora mismo. Quítalo del carrito y pídelo por WhatsApp.`,
      });
    }

    subtotal += precio * cantidad;
    pesoTotal += peso * cantidad;
    idsResumen.push(`${id}x${cantidad}`);

    lineasStripe.push({
      quantity: cantidad,
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(precio * 100),   // Stripe trabaja en céntimos
        product_data: {
          name: producto.nombre,
          images: typeof producto.foto === 'string' && producto.foto.startsWith('http')
            ? [producto.foto]
            : undefined,
        },
      },
    });
  }

  const porte = calcularPorte(pesoTotal);
  if (porte == null) {
    console.error('Porte incalculable. Peso total:', pesoTotal);
    return res.status(500).json({ error: 'No hemos podido calcular el envío.' });
  }

  // ── Cobro ───────────────────────────────────────────────────
  const referencia = nuevaReferencia();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const sesion = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'es',
      line_items: lineasStripe,
      // A proposito NO se pide la direccion aqui: ya la tenemos validada. Si la
      // pidiera Stripe, el cliente podria cambiarla por una de Canarias despues
      // de haber pasado nuestra comprobacion, y Stripe solo filtra por pais.
      phone_number_collection: { enabled: true },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: Math.round(porte * 100), currency: 'eur' },
          display_name: `Envío a península (${pesoTotal.toFixed(1)} kg)`,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 5 },
          },
        },
      }],
      success_url: `${baseDelSitio(req)}/tienda/gracias?ref=${referencia}`,
      cancel_url: `${baseDelSitio(req)}/tienda/carrito`,
      client_reference_id: referencia,
      // El webhook reconstruye el pedido con esto. Los nombres y precios cobrados
      // los lee de Stripe, que es el registro de lo que se cobró de verdad.
      metadata: {
        referencia,
        productos: idsResumen.join(','),
        subtotal: subtotal.toFixed(2),
        porte: porte.toFixed(2),
        peso_total: pesoTotal.toFixed(3),
        env_nombre: envio.nombre,
        env_calle: envio.calle,
        env_piso: envio.piso,
        env_cp: envio.cp,
        env_localidad: envio.localidad,
        env_provincia: provinciaDeCP(envio.cp) || '',
        nota: envio.nota,
        factura: envio.quiereFactura ? 'si' : 'no',
        nif: envio.quiereFactura ? envio.nif : '',
      },
    });

    return res.status(200).json({ url: sesion.url, referencia });
  } catch (e) {
    console.error('Stripe:', e.message);
    return res.status(502).json({ error: 'No hemos podido abrir la pasarela de pago. Inténtalo de nuevo.' });
  }
}
