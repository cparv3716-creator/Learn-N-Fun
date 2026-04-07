"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink, buttonClassName } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { navigationItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-sand-50/80 backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-3 py-3 sm:gap-4">
        <Link
          href="/"
          className="min-w-0 flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-sm font-semibold uppercase tracking-[0.18em] text-white sm:h-11 sm:w-11">
            LF
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-navy-900 sm:text-lg">
              Learn &apos;N&apos; Fun
            </p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-coral-600 sm:text-xs">
              Abacus
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-navy-900 text-white"
                  : "text-ink-600 hover:bg-white hover:text-navy-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink
            href="/dashboard/login"
            variant="secondary"
            analyticsEvent="dashboard_login_cta_click"
            analyticsPayload={{ location: "header_desktop" }}
          >
            Student Login
          </ButtonLink>
          <ButtonLink
            href="/book-demo"
            analyticsEvent="demo_cta_click"
            analyticsPayload={{ location: "header_desktop" }}
          >
            Book demo
          </ButtonLink>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-full border border-navy-200 bg-white px-3.5 py-2 text-sm font-semibold text-navy-900 shadow-sm transition hover:border-navy-300 hover:bg-white lg:hidden"
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="flex items-center gap-2">
            <span className="flex flex-col gap-1" aria-hidden="true">
              <span
                className={cn(
                  "block h-0.5 w-4 rounded-full bg-current transition",
                  isOpen && "translate-y-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-4 rounded-full bg-current transition",
                  isOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-4 rounded-full bg-current transition",
                  isOpen && "-translate-y-1.5 -rotate-45",
                )}
              />
            </span>
            <span>{isOpen ? "Close" : "Menu"}</span>
          </span>
        </button>
      </Container>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(16,37,61,0.08)] lg:hidden"
        >
          <Container className="flex flex-col gap-3 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-3.5 text-sm font-medium transition",
                  isActive(item.href)
                    ? "bg-navy-900 text-white"
                    : "bg-sand-50 text-ink-600 hover:bg-white",
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard/login"
              className={buttonClassName("secondary", "w-full")}
              onClick={() => {
                trackAnalyticsEvent("dashboard_login_cta_click", {
                  location: "header_mobile",
                });
                setIsOpen(false);
              }}
            >
              Student Login
            </Link>
            <Link
              href="/book-demo"
              className={buttonClassName("primary", "mt-1 w-full")}
              onClick={() => {
                trackAnalyticsEvent("demo_cta_click", {
                  location: "header_mobile",
                });
                setIsOpen(false);
              }}
            >
              Book demo
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
