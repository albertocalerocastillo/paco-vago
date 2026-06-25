import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './theme/theme.css'
import App from './App.jsx'
import AdminComponent from './components/pages/Admin/AdminComponent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminComponent />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
