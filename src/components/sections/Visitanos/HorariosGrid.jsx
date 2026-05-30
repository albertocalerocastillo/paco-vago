import { HORARIOS_SEMANA } from '../../../data/horarios';

/** Índice del día actual (0 = Lunes). */
function indiceHoy() {
  return (new Date().getDay() + 6) % 7;
}

/* ─────────────────────────────────────────────
   MÓVIL: una fila por día (lista vertical cómoda)
   ───────────────────────────────────────────── */
function DiaFila({ dia, isToday }) {
  const cerradoTodoElDia = !dia.morning && !dia.afternoon;

  return (
    <div
      className={`flex items-center justify-between gap-4 px-3 py-3 rounded-md transition-colors ${
        isToday ? 'bg-amber-500/10 ring-1 ring-amber-400/30' : 'border-b border-stone-800'
      }`}
    >
      <span className={`text-sm font-semibold ${isToday ? 'text-amber-400' : 'text-stone-300'}`}>
        {dia.dia}
        {isToday && <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-400/70">hoy</span>}
      </span>

      <span className="flex flex-col items-end text-sm leading-tight">
        {cerradoTodoElDia && <span className="text-stone-500 italic">Cerrado</span>}
        {dia.morning && (
          <span className={isToday ? 'text-amber-300' : 'text-stone-200'}>
            {dia.morning.open} – {dia.morning.close}
          </span>
        )}
        {dia.afternoon && (
          <span className={isToday ? 'text-amber-300' : 'text-stone-200'}>
            {dia.afternoon.open} – {dia.afternoon.close}
          </span>
        )}
        {dia.morning && !dia.afternoon && (
          <span className="text-stone-500 italic text-xs">tarde cerrado</span>
        )}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORDENADOR: cuadrícula de 7 columnas (tarjetas)
   ───────────────────────────────────────────── */
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
      <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${isToday ? 'text-amber-400' : 'text-stone-400'}`}>
        {dia.short}
        {isToday && <span className="block text-[10px] text-amber-400/80 font-normal normal-case">hoy</span>}
      </div>

      {cerradoTodoElDia && <div className="text-xs italic text-stone-500">Cerrado</div>}

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
    <>
      {/* Móvil y tablet: lista vertical */}
      <div className="flex flex-col lg:hidden">
        {HORARIOS_SEMANA.map((dia, i) => (
          <DiaFila key={dia.dia} dia={dia} isToday={i === hoy} />
        ))}
      </div>

      {/* Ordenador: cuadrícula de 7 columnas */}
      <div className="hidden lg:grid grid-cols-7 gap-2">
        {HORARIOS_SEMANA.map((dia, i) => (
          <DiaCard key={dia.dia} dia={dia} isToday={i === hoy} />
        ))}
      </div>
    </>
  );
}
