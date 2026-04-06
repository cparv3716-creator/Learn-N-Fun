import { getWhatsAppHref } from "@/lib/whatsapp";

type WhatsAppFollowUpLinkProps = {
  className?: string;
  message: string;
};

export function WhatsAppFollowUpLink({
  className,
  message,
}: WhatsAppFollowUpLinkProps) {
  const href = getWhatsAppHref(message);

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-[#1f9d55]/25 bg-[#1f9d55]/10 px-5 py-3 text-sm font-semibold text-[#147044] transition hover:bg-[#1f9d55]/15"
      }
    >
      Prefer a faster reply? Continue on WhatsApp
    </a>
  );
}
