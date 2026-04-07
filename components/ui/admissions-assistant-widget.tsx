"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { programs } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type AdmissionsAssistantWidgetProps = {
  whatsAppHref: string | null;
};

const assistantTopics = [
  {
    id: "demo",
    label: "How demo works",
    title: "A calm first step for parents",
    body: "Book a free demo, let your child experience the class tone, and receive a clear level recommendation before you commit to regular classes.",
  },
  {
    id: "formats",
    label: "Class formats",
    title: "Flexible formats for real family schedules",
    body: "We support weekday and weekend batches, small-group learning, and guidance on the most suitable rhythm for your child.",
  },
  {
    id: "progress",
    label: "Progress support",
    title: "Parents stay informed without overwhelm",
    body: "Families get milestone visibility, warm teacher notes, and a clearer sense of what children are improving over time.",
  },
];

const assistantQuickActions = [
  {
    href: "/book-demo",
    label: "Book Demo",
    eventName: "demo_cta_click",
    location: "chatbot",
  },
  {
    href: "/programs",
    label: "Explore Programs",
    eventName: "chatbot_quick_action_click",
    location: "chatbot_programs",
  },
];

const ageProgramMap = [
  { maxAge: 7, program: "Spark Beginners" },
  { maxAge: 10, program: "Focus Builders" },
  { maxAge: 14, program: "Championship Track" },
];

export function AdmissionsAssistantWidget({
  whatsAppHref,
}: AdmissionsAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState(assistantTopics[0].id);
  const [childAge, setChildAge] = useState("");
  const [leadForm, setLeadForm] = useState({
    childAge: "",
    name: "",
    phone: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const activeTopic =
    assistantTopics.find((topic) => topic.id === activeTopicId) ??
    assistantTopics[0];

  const suggestedProgram = useMemo(() => {
    const age = Number.parseInt(childAge, 10);

    if (!Number.isInteger(age)) {
      return null;
    }

    const match =
      ageProgramMap.find((item) => age <= item.maxAge) ??
      ageProgramMap[ageProgramMap.length - 1];

    return programs.find((program) => program.name === match.program) ?? null;
  }, [childAge]);

  const leadWhatsAppHref = useMemo(() => {
    if (!whatsAppHref) {
      return null;
    }

    const ageLine = leadForm.childAge ? `Child age: ${leadForm.childAge}` : null;
    const message = [
      "Hi, I want help choosing the right Learn N Fun Abacus program.",
      leadForm.name ? `Parent: ${leadForm.name}` : null,
      leadForm.phone ? `Phone: ${leadForm.phone}` : null,
      ageLine,
    ]
      .filter(Boolean)
      .join(" | ");

    const [baseUrl] = whatsAppHref.split("?text=");
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }, [leadForm.childAge, leadForm.name, leadForm.phone, whatsAppHref]);

  return (
    <div className="fixed bottom-24 right-4 z-40 sm:bottom-28 sm:right-6">
      {isOpen ? (
        <div className="w-[min(92vw,24rem)] overflow-hidden rounded-[30px] border border-white/70 bg-white/96 shadow-[0_28px_70px_rgba(16,37,61,0.18)] backdrop-blur">
          <div className="bg-[linear-gradient(135deg,#10253d_0%,#1b476f_58%,#336e9b_100%)] px-5 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
                  Admissions assistant
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">
                  A quick way to guide your next step
                </h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-sand-50 transition hover:bg-white/16"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm leading-7 text-sand-50/85">
              Ask common parent questions, get a program suggestion, or move
              directly into demo booking.
            </p>
          </div>

          <div className="space-y-6 px-5 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
                Quick answers
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {assistantTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs font-medium transition sm:text-sm",
                      topic.id === activeTopicId
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-navy-100 bg-navy-50 text-navy-700 hover:border-navy-200 hover:bg-white",
                    )}
                    onClick={() => setActiveTopicId(topic.id)}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-[24px] border border-white/80 bg-sand-100/70 p-4 shadow-[0_14px_36px_rgba(16,37,61,0.06)]">
                <p className="text-sm font-semibold text-navy-900">
                  {activeTopic.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-ink-600">
                  {activeTopic.body}
                </p>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/80 bg-white/90 p-4 shadow-[0_16px_40px_rgba(16,37,61,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
                Find the right program
              </p>
              <label className="mt-3 block text-sm font-medium text-navy-900">
                Child age
                <select
                  className="mt-2 w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm outline-none transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70"
                  defaultValue=""
                  value={childAge}
                  onChange={(event) => setChildAge(event.target.value)}
                >
                  <option value="">Select age</option>
                  {Array.from({ length: 10 }).map((_, index) => {
                    const age = index + 5;
                    return (
                      <option key={age} value={age}>
                        {age} years
                      </option>
                    );
                  })}
                </select>
              </label>
              <div className="mt-4 rounded-[22px] bg-navy-50 px-4 py-4">
                {suggestedProgram ? (
                  <>
                    <p className="text-sm font-semibold text-navy-900">
                      Suggested program: {suggestedProgram.name}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-ink-600">
                      {suggestedProgram.description}
                    </p>
                  </>
                ) : (
                  <p className="text-sm leading-7 text-ink-600">
                    Choose your child&apos;s age to get a quick guidance-based
                    program suggestion.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/80 bg-white/90 p-4 shadow-[0_16px_40px_rgba(16,37,61,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
                Quick lead capture
              </p>
              {!leadSubmitted ? (
                <div className="mt-3 space-y-3">
                  <input
                    className="w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm outline-none transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70"
                    placeholder="Parent name"
                    value={leadForm.name}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                  <input
                    className="w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm outline-none transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70"
                    placeholder="Phone number"
                    type="tel"
                    value={leadForm.phone}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm outline-none transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70"
                    defaultValue=""
                    value={leadForm.childAge}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        childAge: event.target.value,
                      }))
                    }
                  >
                    <option value="">Child age</option>
                    {Array.from({ length: 10 }).map((_, index) => {
                      const age = index + 5;
                      return (
                        <option key={age} value={age}>
                          {age} years
                        </option>
                      );
                    })}
                  </select>
                  <button
                    type="button"
                    className="w-full rounded-full bg-[linear-gradient(135deg,#10253d_0%,#1b476f_62%,#336e9b_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_46px_rgba(16,37,61,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(16,37,61,0.24)]"
                    onClick={() => {
                      setLeadSubmitted(true);
                      trackAnalyticsEvent("chatbot_lead_capture", {
                        hasAge: Boolean(leadForm.childAge),
                      });
                    }}
                  >
                    Save details for next step
                  </button>
                </div>
              ) : (
                <div className="mt-3 rounded-[22px] bg-mint-400/12 px-4 py-4">
                  <p className="text-sm font-semibold text-navy-900">
                    Details saved for your next step
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-600">
                    This assistant preview is frontend-first. Use the quick
                    actions below to continue with a real booking or WhatsApp
                    handoff.
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral-600">
                Quick actions
              </p>
              <div className="mt-3 grid gap-3">
                {assistantQuickActions.map((action) => (
                  <ButtonLink
                    key={action.href}
                    className="w-full"
                    href={action.href}
                    variant={action.href === "/programs" ? "secondary" : "primary"}
                    analyticsEvent={action.eventName}
                    analyticsPayload={{ location: action.location }}
                  >
                    {action.label}
                  </ButtonLink>
                ))}
                {leadWhatsAppHref ? (
                  <a
                    href={leadWhatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-[#1f9d55]/25 bg-[#1f9d55]/10 px-5 py-3 text-sm font-semibold text-[#147044] transition hover:bg-[#1f9d55]/15"
                    onClick={() =>
                      trackAnalyticsEvent("whatsapp_click", {
                        location: "chatbot",
                      })
                    }
                  >
                    Chat on WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#10253d_0%,#1b476f_62%,#336e9b_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_55px_rgba(16,37,61,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(16,37,61,0.24)]"
        onClick={() => {
          setIsOpen((current) => !current);
          if (!isOpen) {
            trackAnalyticsEvent("chatbot_open", { location: "floating_widget" });
          }
        }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/14 text-base">
          AI
        </span>
        <span>{isOpen ? "Hide assistant" : "Admissions assistant"}</span>
      </button>
    </div>
  );
}
