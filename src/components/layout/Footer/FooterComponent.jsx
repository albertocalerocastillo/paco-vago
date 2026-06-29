import { Link } from 'react-router-dom';

export default function FooterComponent() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <img
          src="/logo.png"
          alt="Paco Vago · Desde 1924"
          className="h-24 w-24 rounded-full object-cover ring-1 ring-amber-700/40 shadow-lg mx-auto mb-5"
        />
        <div className="text-3xl font-bold text-stone-50 mb-2">Paco Vago</div>
        <div className="text-sm uppercase tracking-widest mb-6">Puerta de Sevilla · Carmona</div>
        <div className="w-16 h-px bg-amber-700 mx-auto mb-6"></div>
        <p className="text-sm mb-2">Desde 1924 · Cuatro generaciones a tu servicio</p>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs mt-6">
          <Link to="/legal/aviso-legal" className="hover:text-amber-500 transition-colors">Aviso legal</Link>
          <Link to="/legal/privacidad" className="hover:text-amber-500 transition-colors">Privacidad</Link>
          <Link to="/legal/condiciones-de-venta" className="hover:text-amber-500 transition-colors">Condiciones de venta</Link>
          <Link to="/legal/devoluciones" className="hover:text-amber-500 transition-colors">Devoluciones</Link>
        </nav>

        <p className="text-xs text-stone-500 mt-6">
          © {new Date().getFullYear()} Paco Vago Puerta Sevilla. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
