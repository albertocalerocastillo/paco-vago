import { useState } from 'react';
import { MapPin, Clock, Phone } from '../../../theme/icons';
import { TELEFONO, TELEFONO_HREF, DIRECCION } from '../../../data/contacto';
import { TEMPORADA } from '../../../data/horarios';
import EstadoTiendaBadge from './EstadoTiendaBadge';
import HorariosGrid from './HorariosGrid';
import Reveal from '../../ui/Reveal/RevealComponent';

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.5!2d-5.6435!3d37.4710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPuerta%20de%20Sevilla%2C%20Carmona!5e0!3m2!1ses!2ses!4v1234567890';

// Enlace normal a Google Maps: abrirlo es decisión del visitante, no hace falta permiso.
const MAPS_LINK_URL = 'https://www.google.com/maps/search/?api=1&query=Paco+Vago+Puerta+de+Sevilla+Carmona';

export default function VisitanosComponent() {
  // El mapa NO se carga solo. Un iframe de Google conecta con google.com nada
  // más abrir la página (IP del visitante, y Google puede poner o leer sus
  // cookies), y la AEPD exige consentimiento previo para eso. Así el que lo
  // quiere lo pide con un clic, y la web se queda sin banner de cookies.
  const [verMapa, setVerMapa] = useState(false);

  return (
    <section id="visitanos" className="py-24 px-6 bg-stone-900 text-stone-50">
      <div className="max-w-7xl mx-auto">

        {/* Cabecera */}
        <Reveal className="text-center mb-16">
          <div className="text-amber-400 text-sm uppercase tracking-[0.4em] mb-4">Visítanos</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Te esperamos</h2>
          <div className="w-24 h-px bg-amber-400 mx-auto mb-8"></div>

          {/* Estado abierto/cerrado en tiempo real */}
          <EstadoTiendaBadge />
        </Reveal>

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
                  className="inline-block py-2 -my-2 text-stone-300 hover:text-amber-400 transition-colors text-lg"
                >
                  {TELEFONO}
                </a>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4">
              <Clock className="text-amber-400 mt-1 shrink-0" size={24} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <h3 className="text-sm font-bold uppercase tracking-wider">Horario semanal</h3>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
                    {TEMPORADA.includes('invierno') ? '❄️' : '☀️'} {TEMPORADA}
                  </span>
                </div>
                <HorariosGrid />
              </div>
            </div>
          </div>

          {/* Columna derecha: mapa */}
          <div className="bg-stone-800 rounded-sm overflow-hidden h-80 md:h-auto md:min-h-[400px]">
            {verMapa ? (
              <iframe
                src={MAPS_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Paco Vago en Carmona"
              ></iframe>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-6 py-10">
                <MapPin className="text-amber-400" size={40} />
                <p className="text-stone-300">
                  {DIRECCION.calle} · {DIRECCION.ciudad}
                </p>
                <button
                  onClick={() => setVerMapa(true)}
                  className="bg-amber-700 hover:bg-amber-800 text-stone-50 font-semibold px-6 py-3 uppercase text-sm tracking-widest transition-colors"
                >
                  Ver mapa
                </button>
                <p className="text-xs text-stone-400 max-w-xs">
                  El mapa se carga desde Google Maps, que puede usar cookies. O si lo prefieres,{' '}
                  <a
                    href={MAPS_LINK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-400"
                  >
                    ábrelo en Google Maps
                  </a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
