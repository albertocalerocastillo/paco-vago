import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './theme/theme.css'
import App from './App.jsx'
import { CarritoProvider } from './hooks/useCarrito.jsx'

// El panel de admin y la tienda se cargan aparte (lazy): la home no arrastra su código.
const AdminComponent = lazy(() => import('./components/pages/Admin/AdminComponent.jsx'))
const TiendaComponent = lazy(() => import('./components/pages/Tienda/TiendaComponent.jsx'))
const CarritoComponent = lazy(() => import('./components/pages/Carrito/CarritoComponent.jsx'))
const ProductoDetalleComponent = lazy(() => import('./components/pages/Tienda/ProductoDetalleComponent.jsx'))

const Cargando = () => (
  <div className="min-h-screen bg-stone-100 text-stone-500 font-serif flex items-center justify-center">
    Cargando…
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/tienda"
            element={<Suspense fallback={<Cargando />}><TiendaComponent /></Suspense>}
          />
          <Route
            path="/tienda/producto/:id"
            element={<Suspense fallback={<Cargando />}><ProductoDetalleComponent /></Suspense>}
          />
          <Route
            path="/tienda/carrito"
            element={<Suspense fallback={<Cargando />}><CarritoComponent /></Suspense>}
          />
          <Route
            path="/admin"
            element={<Suspense fallback={<Cargando />}><AdminComponent /></Suspense>}
          />
        </Routes>
      </CarritoProvider>
    </BrowserRouter>
  </StrictMode>,
)
