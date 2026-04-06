import { ProgramCard } from "@/components/marketing/program-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  companyStats,
  learningJourney,
  programs,
  testimonials,
  values,
} from "@/lib/site-data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-16">
        <div className="absolute left-0 top-0 h-52 w-52 -translate-x-1/3 rounded-full bg-gold-400/25 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute right-0 top-10 h-60 w-60 translate-x-1/4 rounded-full bg-mint-400/20 blur-3xl sm:top-12 sm:h-80 sm:w-80" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <span className="inline-flex rounded-full border border-navy-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-navy-700 shadow-sm sm:text-sm">
              Professional Child Skill Development
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-navy-900 sm:mt-6 sm:text-5xl xl:text-6xl">
              Build confident, focused, and joyful young minds with abacus
              training that feels exciting.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-600 sm:mt-6 sm:text-lg sm:leading-8">
              Learn &apos;N&apos; Fun Abacus helps children strengthen mental
              math, concentration, memory, and stage confidence through a warm,
              structured training journey designed for real family routines.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                Book a free demo
              </ButtonLink>
              <ButtonLink
                className="w-full sm:w-auto"
                href="/programs"
                variant="secondary"
              >
                Explore programs
              </ButtonLink>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 xl:grid-cols-4">
              {companyStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border border-white/80 bg-white/85 p-3.5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] backdrop-blur sm:rounded-[28px] sm:p-5"
                >
                  <p className="text-2xl font-semibold text-navy-900 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-ink-600 sm:mt-2 sm:text-sm sm:leading-6">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative pb-1 sm:pb-8">
            <div className="rounded-[32px] border border-white/80 bg-navy-900 p-6 text-white shadow-[0_26px_70px_rgba(16,37,61,0.2)] sm:rounded-[36px] sm:p-8">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sand-50 sm:text-sm">
                Why families choose us
              </span>
              <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
                A learning experience that balances discipline with delight.
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  "Age-based classes with progressive milestones",
                  "Simple parent communication and monthly progress tracking",
                  "Friendly trainers who build confidence, not pressure",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-3xl bg-white/8 p-4"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold-400" />
                    <p className="text-sm leading-7 text-sand-50/90">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-[28px] bg-white/10 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-sand-50/80">
                  Class format
                </p>
                <p className="mt-3 text-base leading-7 text-sand-50 sm:text-lg sm:leading-8">
                  Weekday and weekend batches, hybrid-ready delivery, and mock
                  competitions to keep children engaged and progressing.
                </p>
              </div>
            </div>
            <div className="mt-5 max-w-sm rounded-[28px] border border-coral-400/30 bg-white p-5 shadow-[0_20px_55px_rgba(16,37,61,0.1)] sm:absolute sm:-bottom-6 sm:-left-8 sm:mt-0 sm:max-w-xs">
              <p className="text-sm uppercase tracking-[0.2em] text-coral-600">
                Parent-friendly onboarding
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-600">
                Free assessment, level guidance, and a clear next-step plan
                after the demo class.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Our approach"
            title="Designed to improve more than just arithmetic speed"
            description="Every class is structured to support sharper focus, stronger memory, calmer confidence, and a visible sense of achievement."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[24px] border border-navy-100 bg-white/80 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.06)] sm:rounded-[30px] sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                  {value.kicker}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-navy-900 sm:mt-4 sm:text-2xl">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Programs"
            title="Structured levels for every stage of a child's growth"
            description="Families can start with a strong foundation and continue through advanced mental math training without needing to change the learning philosophy."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.name} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Learning journey"
            title="A clear path from first session to lasting confidence"
            description="The program experience is designed to feel reassuring for parents and energizing for children."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4">
            {learningJourney.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[24px] border border-sand-200 bg-sand-100/70 p-5 sm:rounded-[28px] sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700 sm:text-sm">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-navy-900 sm:mt-4 sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Parent voices"
            title="Families stay because they can see the difference"
            description="Confidence in class, focus at home, and stronger performance at school are recurring themes in our feedback."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 xl:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard
                key={testimonial.parentName}
                testimonial={testimonial}
              />
            ))}
          </div>
          <div className="mt-8 sm:mt-10">
            <ButtonLink
              className="w-full sm:w-auto"
              href="/testimonials"
              variant="secondary"
            >
              View all testimonials
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="pb-12 pt-3 sm:pb-24 sm:pt-8">
        <Container>
          <div className="rounded-[28px] bg-navy-900 px-5 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:rounded-[40px] sm:px-10 sm:py-14">
            <div className="flex flex-col gap-7 text-center sm:gap-8 sm:text-left lg:flex-row lg:items-center lg:justify-between">
              <div className="mx-auto max-w-3xl lg:mx-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                  Ready to begin
                </p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                  Start with a friendly demo class and a clear plan for your
                  child.
                </h2>
                <p className="mt-4 text-base leading-7 text-sand-50/85 sm:text-lg sm:leading-8">
                  We&apos;ll recommend the right batch, explain the learning
                  roadmap, and answer every parent question before enrollment.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row lg:min-w-max">
                <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                  Book demo
                </ButtonLink>
                <ButtonLink
                  className="w-full sm:w-auto"
                  href="/contact"
                  variant="secondary"
                >
                  Contact us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
