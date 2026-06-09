import NavComponent from './components/layout/Nav/NavComponent';
import FooterComponent from './components/layout/Footer/FooterComponent';
import HeroComponent from './components/sections/Hero/HeroComponent';
import HistoriaComponent from './components/sections/Historia/HistoriaComponent';
import LocalComponent from './components/sections/Local/LocalComponent';
import ProductosComponent from './components/sections/Productos/ProductosComponent';
import GaleriaComponent from './components/sections/Galeria/GaleriaComponent';
import VisitanosComponent from './components/sections/Visitanos/VisitanosComponent';
import SiguenosComponent from './components/sections/Siguenos/SiguenosComponent';
import FloatingActionsComponent from './components/ui/FloatingActions/FloatingActionsComponent';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <NavComponent />
      <HeroComponent />
      <HistoriaComponent />
      <LocalComponent />
      <ProductosComponent />
      <GaleriaComponent />
      <VisitanosComponent />
      <SiguenosComponent />
      <FooterComponent />
      <FloatingActionsComponent />
    </div>
  );
}
