const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I'm interested in Learn N Fun Abacus classes";

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function getWhatsAppLink(message: string) {
  const normalizedNumber = normalizeWhatsAppNumber(
    (process.env.WHATSAPP_NUMBER ?? "").trim(),
  );

  if (!normalizedNumber) {
    return null;
  }

  const text = message.trim() || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(text)}`;
}
