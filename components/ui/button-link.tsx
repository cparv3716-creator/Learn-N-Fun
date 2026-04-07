"use client";

import Link from "next/link";
import type { AnalyticsPayload } from "@/lib/analytics";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = {
  analyticsEvent?: string;
  analyticsPayload?: AnalyticsPayload;
  children: React.ReactNode;
  className?: string;
  href: string;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#10253d_0%,#1b476f_62%,#336e9b_100%)] text-white shadow-[0_18px_46px_rgba(16,37,61,0.2)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(16,37,61,0.24)]",
  secondary:
    "border border-navy-200/80 bg-white/88 text-navy-900 shadow-[0_14px_36px_rgba(16,37,61,0.08)] backdrop-blur hover:-translate-y-0.5 hover:border-navy-300 hover:bg-white hover:shadow-[0_20px_42px_rgba(16,37,61,0.11)]",
  ghost:
    "bg-transparent text-navy-900 hover:-translate-y-0.5 hover:bg-white/70",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-300 focus-visible:ring-offset-2 active:scale-[0.99] sm:px-6 sm:py-3.5",
    variantClasses[variant],
    className,
  );
}

export function ButtonLink({
  analyticsEvent,
  analyticsPayload,
  children,
  className,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClassName(variant, className)}
      onClick={() => {
        if (analyticsEvent) {
          trackAnalyticsEvent(analyticsEvent, analyticsPayload);
        }
      }}
    >
      {children}
    </Link>
  );
}
