import type { Metadata } from "next";
import { FranchiseApplicationForm } from "@/components/forms/franchise-application-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqItems, franchiseBenefits, franchiseSteps } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Franchise",
  description:
    "Explore franchise opportunities with Learn 'N' Fun Abacus and discover the support model for launching a local center.",
};

export default function FranchisePage() {
  return (
    <>
      <PageHero
        eyebrow="Franchise"
        title="Grow a meaningful education business with a warm, proven brand"
        description="Our franchise model is designed for entrepreneurs who want operational clarity, strong academic support, and a child-centered brand they can stand behind."
        actions={[
          { href: "/contact", label: "Enquire now" },
          {
            href: "/book-demo",
            label: "Experience the program first",
            variant: "secondary",
          },
        ]}
      />

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why partner with us"
            title="A franchise model built for thoughtful expansion"
            description="We focus on operational simplicity, quality teaching systems, and local-market confidence for each partner."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 xl:grid-cols-4">
            {franchiseBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] sm:rounded-[30px] sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                  {benefit.kicker}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-navy-900 sm:mt-4 sm:text-2xl">
                  {benefit.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-sand-200 bg-sand-100/80 p-5 sm:rounded-[34px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700 sm:text-sm">
              Franchise journey
            </p>
            <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
              {franchiseSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-3 border-l-2 border-gold-500 pl-4 sm:gap-4 sm:pl-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-navy-900 sm:h-10 sm:w-10">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-900 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-ink-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] bg-navy-900 p-5 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:rounded-[34px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 sm:text-sm">
              Support included
            </p>
            <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
              {[
                "Center launch checklist and local rollout guidance",
                "Trainer onboarding, curriculum planning, and classroom templates",
                "Marketing support assets for parent communication and promotions",
                "Regular review rhythm to help your center maintain quality",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white/8 p-4">
                  <p className="text-sm leading-7 text-sand-50/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="FAQ"
            title="Common franchise questions"
            description="These answers give a clear phase 1 overview. In a later phase, they can be managed from the admin dashboard."
          />
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-2">
            {faqItems.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.06)] sm:rounded-[30px] sm:p-6"
              >
                <h3 className="text-xl font-semibold text-navy-900 sm:text-2xl">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-14 pt-4 sm:pb-24">
        <Container className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] bg-navy-900 px-5 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:rounded-[36px] sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 sm:text-sm">
              Apply now
            </p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Interested in building a center with us?
            </h2>
            <p className="mt-4 text-sm leading-7 text-sand-50/85 sm:text-base sm:leading-8">
              Start the conversation here and we&apos;ll review your city,
              background, and expected timeline before sharing the next steps.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "A practical first review of your local-market fit",
                "A follow-up conversation with the core team",
                "Clear visibility into support, rollout, and expectations",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white/8 p-4">
                  <p className="text-sm leading-7 text-sand-50/90">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_55px_rgba(16,37,61,0.08)] sm:rounded-[36px] sm:p-8">
            <FranchiseApplicationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
