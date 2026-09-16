/**
 * Provincia según los dos primeros dígitos del código postal español.
 *
 * Sirve para dos cosas: rellenar la provincia sola en el formulario de envío
 * (un campo menos que teclear y ningún error de escritura) y saber qué códigos
 * caen fuera de península.
 */
export const PROVINCIA_POR_CP = {
  '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería',
  '05': 'Ávila', '06': 'Badajoz', '07': 'Baleares', '08': 'Barcelona',
  '09': 'Burgos', '10': 'Cáceres', '11': 'Cádiz', '12': 'Castellón',
  '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña', '16': 'Cuenca',
  '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Gipuzkoa',
  '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León',
  '25': 'Lleida', '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid',
  '29': 'Málaga', '30': 'Murcia', '31': 'Navarra', '32': 'Ourense',
  '33': 'Asturias', '34': 'Palencia', '35': 'Las Palmas', '36': 'Pontevedra',
  '37': 'Salamanca', '38': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia',
  '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel',
  '45': 'Toledo', '46': 'Valencia', '47': 'Valladolid', '48': 'Bizkaia',
  '49': 'Zamora', '50': 'Zaragoza', '51': 'Ceuta', '52': 'Melilla',
};

/** true si el valor tiene forma de código postal español (5 cifras). */
export function cpValido(cp) {
  const limpio = String(cp ?? '').trim();
  return limpio.length === 5 && [...limpio].every(c => c >= '0' && c <= '9');
}

/** Provincia a la que pertenece un código postal, o null si no es válido. */
export function provinciaDeCP(cp) {
  if (!cpValido(cp)) return null;
  return PROVINCIA_POR_CP[String(cp).trim().slice(0, 2)] || null;
}
