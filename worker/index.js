import crearSesion from '../servidor/crear-sesion.js';
import stripeWebhook from '../servidor/stripe-webhook.js';
import desistimiento from '../servidor/desistimiento.js';

/**
 * Entrada del Worker de Cloudflare.
 *
 * Solo llegan aquí las peticiones a /api/* (ver `run_worker_first` en
 * wrangler.jsonc). Todo lo demás lo sirve Cloudflare directamente desde /dist,
 * con la portada como respaldo para las rutas de React (/tienda, /admin…).
 *
 * La lógica está en /servidor, igual que la usaría Vercel: aquí solo se reparte.
 */
const RUTAS = {
  '/api/crear-sesion': crearSesion,
  '/api/stripe-webhook': stripeWebhook,
  '/api/desistimiento': desistimiento,
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const manejar = RUTAS[pathname];
    if (!manejar) {
      return new Response(JSON.stringify({ error: 'No encontrado.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return manejar(request, env);
  },
};
