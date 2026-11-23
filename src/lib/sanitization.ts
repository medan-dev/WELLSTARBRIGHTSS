/**
 * Comprehensive System Sanitization Engine for EDUREXA
 * Protects against XSS, path traversal, injection, prototype pollution, and malformed inputs.
 */

/**
 * Strips all HTML tags and unsafe script injections from user-supplied strings.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove <script>...</script>
    .replace(/<[^>]+>/g, "") // Remove all HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: pseudo-protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers like onclick=, onerror=
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "") // Remove ASCII control characters
    .trim();
}

/**
 * Escapes characters for safe HTML rendering.
 */
export function escapeHtml(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitizes file names to prevent path traversal (e.g. `../../etc/passwd`).
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== "string") return "file";
  return fileName
    .replace(/[/\\?%*:|"<>]/g, "_") // Replace reserved characters
    .replace(/\.{2,}/g, "_") // Disallow double dot path traversal
    .replace(/^_+/, "")
    .trim() || "file";
}

/**
 * Safely parses and bounds numerical input.
 */
export function sanitizeNumber(value: unknown, min: number = 0, max: number = Number.MAX_SAFE_INTEGER, fallback: number = 0): number {
  if (typeof value === "number" && !isNaN(value)) {
    return Math.min(max, Math.max(min, value));
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      return Math.min(max, Math.max(min, parsed));
    }
  }
  return fallback;
}

/**
 * Sanitizes phone numbers into clean E.164 or local dialing format.
 */
export function sanitizePhoneNumber(phone: unknown): string {
  if (typeof phone !== "string") return "";
  const cleaned = phone.replace(/[^\d+]/g, "").trim();
  return cleaned;
}

/**
 * Sanitizes meal card plans and eliminates legacy milk schemes.
 */
export function sanitizeMealCard<T extends Record<string, any>>(card: T | null | undefined): T | null {
  if (!card) return null;
  const cleaned: Record<string, any> = { ...card };
  
  if (
    cleaned.planType === "MILK_NUTRITION_AWARD" ||
    (cleaned.planType as string) === "MILK_NUTRITION_SCHEME"
  ) {
    cleaned.planType = "BURSARY_SUBSIDIZED";
  }
  
  if (cleaned.notes && typeof cleaned.notes === "string") {
    cleaned.notes = cleaned.notes
      .replace(/milk cans? daily\.?/gi, "meals daily")
      .replace(/milk/gi, "meal");
  }
  
  delete cleaned.milkQuota;
  delete cleaned.dailyMilkQuota;
  return cleaned as T;
}

/**
 * Deep object sanitizer that recursively applies sanitizeText to all string values.
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Protect against prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;

    if (typeof value === "string") {
      result[key] = sanitizeText(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
