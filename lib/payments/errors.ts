// Shared PagoKit error taxonomy. Pure data — no side effects, no provider imports.
// Provider-specific mappers (e.g. errors-wompi.ts) translate raw provider errors into these codes.

export type PagokitErrorCode =
  | "insufficient_funds"
  | "card_expired"
  | "incorrect_cvc"
  | "fraud_suspected"
  | "declined"
  | "requires_action"
  | "processing_error"
  | "rate_limited"
  | "amount_too_small"
  | "network_error"
  | "internal_error";

export type PagokitError = {
  code: PagokitErrorCode;
  user_message: string;
  raw_code?: string;
};

// Rule 6 reminder: never build a USER_MESSAGES entry from provider-supplied free text.
// These are static, in Spanish, safe to show directly to the customer.
export const USER_MESSAGES: Record<PagokitErrorCode, string> = {
  insufficient_funds: "Tu medio de pago no tiene fondos suficientes. Intenta con otro método.",
  card_expired: "Tu tarjeta está vencida. Intenta con otra tarjeta.",
  incorrect_cvc: "El código de seguridad (CVV) no es correcto. Verifícalo e intenta de nuevo.",
  fraud_suspected: "No pudimos procesar tu pago por motivos de seguridad. Contáctanos si el problema persiste.",
  declined: "Tu pago fue rechazado. Intenta con otro método o contacta a tu banco.",
  requires_action: "Tu banco requiere un paso adicional de verificación para continuar.",
  processing_error: "Ocurrió un problema procesando tu pago. Intenta de nuevo en unos minutos.",
  rate_limited: "Estamos recibiendo muchas solicitudes. Intenta de nuevo en un momento.",
  amount_too_small: "El monto del pedido es demasiado bajo para procesarse en línea.",
  network_error: "No pudimos conectar con el procesador de pagos. Revisa tu conexión e intenta de nuevo.",
  internal_error: "Algo salió mal de nuestro lado. Intenta de nuevo o paga en efectivo al recoger.",
};
