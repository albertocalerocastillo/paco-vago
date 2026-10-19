/**
 * Ayudas comunes de las funciones del servidor (formato web estándar).
 */

/** Respuesta JSON con su estado y cabeceras extra. */
export const json = (datos, estado = 200, cabeceras = {}) =>
  new Response(JSON.stringify(datos), {
    status: estado,
    headers: { 'Content-Type': 'application/json', ...cabeceras },
  });

/** Lee el cuerpo como JSON. Si no lo es (o viene vacío), devuelve null en vez de fallar. */
export async function leerJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
