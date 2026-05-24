export default function FooterComponent() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-3xl font-bold text-stone-50 mb-2">Paco Vago</div>
        <div className="text-sm uppercase tracking-widest mb-6">Puerta de Sevilla · Carmona</div>
        <div className="w-16 h-px bg-amber-700 mx-auto mb-6"></div>
        <p className="text-sm mb-2">Desde 1924 · Cuatro generaciones a tu servicio</p>
        <p className="text-xs text-stone-500 mt-6">
          © {new Date().getFullYear()} Paco Vago Puerta Sevilla. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
