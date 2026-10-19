-- ════════════════════════════════════════════════════════════
--  Almacenamiento de fotos — Paco Vago (Supabase Storage)
--  Fase 2c.4: bucket público "productos" + permisos de subida.
--  Cómo usarlo: Supabase → SQL Editor → pegar y ejecutar.
-- ════════════════════════════════════════════════════════════

-- Bucket público (las fotos se sirven por URL pública, sin login).
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Solo fotos, y de tamaño razonable (aplicado el 19/10/2026). El bucket es
-- PÚBLICO: sin esto, quien robara una contraseña del panel podría colgar
-- cualquier archivo (una página HTML de phishing, un ejecutable…) en una
-- dirección con el nombre de la tienda. Supabase lo rechaza en el servidor,
-- incluso con la service_role; el panel avisa antes, pero eso se puede saltar.
-- Ojo: HEIC (fotos de iPhone) no entra. El iPhone suele convertirlas a JPG al
-- subirlas desde la web; si alguna falla, guardarla como JPG.
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'],
    file_size_limit    = 10485760   -- 10 MB
where id = 'productos';

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
