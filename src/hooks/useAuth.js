import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Gestiona la sesión de Supabase Auth para el panel de admin.
 * Devuelve { sesion, cargando }:
 *  - sesion: objeto de sesión si hay alguien logueado, null si no.
 *  - cargando: true mientras se comprueba la sesión inicial.
 */
export function useAuth() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!supabase) { setCargando(false); return; }

    // Sesión actual al cargar
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargando(false);
    });

    // Reacciona a login/logout en vivo
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSesion(nuevaSesion);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { sesion, cargando };
}
