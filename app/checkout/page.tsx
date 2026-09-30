import { PlanificaSection } from '@/components/shaky-planifica-section';
import { PageHero } from '@/components/shaky-page-hero';

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        title="PLANIFICA"
        accent="TU PEDIDO"
        subtitle="Elige sucursal, fecha y hora. Nosotros lo preparamos."
        image="/assets/checkout-athlete.webp"
        sticker={'TU ESFUERZO\nTAMBIÉN\nCUENTA'}
      />
      <PlanificaSection />
    </>
  );
}
