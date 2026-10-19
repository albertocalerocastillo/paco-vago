import LegalLayout, { Dato } from './LegalLayout';
import { EMPRESA } from '../../../data/empresa';

/**
 * Política de privacidad (RGPD UE 2016/679 y LOPDGDD 3/2018).
 */
export default function Privacidad() {
  return (
    <LegalLayout
      titulo="Política de privacidad"
      intro="Esta política explica cómo se tratan los datos personales que nos facilitas, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD)."
    >
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Responsable:</strong> <Dato valor={EMPRESA.titular} /></li>
        <li><strong>NIF/CIF:</strong> <Dato valor={EMPRESA.nif} /></li>
        <li><strong>Domicilio:</strong> <Dato valor={EMPRESA.domicilio} /></li>
        <li><strong>Email:</strong> <Dato valor={EMPRESA.email} /></li>
        <li><strong>Teléfono:</strong> {EMPRESA.telefono}</li>
      </ul>

      <h2>2. ¿Qué datos tratamos y con qué fin?</h2>
      <ul>
        <li>
          <strong>Pedidos y venta online:</strong> nombre, dirección de envío y facturación, teléfono, email y
          datos del pago. Finalidad: gestionar tu pedido, el envío, la facturación y la atención posventa.
        </li>
        <li>
          <strong>Pedidos por WhatsApp:</strong> el teléfono y los mensajes que nos envías, para atender tu
          consulta o pedido. La conversación se realiza en la plataforma de WhatsApp, sujeta a su propia política.
        </li>
        <li>
          <strong>Desistimientos y devoluciones:</strong> nombre, email, número de pedido y lo que nos indiques,
          para tramitar tu desistimiento y el reembolso, y poder acreditar cuándo lo ejerciste.
        </li>
        <li>
          <strong>Consultas de contacto:</strong> los datos que nos facilites para responderte.
        </li>
      </ul>

      <h2>3. Base jurídica</h2>
      <p>
        El tratamiento se basa en la <strong>ejecución del contrato de compraventa</strong> (gestión del pedido),
        en el <strong>cumplimiento de obligaciones legales</strong> (facturación y fiscalidad) y, en su caso, en
        tu <strong>consentimiento</strong> (por ejemplo, para comunicaciones comerciales si las solicitas).
      </p>

      <h2>4. Conservación</h2>
      <p>
        Los datos se conservan mientras dure la relación comercial y, después, durante los plazos legalmente
        exigidos (la normativa fiscal y mercantil obliga a conservar la documentación de facturación, con
        carácter general, durante varios años).
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        No se ceden datos a terceros salvo obligación legal o cuando sea imprescindible para prestar el servicio:
      </p>
      <ul>
        <li>Empresa de transporte/mensajería, para entregar tu pedido.</li>
        <li>
          <strong>Stripe Payments Europe, Ltd.</strong> (Irlanda), que procesa el pago. Los datos de tu tarjeta
          los recibe directamente Stripe; nosotros nunca los vemos.
        </li>
        <li>
          Proveedores tecnológicos que actúan como encargados del tratamiento: <strong>Vercel Inc.</strong>{' '}
          (alojamiento de la web) y <strong>Supabase Inc.</strong> (base de datos, con servidores en la Unión
          Europea).
        </li>
        <li>Administración tributaria, cuando exista obligación legal.</li>
      </ul>

      <h3>Transferencias internacionales</h3>
      <p>
        Vercel, Supabase y Stripe pertenecen a grupos con sede en Estados Unidos, por lo que puede haber
        accesos a los datos desde allí. Estas transferencias se amparan en el Marco de Privacidad de Datos
        UE-EE. UU. o, en su defecto, en las cláusulas contractuales tipo aprobadas por la Comisión Europea.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y
        portabilidad escribiendo a <Dato valor={EMPRESA.email} />, indicando el derecho que deseas ejercer.
        También puedes presentar una reclamación ante la Agencia Española de Protección de Datos
        (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos. Los pagos con tarjeta se
        procesan a través de una pasarela segura; en ningún caso almacenamos los datos completos de tu tarjeta.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Este sitio utiliza únicamente el almacenamiento local imprescindible para su funcionamiento (por
        ejemplo, recordar tu carrito de la compra). No se utilizan cookies de publicidad ni de analítica.
      </p>
      <p>
        El <strong>mapa de Google</strong> de la sección «Visítanos» no se carga hasta que pulsas «Ver mapa».
        Al pulsarlo, tu navegador se conecta con Google, que puede usar sus propias cookies conforme a su{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad</a>.
        Si no lo pulsas, no se envía nada a Google.
      </p>
      <p>
        Al pagar, la pasarela <strong>Stripe</strong> usa sus propias cookies técnicas para procesar el cobro de
        forma segura y prevenir el fraude. Si en el futuro incorporáramos cookies no imprescindibles, te
        pediríamos antes tu consentimiento.
      </p>
    </LegalLayout>
  );
}
