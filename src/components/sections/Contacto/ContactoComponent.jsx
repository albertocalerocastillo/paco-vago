import InstagramIcon from '../../ui/InstagramIcon/InstagramIcon';

const REDES = [
  {
    href: 'https://www.instagram.com/paco_vago_puerta_sevilla',
    icon: <InstagramIcon className="mx-auto mb-4 text-stone-900 group-hover:text-amber-700 transition-colors" size={48} strokeWidth={1.5} />,
    nombre: 'Instagram',
    handle: '@paco_vago_puerta_sevilla'
  },
  {
    href: 'https://www.tiktok.com/@paco.vago.puerta',
    icon: <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">🎵</div>,
    nombre: 'TikTok',
    handle: '@paco.vago.puerta'
  }
];

export default function ContactoComponent() {
  return (
    <section id="contacto" className="py-24 px-6 bg-amber-50">
      <div className="max-w-4xl mx-auto text-center">

        {/* Cabecera */}
        <div className="text-amber-700 text-sm uppercase tracking-[0.4em] mb-4">Síguenos</div>
        <h2 className="text-5xl md:text-6xl font-bold mb-6">En las redes</h2>
        <div className="w-24 h-px bg-amber-700 mx-auto mb-12"></div>

        <p className="text-lg text-stone-700 mb-12">
          Descubre cada día las novedades, productos destacados y la vida en la tienda.
        </p>

        {/* Tarjetas de redes sociales */}
        <div className="grid sm:grid-cols-2 gap-6">
          {REDES.map(({ href, icon, nombre, handle }) => (
            <a
              key={nombre}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-8 hover:shadow-xl transition-all border border-stone-200"
            >
              {icon}
              <h3 className="text-xl font-bold mb-2">{nombre}</h3>
              <p className="text-stone-600 text-sm">{handle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
