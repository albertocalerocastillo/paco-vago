-- ─────────────────────────────────────────────────────────────
--  PESO DE LOS PRODUCTOS  (Fase 3b — cálculo de portes)
-- ─────────────────────────────────────────────────────────────
--  Los portes de Paco Vago van por tramos de peso, así que cada
--  producto necesita saber lo que pesa YA EMBALADO (con su caja).
--
--  Ejecutar UNA VEZ en Supabase → SQL Editor. Es idempotente:
--  volver a lanzarlo no rompe nada.
--
--  Un producto solo se puede comprar online si tiene precio Y peso.
--  Si le falta cualquiera de los dos, la web enseña el botón de
--  WhatsApp, igual que hasta ahora.
-- ─────────────────────────────────────────────────────────────

alter table productos
  add column if not exists peso numeric(7,3);   -- kilos, con la caja puesta

comment on column productos.peso is
  'Peso en kg del producto ya embalado. NULL = no se puede vender online (se ofrece por WhatsApp).';
