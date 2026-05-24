import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrolled } from '../../../hooks/useScrolled';
import { scrollToSection } from '../../../utils/scroll';

const NAV_LINKS = ['historia', 'productos', 'visitanos', 'contacto'];

export default function NavComponent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  const handleNav = (id) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-stone-50/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className={`text-2xl tracking-tight transition-colors ${scrolled ? 'text-stone-900' : 'text-stone-50'}`}>
          <span className="font-bold">Paco Vago</span>
          <span className="text-xs ml-2 font-normal opacity-70">Desde 1924</span>
        </div>

        {/* Links escritorio */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => handleNav(link)}
              className={`hover:text-amber-700 transition-colors ${scrolled ? 'text-stone-700' : 'text-stone-50'}`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Hamburguesa móvil */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className={`md:hidden ${scrolled ? 'text-stone-900' : 'text-stone-50'}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => handleNav(link)}
              className="block w-full text-left px-6 py-4 uppercase text-sm tracking-widest border-b border-stone-100 hover:bg-stone-100"
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
