import { MapPin, Clock, Phone } from 'lucide-react';
import { horarios } from '../../../data/horarios';

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.5!2d-5.6435!3d37.4710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPuerta%20de%20Sevilla%2C%20Carmona!5e0!3m2!1ses!2ses!4v1234567890';

export default function VisitanosComponent() {
  return (
    <section id="visitanos" className="py-24 px-6 bg-stone-900 text-stone-50">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <div className="text-center mb-16">
          <div className="text-amber-400 text-sm uppercase tracking-[0.4em] mb-4">Visítanos</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Te esperamos</h2>
          <div className="w-24 h-px bg-amber-400 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Info de contacto */}
          <div>
            {/* Dirección */}
            <div className="flex items-start gap-4 mb-8">
              <MapPin className="text-amber-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Dónde</h3>
                <p className="text-stone-300">
                  Puerta de Sevilla<br />Carmona, Sevilla
                </p>
              </div>
            </div>

            {/* Horario */}
            <div className="flex items-start gap-4 mb-8">
              <Clock className="text-amber-400 mt-1 shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Horario</h3>
                <div className="space-y-2">
                  {horarios.map((h, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-stone-300 border-b border-stone-800 pb-2"
                    >
                      <span>{h.dia}</span>
                      <span className={h.closed ? 'text-stone-500 italic' : 'text-amber-400'}>
                        {h.hora}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-4">
              <Phone className="text-amber-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Teléfono</h3>
                <a
                  href="tel:+34954140871"
                  className="text-stone-300 hover:text-amber-400 transition-colors text-lg"
                >
                  954 14 08 71
                </a>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="bg-stone-800 aspect-square md:aspect-auto rounded-sm overflow-hidden">
            <iframe
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Paco Vago en Carmona"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
