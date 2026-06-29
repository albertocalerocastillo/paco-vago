import LegalLayout, { Dato } from './LegalLayout';
import { EMPRESA } from '../../../data/empresa';

/**
 * Política de devoluciones y derecho de desistimiento (RDL 1/2007, arts. 102 y ss.).
 */
export default function Devoluciones() {
  return (
    <LegalLayout
      titulo="Devoluciones y desistimiento"
      intro="Si has comprado a distancia, dispones de un derecho de desistimiento. Aquí te explicamos cómo devolver un producto, en qué plazo y qué excepciones existen."
    >
      <h2>1. Derecho de desistimiento</h2>
      <p>
        Tienes derecho a desistir de la compra en un plazo de <strong>14 días naturales</strong> desde que
        recibes el producto, sin necesidad de justificación. Para ejercerlo, comunícanoslo de forma inequívoca
        (por email o teléfono) antes de que finalice ese plazo.
      </p>

      <h2>2. Cómo solicitar la devolución</h2>
      <ol>
        <li>Escríbenos a <Dato valor={EMPRESA.email} /> o llama al {EMPRESA.telefono} indicando tu número de pedido.</li>
        <li>Te confirmaremos la dirección y la forma de envío de la devolución.</li>
        <li>Devuelve el producto en buen estado, a ser posible con su embalaje original.</li>
      </ol>

      <h2>3. Reembolso</h2>
      <p>
        Una vez recibido y comprobado el producto, te reembolsaremos el importe pagado (incluidos los gastos de
        envío estándar) por el mismo medio de pago que utilizaste, en un plazo máximo de 14 días naturales desde
        que nos comunicaste el desistimiento. Podemos retener el reembolso hasta haber recibido el producto.
      </p>
      <p>
        Los <strong>costes de la devolución</strong> (envío de vuelta) corren a cargo del cliente, salvo que el
        producto sea defectuoso o se haya enviado por error.
      </p>

      <h2>4. Excepciones al desistimiento</h2>
      <p>
        Conforme a la ley, no cabe desistimiento en, entre otros:
      </p>
      <ul>
        <li>Productos <strong>perecederos</strong> o que puedan deteriorarse o caducar con rapidez (muchos alimentos frescos).</li>
        <li>Productos <strong>precintados</strong> que no sean aptos para devolución por razones de salud o higiene y que hayan sido desprecintados tras la entrega.</li>
        <li>Productos <strong>cortados o preparados a medida</strong> según tus indicaciones (por ejemplo, cortes de queso, embutido o mojama por peso).</li>
        <li>Productos que, por su naturaleza, se mezclen de forma indisociable con otros tras la entrega.</li>
      </ul>

      <h2>5. Productos defectuosos o pedidos erróneos</h2>
      <p>
        Si recibes un producto dañado, en mal estado o distinto al que pediste, contáctanos cuanto antes (a ser
        posible con una foto). Nos haremos cargo de la incidencia: reposición o reembolso, sin coste para ti.
      </p>

      <h2>6. Productos de alimentación</h2>
      <p>
        Por tratarse en buena parte de productos de alimentación, te recomendamos revisar el pedido en el momento
        de la entrega. Cualquier incidencia con productos frescos debe comunicarse de forma inmediata para poder
        gestionarla correctamente.
      </p>
    </LegalLayout>
  );
}
