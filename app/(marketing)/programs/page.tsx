import type { Metadata } from "next";
import { ProgramCard } from "@/components/marketing/program-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { learningJourney, programs, trainingFormats } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore the Learn 'N' Fun Abacus programs designed for young learners at different age groups and skill levels.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Age-based abacus programs that grow with every child"
        description="Each program is built to strengthen concentration, mental math fluency, and confidence while keeping the classroom experience lively and clear."
        actions={[
          { href: "/book-demo", label: "Book a demo" },
          { href: "/contact", label: "Talk to our team", variant: "secondary" },
        ]}
      />

      <section className="py-12 sm:py-24">
        <Container>
          <div className="grid gap-5 sm:gap-6 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.name} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Class experience"
            title="Flexible delivery without losing structure"
            description="The program design keeps quality high across weekday, weekend, and hybrid-friendly formats."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {trainingFormats.map((format) => (
              <div
                key={format.title}
                className="rounded-[24px] border border-sand-200 bg-sand-100/80 p-5 sm:rounded-[30px] sm:p-6"
              >
                <h3 className="text-xl font-semibold text-navy-900 sm:text-2xl">
                  {format.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
                  {format.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Progress path"
            title="A learning roadmap parents can clearly follow"
            description="We keep the progression visible, supportive, and motivating so children know what comes next."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-4">
            {learningJourney.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.06)] sm:rounded-[28px] sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                  Stage {index + 1}
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

      <section className="pb-14 pt-4 sm:pb-24 sm:pt-8">
        <Container>
          <div className="rounded-[28px] bg-navy-900 px-5 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:rounded-[36px] sm:px-10 sm:py-14">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Need help choosing the right level?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sand-50/85 sm:text-lg sm:leading-8">
              We&apos;ll guide you based on age, attention span, prior exposure,
              and the outcomes you want for your child.
            </p>
            <div className="mt-8">
              <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                Get level guidance
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
