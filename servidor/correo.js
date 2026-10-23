/**
 * Envío de correos con Resend (resend.com), con fetch y sin librería, por lo
 * mismo que servidor/ligero.js: en el plan gratis de Cloudflare cada petición
 * tiene 10 ms de CPU.
 *
 * Remitente: avisos@pacovago.es (dominio verificado en Resend; registros DNS en
 * Cloudflare). La clave va en el secreto RESEND_API_KEY del Worker.
 *
 * Un correo que falla NUNCA debe tumbar lo importante (guardar el pedido o el
 * desistimiento): se registra en el log y se sigue.
 */

const REMITENTE = 'Paco Vago <avisos@pacovago.es>';
export const CORREO_TIENDA = 'pacovagopuertasevilla@gmail.com';

/** Escapa lo que escribe el cliente antes de meterlo en el HTML del correo. */
export const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const euros = (n) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);

/** Devuelve true si salió; false (y lo apunta en el log) si no. */
export async function enviarCorreo(env, { para, asunto, html, texto, responderA }) {
  if (!env.RESEND_API_KEY) {
    console.error('Correo sin enviar: falta RESEND_API_KEY.', asunto);
    return false;
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: REMITENTE,
        to: Array.isArray(para) ? para : [para],
        subject: asunto,
        html,
        text: texto,
        reply_to: responderA || undefined,
      }),
    });
    if (!r.ok) {
      console.error('Resend respondió', r.status, (await r.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error('No se pudo enviar el correo:', e.message);
    return false;
  }
}

/** Marco común: cabecera con el nombre de la tienda y pie con los datos. */
export const plantilla = (titulo, cuerpo) => `<!doctype html>
<html lang="es"><body style="margin:0;background:#f5f5f4;font-family:Georgia,serif;color:#1c1917">
<div style="max-width:560px;margin:0 auto;background:#fff">
  <div style="background:#1c1917;color:#fafaf9;padding:18px 24px;font-size:20px;font-weight:bold">Paco Vago · Puerta de Sevilla</div>
  <div style="padding:24px">
    <h1 style="font-size:22px;margin:0 0 16px">${titulo}</h1>
    ${cuerpo}
  </div>
  <div style="padding:16px 24px;font-size:12px;color:#78716c;border-top:1px solid #e7e5e4">
    Paco Vago · C/ Puerta de Sevilla 5, 41410 Carmona (Sevilla) · 615 323 072 · pacovago.es
  </div>
</div></body></html>`;

/**
 * Aviso a la tienda de un pedido pagado: lo justo para prepararlo y mandarlo.
 * Se responde directamente al cliente (reply-to) si hace falta preguntarle algo.
 */
export function correoPedido(p) {
  const d = p.direccion || {};
  const filas = (p.lineas || []).map(l =>
    `<tr><td style="padding:6px 0;border-bottom:1px solid #e7e5e4">${esc(l.cantidad)} × ${esc(l.nombre)}</td>` +
    `<td style="padding:6px 0;border-bottom:1px solid #e7e5e4;text-align:right">${euros(l.importe)}</td></tr>`
  ).join('');

  const etiqueta = [
    esc(p.nombre),
    esc([d.calle, d.piso].filter(Boolean).join(', ')),
    `${esc(d.cp)} ${esc(d.localidad)} (${esc(d.provincia)})`,
    esc(p.telefono),
  ].filter(Boolean).join('<br>');

  const avisos = [
    p.estado === 'revisar'
      ? '<p style="background:#fee2e2;border-left:4px solid #b91c1c;padding:10px">⚠️ <strong>Revisa este pedido antes de enviarlo:</strong> la dirección cae fuera de península o las cuentas no cuadran.</p>'
      : '',
    p.nota ? `<p style="background:#fef3c7;border-left:4px solid #d97706;padding:10px"><strong>Nota del cliente:</strong> ${esc(p.nota)}</p>` : '',
    p.quiere_factura ? `<p style="background:#f5f5f4;border-left:4px solid #78716c;padding:10px"><strong>Pide factura</strong> · NIF ${esc(p.nif)}</p>` : '',
  ].join('');

  const html = plantilla(`🛒 Nuevo pedido ${esc(p.referencia)}`, `
    <p style="font-size:16px;margin:0 0 16px">Han pagado <strong>${euros(p.total)}</strong>. Hay que prepararlo y enviarlo en <strong>2 a 5 días laborables</strong>.</p>
    ${avisos}
    <h2 style="font-size:15px;margin:20px 0 8px;text-transform:uppercase;color:#78716c">Qué lleva</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px">${filas}
      <tr><td style="padding:6px 0">Envío${p.peso_total ? ` (${esc(p.peso_total)} kg)` : ''}</td><td style="padding:6px 0;text-align:right">${p.porte ? euros(p.porte) : 'Gratis'}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold">Total cobrado</td><td style="padding:8px 0;text-align:right;font-weight:bold">${euros(p.total)}</td></tr>
    </table>
    <h2 style="font-size:15px;margin:20px 0 8px;text-transform:uppercase;color:#78716c">Enviar a</h2>
    <p style="font-size:16px;background:#f5f5f4;padding:12px;margin:0">${etiqueta}</p>
    <p style="font-size:14px;color:#57534e">Email del cliente: ${esc(p.email)}. Si respondes a este correo, le escribes a él.</p>
  `);

  const texto = [
    `Nuevo pedido ${p.referencia} — ${euros(p.total)}`,
    p.estado === 'revisar' ? '¡REVISAR ANTES DE ENVIAR!' : '',
    '',
    ...(p.lineas || []).map(l => `${l.cantidad} x ${l.nombre}  ${euros(l.importe)}`),
    `Envío: ${p.porte ? euros(p.porte) : 'Gratis'}`,
    '',
    'Enviar a:',
    p.nombre, [d.calle, d.piso].filter(Boolean).join(', '), `${d.cp} ${d.localidad} (${d.provincia})`, p.telefono,
    p.nota ? `\nNota: ${p.nota}` : '',
    p.quiere_factura ? `Pide factura. NIF ${p.nif}` : '',
  ].filter(x => x !== '').join('\n');

  return { asunto: `🛒 Nuevo pedido ${p.referencia} · ${euros(p.total)}`, html, texto };
}

/**
 * Acuse de recibo del desistimiento (Directiva UE 2023/2673: soporte duradero,
 * con el contenido y la fecha y hora). Va al cliente; la tienda recibe copia.
 */
export function correoDesistimiento(d) {
  const cuando = new Date(d.creado_en).toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const html = plantilla('Hemos recibido tu desistimiento', `
    <p>Hola ${esc(d.nombre)}, te confirmamos que hemos recibido tu desistimiento.</p>
    <table style="font-size:15px;border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#78716c">Justificante</td><td><strong>${esc(d.referencia)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#78716c">Recibido el</td><td>${esc(cuando)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#78716c">Pedido</td><td>${esc(d.pedido_ref)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#78716c">Productos</td><td>${esc(d.productos || 'El pedido entero')}</td></tr>
      ${d.comentario ? `<tr><td style="padding:4px 12px 4px 0;color:#78716c">Comentario</td><td>${esc(d.comentario)}</td></tr>` : ''}
    </table>
    <p>Te escribiremos para indicarte cómo devolver el producto. El reembolso se hace por el mismo medio de pago en un máximo de 14 días naturales desde hoy.</p>
    <p style="font-size:13px;color:#78716c">Destinatario: José Antonio López Ruiz (Paco Vago), NIF 47336029M, C/ Puerta de Sevilla 5, 41410 Carmona (Sevilla).</p>
  `);
  const texto = `Hemos recibido tu desistimiento.\nJustificante: ${d.referencia}\nRecibido el: ${cuando}\nPedido: ${d.pedido_ref}\nProductos: ${d.productos || 'El pedido entero'}\n\nTe escribiremos para indicarte cómo devolver el producto. Reembolso en un máximo de 14 días naturales.`;
  return { asunto: `Desistimiento recibido · ${d.referencia}`, html, texto };
}
