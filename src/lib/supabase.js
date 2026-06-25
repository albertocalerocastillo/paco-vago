// Cliente único de Supabase para toda la web.
// Las credenciales vienen de variables de entorno (.env, ver .env.example).
// La anon key es pública y segura en el frontend: la protege la RLS de la BD.
//
// Si faltan las variables (p. ej. producción sin configurar todavía), NO se
// lanza error: `supabase` queda en null y la web sigue funcionando con el
// catálogo estático (data/categorias.js) como red de seguridad.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

if (!supabase) {
  console.warn(
    'Supabase no configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'La web usará el catálogo estático.'
  )
}
