/**
 * Llamadas a Stripe y Supabase con fetch, SIN sus librerías.
 *
 * Por qué: en el plan gratis de Cloudflare cada petición tiene 10 ms de CPU, y
 * solo preparar los clientes de Stripe y Supabase se comía más de eso en
 * frío (medido el 19/10/2026: 11-14 ms en crear-sesion). Esperar la respuesta
 * de la red no cuenta; construir objetos enormes, sí. Aquí solo se hace lo
 * imprescindible: una petición HTTP con su cabecera de autorización.
 *
 * Al principio el webhook seguía con la librería de Stripe, pero en frío
 * gastaba 11-37 ms solo en cargarla. Ahora todo /servidor va por aquí.
 */

/**
 * Convierte un objeto en el formulario que entiende la API de Stripe:
 * { a: { b: [ { c: 1 } ] } }  →  a[b][0][c]=1
 * Los valores undefined/null se omiten, igual que hace su librería.
 */
export function formularioStripe(obj) {
  const pares = new URLSearchParams();
  const recorrer = (valor, clave) => {
    if (valor === undefined || valor === null) return;
    if (Array.isArray(valor)) {
      valor.forEach((v, i) => recorrer(v, `${clave}[${i}]`));
    } else if (typeof valor === 'object') {
      for (const [k, v] of Object.entries(valor)) recorrer(v, clave ? `${clave}[${k}]` : k);
    } else {
      pares.append(clave, String(valor));
    }
  };
  recorrer(obj, '');
  return pares;
}

/** Crea una sesión de Checkout. Devuelve el objeto de Stripe o lanza un Error con su mensaje. */
export async function crearSesionCheckout(claveSecreta, datos) {
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${claveSecreta}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formularioStripe(datos),
  });
  const respuesta = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(respuesta?.error?.message || `Stripe respondió ${r.status}`);
  return respuesta;
}

/**
 * Lee de Supabase los productos pedidos que estén disponibles (API REST directa,
 * con la clave pública: la misma lectura que puede hacer cualquier visitante).
 * Devuelve { data } o { error } con la misma forma que la librería.
 */
export async function productosDisponibles(urlSupabase, clavePublica, ids) {
  const url = `${urlSupabase}/rest/v1/productos`
    + `?select=id,nombre,precio,peso,foto&disponible=eq.true&id=in.(${ids.map(Number).join(',')})`;
  try {
    const r = await fetch(url, { headers: { apikey: clavePublica, Authorization: `Bearer ${clavePublica}` } });
    if (!r.ok) return { error: { message: `Supabase respondió ${r.status}` } };
    return { data: await r.json() };
  } catch (e) {
    return { error: { message: e.message } };
  }
}

/** Lista las líneas cobradas de una sesión de Checkout (lo que se cobró de verdad). */
export async function lineasCobradas(claveSecreta, idSesion) {
  const r = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(idSesion)}/line_items?limit=100`,
    { headers: { Authorization: `Bearer ${claveSecreta}` } }
  );
  const respuesta = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(respuesta?.error?.message || `Stripe respondió ${r.status}`);
  return respuesta;
}

/**
 * Comprueba la firma de un aviso de Stripe, tal como lo documenta Stripe
 * ("Verify signatures manually"): la cabecera trae t=<segundos> y una o varias
 * v1=<hex>; la buena es HMAC-SHA256(secreto, "<t>.<cuerpo>"). Se rechaza
 * también si el aviso tiene más de 5 minutos, para que no se pueda reenviar
 * uno antiguo capturado. Devuelve el evento ya leído, o lanza un Error.
 */
export async function verificarAvisoStripe(cuerpo, cabecera, secreto, toleranciaSegundos = 300) {
  const partes = String(cabecera || '').split(',').map(p => p.trim().split('='));
  const t = partes.find(([k]) => k === 't')?.[1];
  const firmas = partes.filter(([k]) => k === 'v1').map(([, v]) => v);
  if (!t || !/^\d+$/.test(t) || firmas.length === 0) throw new Error('Cabecera de firma incompleta');

  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranciaSegundos) {
    throw new Error('Aviso fuera de plazo');
  }

  const texto = new TextEncoder();
  const clave = await crypto.subtle.importKey(
    'raw', texto.encode(secreto), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', clave, texto.encode(`${t}.${cuerpo}`)));
  const esperada = [...mac].map(b => b.toString(16).padStart(2, '0')).join('');

  // Comparación en tiempo constante: no revelar por el tiempo cuántos
  // caracteres acertó quien prueba firmas falsas.
  const iguales = (a, b) => {
    if (a.length !== b.length) return false;
    let dif = 0;
    for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return dif === 0;
  };
  if (!firmas.some(f => iguales(f, esperada))) throw new Error('Firma no coincide');

  return JSON.parse(cuerpo);
}

/**
 * Cliente mínimo de la API REST de Supabase (PostgREST) con la clave que se le
 * pase. `filtros` es un objeto { columna: 'eq.valor', ... }: va siempre por
 * URLSearchParams, que codifica lo que escriba el cliente (& # + espacios…).
 * Devuelve { data } o { error } con la misma forma que la librería, incluido
 * error.code (p. ej. '23505' = clave duplicada).
 */
export function supabaseRest(urlSupabase, clave) {
  const cabeceras = { apikey: clave, Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' };
  const pedir = async (ruta, opciones) => {
    try {
      const r = await fetch(`${urlSupabase}/rest/v1/${ruta}`, { ...opciones, headers: { ...cabeceras, ...opciones?.headers } });
      const cuerpo = await r.json().catch(() => null);
      if (!r.ok) return { error: { message: cuerpo?.message || `Supabase respondió ${r.status}`, code: cuerpo?.code } };
      return { data: cuerpo };
    } catch (e) {
      return { error: { message: e.message } };
    }
  };
  return {
    select(tabla, columnas, filtros = {}, limite) {
      const q = new URLSearchParams({ select: columnas, ...filtros });
      if (limite) q.set('limit', String(limite));
      return pedir(`${tabla}?${q}`);
    },
    insert(tabla, fila, columnas) {
      const q = columnas ? `?${new URLSearchParams({ select: columnas })}` : '';
      return pedir(`${tabla}${q}`, {
        method: 'POST',
        headers: { Prefer: columnas ? 'return=representation' : 'return=minimal' },
        body: JSON.stringify(fila),
      });
    },
  };
}
