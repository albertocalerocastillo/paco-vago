/**
 * Prueba el webhook en local SIN instalar la herramienta de Stripe.
 *
 * Coge un pago de verdad de tu cuenta de pruebas, lo envuelve en el mismo
 * formato de aviso que manda Stripe, lo firma con STRIPE_WEBHOOK_SECRET y se lo
 * manda a tu servidor. Para el webhook es indistinguible del aviso real: recorre
 * el mismo camino (comprobar la firma, leer las líneas del pago, guardar).
 *
 * Lo único que NO prueba es la entrega de Stripe por internet, que solo se puede
 * comprobar con una dirección pública, o sea al desplegar.
 *
 * Uso:
 *   node scripts/probar-webhook.js            (coge el último pago completado)
 *   node scripts/probar-webhook.js cs_test_x  (coge uno concreto)
 */

import { createHmac } from 'node:crypto';
import Stripe from 'stripe';
import { cargarEnv } from './cargar-env.js';

cargarEnv();

const DESTINO = process.env.DESTINO_WEBHOOK || 'http://localhost:3000/api/stripe-webhook';
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
  console.error('Faltan STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET en el .env');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

/** Firma el cuerpo igual que Stripe: t=<segundos>,v1=<hmac de "t.cuerpo">. */
function firmar(cuerpo, secreto) {
  const t = Math.floor(Date.now() / 1000);
  const v1 = createHmac('sha256', secreto).update(`${t}.${cuerpo}`).digest('hex');
  return `t=${t},v1=${v1}`;
}

const idPedido = process.argv[2];

const sesion = idPedido
  ? await stripe.checkout.sessions.retrieve(idPedido)
  : (await stripe.checkout.sessions.list({ limit: 20 })).data.find(s => s.payment_status === 'paid');

if (!sesion) {
  console.error('No he encontrado ningún pago completado en tu cuenta de pruebas.');
  process.exit(1);
}

console.log('Reproduciendo el pago', sesion.metadata?.referencia || sesion.id);
console.log('  importe:', (sesion.amount_total / 100).toFixed(2), 'EUR');
console.log('  estado :', sesion.payment_status);
console.log('  destino:', DESTINO);
console.log();

const cuerpo = JSON.stringify({
  id: `evt_prueba_${Date.now()}`,
  object: 'event',
  type: 'checkout.session.completed',
  created: Math.floor(Date.now() / 1000),
  data: { object: sesion },
});

const respuesta = await fetch(DESTINO, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': firmar(cuerpo, STRIPE_WEBHOOK_SECRET),
  },
  body: cuerpo,
});

console.log('Respuesta del webhook:', respuesta.status, await respuesta.text());

// Segunda pasada: Stripe reintenta sus avisos, así que el mismo pago puede
// llegar dos veces. Debe responder que ya lo tenía, no duplicar el pedido.
const repetido = await fetch(DESTINO, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': firmar(cuerpo, STRIPE_WEBHOOK_SECRET),
  },
  body: cuerpo,
});

console.log('Aviso repetido       :', repetido.status, await repetido.text());

// Y una firma inventada: tiene que rechazarla.
const falso = await fetch(DESTINO, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': 't=1,v1=firmainventada',
  },
  body: cuerpo,
});

console.log('Firma falsa          :', falso.status, await falso.text());
