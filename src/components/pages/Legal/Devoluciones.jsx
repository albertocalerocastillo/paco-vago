import { Link } from 'react-router-dom';
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
        antes de que finalice ese plazo. Basta con que la comunicación salga dentro del plazo.
      </p>

      <h2>2. Cómo solicitar la devolución</h2>
      <ol>
        <li>
          Desde la web, en <Link to="/legal/desistir">Desistir del contrato</Link>, o escribiéndonos a{' '}
          <Dato valor={EMPRESA.email} /> o llamando al {EMPRESA.telefono} con tu número de pedido. Si lo
          prefieres, puedes usar el modelo de formulario del final de esta página, aunque no es obligatorio.
        </li>
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

      {/* Modelo del Anexo B del RDL 1/2007. Hay que ofrecerlo (art. 97.1.i y
          art. 102); el texto es el oficial, solo se rellenan los datos del titular. */}
      <h2>7. Modelo de formulario de desistimiento</h2>
      <p className="text-sm text-stone-500">
        Sólo debe cumplimentar y enviar el presente formulario si desea desistir del contrato.
      </p>
      <div className="border border-stone-300 bg-white px-5 py-4 text-sm">
        <p>
          A la atención de <Dato valor={EMPRESA.titular} />, <Dato valor={EMPRESA.domicilio} />,{' '}
          <Dato valor={EMPRESA.email} />:
        </p>
        <ul>
          <li>Por la presente le comunico/comunicamos (*) que desisto de mi/desistimos de nuestro (*) contrato de venta del siguiente bien/prestación del siguiente servicio (*):</li>
          <li>Pedido el/recibido el (*):</li>
          <li>Nombre del consumidor o de los consumidores:</li>
          <li>Domicilio del consumidor o de los consumidores:</li>
          <li>Firma del consumidor o de los consumidores (solo si el presente formulario se presenta en papel):</li>
          <li>Fecha:</li>
        </ul>
        <p className="mb-0">(*) Táchese lo que no proceda.</p>
      </div>
    </LegalLayout>
  );
}
