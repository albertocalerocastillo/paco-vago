-- ════════════════════════════════════════════════════════════
--  Permisos de escritura para el panel de admin — Paco Vago
--  Fase 2c: solo usuarios AUTENTICADOS pueden crear/editar/borrar.
--  Los visitantes anónimos siguen pudiendo SOLO leer (políticas del schema).
--  Cómo usarlo: Supabase → SQL Editor → pegar y ejecutar.
-- ════════════════════════════════════════════════════════════

-- categorias: escritura completa para autenticados
create policy "escritura categorias autenticados"
  on categorias for all
  to authenticated
  using (true)
  with check (true);

-- productos: escritura completa para autenticados
create policy "escritura productos autenticados"
  on productos for all
  to authenticated
  using (true)
  with check (true);
