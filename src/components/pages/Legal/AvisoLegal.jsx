import LegalLayout, { Dato } from './LegalLayout';
import { EMPRESA } from '../../../data/empresa';

/**
 * Aviso legal (Ley 34/2002, LSSI-CE). Identificación del titular del sitio.
 */
export default function AvisoLegal() {
  return (
    <LegalLayout
      titulo="Aviso legal"
      intro="En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ponen a disposición de los usuarios los datos identificativos del titular de este sitio web."
    >
      <h2>1. Titular del sitio web</h2>
      <ul>
        <li><strong>Titular:</strong> <Dato valor={EMPRESA.titular} /></li>
        <li><strong>NIF/CIF:</strong> <Dato valor={EMPRESA.nif} /></li>
        <li><strong>Domicilio:</strong> <Dato valor={EMPRESA.domicilio} /></li>
        <li><strong>Teléfono:</strong> {EMPRESA.telefono}</li>
        <li><strong>Email:</strong> <Dato valor={EMPRESA.email} /></li>
        <li><strong>Nombre comercial:</strong> {EMPRESA.rotulo}</li>
        <li><strong>Sitio web:</strong> {EMPRESA.web}</li>
        {EMPRESA.registroMercantil && (
          <li><strong>Datos registrales:</strong> <Dato valor={EMPRESA.registroMercantil} /></li>
        )}
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por objeto la presentación de la actividad comercial de {EMPRESA.nombreComercial},
        tienda situada en {EMPRESA.localidad} ({EMPRESA.provincia}) desde {EMPRESA.fundacion}, así como la venta
        a distancia de los productos ofrecidos a través de la tienda online.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso a este sitio web es gratuito y atribuye la condición de usuario. El usuario se compromete a
        utilizar el sitio, sus contenidos y servicios conforme a la ley, a este aviso legal, a la buena fe y al
        orden público, absteniéndose de cualquier uso que pueda dañar, inutilizar o sobrecargar el sitio o
        impedir su normal utilización.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio (textos, fotografías, logotipos, diseño y código) son titularidad de
        {' '}<Dato valor={EMPRESA.titular} /> o de terceros que han autorizado su uso, y están protegidos por la
        normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o
        comunicación pública sin autorización expresa. Las fotografías de prensa se utilizan con crédito a su autor.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños derivados del uso indebido del sitio ni de la
        indisponibilidad temporal del mismo por causas técnicas. Se procura que la información de productos y
        precios sea correcta y esté actualizada, pero pueden existir errores que se corregirán en cuanto se
        detecten.
      </p>

      <h2>6. Enlaces</h2>
      <p>
        El sitio puede contener enlaces a redes sociales o servicios de terceros (WhatsApp, Instagram, TikTok,
        Google). El titular no se responsabiliza de los contenidos ni de las políticas de privacidad de esos
        sitios externos.
      </p>

      <h2>7. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten
        a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios.
      </p>
    </LegalLayout>
  );
}
