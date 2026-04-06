import type { Metadata } from "next";
import { BookDemoForm } from "@/components/forms/book-demo-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { demoExpectations } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Book Demo",
  description:
    "Book a free demo class with Learn 'N' Fun Abacus and discover the right program for your child.",
};

export default function BookDemoPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Book demo"
        title="Start with a free class and a simple parent consultation"
        description="Share a few details and we&apos;ll help you find a comfortable starting point for your child."
      />

      <section className="pb-14 pt-3 sm:pb-24 sm:pt-6">
        <Container className="grid gap-6 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_55px_rgba(16,37,61,0.08)] sm:rounded-[36px] sm:p-8">
            <BookDemoForm />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-[24px] border border-mint-400/35 bg-white/80 px-4 py-3 text-sm text-navy-700 shadow-[0_16px_36px_rgba(16,37,61,0.06)] sm:rounded-[28px] sm:px-5 sm:py-4">
              Trusted by families who want a calm, guided first conversation
              before choosing a batch.
            </div>
            <div className="rounded-[28px] border border-sand-200 bg-sand-100/80 p-5 sm:rounded-[32px] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700 sm:text-sm">
                What to expect
              </p>
              <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
                {demoExpectations.map((item, index) => (
                  <div key={item.title} className="flex gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-navy-900 sm:h-10 sm:w-10">
                      0{index + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-navy-900 sm:text-2xl">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-ink-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-navy-900 p-5 text-white shadow-[0_22px_55px_rgba(16,37,61,0.16)] sm:rounded-[32px] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 sm:text-sm">
                Helpful note for parents
              </p>
              <p className="mt-4 text-sm leading-7 text-sand-50/90 sm:text-base sm:leading-8">
                If you&apos;re unsure which program to choose, select
                &quot;Need guidance&quot; in the form and our team will recommend
                a starting level after the demo.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
