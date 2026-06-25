-- ════════════════════════════════════════════════════════════
--  Datos iniciales — Paco Vago (catálogo migrado de data/categorias.js)
--  Fase 2b: carga de categorías + productos.
--  IDEMPOTENTE: se puede re-ejecutar sin duplicar (vacía y recarga).
--  Cómo usarlo: Supabase → SQL Editor → pegar y ejecutar.
-- ════════════════════════════════════════════════════════════

-- Asegura la columna tags (chips de la tarjeta) por si el schema es anterior.
alter table categorias add column if not exists tags text[];

begin;

-- Limpia el catálogo para poder recargar sin duplicados.
-- (productos se borra solo por el ON DELETE CASCADE, pero lo hacemos explícito)
delete from productos;
delete from categorias;

-- ─── CATEGORÍAS ───────────────────────────────────────────
insert into categorias (slug, titulo, icono, descripcion, tags, orden) values
  ('gourmet', 'Gourmet', 'Wheat',
   'Jamones, quesos, chacinas, frutos secos, especias a granel, miel 100% natural, legumbres y AOVE. Patés de mar exclusivos y, por supuesto, las mejores conservas: Albo, Ortiz, La Tarifeña, Herpac, gildas y banderillas…',
   array['Jamones','Quesos','Chacinas','Patés de mar','Conservas','Encurtidos','Especias a granel','Infusiones','Miel','AOVE'], 1),

  ('bodega', 'Bodega', 'Wine',
   'Vinos, whiskys y licores selectos. Y un tesoro local: licores y cremas artesanas elaboradas aquí, en Carmona.',
   array['Vinos selectos','Whiskys','Licores de Carmona','Cremas artesanas'], 2),

  ('golosinas', 'Golosinas', 'Candy',
   'Gran variedad en caramelos y golosinas a granel, tradicionales y futuristas: gominolas, regaliz, peladillas, caramelos clásicos y las últimas novedades para los más golosos.',
   array['Caramelos','Gominolas','Regaliz','Peladillas','Chuches a granel'], 3),

  ('moda-piel', 'Moda y Piel', 'ShoppingBag',
   'Sombreros Panamá, gorras, moda flamenca, marroquinería, cinturones, carteras y monederos en piel. Bolsos amazonas, carteras de caballero y artículos de piel de temporada.',
   array['Sombreros Panamá','Gorras','Bolsos de piel','Moda flamenca','Marroquinería','Cinturones','Carteras'], 4),

  ('artesania', 'Artesanía', 'Palette',
   'Artículos artesanos de palma, souvenirs y llaveros con el sabor de Carmona.',
   array['Artículos de palma','Souvenirs','Llaveros'], 5),

  ('merceria-hogar', 'Mercería y Hogar', 'Home',
   'Mercería completa, droguería, medias, calcetines y hombreras. Distribuimos ECOJIN, el limpiador multiusos biodegradable: sin tóxicos ni lejías y tan concentrado que de 1 litro salen 15.',
   array['Mercería','Droguería','Limpieza ecológica','ECOJIN','Control de plagas','Medias y calcetines'], 6),

  ('aire-libre', 'Aire libre', 'Tent',
   'Todo para camping, playa, equipos de fútbol, juguetes y emergencias. Y navajas artesanas, con servicio de afilado.',
   array['Camping','Playa','Navajas','Afilado','Equipos de fútbol','Juguetes'], 7),

  ('automocion', 'Automoción', 'Car',
   'Gama profesional Gorilux para la limpieza y el cuidado de tu coche: champús con cera, limpiallantas, espuma de prelavado, descontaminante férrico, limpiatapicerías y mucho más.',
   array['Gorilux','Champú con cera','Limpiallantas','Espuma de nieve','APC desengrasante','Microfibras'], 8),

  ('perfumeria', 'Perfumería', 'Sparkles',
   'Perfumes, colonias y cosmética. Y todo para el afeitado clásico y la higiene personal: brochas, after shave, cremas, dental y mucho más.',
   array['Perfumes','Colonias','Afeitado','Higiene personal','Cosmética','Aceites esenciales'], 9);

-- ─── PRODUCTOS ────────────────────────────────────────────
-- categoria_id se resuelve por slug, así no dependemos de los id autogenerados.
insert into productos (categoria_id, foto, nombre, descripcion, orden) values
  -- Gourmet
  ((select id from categorias where slug='gourmet'), '/fotos/variedad.jpg',    'Nuestro mostrador gourmet',       'Jamones, quesos al corte, aceites, encurtidos… lo mejor de la tienda', 1),
  ((select id from categorias where slug='gourmet'), '/fotos/pates.jpg',        'Patés de mar Agromar',            'Exclusivos: oricios, centollo, bogavante y cabracho', 2),
  ((select id from categorias where slug='gourmet'), '/fotos/aceite.jpg',       'AOVE de Carmona',                 'Aceite de oliva virgen extra local: El Molino de Carmona, La Matilla…', 3),
  ((select id from categorias where slug='gourmet'), '/fotos/embutido.jpg',     'Chacinas e ibéricos',             'Mojama de Barbate, chorizo cular ibérico, salchichón, panceta…', 4),
  ((select id from categorias where slug='gourmet'), '/fotos/miel-3.jpg',       'Miel Mi Vieja Colmena',           'Miel 100% natural de apicultor · azahar, romero, flores, eucalipto…', 5),
  ((select id from categorias where slug='gourmet'), '/fotos/miel-2.jpg',       'Jalea real, polen y orzas',       'Jalea real, polen de abeja y orzas con miel', 6),
  ((select id from categorias where slug='gourmet'), '/fotos/especias.jpg',     'Especias a granel',               'Pimentón, orégano, comino, ajo molido… al peso', 7),
  ((select id from categorias where slug='gourmet'), '/fotos/infusiones.jpg',   'Infusiones y tés a granel',       'Anís estrellado, flor de Jamaica, té verde, Embrujo de Granada, té Pakistaní…', 8),
  ((select id from categorias where slug='gourmet'), '/fotos/legumbres.jpg',    'Máxima selección en legumbres',   'Garbanzos, lentejas y judión Vegas Bañezanas', 9),
  ((select id from categorias where slug='gourmet'), '/fotos/aceitunas.jpg',    'Aceitunas y encurtidos',          'Aceitunas, pepinillos, alcaparras y banderillas', 10),
  ((select id from categorias where slug='gourmet'), '/fotos/conservas-4.jpg',  'Conservas selectas',              'Lo mejor en conserva: Ortiz, Tejero, Balea, La Tarifeña, Lotamar…', 11),
  ((select id from categorias where slug='gourmet'), '/fotos/conservas-1.jpg',  'Conservas Albo',                  'Sardinas, caballa, atún, ventresca…', 12),
  ((select id from categorias where slug='gourmet'), '/fotos/conservas-2.jpg',  'Conservas Ortiz',                 'Atún claro, bonito, anchoas…', 13),
  ((select id from categorias where slug='gourmet'), '/fotos/conservas-3.jpg',  'Conservas Balea',                 'Sardinillas, mejillones, agujas…', 14),
  ((select id from categorias where slug='gourmet'), '/fotos/conservas-5.jpg',  'Conservas Tejero',                'Bonito y melva en aceite', 15),

  -- Bodega
  ((select id from categorias where slug='bodega'), '/fotos/licores.jpg', 'Licores artesanos de Carmona', 'Cremas de roscón, arroz con leche, torrijas, brownie, whisky; limonchelo, naranchelo y más', 1),

  -- Golosinas
  ((select id from categorias where slug='golosinas'), '/fotos/chuches-1.jpg', 'Golosinas a granel',          'Gran variedad de gominolas y chuches', 1),
  ((select id from categorias where slug='golosinas'), '/fotos/chuches-3.jpg', 'Tradicionales y futuristas',  'Regaliz, peladillas, caramelos clásicos y novedades', 2),
  ((select id from categorias where slug='golosinas'), '/fotos/chuches-2.jpg', 'Caramelos surtidos',          'Caramelos clásicos y especialidades', 3),

  -- Moda y Piel
  ((select id from categorias where slug='moda-piel'), '/fotos/moda.jpg',   'Sombreros Panamá',     'Para el verano', 1),
  ((select id from categorias where slug='moda-piel'), '/fotos/gorras.jpg', 'Gorras de temporada',  null, 2),
  ((select id from categorias where slug='moda-piel'), '/fotos/piel-1.jpg', 'Bolsos de piel',       'Bordados artesanos', 3),
  ((select id from categorias where slug='moda-piel'), '/fotos/piel-2.jpg', 'Carteras y monederos', null, 4),
  ((select id from categorias where slug='moda-piel'), '/fotos/piel-3.jpg', 'Bolsos bandolera',     null, 5),
  ((select id from categorias where slug='moda-piel'), '/fotos/piel-4.jpg', 'Marroquinería',        null, 6),

  -- Artesanía: sin productos (sin fotos aún)

  -- Mercería y Hogar
  ((select id from categorias where slug='merceria-hogar'), '/fotos/insecticidas.jpg', 'Droguería y control de plagas', 'Insecticidas, raticidas, antipolillas y droguería del hogar', 1),

  -- Aire libre
  ((select id from categorias where slug='aire-libre'), '/fotos/navajas.jpg', 'Navajas y afilado', 'Navajas artesanas y servicio de afilado', 1),

  -- Automoción
  ((select id from categorias where slug='automocion'), '/fotos/coches.jpg', 'Gama Gorilux', 'Limpieza profesional de coche', 1),

  -- Perfumería
  ((select id from categorias where slug='perfumeria'), '/fotos/perfumeria.jpg', 'Perfumería y cosmética',     'Colonias, cremas, desodorantes…', 1),
  ((select id from categorias where slug='perfumeria'), '/fotos/afeitado.jpg',   'Todo para el afeitado',      'Maquinillas, brochas, espumas y after shave (Floïd, LEA, Williams…)', 2),
  ((select id from categorias where slug='perfumeria'), '/fotos/higiene.jpg',    'Higiene y cuidado personal', 'Dental, cepillos, colonias clásicas…', 3);

commit;

-- ─── COMPROBACIÓN ─────────────────────────────────────────
-- Debe devolver 9 categorías y 31 productos.
select (select count(*) from categorias) as categorias,
       (select count(*) from productos)  as productos;
