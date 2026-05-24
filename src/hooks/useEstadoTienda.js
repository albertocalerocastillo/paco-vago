import { useState, useEffect } from 'react';
import { HORARIOS_SEMANA } from '../data/horarios';

/** Convierte "9:30" o "17:30" a minutos desde medianoche. */
function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** JS getDay() devuelve 0=Domingo. Convertimos a 0=Lunes para alinearlo con HORARIOS_SEMANA. */
function diaSemanaLunesPrimero(date) {
  return (date.getDay() + 6) % 7;
}

/** Calcula el estado a partir de la fecha indicada. */
function calcularEstado(ahora) {
  const idxHoy = diaSemanaLunesPrimero(ahora);
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const hoy = HORARIOS_SEMANA[idxHoy];

  // 1) ¿Estamos en el tramo de mañana?
  if (hoy.morning) {
    const open  = aMinutos(hoy.morning.open);
    const close = aMinutos(hoy.morning.close);
    if (minutosAhora >= open && minutosAhora < close) {
      return { abierto: true, mensaje: `Cerramos a las ${hoy.morning.close}` };
    }
  }

  // 2) ¿Estamos en el tramo de tarde?
  if (hoy.afternoon) {
    const open  = aMinutos(hoy.afternoon.open);
    const close = aMinutos(hoy.afternoon.close);
    if (minutosAhora >= open && minutosAhora < close) {
      return { abierto: true, mensaje: `Cerramos a las ${hoy.afternoon.close}` };
    }
  }

  // 3) Cerrados ahora → busco la próxima apertura
  if (hoy.morning && minutosAhora < aMinutos(hoy.morning.open)) {
    return { abierto: false, mensaje: `Abrimos hoy a las ${hoy.morning.open}` };
  }
  if (hoy.afternoon && minutosAhora < aMinutos(hoy.afternoon.open)) {
    return { abierto: false, mensaje: `Abrimos a las ${hoy.afternoon.open}` };
  }

  // 4) Hoy ya no abrimos más → buscar el siguiente día con horario
  for (let i = 1; i <= 7; i++) {
    const idx = (idxHoy + i) % 7;
    const d = HORARIOS_SEMANA[idx];
    if (d.morning || d.afternoon) {
      const tramo = d.morning ?? d.afternoon;
      const nombre = i === 1 ? 'mañana' : `el ${d.dia.toLowerCase()}`;
      return { abierto: false, mensaje: `Abrimos ${nombre} a las ${tramo.open}` };
    }
  }

  return { abierto: false, mensaje: 'Cerrado' };
}

/**
 * Devuelve { abierto, mensaje } recalculándose cada minuto.
 */
export function useEstadoTienda() {
  const [estado, setEstado] = useState(() => calcularEstado(new Date()));

  useEffect(() => {
    const tick = () => setEstado(calcularEstado(new Date()));
    const id = setInterval(tick, 60_000); // recalcular cada minuto
    return () => clearInterval(id);
  }, []);

  return estado;
}
