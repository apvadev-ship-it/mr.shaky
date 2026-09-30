"use client";
import { NutritionTools } from '@/components/shaky-tools';
import { PageHero } from '@/components/shaky-page-hero';
import { useShaky } from '@/components/shaky-store';

export default function CalculadorasPage() {
  const { add } = useShaky();
  return (
    <>
      <PageHero
        title="TUS METAS."
        accent="TUS MACROS."
        subtitle="Calcula tu punto de partida y encuentra tu plato."
        image="/assets/calculator-athlete.webp"
      />
      <NutritionTools add={add} />
    </>
  );
}
