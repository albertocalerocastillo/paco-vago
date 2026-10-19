import manejar from '../servidor/desistimiento.js';

// Plan B por si algún día se vuelve a Vercel (Pro): la lógica vive en
// /servidor y la comparten Cloudflare y Vercel. Aquí solo se conecta.
export const config = { runtime: 'edge' };

export default (request) => manejar(request, process.env);
