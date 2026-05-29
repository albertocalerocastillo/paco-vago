import { MapPin, Clock, Phone } from '../../../theme/icons';
import { TELEFONO, TELEFONO_HREF, DIRECCION } from '../../../data/contacto';
import EstadoTiendaBadge from './EstadoTiendaBadge';
import HorariosGrid from './HorariosGrid';

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
          <div className="w-24 h-px bg-amber-400 mx-auto mb-8"></div>

          {/* Estado abierto/cerrado en tiempo real */}
          <EstadoTiendaBadge />
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Columna izquierda: info + horarios */}
          <div>
            {/* Dirección */}
            <div className="flex items-start gap-4 mb-8">
              <MapPin className="text-amber-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Dónde</h3>
                <p className="text-stone-300">
                  {DIRECCION.calle}<br />{DIRECCION.ciudad}, {DIRECCION.provincia}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-4 mb-8">
              <Phone className="text-amber-400 mt-1 shrink-0" size={24} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Teléfono</h3>
                <a
                  href={TELEFONO_HREF}
                  className="text-stone-300 hover:text-amber-400 transition-colors text-lg"
                >
                  {TELEFONO}
                </a>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4">
              <Clock className="text-amber-400 mt-1 shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Horario semanal</h3>
                <HorariosGrid />
              </div>
            </div>
          </div>

          {/* Columna derecha: mapa */}
          <div className="bg-stone-800 aspect-square md:aspect-auto rounded-sm overflow-hidden min-h-[400px]">
            <iframe
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
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
