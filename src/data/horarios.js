/**
 * Horarios estructurados por día.
 * morning/afternoon = null  ➜  ese tramo está cerrado.
 * El orden del array debe ser: Lunes (0), Martes (1), ..., Domingo (6).
 *
 * TEMPORADA: cambia entre 'Horario de verano' y 'Horario de invierno'.
 * Recuerda actualizar también los tramos al cambiar de temporada.
 */
export const TEMPORADA = 'Horario de verano';

export const HORARIOS_SEMANA = [
  {
    dia: 'Lunes',
    short: 'Lun',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '18:00', close: '21:00' }
  },
  {
    dia: 'Martes',
    short: 'Mar',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '18:00', close: '21:00' }
  },
  {
    dia: 'Miércoles',
    short: 'Mié',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '18:00', close: '21:00' }
  },
  {
    dia: 'Jueves',
    short: 'Jue',
    morning:   { open: '9:30',  close: '14:00' },
    afternoon: null
  },
  {
    dia: 'Viernes',
    short: 'Vie',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '18:00', close: '21:00' }
  },
  {
    dia: 'Sábado',
    short: 'Sáb',
    morning:   { open: '10:00', close: '14:00' },
    afternoon: null
  },
  {
    dia: 'Domingo',
    short: 'Dom',
    morning:   null,
    afternoon: null
  }
];
