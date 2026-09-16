import { cpValido, provinciaDeCP } from './provincias.js';
import { zonaFueraDePeninsula } from './envios.js';

/**
 * Dirección de envío: limpieza y validación.
 *
 * Vive aquí, y no dentro del formulario, porque el servidor tiene que validar
 * exactamente lo mismo. Lo que comprueba el navegador es una cortesía para el
 * cliente; lo que decide es la comprobación del servidor, que es la única que
 * nadie puede saltarse.
 */

const LIMITES = {
  nombre: 80,
  calle: 120,
  piso: 40,
  localidad: 60,
  nif: 12,
  nota: 300,
};

const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

/** Comprueba la letra de un DNI o NIE. Los CIF de empresa se aceptan por forma. */
export function nifValido(valor) {
  const nif = String(valor ?? '').trim().toUpperCase().replace(/[\s-]/g, '');
  if (nif.length !== 9) return false;

  const inicial = nif[0];
  const cuerpo = nif.slice(0, 8);
  const control = nif[8];

  // NIE: la X, Y o Z valen como 0, 1 y 2.
  if ('XYZ'.includes(inicial)) {
    const numero = 'XYZ'.indexOf(inicial) + cuerpo.slice(1);
    return LETRAS_DNI[Number(numero) % 23] === control;
  }

  // DNI: ocho cifras y letra de control.
  if ([...cuerpo].every(c => c >= '0' && c <= '9')) {
    return LETRAS_DNI[Number(cuerpo) % 23] === control;
  }

  // CIF de sociedad: letra inicial válida, siete cifras y un control.
  if ('ABCDEFGHJNPQRSUVW'.includes(inicial)) {
    const cifras = nif.slice(1, 8);
    return [...cifras].every(c => c >= '0' && c <= '9');
  }

  return false;
}

/** Recorta espacios y longitudes. Devuelve siempre el mismo molde de objeto. */
export function limpiarDireccion(d) {
  const texto = (v, max) => String(v ?? '').trim().slice(0, max);
  return {
    nombre: texto(d?.nombre, LIMITES.nombre),
    calle: texto(d?.calle, LIMITES.calle),
    piso: texto(d?.piso, LIMITES.piso),
    cp: texto(d?.cp, 5),
    localidad: texto(d?.localidad, LIMITES.localidad),
    nota: texto(d?.nota, LIMITES.nota),
    quiereFactura: d?.quiereFactura === true,
    nif: texto(d?.nif, LIMITES.nif).toUpperCase(),
  };
}

/**
 * Devuelve { errores, ok }. `errores` lleva un mensaje por campo que falle,
 * listo para enseñar debajo del campo correspondiente.
 */
export function validarDireccion(entrada) {
  const d = limpiarDireccion(entrada);
  const errores = {};

  if (d.nombre.length < 3) errores.nombre = 'Escribe el nombre y los apellidos de quien recibe el pedido.';
  if (d.calle.length < 5) errores.calle = 'Escribe la calle y el número.';
  if (d.localidad.length < 2) errores.localidad = 'Escribe la localidad.';

  if (!cpValido(d.cp)) {
    errores.cp = 'El código postal son 5 cifras.';
  } else if (!provinciaDeCP(d.cp)) {
    errores.cp = 'Ese código postal no existe en España.';
  } else {
    const zona = zonaFueraDePeninsula(d.cp);
    if (zona) errores.cp = `Todavía no enviamos a ${zona} desde la web.`;
  }

  if (d.quiereFactura && !nifValido(d.nif)) {
    errores.nif = 'Revisa el NIF: parece que falta una cifra o la letra no cuadra.';
  }

  return { errores, ok: Object.keys(errores).length === 0, direccion: d };
}
