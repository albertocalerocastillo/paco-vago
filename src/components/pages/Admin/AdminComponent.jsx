import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { useSeo } from '../../../hooks/useSeo';
import GestionProductos from './GestionProductos';
import GestionPedidos from './GestionPedidos';
import GestionDesistimientos from './GestionDesistimientos';
import { Package, Store, Undo2, LogOut } from '../../../theme/icons';

/**
 * Panel de administración (/admin).
 * Login con Supabase Auth y, dentro, dos pantallas: los pedidos que entran por
 * la tienda online y el catálogo de productos.
 */
export default function AdminComponent() {
  useSeo({ ruta: '/admin', titulo: 'Panel | Paco Vago', noindex: true });

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

/* ── Zona privada ─────────────────────────────────────────── */
const SECCIONES = [
  { id: 'pedidos', texto: 'Pedidos', Icono: Package },
  { id: 'productos', texto: 'Productos', Icono: Store },
  { id: 'desistimientos', texto: 'Devoluciones', Icono: Undo2 },
];

/**
 * Pensado para usarse sobre todo desde el MÓVIL, por alguien que no es
 * informático. En el móvil la navegación va abajo (al alcance del pulgar),
 * como en cualquier app; en pantallas grandes, arriba.
 *
 * Las tres secciones se quedan montadas (solo se ocultan) para no perder lo que
 * se estaba haciendo al cambiar de una a otra, y para que los números de
 * pendientes de la navegación estén siempre al día.
 */
function Panel({ sesion }) {
  // Arranca en Pedidos: es lo que hay que mirar cada día.
  const [pantalla, setPantalla] = useState('pedidos');
  const [pendientes, setPendientes] = useState({ pedidos: 0, desistimientos: 0 });
  const salir = () => supabase.auth.signOut();

  const contar = (clave) => (n) => setPendientes(p => (p[clave] === n ? p : { ...p, [clave]: n }));

  const Burbuja = ({ n }) =>
    n > 0 ? (
      <span className="min-w-5 h-5 px-1.5 rounded-full bg-amber-600 text-white text-xs font-sans font-bold leading-5 text-center">
        {n}
      </span>
    ) : null;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-serif pb-20 md:pb-0">
      <header className="bg-stone-900 text-stone-50 sticky top-0 z-30">
        <div className="max-w-6xl 2xl:max-w-[88rem] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <span className="font-bold text-lg shrink-0">Paco Vago <span className="text-stone-400 font-normal">· Panel</span></span>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center gap-1 h-full">
            {SECCIONES.map(({ id, texto, Icono }) => (
              <button
                key={id}
                onClick={() => setPantalla(id)}
                aria-current={pantalla === id ? 'page' : undefined}
                className={`h-full px-4 flex items-center gap-2 border-b-2 transition-colors ${
                  pantalla === id
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-stone-300 hover:text-stone-50'
                }`}
              >
                <Icono size={18} />
                {texto}
                <Burbuja n={pendientes[id] || 0} />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-sm shrink-0">
            <span className="text-stone-400 hidden lg:inline truncate max-w-56">{sesion.user.email}</span>
            <button
              onClick={salir}
              className="flex items-center gap-1.5 px-2 py-2 -mr-2 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl 2xl:max-w-[88rem] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div hidden={pantalla !== 'pedidos'}>
          <Titulo texto="Pedidos" ayuda="Prepara los pedidos pagados y márcalos como enviados." />
          <GestionPedidos onPendientes={contar('pedidos')} />
        </div>
        <div hidden={pantalla !== 'productos'}>
          <Titulo texto="Productos" ayuda="Toca un producto para cambiar su precio, foto o si se ve en la web." />
          <GestionProductos />
        </div>
        <div hidden={pantalla !== 'desistimientos'}>
          <Titulo
            texto="Devoluciones"
            ayuda="Clientes que han desistido de una compra. Contéstales y devuélveles el dinero en 14 días como máximo."
          />
          <GestionDesistimientos onPendientes={contar('desistimientos')} />
        </div>
      </main>

      {/* Navegación del móvil: abajo, al alcance del pulgar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-stone-900 text-stone-300 grid grid-cols-3 pb-[env(safe-area-inset-bottom)]">
        {SECCIONES.map(({ id, texto, Icono }) => (
          <button
            key={id}
            onClick={() => { setPantalla(id); window.scrollTo(0, 0); }}
            aria-current={pantalla === id ? 'page' : undefined}
            className={`relative h-16 flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
              pantalla === id ? 'text-amber-400' : 'hover:text-stone-50'
            }`}
          >
            <span className="relative">
              <Icono size={22} />
              <span className="absolute -top-2 left-4">
                <Burbuja n={pendientes[id] || 0} />
              </span>
            </span>
            {texto}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Titulo({ texto, ayuda }) {
  return (
    <div className="mb-5 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold">{texto}</h1>
      <p className="text-stone-500 text-sm sm:text-base mt-1">{ayuda}</p>
    </div>
  );
}
