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
  highlights?: string[];
  title: string;
};

const defaultHighlights = [
  "Warm, child-first instruction",
  "Visible progress for families",
  "Flexible learning pathways",
];

export function PageHero({
  actions,
  compact = false,
  description,
  eyebrow,
  highlights,
  title,
}: PageHeroProps) {
  const heroHighlights =
    highlights && highlights.length > 0 ? highlights : defaultHighlights;

  return (
    <section
      className={`relative overflow-hidden ${compact ? "pb-8 pt-6 sm:pb-12 sm:pt-10" : "pb-10 pt-8 sm:pb-16 sm:pt-16"}`}
    >
      <div className="absolute left-0 top-0 h-48 w-48 -translate-x-1/3 rounded-full bg-gold-400/28 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute right-0 top-10 h-56 w-56 translate-x-1/4 rounded-full bg-mint-400/22 blur-3xl sm:top-12 sm:h-80 sm:w-80" />
      <Container className="relative">
        <div
          className={`relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(255,252,245,0.88)_56%,rgba(239,245,251,0.86)_100%)] px-5 shadow-[0_26px_70px_rgba(16,37,61,0.1)] backdrop-blur sm:rounded-[42px] sm:px-10 ${compact ? "py-7 sm:py-10" : "py-8 sm:py-14"}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,194,100,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(88,175,147,0.14),transparent_28%)]" />
          <div className="absolute -right-10 top-8 h-44 w-44 rounded-full border border-white/30 bg-white/18 blur-2xl" />
          <div
            className={`relative grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(260px,320px)] lg:items-end ${compact ? "lg:gap-8" : "lg:gap-10"}`}
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-coral-200/70 bg-white/78 px-3 py-2 shadow-[0_12px_30px_rgba(16,37,61,0.06)] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-coral-500" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-xs">
                  {eyebrow}
                </p>
              </div>
              <h1
                className={`mt-4 max-w-4xl font-semibold leading-[1.02] text-navy-900 ${compact ? "text-3xl sm:text-4xl lg:text-5xl" : "text-[2.7rem] sm:text-5xl xl:text-[4.5rem]"}`}
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
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/80 bg-white/78 px-4 py-2 text-xs font-medium text-navy-700 shadow-[0_10px_24px_rgba(16,37,61,0.05)] backdrop-blur sm:text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/35 bg-navy-900 p-5 text-white shadow-[0_26px_70px_rgba(16,37,61,0.22)] sm:rounded-[32px] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Why parents stay
              </p>
              <div className="mt-5 space-y-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/8 px-4 py-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/14 text-xs font-semibold text-sand-50">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-sand-50/90">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[24px] bg-white/10 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-sand-50/60">
                  Experience
                </p>
                <p className="mt-2 text-sm leading-7 text-sand-50/88">
                  Calm onboarding, polished communication, and a clear path into
                  every next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
