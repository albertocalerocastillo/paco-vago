-- ════════════════════════════════════════════════════════════
--  Almacenamiento de fotos — Paco Vago (Supabase Storage)
--  Fase 2c.4: bucket público "productos" + permisos de subida.
--  Cómo usarlo: Supabase → SQL Editor → pegar y ejecutar.
-- ════════════════════════════════════════════════════════════

-- Bucket público (las fotos se sirven por URL pública, sin login).
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Subir / actualizar / borrar fotos: SOLO usuarios autenticados (el panel).
create policy "storage subir productos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

create policy "storage actualizar productos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

create policy "storage borrar productos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');

-- (La lectura es pública automáticamente por ser el bucket público.)
