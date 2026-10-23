import LegalLayout, { Dato } from './LegalLayout';
import { Link } from 'react-router-dom';
import { EMPRESA } from '../../../data/empresa';

/**
 * Condiciones generales de venta (TRLGDCU — RDL 1/2007 — venta a distancia).
 *
 * OJO: varios apartados dependen de decisiones del tío todavía pendientes
 * (IVA, portes, pasarela de pago, venta por kilo). Se dejan como placeholders
 * resaltados; al concretarse, basta editar el texto de este documento.
 */
export default function Condiciones() {
  return (
    <LegalLayout
      titulo="Condiciones generales de venta"
      intro="Estas condiciones regulan la compra de productos a través de la tienda online y se aplican junto con la legislación de defensa de consumidores y usuarios (RDL 1/2007)."
    >
      <h2>1. Vendedor</h2>
      <p>
        La venta la realiza <Dato valor={EMPRESA.titular} /> (NIF/CIF <Dato valor={EMPRESA.nif} />), con
        domicilio en <Dato valor={EMPRESA.domicilio} />. Para cualquier cuestión sobre tu pedido puedes escribir
        a <Dato valor={EMPRESA.email} /> o llamar al {EMPRESA.telefono}.
      </p>

      <h2>2. Productos y precios</h2>
      <p>
        Los productos ofertados son los disponibles en la tienda online en cada momento. Cada producto muestra su
        descripción y precio. Los precios están expresados en euros (€).
      </p>
      <ul>
        <li><strong>IVA:</strong> <Dato valor="Todos los precios mostrados incluyen el IVA aplicable a cada producto" />.</li>
        <li>
          <strong>Productos por peso</strong> (queso, salchichón, mojama y similares):{' '}
          <Dato valor="En la tienda online solo se ofrecen piezas con precio cerrado, el que figura en cada producto, sin ajustes posteriores por el peso final. Los productos cuyo precio dependa del peso exacto no se venden por la web: puedes pedirlos por WhatsApp y te preparamos el pedido a medida" />.
        </li>
      </ul>
      <p>
        El vendedor se reserva el derecho a modificar los precios; el precio aplicable será el vigente en el
        momento de confirmar el pedido.
      </p>

      <h2>3. Proceso de compra</h2>
      <p>
        Para comprar, añade los productos al carrito y sigue los pasos del proceso de pedido. Antes de confirmar,
        verás el resumen con los productos, el importe y los gastos de envío. Al confirmar aceptas estas
        condiciones. Al completar el pago verás la confirmación del pedido con su número de referencia y
        recibirás el justificante del pago en el email que indiques.
      </p>
      <p className="text-sm text-stone-500">
        Mientras no esté activo el pago con tarjeta, los pedidos pueden tramitarse por WhatsApp, acordando el pago
        y el envío de forma directa con la tienda.
      </p>

      <h2>4. Formas de pago</h2>
      <p>
        <Dato valor="Tarjeta de débito o crédito y Bizum. El cobro se hace en el momento de confirmar el pedido" />.
        El pago se procesa a través de Stripe, pasarela de pago segura; la tienda no ve ni almacena los datos de
        la tarjeta. Los pedidos por WhatsApp se pagan como se acuerde directamente con la tienda.
      </p>

      <h2>5. Envíos y plazos</h2>
      <ul>
        <li><strong>Zona de envío:</strong> <Dato valor="Península. Los envíos a Baleares y Canarias se preparan bajo presupuesto: consúltanos antes por WhatsApp o email y te confirmamos el coste del transporte" />.</li>
        <li><strong>Gastos de envío:</strong> <Dato valor="Según el peso del pedido: hasta 5 kg, 6,50 €; hasta 10 kg, 12 €; hasta 15 kg, 18 €; más de 15 kg, 25 €. IVA incluido. Envío gratis en pedidos desde 100 € de productos que pesen menos de 10 kg. Baleares y Canarias, bajo presupuesto" />.</li>
        <li><strong>Plazo de entrega estimado:</strong> <Dato valor="Entre 2 y 5 días laborables en península desde la confirmación del pedido. Si algún producto tarda más, te avisamos" />.</li>
      </ul>
      <p>
        Los productos frescos o perecederos pueden tener condiciones de envío específicas para garantizar su
        conservación.
      </p>

      <h2>6. Desistimiento y devoluciones</h2>
      <p>
        Como consumidor tienes derecho a desistir de la compra en los términos previstos por la ley. Consulta la
        <Link to="/legal/devoluciones"> política de devoluciones</Link> para conocer el procedimiento, los plazos
        y las excepciones (por ejemplo, productos perecederos o alimentos precintados que se hayan abierto).
        Puedes desistir directamente desde la web en <Link to="/legal/desistir">Desistir del contrato</Link>.
      </p>

      <h2>7. Garantía</h2>
      <p>
        Los productos tienen la garantía legal de conformidad de <strong>tres años</strong> desde la entrega
        (RDL 1/2007, art. 120). En los alimentos, sin perjuicio de su fecha de consumo preferente o de
        caducidad. Si recibes un producto defectuoso o erróneo, contacta con nosotros y lo resolveremos sin
        coste para ti.
      </p>

      <h2>8. Facturación</h2>
      <p>
        <Dato valor="Se emite factura a quien la solicite. Puedes pedirla escribiendo a nuestro email de contacto e indicando el número de pedido y tus datos fiscales (nombre o razón social, NIF y dirección)" />.
      </p>

      <h2>9. Atención al cliente y reclamaciones</h2>
      <p>
        Para cualquier reclamación, escribe a <Dato valor={EMPRESA.email} /> o llama al {EMPRESA.telefono}.
        Tenemos a tu disposición hojas de quejas y reclamaciones oficiales de la Junta de Andalucía, en la
        tienda y también en formato electrónico a través de{' '}
        <a href="https://www.consumoresponde.es" target="_blank" rel="noopener noreferrer">Consumo Responde</a>.
      </p>
      {/* La plataforma europea de resolucion de litigios en linea (ODR) cerro el
          20/07/2025 (Reglamento UE 2024/3228). Ya no hay obligacion de enlazarla
          y enlazarla mandaria al cliente a una pagina que no existe. */}

      <h2>10. Legislación y jurisdicción</h2>
      <p>
        Estas condiciones se rigen por la legislación española. En las relaciones con consumidores serán
        competentes los juzgados y tribunales que correspondan según la normativa de protección de consumidores.
      </p>
    </LegalLayout>
  );
}
