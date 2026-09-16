import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Check } from '../../../theme/icons';
import { formatoPrecio } from '../../../utils/formato';
import { formatoPeso } from '../../../data/envios';

/**
 * Pedidos de la tienda online (/admin).
 *
 * Está pensada para el trabajo del día: entra, ve lo que hay que preparar, lo
 * prepara y lo marca como enviado. Por eso arranca en "Por preparar" y no en
 * "Todos": la lista completa crece sin parar y casi nunca hace falta.
 *
 * Los pedidos los escribe el webhook de Stripe; aquí solo se cambia el estado.
 */

const VISTAS = [
  { id: 'preparar', texto: 'Por preparar', estados: ['pagado', 'revisar'] },
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

export default function GestionPedidos() {
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

  const marcarEnviado = async (pedido) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: 'enviado', enviado_en: new Date().toISOString() })
      .eq('id', pedido.id);
    if (error) {
      setError(error.message);
      return;
    }
    setPedidos(lista =>
      lista.map(p => (p.id === pedido.id ? { ...p, estado: 'enviado', enviado_en: new Date().toISOString() } : p))
    );
  };

  const deshacerEnviado = async (pedido) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado: 'pagado', enviado_en: null })
      .eq('id', pedido.id);
    if (error) {
      setError(error.message);
      return;
    }
    setPedidos(lista =>
      lista.map(p => (p.id === pedido.id ? { ...p, estado: 'pagado', enviado_en: null } : p))
    );
  };

  const filtro = VISTAS.find(v => v.id === vista);
  const visibles = filtro?.estados
    ? pedidos.filter(p => filtro.estados.includes(p.estado))
    : pedidos;

  const porPreparar = pedidos.filter(p => ['pagado', 'revisar'].includes(p.estado)).length;

  if (cargando) return <p className="text-stone-500">Cargando pedidos…</p>;

  return (
    <div>
      {error && (
        <p className="mb-4 text-red-700 bg-red-50 border-l-4 border-red-700 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {VISTAS.map(v => (
          <button
            key={v.id}
            onClick={() => setVista(v.id)}
            className={`px-4 py-2 text-sm uppercase tracking-wider border transition-colors ${
              vista === v.id
                ? 'bg-stone-900 text-stone-50 border-stone-900'
                : 'bg-white text-stone-600 border-stone-300 hover:border-amber-700'
            }`}
          >
            {v.texto}
            {v.id === 'preparar' && porPreparar > 0 && (
              <span className="ml-2 bg-amber-600 text-white rounded-full px-2 py-0.5 text-xs">
                {porPreparar}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={() => { setCargando(true); cargar(); }}
          className="px-4 py-2 text-sm uppercase tracking-wider border border-stone-300 bg-white text-stone-500 hover:border-amber-700 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {visibles.length === 0 ? (
        <p className="text-stone-500">
          {vista === 'preparar'
            ? 'No hay pedidos pendientes de preparar. Todo al día.'
            : 'No hay pedidos en esta lista.'}
        </p>
      ) : (
        <div className="space-y-4">
          {visibles.map(p => (
            <Pedido
              key={p.id}
              pedido={p}
              onEnviado={() => marcarEnviado(p)}
              onDeshacer={() => deshacerEnviado(p)}
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

  return (
    <article className={`bg-white border p-4 ${p.estado === 'revisar' ? 'border-red-400' : 'border-stone-200'}`}>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="font-bold text-lg tracking-wide">{p.referencia}</span>
        <span className={`text-xs uppercase tracking-wider border px-2 py-0.5 ${etiqueta.clase}`}>
          {etiqueta.texto}
        </span>
        <span className="text-sm text-stone-400">{fecha(p.creado_en)}</span>
        <span className="ml-auto text-xl font-bold">{formatoPrecio(p.total)}</span>
      </div>

      {p.estado === 'revisar' && (
        <p className="mb-3 text-sm text-red-800 bg-red-50 border-l-4 border-red-700 px-3 py-2">
          Este pedido necesita una mirada antes de prepararlo: o la dirección queda fuera de
          península, o las cuentas no cuadran con lo que se cobró. Compruébalo antes de enviarlo.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Enviar a</p>
          <p className="font-semibold">{p.nombre}</p>
          <p className="text-stone-600">
            {d.calle}{d.piso ? `, ${d.piso}` : ''}<br />
            {d.cp} {d.localidad} ({d.provincia})
          </p>
          <p className="text-stone-600 mt-1">{p.telefono}</p>
          <p className="text-stone-500">{p.email}</p>

          <button
            onClick={copiar}
            className="mt-2 text-xs uppercase tracking-wider border border-stone-300 px-3 py-1.5 hover:border-amber-700 transition-colors"
          >
            {copiado ? 'Copiado ✓' : 'Copiar dirección'}
          </button>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Qué lleva</p>
          <ul className="space-y-0.5">
            {(p.lineas || []).map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>{l.cantidad} × {l.nombre}</span>
                <span className="text-stone-500 shrink-0">{formatoPrecio(l.importe)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-stone-200 text-stone-600 space-y-0.5">
            <p className="flex justify-between">
              <span>Envío {p.peso_total ? `(${formatoPeso(p.peso_total)})` : ''}</span>
              <span>{formatoPrecio(p.porte)}</span>
            </p>
            <p className="flex justify-between font-semibold text-stone-900">
              <span>Total cobrado</span>
              <span>{formatoPrecio(p.total)}</span>
            </p>
          </div>
        </div>
      </div>

      {p.nota && (
        <p className="mt-3 text-sm bg-amber-50 border-l-4 border-amber-500 px-3 py-2">
          <strong>Nota del cliente:</strong> {p.nota}
        </p>
      )}

      {p.quiere_factura && (
        <p className="mt-3 text-sm bg-stone-100 border-l-4 border-stone-400 px-3 py-2">
          <strong>Pide factura</strong> · NIF {p.nif}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-3">
        {p.estado === 'enviado' ? (
          <>
            <span className="text-sm text-stone-500">Enviado el {fecha(p.enviado_en)}</span>
            <button
              onClick={onDeshacer}
              className="text-xs text-stone-400 hover:text-red-700 uppercase tracking-wider transition-colors"
            >
              Deshacer
            </button>
          </>
        ) : (
          <button
            onClick={onEnviado}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 px-5 py-2.5 uppercase text-sm tracking-widest transition-colors"
          >
            <Check size={16} /> Marcar como enviado
          </button>
        )}
      </div>
    </article>
  );
}
