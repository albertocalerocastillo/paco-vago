import { useSeo } from './hooks/useSeo';
import NavComponent from './components/layout/Nav/NavComponent';
import FooterComponent from './components/layout/Footer/FooterComponent';
import HeroComponent from './components/sections/Hero/HeroComponent';
import HistoriaComponent from './components/sections/Historia/HistoriaComponent';
import LocalComponent from './components/sections/Local/LocalComponent';
import ProductosComponent from './components/sections/Productos/ProductosComponent';
import ComprarOnlineComponent from './components/sections/ComprarOnline/ComprarOnlineComponent';
import GaleriaComponent from './components/sections/Galeria/GaleriaComponent';
import VisitanosComponent from './components/sections/Visitanos/VisitanosComponent';
import SiguenosComponent from './components/sections/Siguenos/SiguenosComponent';
import FloatingActionsComponent from './components/ui/FloatingActions/FloatingActionsComponent';

export default function App() {
  // Sin argumentos: usa el titulo y la descripcion por defecto, que son los de
  // la portada. El canonical apunta a la raiz.
  useSeo({ ruta: '/' });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      <NavComponent />
      <HeroComponent />
      {/* Comprar va antes que la historia: quien entra buscando el aceite lo
          encuentra sin bajar, y quien viene a conocer la tienda sigue leyendo. */}
      <ComprarOnlineComponent />
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
