import NavComponent from './components/layout/Nav/NavComponent';
import FooterComponent from './components/layout/Footer/FooterComponent';
import HeroComponent from './components/sections/Hero/HeroComponent';
import HistoriaComponent from './components/sections/Historia/HistoriaComponent';
import ProductosComponent from './components/sections/Productos/ProductosComponent';
import VisitanosComponent from './components/sections/Visitanos/VisitanosComponent';
import ContactoComponent from './components/sections/Contacto/ContactoComponent';
import WhatsAppButtonComponent from './components/ui/WhatsAppButton/WhatsAppButtonComponent';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
      <NavComponent />
      <HeroComponent />
      <HistoriaComponent />
      <ProductosComponent />
      <VisitanosComponent />
      <ContactoComponent />
      <FooterComponent />
      <WhatsAppButtonComponent />
    </div>
  );
}
