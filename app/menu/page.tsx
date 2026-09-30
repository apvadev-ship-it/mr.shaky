import { MenuSection } from '@/components/shaky-menu-section';
import { PageHero } from '@/components/shaky-page-hero';

export default function MenuPage() {
  return (
    <>
      <PageHero
        title="NUESTRO"
        accent="MENÚ"
        subtitle="Comida real para cada objetivo."
        image="/assets/menu-hero.webp"
        mobileImage="/assets/menu-athlete.webp"
        sticker={'DISCIPLINA\nTAMBIÉN\nSE SABE DELICIOSA'}
      />
      <MenuSection />
    </>
  );
}
