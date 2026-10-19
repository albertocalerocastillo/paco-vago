-- ─────────────────────────────────────────────────────────────
--  DESISTIMIENTOS  (función de desistimiento online)
-- ─────────────────────────────────────────────────────────────
--  Ejecutar UNA VEZ en Supabase → SQL Editor. Idempotente.
--
--  Desde el 19/06/2026 la Directiva (UE) 2023/2673 obliga a quien vende
--  online a ofrecer en la web una función para desistir del contrato tan
--  fácil como la de comprar. Esto guarda cada desistimiento que llega por
--  /legal/desistir, con su fecha y hora: es la prueba de que el cliente
--  desistió dentro de plazo.
--
--  Igual que con los pedidos: ESCRIBE la función serverless (service_role,
--  se salta RLS) y LEE el panel /admin. El navegador nunca escribe aquí.
-- ─────────────────────────────────────────────────────────────

create table if not exists desistimientos (
  id               bigint generated always as identity primary key,

  -- Código que ve el cliente en el justificante. Ej: DS-K3F9A2B
  referencia       text not null unique,

  -- Lo que escribe el cliente. La referencia del pedido NO se exige que
  -- exista: desistir es un derecho, y un error tecleando no puede anularlo.
  -- Por eso se apunta aparte si se encontró el pedido.
  pedido_ref       text not null,
  pedido_id        bigint references pedidos(id) on delete set null,
  nombre           text not null,
  email            text not null,
  productos        text,          -- vacío = todo el pedido
  comentario       text,

  estado           text not null default 'recibido'
                   check (estado in ('recibido','tramitado')),

  creado_en        timestamptz not null default now(),
  tramitado_en     timestamptz
);

create index if not exists idx_desistimientos_creado on desistimientos(creado_en desc);

-- ─── SEGURIDAD ────────────────────────────────────────────────
alter table desistimientos enable row level security;

-- Datos personales: sin lectura pública.
drop policy if exists "lectura desistimientos autenticados" on desistimientos;
create policy "lectura desistimientos autenticados"
  on desistimientos for select
  to authenticated
  using (true);

-- El titular solo marca como tramitado desde el panel.
drop policy if exists "actualizar desistimientos autenticados" on desistimientos;
create policy "actualizar desistimientos autenticados"
  on desistimientos for update
  to authenticated
  using (true)
  with check (true);
