import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './theme/theme.css'
import App from './App.jsx'

// El panel de admin se carga aparte (lazy): la web pública no arrastra su código.
const AdminComponent = lazy(() => import('./components/pages/Admin/AdminComponent.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen bg-stone-100 text-stone-500 font-serif flex items-center justify-center">
                  Cargando…
                </div>
              }
            >
              <AdminComponent />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
