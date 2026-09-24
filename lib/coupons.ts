// Fixed coupon codes. Percent-off, applied to the subtotal before any provider fee.
// Server routes are the source of truth — never trust a discount computed on the client.
export const COUPONS: Record<string, number> = {
  BIENVENIDA10: 10,
  SHAKY20: 20,
};

export function getCouponPercent(rawCode: string | null | undefined): number | null {
  if (!rawCode) return null;
  const code = rawCode.trim().toUpperCase();
  return Object.prototype.hasOwnProperty.call(COUPONS, code) ? COUPONS[code] : null;
}

export function applyDiscount(subtotal: number, percent: number): number {
  return Math.round(subtotal * (1 - percent / 100));
}
