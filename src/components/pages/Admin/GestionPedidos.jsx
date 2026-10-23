import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Check, Phone, Copy, RefreshCw, MessageCircle } from '../../../theme/icons';
import { formatoPrecio } from '../../../utils/formato';
import { formatoPeso, esRepartoLocal, repartoLocalDudoso } from '../../../data/envios';

/**
 * Pedidos de la tienda online (/admin).
 *
 * Está pensada para el trabajo del día y para el MÓVIL: entra, ve lo que hay
 * que preparar, llama o escribe al cliente si hace falta, lo prepara y lo marca
 * como enviado. Por eso arranca en "Por preparar" y no en "Todos".
 *
 * Los pedidos los escribe el webhook de Stripe; aquí solo se cambia el estado.
 */

const VISTAS = [
  { id: 'preparar', texto: 'Por preparar', corto: 'Pendientes', estados: ['pagado', 'revisar'] },
  { id: 'enviados', texto: 'Enviados', estados: ['enviado'] },
  { id: 'todos', texto: 'Todos', estados: null },
];

const ETIQUETA = {
  pagado: { texto: 'Pagado', clase: 'bg-green-100 text-green-800 border-green-300' },
  revisar: { texto: '⚠ Revisar', clase: 'bg-red-100 text-red-800 border-red-400' },
  enviado: { texto: 'Enviado', clase: 'bg-stone-100 text-stone-600 border-stone-300' },
  pendiente: { texto: 'Sin pagar', clase: 'bg-amber-100 text-amber-800 border-amber-300' },
  cancelado: { texto: 'Cancelado', clase: 'bg-stone-100 text-stone-500 border-stone-300' },
};

const fecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '';

// Solo cifras, con el prefijo de España si no lo trae: lo que piden tel: y wa.me.
const soloCifras = (tel) => {
  const d = String(tel || '').replace(/\D/g, '');
  return d.length === 9 ? `34${d}` : d;
};

export default function GestionPedidos({ onPendientes }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [vista, setVista] = useState('preparar');

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('creado_en', { ascending: false });
    setCargando(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setPedidos(data || []);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const porPreparar = pedidos.filter(p => ['pagado', 'revisar'].includes(p.estado)).length;

  useEffect(() => {
    onPendientes?.(porPreparar);
  }, [porPreparar, onPendientes]);

  const cambiarEstado = async (pedido, cambios) => {
    const { error } = await supabase.from('pedidos').update(cambios).eq('id', pedido.id);
    if (error) {
      setError(error.message);
      return;
    }
    setPedidos(lista => lista.map(p => (p.id === pedido.id ? { ...p, ...cambios } : p)));
  };

  const filtro = VISTAS.find(v => v.id === vista);
  const visibles = filtro?.estados
    ? pedidos.filter(p => filtro.estados.includes(p.estado))
    : pedidos;

  if (cargando) return <p className="text-stone-500">Cargando pedidos…</p>;

  return (
    <div>
      {error && (
        <p className="mb-4 text-red-700 bg-red-50 border-l-4 border-red-700 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {/* Filtro: tres botones del mismo ancho + recargar */}
      <div className="flex gap-2 mb-5 sm:mb-6">
        <div className="flex-1 sm:flex-none grid grid-cols-3 bg-white border border-stone-300 p-1 rounded-lg">
          {VISTAS.map(v => (
            <button
              key={v.id}
              onClick={() => setVista(v.id)}
              className={`h-10 px-2 sm:px-5 rounded-md text-sm flex items-center justify-center gap-1.5 transition-colors ${
                vista === v.id ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {v.corto ? (
                <>
                  <span className="sm:hidden">{v.corto}</span>
                  <span className="hidden sm:inline">{v.texto}</span>
                </>
              ) : v.texto}
              {v.id === 'preparar' && porPreparar > 0 && (
                <span className="bg-amber-600 text-white rounded-full min-w-5 h-5 px-1.5 text-xs font-sans font-bold leading-5">
                  {porPreparar}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setCargando(true); cargar(); }}
          aria-label="Actualizar la lista"
          title="Actualizar"
          className="w-12 shrink-0 flex items-center justify-center bg-white border border-stone-300 rounded-lg text-stone-600 hover:border-amber-700 hover:text-amber-700 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {visibles.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center text-stone-500">
          {vista === 'preparar'
            ? '✓ No hay pedidos pendientes de preparar. Todo al día.'
            : 'No hay pedidos en esta lista.'}
        </div>
      ) : (
        <div className="grid gap-4 2xl:grid-cols-2 items-start">
          {visibles.map(p => (
            <Pedido
              key={p.id}
              pedido={p}
              onEnviado={() => cambiarEstado(p, { estado: 'enviado', enviado_en: new Date().toISOString() })}
              onDeshacer={() => cambiarEstado(p, { estado: 'pagado', enviado_en: null })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Un pedido ────────────────────────────────────────────── */
function Pedido({ pedido: p, onEnviado, onDeshacer }) {
  const [copiado, setCopiado] = useState(false);
  const etiqueta = ETIQUETA[p.estado] || ETIQUETA.pendiente;
  const d = p.direccion || {};
  const local = esRepartoLocal(d.cp);
  const tel = soloCifras(p.telefono);

  // Lo que hay que escribir en la etiqueta del paquete, de una tacada.
  const parteEnvio = [
    p.nombre,
    [d.calle, d.piso].filter(Boolean).join(', '),
    `${d.cp} ${d.localidad} (${d.provincia})`,
    p.telefono,
  ].filter(Boolean).join('\n');

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(parteEnvio);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sin permiso de portapapeles: se puede seleccionar a mano */
    }
  };

  const botonContacto =
    'flex-1 sm:flex-none h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 text-sm text-stone-700 hover:border-amber-700 hover:text-amber-700 transition-colors';

  return (
    <article className={`bg-white border rounded-lg overflow-hidden ${p.estado === 'revisar' ? 'border-red-400' : 'border-stone-200'}`}>
      {/* Cabecera */}
      <div className="px-4 sm:px-5 pt-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-lg tracking-wide">{p.referencia}</span>
            <span className={`text-xs uppercase tracking-wider border rounded px-2 py-0.5 ${etiqueta.clase}`}>
              {etiqueta.texto}
            </span>
          </div>
          <span className="text-sm text-stone-400">{fecha(p.creado_en)}</span>
        </div>
        <span className="text-2xl font-bold">{formatoPrecio(p.total)}</span>
      </div>

      <div className="px-4 sm:px-5 pt-3 space-y-2">
        {p.estado === 'revisar' && (
          <p className="text-sm text-red-800 bg-red-50 border-l-4 border-red-700 px-3 py-2">
            {repartoLocalDudoso(d.cp, d.localidad)
              ? `Ha puesto el código postal de Carmona (reparto gratis) pero la localidad es "${d.localidad}". Comprueba la dirección: si está fuera de Carmona, llámale para cobrar el envío o anular el pedido.`
              : 'Este pedido necesita una mirada antes de prepararlo: o la dirección queda fuera de península, o las cuentas no cuadran con lo que se cobró. Compruébalo antes de enviarlo.'}
          </p>
        )}
        {local && p.estado !== 'revisar' && p.estado !== 'cancelado' && (
          <p className="text-sm text-green-800 bg-green-50 border-l-4 border-green-600 px-3 py-2">
            🚲 Reparto en Carmona: lo lleva la tienda. Llama al cliente para quedar en la hora.
          </p>
        )}
        {p.nota && (
          <p className="text-sm bg-amber-50 border-l-4 border-amber-500 px-3 py-2">
            <strong>Nota del cliente:</strong> {p.nota}
          </p>
        )}
        {p.quiere_factura && (
          <p className="text-sm bg-stone-100 border-l-4 border-stone-400 px-3 py-2">
            <strong>Pide factura</strong> · NIF {p.nif}
          </p>
        )}
      </div>

      <div className="px-4 sm:px-5 py-4 grid md:grid-cols-2 gap-5">
        {/* A quién y a dónde */}
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Enviar a</p>
          <p className="font-semibold">{p.nombre}</p>
          <p className="text-stone-600">
            {d.calle}{d.piso ? `, ${d.piso}` : ''}<br />
            {d.cp} {d.localidad} ({d.provincia})
          </p>
          <p className="text-stone-500 text-sm mt-1 break-all">{p.email}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {tel && (
              <a href={`tel:+${tel}`} className={botonContacto}>
                <Phone size={16} /> Llamar
              </a>
            )}
            {tel && (
              <a
                href={`https://wa.me/${tel}?text=${encodeURIComponent(`Hola ${p.nombre || ''}, te escribimos de Paco Vago por tu pedido ${p.referencia}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={botonContacto}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
            <button onClick={copiar} className={botonContacto}>
              {copiado ? <Check size={16} /> : <Copy size={16} />}
              {copiado ? 'Copiada' : 'Copiar dirección'}
            </button>
          </div>
        </div>

        {/* Qué lleva */}
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Qué lleva</p>
          <ul className="space-y-1">
            {(p.lineas || []).map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span><strong>{l.cantidad} ×</strong> {l.nombre}</span>
                <span className="text-stone-500 shrink-0">{formatoPrecio(l.importe)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-stone-200 text-stone-600 space-y-0.5">
            <p className="flex justify-between">
              <span>
                {local ? 'Reparto en Carmona' : `Envío ${p.peso_total ? `(${formatoPeso(p.peso_total)})` : ''}`}
              </span>
              <span>{Number(p.porte) > 0 ? formatoPrecio(p.porte) : 'Gratis'}</span>
            </p>
            <p className="flex justify-between font-semibold text-stone-900">
              <span>Total cobrado</span>
              <span>{formatoPrecio(p.total)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Acción principal */}
      {p.estado !== 'cancelado' && (
        <div className="px-4 sm:px-5 py-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center gap-3">
          {p.estado === 'enviado' ? (
            <>
              <span className="text-sm text-stone-500 flex items-center gap-1.5">
                <Check size={16} className="text-green-700" /> Enviado el {fecha(p.enviado_en)}
              </span>
              <button
                onClick={onDeshacer}
                className="ml-auto h-10 px-3 text-sm text-stone-500 hover:text-red-700 transition-colors"
              >
                Deshacer
              </button>
            </>
          ) : (
            <button
              onClick={onEnviado}
              className="w-full sm:w-auto h-12 px-6 inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 hover:bg-amber-700 text-stone-50 font-semibold transition-colors"
            >
              <Check size={18} /> {local ? 'Marcar como entregado' : 'Marcar como enviado'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
