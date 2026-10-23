import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

/**
 * Modo DEMO del panel, solo para desarrollo: `npm run demo` → http://localhost:5174/admin
 *
 * Sustituye el cliente de Supabase por uno de mentira (demo/supabase-demo.js):
 * entra al panel sin contraseña, con pedidos inventados, y nada de lo que se
 * toque se guarda en ningún sitio. Sirve para revisar el diseño en todos los
 * tamaños de pantalla sin usar credenciales reales ni tocar datos de clientes.
 * No forma parte de la web publicada (el build normal usa vite.config.js).
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^(\.\.\/)+lib\/supabase(\.js)?$/,
        replacement: fileURLToPath(new URL('./demo/supabase-demo.js', import.meta.url)),
      },
    ],
  },
  server: { port: 5174 },
})
