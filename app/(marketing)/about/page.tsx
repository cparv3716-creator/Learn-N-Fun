import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  companyInfo,
  leadershipTeam,
  milestones,
  values,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Learn 'N' Fun Abacus, our teaching philosophy, and the team behind our child-focused abacus programs.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A child-first abacus company built around discipline, joy, and confidence"
        description="Learn 'N' Fun Abacus was created to make mental math training feel inspiring for children and reassuring for parents."
      />

      <section className="py-12 sm:py-24">
        <Container className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] sm:rounded-[32px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
              Our story
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-navy-900 sm:mt-5 sm:text-4xl">
              From stronger arithmetic to stronger self-belief
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-ink-600 sm:mt-6 sm:space-y-5 sm:text-base sm:leading-8">
              <p>{companyInfo.story[0]}</p>
              <p>{companyInfo.story[1]}</p>
              <p>{companyInfo.story[2]}</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-sand-200 bg-sand-100/80 p-5 sm:rounded-[32px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700 sm:text-sm">
              Milestones
            </p>
            <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
              {milestones.map((milestone) => (
                <div
                  key={milestone.year}
                  className="border-l-2 border-gold-500 pl-4 sm:pl-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                    {milestone.year}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-navy-900 sm:text-2xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-ink-600">
                    {milestone.description}
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
            eyebrow="Core values"
            title="What guides every interaction with children and parents"
            description="Our values shape how we teach, communicate progress, and build long-term trust with families."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[24px] border border-navy-100 bg-white/80 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.06)] sm:rounded-[30px] sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700 sm:text-sm">
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

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="A team that blends academic structure with child-friendly delivery"
            description="Our leadership philosophy is simple: children grow best when instruction feels clear, warm, and consistently encouraging."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 xl:grid-cols-3">
            {leadershipTeam.map((member) => (
              <div
                key={member.name}
                className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] sm:rounded-[32px] sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                  {member.role}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-navy-900 sm:mt-4 sm:text-3xl">
                  {member.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
                  {member.bio}
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
              Want to see our teaching style in action?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sand-50/85 sm:text-lg sm:leading-8">
              Book a free demo class and see how the program feels from a
              child&apos;s perspective before you commit.
            </p>
            <div className="mt-8">
              <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                Schedule a demo
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
