import type { PaymentError, PaymentErrorCode } from "./errors";
import { USER_MESSAGES } from "./errors";

// Wompi exposes failure reasons in transaction.status_message (Spanish prose) and, for direct
// REST errors, error.type. We pattern-match the common ones into the shared taxonomy.
const WOMPI_REASON_PATTERNS: Array<{ pattern: RegExp; code: PaymentErrorCode }> = [
  { pattern: /insufficient|fondos insuficientes/i, code: "insufficient_funds" },
  { pattern: /expired|tarjeta vencida|vencimiento/i, code: "card_expired" },
  { pattern: /cvv|cvc|cód.*seguridad/i, code: "incorrect_cvc" },
  { pattern: /fraud|sospechos/i, code: "fraud_suspected" },
  { pattern: /declined|rechaz/i, code: "declined" },
  { pattern: /3ds|three.?d.?s|autenticación/i, code: "requires_action" },
  { pattern: /timeout|tiempo agotado/i, code: "processing_error" },
];

interface WompiErrorLike {
  transaction?: { status?: string; status_message?: string };
  status?: string;
  status_message?: string;
  error?: { type?: string };
  code?: string;
}

export function mapWompiError(err: WompiErrorLike): PaymentError {
  // Case A: a transaction object with a failure status.
  if (err?.transaction?.status === "DECLINED" || err?.status === "DECLINED") {
    const reason = err.transaction?.status_message ?? err.status_message ?? "";
    for (const { pattern, code } of WOMPI_REASON_PATTERNS) {
      if (pattern.test(reason)) {
        return { code, user_message: USER_MESSAGES[code], raw_code: reason };
      }
    }
    return { code: "declined", user_message: USER_MESSAGES.declined, raw_code: reason };
  }

  // Case B: an API error from Wompi's REST.
  if (err?.error?.type) {
    switch (err.error.type) {
      case "INVALID_PUBLIC_KEY":
      case "INVALID_PRIVATE_KEY":
        return { code: "internal_error", user_message: USER_MESSAGES.internal_error };
      case "TOO_MANY_REQUESTS":
        return { code: "rate_limited", user_message: USER_MESSAGES.rate_limited };
      case "INVALID_AMOUNT":
        return { code: "amount_too_small", user_message: USER_MESSAGES.amount_too_small };
      default:
        return { code: "internal_error", user_message: USER_MESSAGES.internal_error, raw_code: err.error.type };
    }
  }

  // Case C: network failure calling Wompi.
  if (err?.code === "ECONNREFUSED" || err?.code === "ETIMEDOUT") {
    return { code: "network_error", user_message: USER_MESSAGES.network_error };
  }

  return { code: "internal_error", user_message: USER_MESSAGES.internal_error };
}

// When logging a declined/failed transaction, log only { error_code, raw_code, tx_id } —
// never the full transaction object (may carry the customer's phone or masked card info).
