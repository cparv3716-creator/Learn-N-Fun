"use client";

import { trackAnalyticsEvent } from "@/lib/analytics";

type WhatsAppFollowUpLinkProps = {
  className?: string;
  href: string | null;
};

export function WhatsAppFollowUpLink({
  className,
  href,
}: WhatsAppFollowUpLinkProps) {
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
      onClick={() =>
        trackAnalyticsEvent("whatsapp_click", { location: "post_submit_cta" })
      }
    >
      Chat with us on WhatsApp
    </a>
  );
}
