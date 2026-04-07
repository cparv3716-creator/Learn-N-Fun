import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { companyInfo, navigationItems, programs } from "@/lib/site-data";
import { getPublicContactInfo } from "@/server/public-site-content";

export function SiteFooter() {
  const publicContactInfo = getPublicContactInfo();

  return (
    <footer className="border-t border-white/70 bg-[linear-gradient(180deg,#0f2136_0%,#10253d_100%)] text-white">
      <Container className="py-10 sm:py-14">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)] backdrop-blur sm:rounded-[38px] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.75fr_0.75fr_0.9fr] lg:gap-10">
            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Learn &apos;N&apos; Fun Abacus
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-[2.45rem]">
                Confident children. Structured growth. Joyful classes.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-sand-50/80 sm:text-base sm:leading-8">
                {companyInfo.shortDescription}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
                <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                  Book a demo
                </ButtonLink>
                <ButtonLink
                  className="w-full border-white/20 bg-white/8 text-white hover:bg-white/14 sm:w-auto"
                  href="/franchise"
                  variant="secondary"
                >
                  Explore franchise
                </ButtonLink>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Explore
              </p>
              <div className="mt-4 grid gap-2.5 sm:mt-5">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-sand-50/80 transition hover:border-white/20 hover:bg-white/8 hover:text-white lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Programs
              </p>
              <div className="mt-4 grid gap-2.5 sm:mt-5">
                {programs.map((program) => (
                  <div
                    key={program.name}
                    className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-sand-50/80 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
                  >
                    <p className="font-medium text-white">{program.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-sand-50/55">
                      {program.ageRange}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Contact
              </p>
              <div className="mt-4 space-y-2.5 text-sm leading-7 text-sand-50/80 sm:mt-5 sm:space-y-3">
                <p className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                  {publicContactInfo.phone}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                  {publicContactInfo.email}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                  {publicContactInfo.address}
                </p>
                <p className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                  {publicContactInfo.hours}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-center text-xs leading-6 text-sand-50/65 sm:mt-12 sm:pt-6 sm:text-sm lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p>
            &copy; {new Date().getFullYear()} Learn &apos;N&apos; Fun Abacus.
            Thoughtfully designed abacus learning for confident, curious
            children.
          </p>
          <p>Structured programs, warm teaching, and premium parent support.</p>
        </div>
      </Container>
    </footer>
  );
}
