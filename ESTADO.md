# Estado del proyecto — Paco Vago (web)

> Documento de continuación. Si abres un chat nuevo, léelo para ponerte al día.
> Última actualización: 16 septiembre 2026.

## ⚡ RESUMEN ACTUAL (para retomar rápido)

Web informativa **+ tienda online** de Paco Vago, en producción en
https://paco-vago.vercel.app. Backend con **Supabase** (BD + auth + storage).
- ✅ Catálogo en BD; la web lee de Supabase (con fallback al estático).
- ✅ **Panel `/admin`** (login Supabase Auth): gestiona productos y categorías (crear,
  editar, borrar, ocultar, reordenar, **precio**, subir fotos, buscador).
- ✅ **Tienda online** (`/tienda`): listado + ficha con zoom + carrito + mini-carrito +
  animación volar-al-carrito. Modelo HÍBRIDO: con precio → carrito; sin precio → WhatsApp.
  Pedidos por WhatsApp ya funcionan.
- ✅ **"Cómpralo online" + colecciones** (Fase 3a-bis): sección en la home con una
  "tarjeta de grupo" (foto general) que lleva a `/tienda` ya filtrada (deep-link
  `/tienda?q=…`). En el panel de "Tenemos de todo" los productos de una colección
  (p. ej. los 3 aceites) se muestran como UNA sola tarjeta en su sitio (no fotos
  repetidas), y el botón es inteligente (con precio → **Comprar** a la ficha; sin
  precio → **Me interesa** por WhatsApp). Todo config-driven en
  [`data/colecciones.js`](src/data/colecciones.js): añadir miel/licores = copiar un bloque.
  1er producto real con precio+foto: **AOVE de Carmona** 5 L (34,50€) / 2 L (16,50€) / 1 L (8,50€).
- 🔶 **Fase 3b (pago con tarjeta): FUNCIONANDO EN LOCAL**, sin desplegar. Checkout con
  Stripe de punta a punta, portes por peso, pedidos guardados en Supabase y pantalla de
  pedidos en `/admin`. Falta **solo el correo de aviso** al titular. Ver punto 10.
- ⚠️ **DOS RAMAS SIN FUSIONAR**: `feature/legal` (páginas legales) y `feature/portes`
  (todo el checkout). Las dos tocan `ESTADO.md`; al fusionar, cuidado de no perder nada.
- ✅ **SEO por ruta HECHO el 18/09/2026**: título, descripción y canonical propios, datos
  estructurados de producto y sitemap de 37 páginas. Ver el apartado "REVISIÓN" al final.
  Las **imágenes** también: 11 MB → 4 MB. De la revisión no queda nada pendiente.

**Flujo de trabajo (IMPORTANTE):** trabajar en rama (no en master); `npm run build` para
verificar; **NO hacer `git push` sin OK del usuario**; ofrecer opciones marcando la
(Recomendado) y tirar por ella; ir poco a poco.

## Qué es

Web informativa **+ tienda online** de **Paco Vago**, tienda centenaria (desde 1924) en la
**Puerta de Sevilla, Carmona (Sevilla)**. Lema: *"La tienda que tiene de todo, y si no lo
tienen, se lo inventan o te lo consiguen"*. Es "la tienda que tiene de todo".

- **Carpeta del proyecto:** `C:\Users\alberto.calero\paco.vago`
- **GitHub:** https://github.com/albertocalerocastillo/paco-vago
- **Web en producción:** https://paco-vago.vercel.app (Vercel, plan gratis Hobby)
- **Despliegue:** automático con cada `git push` a `master`.

## Stack

- **React + Vite 8** (parser oxc, estricto con JSX) + **Tailwind CSS v4** (`@tailwindcss/vite`)
- **lucide-react** para iconos · **react-router-dom** (rutas `/`, `/tienda`, `/tienda/producto/:id`, `/tienda/carrito`, `/admin`)
- JavaScript (NO TypeScript)
- **Backend: Supabase** (PostgreSQL + Auth + Storage). Cliente en `src/lib/supabase.js`.
  Credenciales en `.env` local (no se sube) y en Vercel (solo entorno Production).

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
8b. ✅ Botón **"Me interesa" por WhatsApp** en cada producto (carrusel + foto ampliada),
   web pública. Helper `whatsappProducto(nombre)` en `data/contacto.js`. Es el puente
   barato hacia la venta online mientras se monta el checkout.
9. ✅ (Fase 3a) TIENDA ONLINE — front-end DESPLEGADO. Estructura con react-router:
   - Entrada **"Comprar online"** en Nav y Hero de la home.
   - `/tienda` (listado): hero con foto+sello (TiendaHeader, barra de marca, banda de
     confianza), buscador flotante, filtros con iconos, rejilla. `TiendaComponent`.
   - `/tienda/producto/:id` (ficha): foto ampliable con zoom, cantidad, relacionados.
     `ProductoDetalleComponent`. Tarjeta reutilizable `ProductoCard`.
   - **Carrito** (`/tienda/carrito`) + **mini-carrito** lateral (`MiniCarrito`, se abre al
     pulsar el icono) + **animación volar-al-carrito** (`utils/flyToCart.js`).
   - Estado de carrito en `hooks/useCarrito.jsx` (Context + localStorage).
   - **Campo precio** por producto (panel + web). Modelo HÍBRIDO: con precio → "Añadir al
     carrito"; sin precio → "Me interesa" (WhatsApp). El carrito permite "Hacer pedido por
     WhatsApp" mientras no haya pago con tarjeta.
   - Pie de página reutilizado en todas las páginas de tienda.
10. 🔶 (Fase 3b) PAGO CON TARJETA — **decisiones cerradas el 16/09/2026** (WhatsApp con
   el tío). Ya solo queda escribir código.

   **Titular (CONFIRMADO, ya en `src/data/empresa.js`):** José Antonio López Ruiz ·
   NIF 47336029M · C/ Puerta de Sevilla 5, 41410 Carmona (Sevilla) ·
   pacovagopuertasevilla@gmail.com. Es **autónomo, no S.L.** → no hay datos registrales
   (esa línea del aviso legal se oculta sola).

   **Legal — ✅ RELLENADO** (rama `feature/legal`, commit `9a21abf`, SIN desplegar). Las 4
   páginas + enlaces en el footer. Queda **1 hueco A PROPÓSITO**: la forma de pago en
   Condiciones. Es lo que mantiene la página en modo borrador (aviso amarillo) e impide
   publicar unas condiciones que anuncien cobro con tarjeta antes de que Stripe funcione.
   Al activar el pago: rellenar ese `<Dato>` y quitar el prop `borrador` de
   `Condiciones.jsx`. **Desplegar legal + pago JUNTOS.**

   **Pasarela: STRIPE** (~1,5% + 0,25€, acepta tarjeta **y Bizum**). El tío **NO tiene TPV
   virtual**: dijo "tengo TPV sí", pero se refería al **datáfono físico** del mostrador,
   que no sirve para cobrar online. Nunca ha vendido por internet, así que el banco no se
   lo ha dado. Con Stripe no hay que pedirle nada al BBVA. Su IBAN se configura DENTRO de
   Stripe, **nunca en el repo**.

   **Portes (tarifa suya, IVA incl.):** hasta 5 kg → 7,50 € · hasta 10 kg → 12 € ·
   hasta 15 kg → 18 € · más de 15 kg → 25 €.
   - **SIN envío gratis por importe mínimo.** Se valoró 60€ y 100€ y se descartó: el
     aceite pesa mucho y deja poco margen ("si los portes son 15€ ahí ni gano nada").
   - **Zona:** península en la web. **Canarias y Baleares → WhatsApp** (presupuesto).
   - ⚠️ **OJO al lanzar:** el AOVE de 5 L pesa 5,5 kg → se sale del primer tramo y paga
     **12 € de porte sobre 34,50 €**. El de 2 L paga 7,50 € sobre 16,50 €. Cuantos más
     productos vendibles haya, mejor se reparte el porte → valorar packs.

   **Pesos CONFIRMADOS (con caja):** AOVE 5 L = **5,5 kg** · 2 L = **2,3 kg** ·
   1 L = **~1 kg**. Licores: pendientes.

   **Regla de venta AMPLIADA** (extiende el modelo híbrido ya existente):
   **con precio Y peso → carrito; si falta cualquiera de los dos → botón WhatsApp.**
   Así el tío no se compromete con nada: nada se vende solo hasta que él dé precio y peso,
   y el catálogo crece según vaya pasando datos. Esto salió porque al principio quiso que
   **todos** los portes se consultaran por WhatsApp, lo que habría dejado el checkout
   inservible; con esta regla se quedó tranquilo.

   **Productos al peso (queso, salchichón, mojama): FUERA de la web por ahora.** Dijo
   "3 salchichones 12,50€ / 3 mojamas 11€, igual pesan", pero no está claro si es por
   pieza, por kilo o el lote entero → **no fiarse del dato**. Entran el día que confirme
   precio por pieza: son 2 campos en el panel. Si un lote viene con pesos dispares, se
   ocultan con la casilla `disponible` que ya existe.

   **IVA:** los precios que pasa el tío llevan **IVA incluido**.
   **Factura:** se emite a quien la pida (obligatorio como autónomo) → casilla "quiero
   factura" con NIF en el checkout. **Plazo de entrega:** 2-5 días laborables (holgado a
   propósito, confirmado por él).

   **Gestión de pedidos** — lo preguntó él ("¿y cómo sé yo cuándo entra una compra?").
   Tres capas: (1) **email a su Gmail** por cada pedido, con productos y dirección — es lo
   que va a usar de verdad; (2) **app de Stripe en el móvil**, aviso al instante, gratis y
   sin código (solo instalarla); (3) **apartado "Pedidos" en `/admin`** para verlos todos
   y marcar los enviados.

   **YA CONSTRUIDO** (rama `feature/portes`, probado en local, SIN desplegar):
   1. ✅ Columna `peso` en `productos` (`supabase/peso.sql`, YA EJECUTADO) + campo en el
      panel. Pesos metidos: AOVE 5 L = 5,5 kg · 2 L = 2,3 kg · 1 L = 1 kg.
   2. ✅ Portes por tramos en el carrito (`src/data/envios.js`). Regla de venta ampliada:
      `esComprable()` exige **precio Y peso**; si falta alguno → botón de WhatsApp.
   3. ✅ Checkout con Stripe (`api/crear-sesion.js`). El servidor NO se fía del carrito:
      lee precios y pesos de la BD y recalcula el porte. Verificado que 1 AOVE de 5 L
      cobra 46,50 € y 2 de 2 L cobran 40,50 €.
   4. ✅ **La dirección se pide en la web, no en Stripe** (`DatosDeEnvio.jsx`). Es un
      agujero que detectó Alberto: Stripe solo filtra por país y Canarias es España, así
      que se podía pasar el filtro con un CP de península y luego poner dirección canaria
      al pagar. Con `shipping_address_collection` desactivado, no hay donde cambiarla.
   5. ✅ Tabla `pedidos` (`supabase/pedidos.sql`, YA EJECUTADO) + webhook
      (`api/stripe-webhook.js`). ⚠️ **El webhook corre en `runtime: 'edge'` a propósito**:
      en el entorno normal Vercel se lee y trocea el cuerpo antes que nuestro código y
      llegan 0 bytes, así que la firma NUNCA valida. Está comentado en el fichero.
   6. ✅ Pantalla "Pedidos" en `/admin`, con pestañas. Arranca en "Por preparar".

   **PENDIENTE:**
   - ⬜ **Correo de aviso al titular** por cada pedido. Hace falta un servicio de envío
     (Resend, gratis hasta 3.000/mes). Para mandar desde una dirección propia hace falta
     **dominio**, que aún no hay: con la cuenta gratis el correo saldría desde una
     dirección tipo `onboarding@resend.dev`, con pinta rara y riesgo de spam. Decisión
     abierta: montarlo provisional o esperar al dominio.
   - ⬜ Rellenar la forma de pago en Condiciones, quitar el prop `borrador` y desplegar
     legal + pago JUNTOS.
   - ⬜ **Métodos de pago en Stripe**: activar **Bizum** (NO viene de serie) y quitar
     Klarna, Bancontact y MB WAY, que no pintan nada aquí. Es configuración del panel de
     Stripe, sin código.
   - ⬜ **Activar la cuenta de Stripe a nombre del tío** (NIF 47336029M + su IBAN). Ahora
     está en modo prueba con el email de Alberto. El titular verificado tiene que ser él:
     es quien cobra y quien declara. Requiere que mande foto del DNI.
   - ⬜ **Vaciar la tabla `pedidos`** antes de abrir: tiene pedidos de prueba.
   - ⬜ Variables de entorno en Vercel para producción: `STRIPE_SECRET_KEY`,
     `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SITIO_URL`.

   **CÓMO PROBARLO EN LOCAL:** `npx vercel dev` (NO `npm run dev`: ese no ejecuta `/api`).
   Tarjeta de prueba `4242 4242 4242 4242`, `12/30`, `123`. Para el webhook, sin instalar
   nada: `node scripts/probar-webhook.js`, que coge un pago real de la cuenta de pruebas,
   lo firma como lo firma Stripe y se lo manda al servidor. Comprueba además que un aviso
   repetido no duplica el pedido y que una firma falsa se rechaza.

**Pendientes (opcionales):** crear el usuario del tío (Authentication → Users → Add user +
Auto Confirm) y pasarle `paco-vago.vercel.app/admin`; limpiar `public/fotos/` ya migradas
(OJO: el fallback estático `data/categorias.js` aún apunta a `/fotos/`; actualizarlo antes
de borrar para no romper la red de seguridad); seguir puliendo el responsive si hace falta.

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
- ~~Fotos de Artesanía y Perfumería~~ ✅ HECHO: comprobado el 18/09/2026 contra la base
  de datos, **las 9 categorías tienen foto**. La nota anterior estaba desfasada.
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

## 🔍 REVISIÓN DE DISEÑO, MÓVIL Y SEO — 16 septiembre 2026

Hecha **midiendo la web en marcha**, no a ojo: peticiones reales por ruta y medidas
tomadas en el navegador a 1440 px y a 375 px. Lo que aquí pone un número, está medido.

### Ya arreglado ese mismo día

- ✅ **El cartel mentía.** La cabecera de la tienda y la banda de confianza decían "Envíos
  a toda España", pero el checkout rechaza Canarias, Baleares, Ceuta y Melilla, y las
  condiciones de venta dicen "solo península". Ahora dice "a toda la península" y la banda
  lo convierte en servicio: "Canarias y Baleares, por WhatsApp".
- ✅ **"1 productos"** → "1 producto". Era la categoría de Artesanía, que tiene una sola foto.
- ✅ **"Cómpralo online" sube justo debajo del hero.** La portada se escribió cuando la web
  solo informaba; ahora que cobra con tarjeta, el que entra buscando el aceite no tiene que
  bajar por historia, el local y los rodajes. Es cambio de ORDEN en `App.jsx`, no de diseño.
- ✅ **Áreas pulsables en móvil** (mínimo recomendado 44×44): menú 24→44, carrito 24→44,
  teléfono 21→44 de alto, chips de filtro 34→42, botones de cerrar 22→38..48. Crece el
  relleno, NO el icono: visualmente no cambia nada.

### ✅ HECHO — SEO por ruta (18/09/2026)

Antes, **todas** las rutas devolvían el mismo `<title>`, la misma descripción y un
`canonical` apuntando a la portada: la ficha del aceite no existía como resultado de
búsqueda. Ya está resuelto:

- **`src/hooks/useSeo.js`** pone título, descripción, canonical, Open Graph y robots
  propios de cada página. ⚠️ **MODIFICA** las etiquetas que ya están en `index.html`, no
  añade otras: si añadiera, habría dos `<title>` y Google se queda con el primero, que es
  justo el que queremos cambiar. Verificado que sigue habiendo una sola de cada.
- La **ficha de producto** compone su descripción con el texto del producto y su precio, y
  usa su propia foto al compartir por WhatsApp.
- **Carrito, gracias y panel** con `noindex, nofollow`.
- **Datos estructurados `Product`** en la ficha (`useDatosEstructurados`). La **oferta solo
  se declara si el producto se puede comprar de verdad** (precio Y peso): anunciar un
  precio en algo sin botón de comprar engaña al que pincha y Google lo sanciona. El bloque
  se borra al salir de la página para que no se acumulen al navegar entre fichas.
- **`sitemap.xml` generado con `npm run sitemap`** (`scripts/generar-sitemap.js`), leyendo
  el catálogo de Supabase: pasó de 1 página a 37. Solo entran los productos
  `disponible = true`, y cada ficha lleva su fecha de alta real.
  ⚠️ **Hay que relanzarlo y desplegar cuando se añadan o quiten productos.**

⬜ **Lo que queda por ver:** esto ocurre con JavaScript, o sea después de cargar la página.
Google lo ejecuta y lo lee, pero más tarde y con menos garantías que si viniera ya escrito
del servidor. **A las pocas semanas de desplegar, mirar Search Console**: si las fichas no
aparecen indexadas, el paso siguiente es prerenderizar las rutas, que es bastante más
trabajo. No adelantarlo sin comprobar antes que hace falta.

⬜ Las **páginas legales** (rama `feature/legal`) todavía no usan `useSeo` ni entran en el
sitemap. Añadirlas al fusionar.

### ✅ HECHO — Imágenes (18/09/2026)

La portada descargaba **11 MB** de fotos. Ahora ~4 MB, y sin perder calidad visible.

- **`src/utils/imagenes.js`** pide cada foto del tamaño en que se ve. Supabase las
  redimensiona al vuelo: basta cambiar `/object/public/` por `/render/image/public/`. No
  hubo que volver a subir nada ni tocar la base de datos.
- **El logo pesaba 336 KB y se ve a 44 px**, en la cabecera de TODAS las páginas. Pasa a
  200x200 y 76 KB. La foto de ambiente de la galería, de 1920 a 1200 px.
- Al **ampliar una foto a pantalla completa se sirve el original** sin tocar.

⚠️ **DOS TRAMPAS QUE COSTARON UN ARREGLO CADA UNA** (están comentadas en el fichero):

1. **Hay que pedir SIEMPRE las dos medidas.** Con solo `width`, Supabase estrecha la foto
   pero le deja el alto original: una de 1500x2000 volvía como 400x2000, una tira
   deformada que la tarjeta recortaba dejando un zoom brutal.
2. **En un hueco cuadrado manda el LADO CORTO.** Con `contain` a 400, una foto apaisada
   volvía 400x267 para un hueco de 289: el alto se quedaba corto y el navegador estiraba.
   Por eso los huecos cuadrados piden el recorte ya hecho (`cover`), no `contain`.

**Lección de método:** las dos veces se validó por peso y no mirando la pantalla, y las dos
veces se coló. Los bytes bajaban mientras la web se veía fatal. En cambios que afectan a lo
que se ve, el número NO vale como prueba: hay que mirarlo.

### ❌ DESCARTADO — poner ancho y alto a las imágenes

Se midió el salto de maquetación (CLS) antes de tocar nada y daba **CERO** en portada y
tienda. Es verdad que las 54 imágenes no declaran medidas, pero todas van dentro de
contenedores ya dimensionados por CSS. Era un problema teórico que aquí no existe: tocarlas
habría sido riesgo de romper maquetación a cambio de nada.

Por lo mismo se descartó reencodar las fotos locales de Historia y El Local: se simuló
primero y **cuatro de ellas salían MÁS GRANDES**. Ya estaban bien comprimidas.

### Lo que NO está mal (también medido)

Sin desbordamiento horizontal ni en escritorio ni en móvil · todas las imágenes con texto
alternativo · jerarquía de títulos correcta · ningún enlace sin texto accesible · carga
diferida de imágenes funcionando.

### Sobre el diseño

**No rediseñar.** La identidad (serifas, fondo crema, marrón de acento, el sello) es
coherente y le da un aire de tienda antigua que le pega al negocio; la mayoría de webs de
comercios pequeños no tienen ni la mitad de carácter. Lo que hacía falta era de estructura
(el orden de las secciones) y de usabilidad (los dedos en móvil), y eso ya está hecho.

### Deuda técnica menor

El proyecto tiene 12 avisos de ESLint, casi todos de una regla de React que se queja de
cargar datos dentro de un efecto (`GestionProductos`, `GestionPedidos`, `useAuth`). Son
falsos positivos: el cambio de estado ocurre después de esperar a la base de datos. Conviene
una pasada de limpieza algún día, pero no rompen nada.

## 📌 PARA EL FINAL — lo que queda cuando el código esté listo

Ordenado por lo que más va a aportar. Nada de esto es programar.

### Depende del tío (pedírselo con tiempo, tarda días)

1. 🔑 **Google: la ficha buena es "Paco Vago Puerta Sevilla"** (5,0★, 39 reseñas el
   18/10/2026, tel. 954 14 08 71). **La otra ficha, "Paco Vago" (Juguetería, 4,5★/124,
   C. González Girón 1), es OTRO NEGOCIO: la juguetería de enfrente, de familiares.**
   Confirmado por el tío el 18/10/2026. ⛔ **NO pedir fusión nunca**: serían las reseñas
   de otro negocio y Google lo prohíbe. La nota anterior de "duplicadas" estaba mal.
   Queda: que dé acceso a su cuenta para cambiar el botón "Sitio web" (ahora lleva a su
   Instagram) a la web. El tío ha puesto un soporte NFC en el mostrador que lleva a dejar
   reseña. Si se añade un "déjanos tu reseña" en la web: enlace normal, **sin regalos a
   cambio y sin pedírsela solo a los contentos** (Google lo penaliza y en la UE las
   reseñas incentivadas sin avisarlo son práctica desleal).
2. 🌐 **Dominio propio: ELEGIDO `pacovago.es`** (18/10/2026, lo paga el tío; registrarlo
   a SU nombre y NIF, es el titular del negocio). ~10-12 €/año. Desbloquea el correo de pedidos (sin dominio
   verificado, Resend solo deja mandar a tu propia dirección) y quita el
   `paco-vago.vercel.app`, que a la hora de meter una tarjeta resta confianza.
3. 🪪 **Activar la cuenta de Stripe a su nombre**: NIF 47336029M, su IBAN y foto del DNI.
   Es quien cobra y quien declara, así que el titular verificado tiene que ser él.
4. 🔗 **La URL en las bios de Instagram y TikTok.** Dos minutos, pero las cuentas son suyas.

### Depende solo de Alberto

5. 💳 **Métodos de pago en Stripe**: activar **Bizum** (NO viene de serie) y quitar Klarna,
   Bancontact y MB WAY, que no pintan nada en una tienda de Carmona. Es configuración del
   panel, sin tocar código.
6. 🧹 **Vaciar la tabla `pedidos`**: tiene pedidos de prueba.
7. ⚙️ **Variables de entorno en Vercel** (entorno Production): `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SITIO_URL`.
8. 🔔 **Crear el webhook en el panel de Stripe** apuntando a
   `https://<dominio>/api/stripe-webhook`, evento `checkout.session.completed`. La clave de
   firma que dé va en `STRIPE_WEBHOOK_SECRET` de Vercel.
9. 🚀 **Fusionar `feature/portes` a master y hacer push.** Vercel despliega solo. Hacerlo
   DESPUÉS de los puntos 5 a 8, o el botón de pagar fallará en producción.
10. 📄 Antes de desplegar: rellenar la forma de pago en Condiciones y quitar el prop
    `borrador` de `Condiciones.jsx`.

### Cuando ya esté abierto

11. 🔍 **Mirar Search Console a las pocas semanas.** Si las fichas de producto no aparecen
    indexadas, tocará prerenderizar (ver el apartado de SEO).
12. ✍️ Repasar los textos comerciales de las descripciones de categoría. Cuestión de gusto,
    pero las descripciones venden.
13. 🧪 Usar la web como un cliente: en el móvil, con el carrito lleno, cambiando cantidades.
    Los fallos que queden salen usándola, no leyendo código.
14. 🧹 Limpieza de los 17 avisos de ESLint (casi todos falsos positivos de una regla de
    React sobre cargar datos en efectos). No rompen nada.

## 🖐️ RONDA DE USABILIDAD — 18 septiembre 2026

Todo esto salió **usando la web**, no leyendo código. La mayoría lo detectó Alberto.

- ✅ **Al cambiar de página no subía al principio.** Estando al final de la portada y
  pulsando "Comprar online", aterrizabas en mitad de la tienda. `IrArribaComponent`.
  Con el botón de ATRÁS no se toca nada: el navegador ya devuelve donde estabas.
- ✅ **Página 404.** Una dirección inventada no encajaba con ninguna ruta y quedaba el
  mini-carrito flotando sobre el vacío, con un "Tu carrito está vacío" sin contexto.
- ✅ **Flechas del carrusel en móvil** (productos, galería y vídeos). Estaban ocultas por
  debajo de 768 px: en la galería solo se asomaban 23 px de la segunda foto de 36, así que
  parecía una foto suelta.
- ✅ **Pasar fotos en el visor**: flechas, contador "3 / 15", deslizar con el dedo (umbral
  50 px para no confundirlo con un toque) y flechas del teclado. Antes había que cerrar y
  abrir otra.
- ✅ **El chip "Todas" era inalcanzable.** Centrar con `justify-center` la MISMA fila que se
  desplaza deja el principio fuera de alcance cuando no cabe: a 1100 px estaba cortado
  99 px y no había forma de verlo, ni desplazando. Y es el botón que quita el filtro.
  Ahora la fila que se desplaza y la que se centra son distintas (`w-max mx-auto`).
- ✅ **Degradados en los bordes de los filtros**, para que se vea que la fila sigue.

### ⚠️ Una trampa del entorno de pruebas, para no volver a caer

El panel de vista previa a veces **no pinta la página** (`visibilityState: 'hidden'`).
Cuando eso pasa NO se disparan `requestAnimationFrame`, `ResizeObserver` ni los eventos de
scroll, y las mediciones dan **falsos negativos**: el degradado parecía no funcionar y el
código estaba bien. Antes de "arreglar" algo que no reacciona, comprobar si la página se
está pintando:

```js
document.visibilityState              // 'hidden' => las medidas no valen
await new Promise(r => { requestAnimationFrame(() => r(true)); })
```

Se puede sortear lanzando los eventos a mano (`el.dispatchEvent(new Event('scroll'))`),
que sí invoca a los oyentes aunque la página no se pinte.

## ⚖️ REPASO LEGAL — 19 octubre 2026

Rama `feature/portes`, sin desplegar. Lo que faltaba o había cambiado en la ley:

- ✅ **Función de desistimiento online** (`/legal/desistir`). Directiva (UE) 2023/2673,
  obligatoria desde el **19/06/2026** para toda tienda online: desistir tiene que ser tan
  fácil como comprar. Enlace en el pie y en las legales, formulario mínimo, botón
  "Confirmar desistimiento" y justificante con fecha y hora. Lo guarda
  `api/desistimiento.js` en la tabla `desistimientos` y el titular lo ve en la pestaña
  **Desistimientos** de `/admin`, con el plazo de reembolso (14 días) a la vista.
  ⚠️ **Falta ejecutar `supabase/desistimientos.sql`** en el SQL Editor.
  ⚠️ El acuse de recibo por **email** depende de Resend + dominio, igual que el aviso de
  pedidos. Mientras tanto el titular contesta a mano desde su Gmail, sin dejarlo pasar.
- ✅ **Modelo de formulario de desistimiento** (Anexo B RDL 1/2007) al final de Devoluciones.
- ✅ **Quitado el enlace a la plataforma ODR** de la UE: cerró el 20/07/2025.
- ✅ **Hojas de reclamaciones de la Junta de Andalucía** mencionadas en Condiciones.
- ✅ **Garantía de 3 años** explícita (antes decía "la aplicable").
- ✅ **Privacidad**: fuera la "nota técnica para revisión", que se veía en la página.
  Ahora nombra Stripe, Vercel y Supabase y explica las transferencias a EE. UU.
- ✅ **Junto al botón de pagar**, enlaces a condiciones, devoluciones y privacidad.

**Para el día de abrir** (añadir a "PARA EL FINAL"): en Stripe, activar los **recibos por
email** de pagos correctos (Settings → Emails): Condiciones dice que el cliente recibe el
justificante en su email.

## 🔒 REVISIÓN DE SEGURIDAD — 19 octubre 2026

Comprobado **contra el Supabase real** con la clave pública (la que lleva la web):
registros públicos **desactivados**; `pedidos` no se puede leer (devuelve vacío) ni
escribir (RLS lo rechaza); subir fotos sin login, rechazado. Ninguna clave secreta en el
historial de git ni en el bundle. Los `/api` no se fían del navegador (precios, pesos y
porte se recalculan; la firma del webhook se valida).

Arreglado:
- **Cabeceras de seguridad** en `vercel.json`: la web no se puede meter en un iframe de
  otro sitio (protege `/admin` de clickjacking), `nosniff`, `Referrer-Policy` y
  `Permissions-Policy`. Producción solo tenía HSTS. ⚠️ No se puede ver en local sin
  `vercel dev`: comprobar con `curl -sI` tras desplegar.
- **Almacén de fotos limitado** a JPG/PNG/WebP de hasta 10 MB (antes aceptaba cualquier
  archivo). Aplicado en Supabase y apuntado en `supabase/storage.sql`. Probado: un HTML se
  rechaza incluso con la service_role.
- `npm audit fix`: Vite 8.3.4. Dependencias de producción, **0 vulnerabilidades**. Las
  que quedan son del CLI de Vercel, que no se despliega.

A tener en cuenta (sin código):
- **Cualquier usuario con login es administrador** total. Es seguro porque los registros
  están cerrados: **no activarlos nunca**. Contraseñas largas para Alberto y el tío.
- Al pasar Stripe a real: claves `sk_live` y el `whsec_` del webhook de producción
  **solo en Vercel**, nunca en `.env` ni en el repo.
- `/api/crear-sesion` y `/api/desistimiento` no tienen límite de peticiones. Para el
  volumen de esta tienda no compensa montarlo; si algún día llega spam, es lo primero.

- ✅ **Mapa de Google al pulsar** (19/10/2026). El iframe de Visítanos conectaba con Google
  nada más abrir la portada (IP y posibles cookies de Google), lo que según la AEPD requiere
  consentimiento previo. Ahora sale un recuadro con "Ver mapa" y un enlace para abrirlo en
  Google Maps; hasta que no se pulsa, no se carga nada de Google. Así la web sigue **sin
  banner de cookies**. Privacidad lo explica. ⚠️ Si algún día se añade Analytics, un
  píxel o vídeos incrustados, entonces SÍ hará falta banner.

## 💬 WHATSAPP CON EL TÍO — 18 octubre 2026

- Dominio: **pacovago.es**. Google: ver punto 1 de "PARA EL FINAL" (la otra ficha es otro negocio).
- Ya está **vendiendo por WhatsApp** a gente que le llega desde la web, cobrando por
  Bizum. Primera venta: gildas, 6,50 € de envío.
- ⚠️ **PORTES SIN CERRAR, CHOCAN CON LO DECIDIDO.** En WhatsApp cobró **6,50 €** de envío y
  propuso **envío gratis desde 100 €**. Lo cerrado el 16/09 es 7,50 / 12 / 18 / 25 € por
  tramos de peso y SIN envío gratis (lo descartó él: "con el aceite no gano nada"). **No
  tocar `data/envios.js` hasta que lo confirme.** Preguntarle: ¿6,50 € era una tarifa nueva
  o un precio para ese pedido ligero?, ¿y los 100 € con el aceite de 5 L?
- Productos nuevos para la web: **gildas** (clásicas 16,95 € / 30 piezas, y 11 modelos
  más). Faltan precio, PESO con caja y foto de cada una.
- "Pues el punto 4": parece que está listo para verificar Stripe juntos. Quedar en
  persona y hacer en la misma visita Stripe + acceso a Google.

## ⚠️ VERCEL GRATIS NO VALE PARA UNA TIENDA (comprobado el 19/10/2026)

Las condiciones de Vercel (Fair Use Guidelines, "Commercial usage") dicen que el plan
**Hobby es solo para uso personal NO comercial**, y ponen como ejemplos cobrar a los
visitantes, anunciar productos a la venta y que te paguen por hacer o mantener la web.
Aquí se dan los tres. **Antes de abrir el cobro: pasar a Pro (20 $/mes)** y poner un
límite de gasto (Spend Management), porque en Pro lo que pase del crédito incluido SÍ se
factura. Incluirlo en lo que se le cobre al tío por el mantenimiento.

Plan acordado (19/10/2026): **Alberto lo gestiona todo de momento con los datos del tío**
(sin videollamadas ni quedadas, todo por WhatsApp) y más adelante le pasa parte de la
gestión o le cobra un mantenimiento mensual. Si cobra: contrato sencillo + contrato de
encargado del tratamiento (RGPD art. 28), porque accede a los datos de los clientes.

## ☁️ MUDANZA A CLOUDFLARE (en curso, 19/10/2026)

Decidido: **Cloudflare Workers, plan gratuito** (permite uso comercial; al pasarse del
límite falla, NO cobra). Sustituye a Vercel, cuyo gratuito prohíbe tiendas.

**Hecho (rama `feature/portes`, probado en local con el simulador de Cloudflare):**
- La lógica de las 3 funciones vive en **`servidor/`** en formato web estándar
  (Request → Response; las variables llegan en `env`, no en `process.env`).
- **`worker/index.js`** reparte `/api/*`; el resto lo sirve Cloudflare desde `dist/` con
  la portada como respaldo para las rutas de React. Configuración en **`wrangler.jsonc`**.
  Cabeceras de seguridad en **`public/_headers`** (comprobadas en local).
- **`api/`** queda como 3 envoltorios de una línea: plan B si hubiera que volver a
  Vercel Pro. No tienen lógica propia.
- Probado de punta a punta en local: cobro de prueba (AOVE 5 L = 46,50 €), vuelta a
  `/tienda/gracias`, aviso firmado → pedido guardado como pagado, aviso repetido sin
  duplicar, firma falsa rechazada, desistimiento guardado y sin duplicar.

**Cómo probar en local ahora:** `npm run cf` (compila y arranca el simulador en
http://localhost:8787 con las variables del `.env`). Para el webhook:
`DESTINO_WEBHOOK=http://localhost:8787/api/stripe-webhook node scripts/probar-webhook.js`.
(`vercel dev` ya no hace falta.)

**DESPLEGADO DE PRUEBA (19/10/2026): https://paco-vago.albertocalero.workers.dev**, con las
claves de PRUEBA de Stripe. Cuenta de Cloudflare de Alberto (login con Google). Comprobado
ahí: páginas, cabeceras, catálogo desde Supabase, cobro de prueba con el precio recalculado
en el servidor y Canarias rechazado. Para volver a desplegar: `npm run build` y
`npx wrangler deploy`. Una dirección workers.dev nueva tarda unos minutos en tener HTTPS.

**Pendiente:**
1. ~~Cuenta de Cloudflare y `wrangler login`~~ ✅ hecho.
2. Primer despliegue en la dirección de prueba `*.workers.dev` y secretos con
   `npx wrangler secret put`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_ANON_KEY`, `SITIO_URL`.
   ⚠️ **Las variables `VITE_*` del navegador se meten al COMPILAR** (`npm run build` con
   el `.env`), no en Cloudflare: comprobar que el bundle desplegado lleva la URL de Supabase.
3. ⚠️ **Límite de 10 ms de CPU por petición** en el gratuito. Esperar a Stripe/Supabase
   no cuenta, pero hay que mirarlo en el panel de Cloudflare (Workers → Observability)
   tras las primeras peticiones reales. Si alguna se pasa: Workers de pago (5 $/mes)
   o volver a Vercel Pro con los envoltorios de `api/`.
4. Comprar `pacovago.es`, ponerlo en Cloudflare y apuntarlo al Worker. Hasta entonces
   `paco-vago.vercel.app` sigue sirviendo la web actual (master) sin cambios.
5. Cambiar a `pacovago.es` lo que apunta a vercel.app (`data/empresa.js`, `index.html`,
   `useSeo`, sitemap, robots) y el webhook de Stripe.

**Prueba completa en Cloudflare (19/10/2026):** webhook de Stripe en MODO PRUEBA creado
apuntando a `https://paco-vago.albertocalero.workers.dev/api/stripe-webhook` (su clave está en
los secretos del Worker). Pedido de punta a punta desde el navegador: carrito → datos →
Stripe → gracias → Stripe avisa solo → pedido guardado como pagado (PV-YVDQ3EAH, 24 €).

**CPU medida con `wrangler tail`** (límite del plan gratis: 10 ms por petición):
webhook 1-2 ms · desistimiento 4 ms · **crear-sesion 11 y 14 ms en frío, 4 ms en
caliente**. Por encima del límite en frío.

✅ **ALIGERADO el mismo día, y SE QUEDA EN EL PLAN GRATIS.** El servidor ya no usa las
librerías de Stripe ni de Supabase: todo va con `fetch` en **`servidor/ligero.js`**
(formulario de la API de Stripe, lectura/escritura REST de Supabase y la comprobación de
la firma del webhook con el criptográfico estándar, según la receta de Stripe: firma,
caducidad de 5 min y comparación en tiempo constante). El Worker pasó de 1,6 MB a 25 KB.
Medido en frío en 3 despliegues: **cobro 3-6 ms · webhook 0-2 ms · desistimiento 1-4 ms**.
Probado: firma buena, varias v1, falsa, caducada, cuerpo alterado y sin cabecera; pedido
real de punta a punta (PV-Z7EF23L7) guardado con todas sus líneas.
`stripe` queda solo como dependencia de desarrollo (lo usa `scripts/probar-webhook.js`).
⚠️ La página de gracias dice "te llega un correo con el resumen": solo es verdad si se
activan los recibos por email en Stripe (en modo real). No abrir sin activarlos.

## 🌐 DOMINIO pacovago.es (23/10/2026)

- Comprado en **DonDominio** (cuenta de Alberto, usuario Alber987), 1 año, 8,41 €. Caduca
  el **23/10/2027**; renovación en **manual** → poner automática o un recordatorio.
- **Titular: José Antonio López Ruiz** (datos de la tienda y móvil 615 323 072). Alberto,
  contacto administrativo y técnico.
- DNS cambiados a Cloudflare: `adel.ns.cloudflare.com` y `ben.ns.cloudflare.com`. DNSSEC
  sin activar. Zona creada en la cuenta de Cloudflare de Alberto, plan Free.
- El Worker ya tiene `pacovago.es` y `www.pacovago.es` como dominios propios
  (`routes` en `wrangler.jsonc`); funcionarán cuando Cloudflare active la zona.

**Pendiente cuando la zona esté activa:** redirigir `www` a `pacovago.es`, poner
`SITIO_URL=https://pacovago.es`, cambiar `paco-vago.vercel.app` por `pacovago.es` en el
código (empresa.js, index.html, useSeo, sitemap, robots) y dar de alta el dominio en
Search Console.
