/** Normalizes a raw Indian mobile number input into E.164 format (+91XXXXXXXXXX). */
export function formatIndianPhoneNumber(rawPhone: string): string {
  const cleaned = rawPhone.replace(/\D/g, "");
  if (rawPhone.trim().startsWith("+")) {
    return rawPhone.trim().replace(/[\s-]/g, "");
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

/** Strips a phone input down to digits only, capped at 10 (Indian mobile number length). */
export function sanitizePhoneInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}
