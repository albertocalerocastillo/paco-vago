import { useEstadoTienda } from '../../../hooks/useEstadoTienda';

export default function EstadoTiendaBadge() {
  const { abierto, mensaje } = useEstadoTienda();

  return (
    <div
      className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border ${
        abierto
          ? 'bg-green-500/15 border-green-400/40'
          : 'bg-stone-800 border-stone-700'
      }`}
    >
      {/* Punto de estado (verde parpadeante si abierto, gris si cerrado) */}
      <span className="relative flex h-3 w-3">
        {abierto && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            abierto ? 'bg-green-400' : 'bg-stone-500'
          }`}
        ></span>
      </span>

      {/* Etiqueta */}
      <span className="text-sm">
        <span className={`font-bold uppercase tracking-wider ${abierto ? 'text-green-400' : 'text-stone-400'}`}>
          {abierto ? 'Abierto ahora' : 'Cerrado ahora'}
        </span>
        <span className="text-stone-300 ml-2">· {mensaje}</span>
      </span>
    </div>
  );
}
