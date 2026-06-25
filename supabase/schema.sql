-- ════════════════════════════════════════════════════════════
--  Esquema de base de datos — Paco Vago (Supabase / PostgreSQL)
--  Fase 2a: catálogo (categorías + productos).
--  Cómo usarlo: Supabase → SQL Editor → pegar y ejecutar.
-- ════════════════════════════════════════════════════════════

-- ─── CATEGORÍAS ───────────────────────────────────────────
create table if not exists categorias (
  id          bigint generated always as identity primary key,
  slug        text unique not null,          -- ej: 'gourmet'
  titulo      text not null,                 -- ej: 'Gourmet'
  icono       text,                          -- nombre del icono lucide (ej: 'Wheat')
  descripcion text,
  tags        text[],                        -- chips de la tarjeta (ej: {Jamones,Quesos})
  orden       int  default 0,                -- para ordenar en la web
  creado_en   timestamptz default now()
);

-- ─── PRODUCTOS ────────────────────────────────────────────
create table if not exists productos (
  id            bigint generated always as identity primary key,
  categoria_id  bigint references categorias(id) on delete cascade,
  nombre        text not null,
  descripcion   text,
  foto          text,                        -- ruta o URL de la imagen
  precio        numeric(10,2),               -- NULL por ahora (se usará en Fase 3)
  disponible    boolean default true,        -- para mostrar/ocultar o "agotado"
  orden         int  default 0,
  creado_en     timestamptz default now()
);

create index if not exists idx_productos_categoria on productos(categoria_id);

-- ─── SEGURIDAD (RLS) ──────────────────────────────────────
-- Lectura pública (la web lee el catálogo sin login).
-- La escritura se hará desde el panel de admin con usuario autenticado (Fase 2c).
alter table categorias enable row level security;
alter table productos  enable row level security;

create policy "lectura publica categorias"
  on categorias for select using (true);

create policy "lectura publica productos"
  on productos for select using (true);
