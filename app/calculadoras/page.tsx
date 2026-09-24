"use client";
import { NutritionTools } from '@/components/shaky-tools';
import { useShaky } from '@/components/shaky-store';

export default function CalculadorasPage() {
  const { add } = useShaky();
  return <NutritionTools add={add} />;
}
