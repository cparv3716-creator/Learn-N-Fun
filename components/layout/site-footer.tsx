import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { companyInfo, navigationItems } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-navy-900 text-white">
      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr]">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
              Learn &apos;N&apos; Fun Abacus
            </p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-4xl">
              Confident children. Structured growth. Joyful classes.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-sand-50/80 sm:text-base sm:leading-8">
              {companyInfo.shortDescription}
            </p>
            <div className="mt-8">
              <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                Book a demo
              </ButtonLink>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
              Explore
            </p>
            <div className="mt-4 grid gap-3 sm:mt-5">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-sand-50/80 transition hover:border-white/20 hover:text-white lg:border-0 lg:px-0 lg:py-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
              Contact
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-sand-50/80 sm:mt-5 sm:space-y-4">
              <p className="rounded-2xl border border-white/10 px-4 py-3 lg:border-0 lg:px-0 lg:py-0">
                {companyInfo.contact.phone}
              </p>
              <p className="rounded-2xl border border-white/10 px-4 py-3 lg:border-0 lg:px-0 lg:py-0">
                {companyInfo.contact.email}
              </p>
              <p className="rounded-2xl border border-white/10 px-4 py-3 lg:border-0 lg:px-0 lg:py-0">
                {companyInfo.contact.address}
              </p>
              <p className="rounded-2xl border border-white/10 px-4 py-3 lg:border-0 lg:px-0 lg:py-0">
                {companyInfo.contact.hours}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-xs leading-6 text-sand-50/65 sm:mt-12 sm:pt-6 sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} Learn &apos;N&apos; Fun Abacus.
            Phase 1 website with mock content and future-ready admin/backend
            structure.
          </p>
        </div>
      </Container>
    </footer>
  );
}
