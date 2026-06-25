import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import GestionProductos from './GestionProductos';

/**
 * Panel de administración (/admin).
 * Fase 2c.1: login con Supabase Auth + zona privada (de momento un placeholder).
 * La gestión de productos se añadirá en los siguientes pasos.
 */
export default function AdminComponent() {
  const { sesion, cargando } = useAuth();

  if (cargando) {
    return <Centrado>Cargando…</Centrado>;
  }

  if (!supabase) {
    return (
      <Centrado>
        <p className="text-red-700">
          Supabase no está configurado. Falta el archivo <code>.env</code> con las credenciales.
        </p>
      </Centrado>
    );
  }

  return sesion ? <Panel sesion={sesion} /> : <Login />;
}

/* ── Contenedor centrado reutilizable ─────────────────────── */
function Centrado({ children }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-serif flex items-center justify-center px-6">
      {children}
    </div>
  );
}

/* ── Pantalla de login ────────────────────────────────────── */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setEnviando(false);
    if (error) setError('Email o contraseña incorrectos.');
  };

  return (
    <Centrado>
      <form onSubmit={entrar} className="w-full max-w-sm bg-white border border-stone-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Paco Vago</h1>
        <p className="text-stone-500 text-sm mb-6">Acceso al panel de gestión</p>

        <label className="block text-sm text-stone-600 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-stone-300 px-3 py-2 mb-4 focus:outline-none focus:border-amber-700"
        />

        <label className="block text-sm text-stone-600 mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-stone-300 px-3 py-2 mb-4 focus:outline-none focus:border-amber-700"
        />

        {error && <p className="text-red-700 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-stone-900 hover:bg-amber-700 disabled:opacity-60 text-stone-50 py-3 uppercase text-sm tracking-widest transition-colors"
        >
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </Centrado>
  );
}

/* ── Zona privada (placeholder hasta 2c.2) ────────────────── */
function Panel({ sesion }) {
  const salir = () => supabase.auth.signOut();

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-serif">
      <header className="bg-stone-900 text-stone-50 px-6 py-4 flex items-center justify-between">
        <span className="font-bold">Paco Vago · Panel</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-stone-300 hidden sm:inline">{sesion.user.email}</span>
          <button onClick={salir} className="hover:text-amber-400 uppercase tracking-widest transition-colors">
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Productos</h1>
        <p className="text-stone-600 mb-8">
          Edita el nombre, la descripción o si un producto se muestra en la web. Los cambios
          se guardan al instante y aparecen en la tienda.
        </p>
        <GestionProductos />
      </main>
    </div>
  );
}
