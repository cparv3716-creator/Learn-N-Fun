import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { getPublicContactDetails } from "@/server/public-site-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Learn 'N' Fun Abacus for admissions, program questions, parent guidance, or franchise conversations.",
};

export default function ContactPage() {
  const whatsAppLink = getWhatsAppLink(
    "Hi, I'm interested in Learn N Fun Abacus classes",
  );
  const contactDetails = getPublicContactDetails();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach the team behind Learn 'N' Fun Abacus"
        description="We're happy to help with admissions, batch selection, parent questions, and franchise interest."
        highlights={[
          "Admissions guidance",
          "Fast parent support",
          "Franchise conversations welcome",
        ]}
      />

      <section className="pb-14 pt-4 sm:pb-24 sm:pt-6">
        <Container className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 sm:space-y-6">
            {contactDetails.map((detail) => (
              <div
                key={detail.title}
                className="rounded-[24px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(16,37,61,0.1)] sm:rounded-[30px] sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
                  {detail.title}
                </p>
                <p className="mt-3 break-words text-xl font-semibold text-navy-900 sm:mt-4 sm:text-2xl">
                  {detail.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-ink-600">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_22px_55px_rgba(16,37,61,0.08)] sm:rounded-[36px] sm:p-8">
            <ContactForm whatsAppLink={whatsAppLink} />
          </div>
        </Container>
      </section>
    </>
  );
}
