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
8. **Síguenos** (id `redes`, antes "Contacto" + "Videos", ahora UNIFICADAS) — carrusel de
   vídeos (TikTok + Reels de Instagram, enlaces ligeros, NO embeds) con su icono de red +
   botones de seguir Instagram y TikTok. Datos en `data/videos.js` ({url, red, portada}).
   Para añadir vídeo: nueva línea con red 'tiktok'|'instagram'.
9. **Footer** — logo + datos.
10. **Botones flotantes** — WhatsApp (615 323 072, con mensaje predefinido) + teléfono fijo.

NOTA: el menú (NAV_LINKS en Nav) usa el texto como id de ancla. Ahora: historia, productos,
visitanos, **redes**.

## Datos del negocio

- **Teléfono (fijo):** 954 14 08 71
- **WhatsApp (móvil):** 615 323 072
- **Horario (VERANO, en data/horarios.js + TEMPORADA):** L-V mañanas 9:30-13:30 · tardes
  18:00-21:00 (Lun/Mar/Mié/Vie) · Jueves 9:30-14:00 (tarde cerrado) · Sáb 10:00-14:00 ·
  Domingo cerrado. OJO: en invierno cambian las tardes (17:30-20:30) y jueves (hasta 13:30);
  actualizar `data/horarios.js`, `TEMPORADA` y el `openingHoursSpecification` de `index.html`.
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
- ✅ **Aire libre** — navajas y afilado (camping, playa, juguetes)
- ✅ **Perfumería** — perfumería/cosmética, afeitado, higiene personal
- ⬜ **Artesanía** — SIN foto aún (palma, souvenirs) ← ÚNICA categoría que falta

## 🛒 BACKEND / TIENDA ONLINE — Fase 2 (EN CURSO)

> Trabajo en la **rama `feature/backend`** (NO en master, para no tocar producción).
> El catálogo de la web sigue en `data/categorias.js` (estático) hasta que migremos.

**Decidido:** empezar por la base sólida (Supabase gratis: BD + auth + storage).
**Hecho hasta ahora:**
- Rama `feature/backend` creada.
- Esquema SQL preparado en [`supabase/schema.sql`](supabase/schema.sql): tablas
  `categorias` y `productos` (con `precio` nullable para el futuro, `disponible`, RLS de
  lectura pública). Aún NO ejecutado en Supabase.

**Pendiente (siguiente sesión), por orden:**
1. ✅ Proyecto `paco-vago` creado en supabase.com (región Europe, plan Free).
   Project ref: `krjnhnevzpsxpjsnpbjm` → URL `https://krjnhnevzpsxpjsnpbjm.supabase.co`.
2. ✅ `supabase/schema.sql` ejecutado (tablas `categorias` + `productos` + RLS). Se añadió
   columna `tags text[]` a `categorias` (chips de la tarjeta).
3. ✅ Credenciales en `.env` local (URL + anon key). El `.env` está en `.gitignore`
   (plantilla en `.env.example`). FALTA ponerlas en Vercel antes de desplegar a master.
4. ✅ `@supabase/supabase-js` instalado. Cliente en `src/lib/supabase.js` (a prueba de
   fallos: si faltan env vars NO rompe, queda en null y se usa el catálogo estático).
5. ✅ Catálogo migrado a la BD con `supabase/seed.sql` (idempotente): 9 categorías + 31
   productos. Verificado vía API REST (lectura pública RLS OK).
6. ✅ La web lee el catálogo desde Supabase mediante el hook `src/hooks/useCategorias.js`
   (Opción A: arranca con el estático, lo sustituye por la BD al responder, y ante
   cualquier fallo se queda con el estático). Conectado en `ProductosComponent` y, vía
   `src/hooks/useGaleria.js`, también en `GaleriaComponent`. `data/galeria.js` ELIMINADO
   (la galería se deriva del catálogo). `data/categorias.js` se mantiene como fallback.
   Nota: el bundle JS subió a ~447 kB (gzip 128) al incluir supabase-js.
7. ✅ DESPLEGADO a producción (master). Env vars `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
   puestas en Vercel (solo entorno **Production**; Preview/Development NO las tienen, así que
   los previews de rama usarán el catálogo estático). Verificado: el bundle de
   `paco-vago.vercel.app` embebe la URL de Supabase → producción lee de la BD.
8. ✅ (Fase 2c) Panel de administración DESPLEGADO en `/admin`. Hecho en la rama
   `feature/admin` (fusionada a master). Incluye:
   - Login con **Supabase Auth** (email/contraseña). Registros públicos DESACTIVADOS
     (Authentication → Sign In/Up). Usuarios se crean a mano en Authentication → Users
     (Add user + Auto Confirm). De momento solo el de Alberto; falta crear el del tío.
   - **react-router-dom**: rutas `/` (web) y `/admin` (panel). `vercel.json` con rewrite SPA.
   - `src/components/pages/Admin/` (AdminComponent = login+layout; GestionProductos = CRUD).
     `src/hooks/useAuth.js` = sesión.
   - Productos: **buscador** (insensible a acentos), editar (nombre/descr./disponible),
     crear, borrar, reordenar (▲▼), e índice fijo de categorías. La web pública oculta lo
     no `disponible`.
   - **Categorías**: editar (título/descripción/etiquetas) y reordenar (▲▼) desde el panel.
   - **Fotos**: subida a Supabase **Storage** (bucket público `productos`, ver
     `supabase/storage.sql`; escritura solo autenticados). Las fotos antiguas YA se
     migraron a Storage (botón de Mantenimiento, que se oculta cuando no quedan `/fotos/`).
     Las imágenes de `public/fotos/` siguen en el repo pero ya no se usan en el catálogo
     (salvo la "de ambiente" `latas-1.jpg` y el logo); se pueden limpiar con cuidado.
   - Permisos de escritura en BD: `supabase/policies-admin.sql` (solo autenticados).
   - **Rendimiento**: panel cargado con lazy-load (chunk aparte); web pública más ligera.
   - **Móvil**: cabecera de categoría apilada y flechas grandes en móvil; escritorio igual.
9. ⬜ (Fase 3) precios → carrito → checkout → pagos (Stripe/Redsys) + legal.

**Pendientes (opcionales):** crear el usuario del tío (Authentication → Users → Add user +
Auto Confirm) y pasarle `paco-vago.vercel.app/admin`; limpiar `public/fotos/` ya migradas;
seguir puliendo el responsive de las tarjetas de producto si hace falta.

**Cómo probar (local o producción):** abrir la sección "Tenemos de todo". Para confirmar
que viene de la BD: edita un título en Supabase (Table Editor) y recarga; debe cambiar.
En local: `npm run dev` (reinícialo si cambiaste el `.env`).

**Importante:** trabajar en `feature/backend`; cuando esté estable y probado, fusionar a
master. Las fotos siguen en `public/fotos/` (campo `foto` guarda la ruta); más adelante se
puede pasar a Supabase Storage.

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
