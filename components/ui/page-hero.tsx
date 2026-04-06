import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

type PageHeroProps = {
  actions?: HeroAction[];
  compact?: boolean;
  description: string;
  eyebrow: string;
  title: string;
};

export function PageHero({
  actions,
  compact = false,
  description,
  eyebrow,
  title,
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "pb-6 pt-6 sm:pb-10 sm:pt-10" : "pb-8 pt-8 sm:pb-14 sm:pt-16"}`}
    >
      <div className="absolute left-0 top-0 h-48 w-48 -translate-x-1/3 rounded-full bg-gold-400/20 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute right-0 top-10 h-56 w-56 translate-x-1/4 rounded-full bg-mint-400/18 blur-3xl sm:top-12 sm:h-80 sm:w-80" />
      <Container className="relative">
        <div
          className={`rounded-[32px] border border-white/80 bg-white/70 px-5 shadow-[0_18px_45px_rgba(16,37,61,0.06)] backdrop-blur sm:rounded-[40px] sm:px-10 ${compact ? "py-7 sm:py-10" : "py-8 sm:py-14"}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-sm">
            {eyebrow}
          </p>
          <h1
            className={`mt-4 max-w-4xl font-semibold leading-tight text-navy-900 ${compact ? "text-3xl sm:text-4xl lg:text-5xl" : "text-4xl sm:text-5xl xl:text-6xl"}`}
          >
            {title}
          </h1>
          <p
            className={`max-w-3xl text-base leading-7 text-ink-600 ${compact ? "mt-4 sm:mt-5 sm:text-base sm:leading-7" : "mt-5 sm:mt-6 sm:text-lg sm:leading-8"}`}
          >
            {description}
          </p>
          {actions ? (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {actions.map((action) => (
                <ButtonLink
                  key={action.href}
                  className="w-full sm:w-auto"
                  href={action.href}
                  variant={action.variant}
                >
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
