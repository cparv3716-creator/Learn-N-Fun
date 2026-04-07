import type { Metadata } from "next";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { companyStats, testimonials } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "See what parents say about the learning experience, confidence gains, and classroom structure at Learn 'N' Fun Abacus.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="The strongest proof comes from the families we work with"
        description="Parents consistently tell us that their children become more focused, self-assured, and willing to challenge themselves."
        highlights={[
          "Visible confidence gains",
          "Better focus at home",
          "Warm classroom experience",
        ]}
      />

      <section className="py-10 sm:py-16">
        <Container className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {companyStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-[0_18px_45px_rgba(16,37,61,0.06)] sm:rounded-[28px] sm:p-5"
            >
              <p className="text-2xl font-semibold text-navy-900 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">{stat.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="pb-14 pt-4 sm:pb-24 sm:pt-6">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Family feedback"
            title="Real experiences across multiple age groups and learning levels"
            description="These stories reflect the kind of classroom confidence, focus, and support families consistently value."
          />
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={`${testimonial.parentName}-${testimonial.childName}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-14 pt-4 sm:pb-24">
        <Container>
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#10253d_0%,#16385c_56%,#225e88_100%)] px-5 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:rounded-[36px] sm:px-10 sm:py-14">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Ready to create this kind of progress for your child?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sand-50/85 sm:text-lg sm:leading-8">
              Begin with a free demo and see how our classroom rhythm works for
              your family.
            </p>
            <div className="mt-8">
              <ButtonLink className="w-full sm:w-auto" href="/book-demo">
                Book a free demo
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
