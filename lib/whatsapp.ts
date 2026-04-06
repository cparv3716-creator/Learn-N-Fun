const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I would like to know more about Learn 'N' Fun Abacus.";

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function getWhatsAppHref(
  message?: string,
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
) {
  const normalizedNumber = normalizeWhatsAppNumber(phoneNumber.trim());

  if (!normalizedNumber) {
    return null;
  }

  const text =
    message?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE?.trim() ||
    DEFAULT_WHATSAPP_MESSAGE;

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(text)}`;
}
