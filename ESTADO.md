# Estado del proyecto — Paco Vago (web)

> Documento de continuación. Si abres un chat nuevo, léelo para ponerte al día.
> Última actualización: junio 2026.

## Qué es

Web **informativa** (de momento) de **Paco Vago**, tienda centenaria (desde 1924) en la
**Puerta de Sevilla, Carmona (Sevilla)**. Lema: *"La tienda que tiene de todo, y si no lo
tienen, se lo inventan o te lo consiguen"*. Es "la tienda que tiene de todo".

- **Carpeta del proyecto:** `C:\Users\alberto.calero\paco.vago`
- **GitHub:** https://github.com/albertocalerocastillo/paco-vago
- **Web en producción:** https://paco-vago.vercel.app (Vercel, plan gratis Hobby)
- **Despliegue:** automático con cada `git push` a `master`.

## Stack

- **React + Vite 8** (parser oxc, estricto con JSX) + **Tailwind CSS v4** (`@tailwindcss/vite`)
- **lucide-react** para iconos
- JavaScript (NO TypeScript)
- Sin backend (web estática por ahora)

### Cuidado con Vite 8 / oxc (parser estricto)
- Cerrar etiquetas auto-cerradas con `/>`.
- Atributos booleanos sin `=""` (p. ej. `allowFullScreen`, no `allowFullScreen=""`).
- `lucide-react` v1.x **no trae iconos de marcas** (Instagram, WhatsApp): se usan SVG propios.

## Estructura (estilo tms.web, "componente por carpeta")

```
src/
├── theme/
│   ├── theme.css      → import tailwind + tokens (@theme) + estilos base + animación .reveal
│   └── icons.js       → catálogo ÚNICO de iconos (todo se importa de aquí, no de lucide directo)
├── components/
│   ├── layout/        → Nav, Footer
│   ├── sections/      → Hero, Historia, Local, Productos, Galeria, Visitanos, Contacto
│   └── ui/            → Logo, PhoneButton, WhatsAppButton, WhatsAppIcon, InstagramIcon,
│                        FloatingActions, Reveal (fade-in scroll), Lightbox (visor foto)
├── data/              → categorias.js, galeria.js, horarios.js, contacto.js
├── hooks/             → useScrolled.js, useEstadoTienda.js
├── utils/             → scroll.js
├── App.jsx            → contenedor fino (solo ensambla las secciones)
└── main.jsx
```

- **Fotos:** en `public/fotos/`. Nombrar SIN ñ ni acentos (la ñ rompe URLs).
- **Modelo de datos (preparado para e-commerce):** cada categoría en `data/categorias.js`
  tiene `productos: [{ src, nombre, desc }]`. Solo faltará añadir `precio` + botón comprar.
- **Galería automática:** `data/galeria.js` se construye SOLO con todas las fotos de los
  productos (intercaladas). No hay que mantener lista aparte.

## Secciones de la web

1. **Nav** — logo (sello PV) + enlaces, menú hamburguesa en móvil.
2. **Hero** — foto de la tienda de fondo + lema.
3. **Historia** — timeline 1924→2025 + retratos de Paco y José Antonio (foto reportaje
   La Voz del Sur, con crédito). Fotos ampliables (lightbox).
4. **El local** — fachada + trío interior (panorámica, utensilios, maderas, ampliables) +
   bloque "🎬 Han rodado aquí" (Manolete con Penélope Cruz y Adrien Brody, La Peste de
   Movistar+, La chica invisible). OJO: las letras de la fachada ("Aceites/Aceitunas/
   Cooperativa Olivarera") NO son de una cooperativa histórica — son del rodaje de Manolete,
   la familia las conservó quitando "cordobesa". (Dato confirmado por el dueño).
5. **Productos ("Tenemos de todo")** — 9 categorías en tarjetas. Al pulsar una con fotos se
   abre un PANEL con carrusel de productos (dedo/flechas) + lightbox al pulsar foto.
6. **Galería ("La tienda por dentro")** — carrusel automático + lightbox.
7. **Visítanos** — dirección, teléfono, horario (lista en móvil / cuadrícula 7 días en
   escritorio), badge ABIERTO/CERRADO en tiempo real, mapa.
8. **Contacto** — Instagram + TikTok.
9. **Footer** — logo + datos.
10. **Botones flotantes** — WhatsApp (615 323 072, con mensaje predefinido) + teléfono fijo.

## Datos del negocio

- **Teléfono (fijo):** 954 14 08 71
- **WhatsApp (móvil):** 615 323 072
- **Horario:** L-V 9:30-13:30 y 17:30-20:30 · Sáb 10:00-14:00 · Jueves tarde y domingos cerrado
- **Instagram:** @paco_vago_puerta_sevilla · **TikTok:** @paco.vago.puerta
- **Logo oficial:** sello "Paco Vago / Desde 1924" con dibujo de la Puerta de Sevilla
  (lo hizo el dueño con ChatGPT; está en `public/fotos/`… realmente como `logo.png`,
  `logo-grande.png`, `favicon.png`). Versión "PV" propia descartada.

## Categorías de producto (9) — estado de fotos

- ✅ **Gourmet** — mostrador, patés de mar, AOVE de Carmona, ibéricos, miel, jalea/polen,
  aceitunas, especias, infusiones, legumbres, conservas (Albo/Ortiz/Balea/Tejero)
- ✅ **Bodega** — licores artesanos de Carmona (cremas, limonchelo…)
- ✅ **Golosinas** — chuches a granel
- ✅ **Moda y Piel** — sombreros, gorras, bolsos de piel, marroquinería
- ✅ **Mercería y Hogar** — droguería/control de plagas + ECOJIN (limpiador biodegradable, en texto)
- ✅ **Automoción** — gama Gorilux
- ⬜ **Artesanía** — SIN foto aún (palma, souvenirs)
- ⬜ **Perfumería** — SIN foto aún

## Flujo de trabajo acordado

- **NO hacer `git push` sin que el usuario lo confirme.** Hacer cambios + `npm run build`
  para verificar, dejar en local, y AVISAR. El usuario dice "súbelo" cuando quiere desplegar.
- Antes de cada decisión, **ofrecer opciones marcando la (Recomendado)**.
- Descripciones de producto: cortas y comerciales (no volcar todo el texto del tío; coger
  lo más llamativo + "…"). El usuario pasa info de Instagram; mezclar con toque de marketing.
- No inventar datos (marcas, certificaciones). Acreditar fotos de prensa.
- Verificar en navegador real las animaciones `.reveal` (el preview headless no las dispara).

## Pendientes / hoja de ruta

- 🔑 **Google My Business** — cambiar el botón "Sitio web" de la ficha (con ⭐4,5/122 reseñas)
  a la URL. Es lo que MÁS posiciona. Pendiente de que el tío dé acceso a la cuenta.
- 🔗 Poner la URL en las bios de Instagram y TikTok (ayuda a que Google rastree más).
- 📸 Fotos de **Artesanía** y **Perfumería** (las 2 categorías sin foto).
- ✍️ Posible repaso de marketing de todas las descripciones de categoría.
- 🌐 **Dominio propio** (~10€/año, lo paga el tío) — opcional, para más adelante.
- 🛒 **Tienda online (futuro, por fases)**: Fase 2 = catálogo con base de datos
  (**Supabase** gratis: BD PostgreSQL + auth + storage). Fase 3 = pagos (Stripe/Redsys,
  comisión por venta) + dominio + textos legales (RGPD, condiciones de venta, devoluciones).
  Estrategia: construir/validar gratis, pagar solo lo necesario cuando haya tracción.

## SEO

- Meta tags, Open Graph (imagen `tienda.jpg`), datos estructurados (Store) en `index.html`.
- `sitemap.xml` y `robots.txt` en `public/`. Verificado en Google Search Console.
- Aparece 2º en Google buscando "paco vago". Favicon "PV"/logo ya se muestra en resultados.
