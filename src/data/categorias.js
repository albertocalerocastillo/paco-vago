import { Wheat, Wine, ShoppingBag, Palette, Home, Tent, Sparkles, Car, Candy } from '../theme/icons';

/**
 * Cada categoría tiene una lista de `productos` (nombre + foto + descripción).
 * Este es el modelo que usará la futura tienda online: solo habrá que añadir
 * precio y botón de compra cuando exista backend.
 */
export const categorias = [
  {
    icon: Wheat,
    titulo: 'Gourmet',
    desc: 'Jamones, quesos, chacinas, frutos secos, especias a granel, miel 100% natural, legumbres y AOVE. Patés de mar exclusivos y, por supuesto, las mejores conservas: Albo, Ortiz, La Tarifeña, Herpac, gildas y banderillas…',
    items: ['Jamones', 'Quesos', 'Chacinas', 'Patés de mar', 'Conservas', 'Especias a granel', 'Miel', 'AOVE'],
    productos: [
      { src: '/fotos/pates.jpg', nombre: 'Patés de mar Agromar', desc: 'Exclusivos: oricios, centollo, bogavante y cabracho' },
      { src: '/fotos/miel-1.jpg', nombre: 'Miel Mi Vieja Colmena', desc: 'Miel 100% natural de apicultor · azahar, eucalipto, tomillo, mil flores' },
      { src: '/fotos/miel-2.jpg', nombre: 'Jalea real, polen y orzas', desc: 'Jalea real, polen de abeja y orzas con miel' },
      { src: '/fotos/especias.jpg', nombre: 'Especias a granel', desc: 'Pimentón, orégano, comino, ajo molido… al peso' },
      { src: '/fotos/legumbres.jpg', nombre: 'Máxima selección en legumbres', desc: 'Garbanzos, lentejas y judión Vegas Bañezanas' },
      { src: '/fotos/conservas-1.jpg', nombre: 'Conservas Albo', desc: 'Sardinas, caballa, atún, ventresca…' },
      { src: '/fotos/conservas-2.jpg', nombre: 'Conservas Ortiz', desc: 'Atún claro, bonito, anchoas…' },
      { src: '/fotos/conservas-3.jpg', nombre: 'Conservas Balea', desc: 'Sardinillas, mejillones, agujas…' },
      { src: '/fotos/conservas-5.jpg', nombre: 'Conservas Tejero', desc: 'Bonito y melva en aceite' }
    ]
  },
  {
    icon: Wine,
    titulo: 'Bodega',
    desc: 'Selección de licores, whiskys y vinos cuidadosamente escogidos.',
    items: ['Vinos selectos', 'Whiskys', 'Licores'],
    productos: []
  },
  {
    icon: Candy,
    titulo: 'Golosinas',
    desc: 'Gran variedad en caramelos y golosinas a granel, tradicionales y futuristas: gominolas, regaliz, peladillas, caramelos clásicos y las últimas novedades para los más golosos.',
    items: ['Caramelos', 'Gominolas', 'Regaliz', 'Peladillas', 'Chuches a granel'],
    productos: [
      { src: '/fotos/chuches-1.jpg', nombre: 'Golosinas a granel', desc: 'Gran variedad de gominolas y chuches' },
      { src: '/fotos/chuches-3.jpg', nombre: 'Tradicionales y futuristas', desc: 'Regaliz, peladillas, caramelos clásicos y novedades' },
      { src: '/fotos/chuches-2.jpg', nombre: 'Caramelos surtidos', desc: 'Caramelos clásicos y especialidades' }
    ]
  },
  {
    icon: ShoppingBag,
    titulo: 'Moda y Piel',
    desc: 'Sombreros Panamá, gorras, moda flamenca, marroquinería, cinturones, carteras y monederos en piel. Bolsos amazonas, carteras de caballero y artículos de piel de temporada.',
    items: ['Sombreros Panamá', 'Gorras', 'Bolsos de piel', 'Moda flamenca', 'Marroquinería', 'Cinturones', 'Carteras'],
    productos: [
      { src: '/fotos/moda.jpg',   nombre: 'Sombreros Panamá', desc: 'Para el verano' },
      { src: '/fotos/gorras.jpg', nombre: 'Gorras de temporada' },
      { src: '/fotos/piel-1.jpg', nombre: 'Bolsos de piel', desc: 'Bordados artesanos' },
      { src: '/fotos/piel-2.jpg', nombre: 'Carteras y monederos' },
      { src: '/fotos/piel-3.jpg', nombre: 'Bolsos bandolera' },
      { src: '/fotos/piel-4.jpg', nombre: 'Marroquinería' }
    ]
  },
  {
    icon: Palette,
    titulo: 'Artesanía',
    desc: 'Artículos artesanos de palma, souvenirs y llaveros con el sabor de Carmona.',
    items: ['Artículos de palma', 'Souvenirs', 'Llaveros'],
    productos: []
  },
  {
    icon: Home,
    titulo: 'Mercería y Hogar',
    desc: 'Mercería completa, droguería, medias, calcetines y hombreras. Distribuimos ECOJIN, el limpiador multiusos biodegradable: sin tóxicos ni lejías y tan concentrado que de 1 litro salen 15.',
    items: ['Mercería', 'Droguería', 'Limpieza ecológica', 'ECOJIN', 'Control de plagas', 'Medias y calcetines'],
    productos: [
      { src: '/fotos/insecticidas.jpg', nombre: 'Droguería y control de plagas', desc: 'Insecticidas, raticidas, antipolillas y droguería del hogar' }
    ]
  },
  {
    icon: Tent,
    titulo: 'Aire libre',
    desc: 'Todo para camping, playa, equipos de fútbol, juguetes y artículos de emergencia.',
    items: ['Camping', 'Playa', 'Equipos de fútbol', 'Juguetes', 'Emergencias'],
    productos: []
  },
  {
    icon: Car,
    titulo: 'Automoción',
    desc: 'Gama profesional Gorilux para la limpieza y el cuidado de tu coche: champús con cera, limpiallantas, espuma de prelavado, descontaminante férrico, limpiatapicerías y mucho más.',
    items: ['Gorilux', 'Champú con cera', 'Limpiallantas', 'Espuma de nieve', 'APC desengrasante', 'Microfibras'],
    productos: [
      { src: '/fotos/coches.jpg', nombre: 'Gama Gorilux', desc: 'Limpieza profesional de coche' }
    ]
  },
  {
    icon: Sparkles,
    titulo: 'Perfumería',
    desc: 'Perfumes, colonias y aceites esenciales seleccionados.',
    items: ['Perfumes', 'Colonias', 'Aceites esenciales'],
    productos: []
  }
];
