// Rule 1: keys read from process.env only, never hardcoded.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. See .env.example.`);
  return value;
}

export function wompiApiBase(): string {
  const privateKey = requireEnv("WOMPI_PRIVATE_KEY");
  return privateKey.startsWith("prv_prod_") ? "https://production.wompi.co/v1" : "https://sandbox.wompi.co/v1";
}

export async function wompiFetch(path: string, init?: RequestInit): Promise<Response> {
  const privateKey = requireEnv("WOMPI_PRIVATE_KEY");
  return fetch(`${wompiApiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${privateKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

// Wompi amounts are in centavos (minor units), same convention as Stripe for COP.
export function toWompiCentavos(copAmount: number): number {
  return Math.round(copAmount * 100);
}
