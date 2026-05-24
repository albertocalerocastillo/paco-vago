import { HORARIOS_SEMANA } from '../../../data/horarios';

/** Índice del día actual (0 = Lunes). */
function indiceHoy() {
  return (new Date().getDay() + 6) % 7;
}

/**
 * Render de un único bloque (día).
 */
function DiaCard({ dia, isToday }) {
  const cerradoTodoElDia = !dia.morning && !dia.afternoon;
  const soloManyana = dia.morning && !dia.afternoon;

  return (
    <div
      className={`flex flex-col items-center text-center py-4 px-2 rounded-md border transition-all ${
        isToday
          ? 'bg-amber-500/10 border-amber-400/50 ring-1 ring-amber-400/30'
          : 'bg-stone-800/60 border-stone-700/60'
      } ${cerradoTodoElDia ? 'opacity-50' : ''}`}
    >
      {/* Día */}
      <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${isToday ? 'text-amber-400' : 'text-stone-400'}`}>
        {dia.short}
        {isToday && <span className="block text-[10px] text-amber-400/80 font-normal normal-case">hoy</span>}
      </div>

      {/* Tramos horarios */}
      {cerradoTodoElDia && (
        <div className="text-xs italic text-stone-500">Cerrado</div>
      )}

      {dia.morning && (
        <div className="text-xs text-stone-200 mb-1.5">
          <div>{dia.morning.open}</div>
          <div className="text-stone-500">—</div>
          <div>{dia.morning.close}</div>
        </div>
      )}

      {dia.afternoon && (
        <div className="text-xs text-stone-200 mt-2 pt-2 border-t border-stone-700/50 w-full">
          <div>{dia.afternoon.open}</div>
          <div className="text-stone-500">—</div>
          <div>{dia.afternoon.close}</div>
        </div>
      )}

      {soloManyana && !cerradoTodoElDia && (
        <div className="text-[10px] italic text-stone-500 mt-2 pt-2 border-t border-stone-700/50 w-full">
          tarde cerrado
        </div>
      )}
    </div>
  );
}

export default function HorariosGrid() {
  const hoy = indiceHoy();

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {HORARIOS_SEMANA.map((dia, i) => (
        <DiaCard key={dia.dia} dia={dia} isToday={i === hoy} />
      ))}
    </div>
  );
}
