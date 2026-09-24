// Rule 12: this only declares the shape of Wompi's client-side Widget (tokenizes card data in
// Wompi's own iframe/modal). Our code never receives or stores raw card data.
declare global {
  interface WidgetCheckoutOptions {
    currency: "COP";
    amountInCents: number;
    reference: string;
    publicKey: string;
    redirectUrl: string;
    signature: { integrity: string };
    expirationTime?: string;
  }
  class WidgetCheckout {
    constructor(options: WidgetCheckoutOptions);
    open(callback: (result: { transaction?: { status?: string; reference?: string } }) => void): void;
  }
}
export {};
