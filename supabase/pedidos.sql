-- ─────────────────────────────────────────────────────────────
--  PEDIDOS  (Fase 3b — checkout con Stripe)
-- ─────────────────────────────────────────────────────────────
--  Ejecutar UNA VEZ en Supabase → SQL Editor. Idempotente.
--
--  Quien ESCRIBE aquí es la función serverless del checkout, con la
--  service_role key (se salta RLS). El navegador NUNCA escribe pedidos:
--  si pudiera, cualquiera se inventaría uno pagado.
--
--  Quien LEE es el panel /admin, con usuario autenticado.
-- ─────────────────────────────────────────────────────────────

create table if not exists pedidos (
  id                bigint generated always as identity primary key,

  -- Código corto que ve el cliente y que usa el titular para buscarlo.
  referencia        text not null unique,

  -- Enlace con Stripe. Sirve además de candado anti-duplicados: si el
  -- webhook llega dos veces (Stripe reintenta), el unique lo impide.
  stripe_session_id text unique,

  -- 'revisar' es la red de seguridad: un pedido cobrado cuyo código postal
  -- cae fuera de península. No debería llegar ninguno, porque la dirección se
  -- valida antes de cobrar, pero si alguno se cuela NO se prepara sin mirarlo.
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente','pagado','revisar','enviado','cancelado')),

  -- Datos del comprador (los rellena Stripe al completarse el pago).
  email             text,
  nombre            text,
  telefono          text,
  direccion         jsonb,

  -- Copia de lo comprado EN EL MOMENTO de la compra: nombre, precio y peso.
  -- Se guarda copiado a propósito. Si el titular cambia mañana el precio de
  -- un producto, el pedido antiguo tiene que seguir diciendo lo que se cobró.
  lineas            jsonb  not null,

  subtotal          numeric(10,2) not null,
  porte             numeric(10,2) not null,
  total             numeric(10,2) not null,
  peso_total        numeric(7,3),

  quiere_factura    boolean default false,
  nif               text,
  nota              text,

  creado_en         timestamptz default now(),
  pagado_en         timestamptz,
  enviado_en        timestamptz
);

create index if not exists idx_pedidos_estado on pedidos(estado, creado_en desc);

-- ─── SEGURIDAD ────────────────────────────────────────────────
alter table pedidos enable row level security;

-- Sin política de lectura pública: los pedidos llevan nombre, dirección y
-- teléfono de clientes. Con la anon key NO se pueden leer.
drop policy if exists "lectura pedidos autenticados" on pedidos;
create policy "lectura pedidos autenticados"
  on pedidos for select
  to authenticated
  using (true);

-- El titular solo cambia el estado desde el panel (marcar como enviado).
drop policy if exists "actualizar pedidos autenticados" on pedidos;
create policy "actualizar pedidos autenticados"
  on pedidos for update
  to authenticated
  using (true)
  with check (true);
