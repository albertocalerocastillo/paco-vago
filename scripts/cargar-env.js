import { readFileSync } from 'node:fs';

/**
 * Lee el .env a mano.
 *
 * Los scripts de esta carpeta se lanzan con `node` pelado, sin Vite ni Vercel
 * delante, así que nadie les carga las variables de entorno. Se leen primero
 * de `.env.local` y luego de `.env`: lo que ya esté puesto no se pisa, igual
 * que hacen las herramientas.
 */
export function cargarEnv(ficheros = ['.env.local', '.env']) {
  for (const fichero of ficheros) {
    let texto;
    try {
      texto = readFileSync(fichero, 'utf8');
    } catch {
      continue; // no existe: no pasa nada
    }
    for (const linea of texto.split('\n')) {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith('#')) continue;
      const corte = limpia.indexOf('=');
      if (corte < 1) continue;
      const clave = limpia.slice(0, corte).trim();
      if (!process.env[clave]) process.env[clave] = limpia.slice(corte + 1).trim();
    }
  }
}
