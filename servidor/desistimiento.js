import { json, leerJson } from './http.js';
import { supabaseRest } from './ligero.js';

/**
 * Recibe un desistimiento hecho desde /legal/desistir y lo guarda con su fecha
 * y hora, que es lo que prueba que el cliente desistió dentro de plazo.
 *
 * Directiva (UE) 2023/2673, aplicable desde el 19/06/2026: quien vende online
 * tiene que ofrecer una función para desistir tan fácil como la de comprar, y
 * acusar recibo en un soporte duradero.
 *
 * Esta dirección es pública, así que se trata como el checkout: todo lo que
 * llega se limpia y se recorta, y la escritura la hace el servidor con la
 * service_role. El navegador nunca toca la tabla.
 *
 * NO se rechaza un desistimiento porque la referencia de pedido no exista: es
 * un derecho del cliente y una errata no puede quitárselo. Se guarda igual y
 * se marca si se encontró el pedido, para que el titular lo compruebe.
 */

const LIMITES = { nombre: 80, email: 120, pedido: 20, productos: 500, comentario: 500 };
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function nuevaReferencia() {
  const tiempo = Date.now().toString(36).toUpperCase().slice(-5);
  const azar = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `DS-${tiempo}${azar}`;
}

export default async function desistimiento(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido.' }, 405, { Allow: 'POST' });
  }

  const faltan = ['VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'].filter(v => !env[v]);
  if (faltan.length) {
    console.error('Faltan variables de entorno:', faltan.join(', '));
    return json({ error: 'No hemos podido registrarlo. Escríbenos por email, vale igual.' }, 500);
  }

  const cuerpo = (await leerJson(request)) || {};

  // Trampa para robots: un campo que una persona no ve ni rellena. Se responde
  // OK para que el robot no aprenda nada, pero no se guarda.
  if (cuerpo.web) return json({ referencia: 'DS-OK', creado_en: new Date().toISOString() });

  const texto = (v, max) => String(v ?? '').trim().slice(0, max);
  const datos = {
    nombre: texto(cuerpo.nombre, LIMITES.nombre),
    email: texto(cuerpo.email, LIMITES.email).toLowerCase(),
    pedido_ref: texto(cuerpo.pedido, LIMITES.pedido).toUpperCase(),
    productos: texto(cuerpo.productos, LIMITES.productos) || null,
    comentario: texto(cuerpo.comentario, LIMITES.comentario) || null,
  };

  const errores = {};
  if (datos.nombre.length < 2) errores.nombre = 'Escribe tu nombre.';
  if (!EMAIL_VALIDO.test(datos.email)) errores.email = 'Revisa el email: ahí te mandaremos la confirmación.';
  if (datos.pedido_ref.length < 3) errores.pedido = 'Indica el número de pedido (empieza por PV-).';
  if (Object.keys(errores).length) {
    return json({ error: Object.values(errores)[0], errores }, 400);
  }

  // Sin la librería de Supabase: ver servidor/ligero.js (CPU en Cloudflare).
  const supabase = supabaseRest(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // Doble clic o reenvío: si el mismo email ya desistió de ese pedido hace
  // menos de 10 minutos, se devuelve el mismo justificante en vez de otro.
  const haceUnRato = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: previos } = await supabase.select('desistimientos', 'referencia,creado_en', {
    email: `eq.${datos.email}`,
    pedido_ref: `eq.${datos.pedido_ref}`,
    creado_en: `gte.${haceUnRato}`,
  }, 1);
  if (previos?.[0]) return json(previos[0]);

  const { data: pedidos } = await supabase.select('pedidos', 'id', { referencia: `eq.${datos.pedido_ref}` }, 1);
  const pedido = pedidos?.[0];

  const { data: filas, error } = await supabase.insert(
    'desistimientos',
    { ...datos, referencia: nuevaReferencia(), pedido_id: pedido?.id ?? null },
    'referencia,creado_en'
  );
  const data = filas?.[0];

  if (error) {
    console.error('Supabase:', error.message);
    return json({ error: 'No hemos podido registrarlo. Escríbenos por email, vale igual.' }, 502);
  }

  return json(data);
}
