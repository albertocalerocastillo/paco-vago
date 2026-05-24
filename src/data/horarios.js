/**
 * Horarios estructurados por día.
 * morning/afternoon = null  ➜  ese tramo está cerrado.
 * El orden del array debe ser: Lunes (0), Martes (1), ..., Domingo (6).
 */
export const HORARIOS_SEMANA = [
  {
    dia: 'Lunes',
    short: 'Lun',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '17:30', close: '20:30' }
  },
  {
    dia: 'Martes',
    short: 'Mar',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '17:30', close: '20:30' }
  },
  {
    dia: 'Miércoles',
    short: 'Mié',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '17:30', close: '20:30' }
  },
  {
    dia: 'Jueves',
    short: 'Jue',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: null
  },
  {
    dia: 'Viernes',
    short: 'Vie',
    morning:   { open: '9:30',  close: '13:30' },
    afternoon: { open: '17:30', close: '20:30' }
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
