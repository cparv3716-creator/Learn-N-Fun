import { ProgramCard } from "@/components/marketing/program-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { companyStats, programs, testimonials } from "@/lib/site-data";

const trustHighlights = [
  "Age-based class pathways",
  "Warm trainers and clear parent communication",
  "Hybrid-ready weekday and weekend batches",
  "Visible progress children feel proud of",
];

const howItWorksSteps = [
  {
    title: "Book Free Demo",
    description:
      "Begin with a no-pressure trial session so your child can experience the class rhythm and you can understand the teaching approach.",
  },
  {
    title: "Get Level Recommendation",
    description:
      "Our team suggests the right starting level based on age, comfort, focus, and early performance during the demo experience.",
  },
  {
    title: "Join Regular Classes & Track Progress",
    description:
      "Move into a structured batch with visible milestones, supportive communication, and a clear sense of how your child is progressing.",
  },
];

const whyAbacusCards = [
  {
    title: "Sharper concentration",
    description:
      "Children build stronger attention spans through guided, rhythmic practice that feels structured rather than overwhelming.",
  },
  {
    title: "Visual number confidence",
    description:
      "The abacus gives children a physical and mental model for numbers, helping them think more clearly and solve with less hesitation.",
  },
  {
    title: "Better memory habits",
    description:
      "Repetition, visualisation, and milestone-based learning support stronger recall in class and at home.",
  },
  {
    title: "Joyful progress",
    description:
      "Children stay engaged because the learning experience balances challenge, encouragement, and visible wins they can celebrate.",
  },
];

const franchiseHighlights = [
  "Launch support with academic and operational guidance",
  "A child-first brand parents can trust from day one",
  "A scalable model built for thoughtful local growth",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-6 sm:pb-18 sm:pt-10">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_top_left,rgba(239,194,100,0.24),transparent_18%),radial-gradient(circle_at_top_right,rgba(88,175,147,0.18),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.82)_0%,transparent_100%)]" />
        <div className="absolute left-0 top-10 h-64 w-64 -translate-x-1/3 rounded-full bg-gold-400/28 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute right-0 top-16 h-64 w-64 translate-x-1/4 rounded-full bg-mint-400/28 blur-3xl sm:h-96 sm:w-96" />
        <Container className="relative">
          <div className="relative overflow-hidden rounded-[32px] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(255,250,243,0.92)_52%,rgba(239,245,251,0.9)_100%)] px-5 py-8 shadow-[0_30px_80px_rgba(16,37,61,0.12)] sm:rounded-[38px] sm:px-10 sm:py-12 xl:px-14 xl:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,194,100,0.2),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(88,175,147,0.14),transparent_28%)]" />
            <div className="absolute -right-8 top-8 h-48 w-48 rounded-full border border-white/35 bg-white/20 blur-2xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-coral-200/70 bg-white/82 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-coral-600 shadow-[0_12px_30px_rgba(16,37,61,0.06)] backdrop-blur sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-coral-500" />
                  Premium edtech for young learners
                </span>
                <h1 className="mt-5 max-w-4xl text-[2.75rem] font-semibold leading-[0.97] text-navy-900 sm:mt-6 sm:text-6xl xl:text-[4.8rem]">
                  Help children think faster, focus longer, and enjoy learning
                  more.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600 sm:mt-5 sm:text-lg sm:leading-8">
                  Learn &apos;N&apos; Fun Abacus blends structured mental math
                  training with a warm classroom experience, giving families a
                  polished path to stronger confidence, memory, and focus.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                  <ButtonLink
                    className="w-full sm:w-auto"
                    href="/book-demo"
                    analyticsEvent="demo_cta_click"
                    analyticsPayload={{ location: "home_hero" }}
                  >
                    Book Demo
                  </ButtonLink>
                  <ButtonLink
                    className="w-full sm:w-auto"
                    href="/programs"
                    variant="secondary"
                  >
                    Explore Programs
                  </ButtonLink>
                </div>
                <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                  {trustHighlights.slice(0, 3).map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-white/85 bg-white/80 px-4 py-2 text-xs font-medium text-navy-700 shadow-[0_10px_24px_rgba(16,37,61,0.05)] backdrop-blur sm:text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[30px] border border-white/35 bg-navy-900 p-6 text-white shadow-[0_28px_80px_rgba(16,37,61,0.24)] sm:rounded-[34px] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                    Why families choose us
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-[2rem]">
                    A premium learning experience that still feels personal and
                    encouraging.
                  </h2>
                  <div className="mt-6 space-y-3">
                    {trustHighlights.slice(0, 3).map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/8 px-4 py-3"
                      >
                        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gold-400" />
                        <p className="text-sm leading-7 text-sand-50/90">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-coral-400/25 bg-white/92 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.1)] sm:rounded-[34px] sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                    Parent-friendly start
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink-600 sm:text-base">
                    Begin with a free demo, get guidance on the right level, and
                    move ahead with clear next steps instead of guesswork.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-14">
        <Container>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] backdrop-blur sm:rounded-[34px] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-navy-700 sm:text-sm">
                Trusted by growing families
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {companyStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex min-h-[122px] flex-col justify-between rounded-[24px] bg-sand-100/72 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]"
                  >
                    <p className="text-2xl font-semibold leading-none text-navy-900 sm:text-[2rem]">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-ink-600 sm:text-sm sm:leading-6">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] backdrop-blur sm:rounded-[34px] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-navy-700 sm:text-sm">
                Key highlights
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {trustHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-navy-100 bg-navy-50 px-4 py-2 text-xs font-medium text-navy-700 sm:text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Why Abacus"
            title="The right learning format for stronger attention, memory, and confidence"
            description="Abacus training helps children build more than arithmetic speed. It creates a strong mental framework for numbers while making progress feel visible and motivating."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 md:grid-cols-2 xl:grid-cols-4">
            {whyAbacusCards.map((card, index) => (
              <div
                key={card.title}
                className="group rounded-[30px] border border-white/85 bg-white/92 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_62px_rgba(16,37,61,0.12)] sm:rounded-[34px] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                    0{index + 1}
                  </span>
                  <span className="h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,rgba(239,194,100,0.28)_0%,rgba(138,208,187,0.26)_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold leading-tight text-navy-900 sm:text-[1.7rem]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-600">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <div className="rounded-[32px] border border-white/75 bg-white/70 p-5 shadow-[0_20px_60px_rgba(16,37,61,0.08)] backdrop-blur sm:rounded-[38px] sm:p-10">
            <SectionHeading
              align="center"
              eyebrow="How It Works"
              title="A simple three-step path from first enquiry to visible progress"
              description="We keep the journey easy for parents to follow and exciting for children to experience."
            />
            <div className="mt-8 grid gap-4 sm:mt-12 lg:grid-cols-3">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[30px] border border-white/85 bg-white/92 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] sm:rounded-[34px] sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sand-100 text-sm font-semibold text-navy-900 shadow-[inset_0_0_0_1px_rgba(230,215,187,0.6)]">
                    0{index + 1}
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight text-navy-900 sm:text-[1.7rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Programs"
            title="Structured levels designed for different ages and learning stages"
            description="Children can begin with strong foundations and progress into advanced mental math training without losing the same warm, encouraging teaching style."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.name} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="Families stay because they can see the difference"
            description="Parents regularly mention stronger focus, more confidence, and a smoother homework experience after their children settle into the program."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard
                key={`${testimonial.parentName}-${testimonial.childName}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#10253d_0%,#16385c_56%,#225e88_100%)] px-5 py-8 text-white shadow-[0_30px_80px_rgba(16,37,61,0.22)] sm:rounded-[38px] sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,194,100,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(88,175,147,0.16),transparent_28%)]" />
            <div className="relative grid gap-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                  Franchise Opportunity
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                  Explore a premium franchise opportunity with guided launch support.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-sand-50/85 sm:text-lg sm:leading-8">
                  If you&apos;re exploring education entrepreneurship, our
                  franchise model is designed to balance thoughtful growth,
                  academic quality, and operational clarity.
                </p>
              </div>
              <div className="space-y-3">
                {franchiseHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/8 px-4 py-4"
                  >
                    <p className="text-sm leading-7 text-sand-50/90">{item}</p>
                  </div>
                ))}
                <ButtonLink
                  className="mt-3 w-full sm:w-auto"
                  href="/franchise"
                  analyticsEvent="chatbot_quick_action_click"
                  analyticsPayload={{ location: "home_franchise_cta" }}
                >
                  Explore Franchise
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-14 pt-4 sm:pb-24 sm:pt-8">
        <Container>
          <div className="rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(255,249,242,0.92)_56%,rgba(255,255,255,0.9)_100%)] px-5 py-8 shadow-[0_24px_70px_rgba(16,37,61,0.1)] sm:rounded-[38px] sm:px-10 sm:py-14">
            <div className="flex flex-col gap-7 text-center sm:gap-8 sm:text-left lg:flex-row lg:items-center lg:justify-between">
              <div className="mx-auto max-w-3xl lg:mx-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-sm">
                  Ready to begin
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
                  Start with a friendly demo class and a clear learning plan for
                  your child.
                </h2>
                <p className="mt-4 text-base leading-7 text-ink-600 sm:text-lg sm:leading-8">
                  We&apos;ll guide you to the right batch, answer your questions,
                  and help your family take the next step with confidence.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row lg:min-w-max">
                <ButtonLink
                  className="w-full sm:w-auto"
                  href="/book-demo"
                  analyticsEvent="demo_cta_click"
                  analyticsPayload={{ location: "home_final_cta" }}
                >
                  Book Demo
                </ButtonLink>
                <ButtonLink
                  className="w-full sm:w-auto"
                  href="/contact"
                  variant="secondary"
                >
                  Contact Us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
