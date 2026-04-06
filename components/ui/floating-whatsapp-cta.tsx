import { getWhatsAppHref } from "@/lib/whatsapp";

export function FloatingWhatsAppCTA() {
  const href = getWhatsAppHref();

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#1f9d55] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(31,157,85,0.28)] transition hover:bg-[#147044] sm:bottom-6 sm:right-6"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/18 text-base">
        W
      </span>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
