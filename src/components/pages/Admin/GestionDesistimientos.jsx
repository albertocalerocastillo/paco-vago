import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Check } from '../../../theme/icons';

/**
 * Desistimientos que llegan por /legal/desistir (/admin).
 *
 * Hay que contestar a cada uno por email confirmando que se ha recibido y
 * explicando cómo devolver el producto, y reembolsar en 14 días como máximo.
 * Por eso el plazo se enseña bien grande.
 */

const fecha = (iso) =>
  iso
    ? new Date(iso).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '';

const DIA = 24 * 60 * 60 * 1000;

export default function GestionDesistimientos() {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('desistimientos')
      .select('*, pedidos(referencia, total, email)')
      .order('creado_en', { ascending: false });
    setCargando(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setLista(data || []);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const marcar = async (d, tramitado) => {
    const cambios = { estado: tramitado ? 'tramitado' : 'recibido', tramitado_en: tramitado ? new Date().toISOString() : null };
    const { error } = await supabase.from('desistimientos').update(cambios).eq('id', d.id);
    if (error) {
      setError(error.message);
      return;
    }
    setLista(l => l.map(x => (x.id === d.id ? { ...x, ...cambios } : x)));
  };

  if (cargando) return <p className="text-stone-500">Cargando…</p>;

  return (
    <div>
      {error && (
        <p className="mb-4 text-red-700 bg-red-50 border-l-4 border-red-700 px-3 py-2 text-sm">{error}</p>
      )}
      {lista.length === 0 ? (
        <p className="text-stone-500">No ha llegado ningún desistimiento.</p>
      ) : (
        <div className="space-y-4">
          {lista.map(d => {
            const limite = new Date(new Date(d.creado_en).getTime() + 14 * DIA);
            const quedan = Math.ceil((limite - Date.now()) / DIA);
            const pendiente = d.estado === 'recibido';
            return (
              <article key={d.id} className={`bg-white border p-4 ${pendiente ? 'border-amber-500' : 'border-stone-200'}`}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-bold text-lg tracking-wide">{d.referencia}</span>
                  <span className="text-sm text-stone-400">{fecha(d.creado_en)}</span>
                  {pendiente && (
                    <span className={`ml-auto text-sm font-semibold ${quedan <= 3 ? 'text-red-700' : 'text-amber-800'}`}>
                      Reembolsar antes del {limite.toLocaleDateString('es-ES')} ({quedan > 0 ? `quedan ${quedan} días` : 'plazo vencido'})
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">{d.nombre}</p>
                    <p className="text-stone-500">{d.email}</p>
                  </div>
                  <div>
                    <p>
                      Pedido <strong>{d.pedido_ref}</strong>{' '}
                      {d.pedidos ? (
                        <span className="text-green-700">✓ existe</span>
                      ) : (
                        <span className="text-red-700">⚠ no encontrado: compruébalo con el cliente</span>
                      )}
                    </p>
                    <p className="text-stone-600">Devuelve: {d.productos || 'el pedido entero'}</p>
                  </div>
                </div>
                {d.comentario && (
                  <p className="mt-3 text-sm bg-amber-50 border-l-4 border-amber-500 px-3 py-2">
                    <strong>Comentario:</strong> {d.comentario}
                  </p>
                )}
                <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-3">
                  {pendiente ? (
                    <button
                      onClick={() => marcar(d, true)}
                      className="inline-flex items-center gap-2 bg-stone-900 hover:bg-amber-700 text-stone-50 px-5 py-2.5 uppercase text-sm tracking-widest transition-colors"
                    >
                      <Check size={16} /> Marcar como tramitado
                    </button>
                  ) : (
                    <>
                      <span className="text-sm text-stone-500">Tramitado el {fecha(d.tramitado_en)}</span>
                      <button
                        onClick={() => marcar(d, false)}
                        className="text-xs text-stone-400 hover:text-red-700 uppercase tracking-wider transition-colors"
                      >
                        Deshacer
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
