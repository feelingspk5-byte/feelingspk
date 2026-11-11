/** Digits only; Pakistani local 03… becomes 92… for WhatsApp. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function toTelHref(phone: string): string | null {
  const digits = phoneDigits(phone);
  if (digits.length < 7) return null;
  return `tel:+${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

export function toWhatsAppHref(phone: string): string | null {
  const digits = phoneDigits(phone);
  if (digits.length < 7) return null;
  const intl = digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}
