
/**
 * Entrada del Worker de Cloudflare.
 *
 * Solo llegan aquí las peticiones a /api/* (ver `run_worker_first` en
 * wrangler.jsonc). Todo lo demás lo sirve Cloudflare directamente desde /dist,
 * con la portada como respaldo para las rutas de React (/tienda, /admin…).
 *
 * La lógica está en /servidor, igual que la usaría Vercel: aquí solo se reparte.
 *
 * Cada función se carga SOLO cuando se pide (import dinámico). Así el cobro no
 * arrastra la librería de Stripe que necesita el webhook: en el plan gratis
 * cada petición tiene 10 ms de CPU y preparar código que no se usa también cuenta.
 */
const RUTAS = {
  '/api/crear-sesion': () => import('../servidor/crear-sesion.js'),
  '/api/stripe-webhook': () => import('../servidor/stripe-webhook.js'),
  '/api/desistimiento': () => import('../servidor/desistimiento.js'),
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const cargar = RUTAS[pathname];
    if (!cargar) {
      return new Response(JSON.stringify({ error: 'No encontrado.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { default: manejar } = await cargar();
    return manejar(request, env);
  },
};
