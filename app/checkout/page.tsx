import ShakyApp from '../shaky-app';

/* Finalizar el pedido. Vive fuera de [section] porque app/checkout ya existe
   para la vuelta del pago, y un segmento estatico gana a uno dinamico. */
export default function Page() {
  return <ShakyApp />;
}
