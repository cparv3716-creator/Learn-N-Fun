"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitDemoRequest } from "@/app/actions/enquiries";
import { demoRequestInitialState } from "@/app/actions/form-states";
import { ButtonLink, buttonClassName } from "@/components/ui/button-link";
import { WhatsAppFollowUpLink } from "@/components/ui/whatsapp-follow-up-link";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { programs } from "@/lib/site-data";

const fieldClasses =
  "mt-2 w-full rounded-[22px] border border-navy-100 bg-white px-4 py-3.5 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

const demoModes = [
  { label: "Online demo", value: "Online" },
  { label: "Offline demo", value: "Offline" },
];

type ConfirmationSummary = {
  childAge: string;
  childName: string;
  city: string;
  email: string;
  mode: string;
  parentName: string;
  phone: string;
  preferredBatch: string;
  preferredDate: string;
  preferredSlot: string;
  preferredTime: string;
};

type BookDemoFormProps = {
  whatsAppLink?: string | null;
};

export function BookDemoForm({ whatsAppLink = null }: BookDemoFormProps) {
  const [state, formAction, pending] = useActionState(
    submitDemoRequest,
    demoRequestInitialState,
  );
  const [preferredDemoDate, setPreferredDemoDate] = useState("");
  const [preferredDemoTime, setPreferredDemoTime] = useState("");
  const [mode, setMode] = useState(demoModes[0].value);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationSummary, setConfirmationSummary] =
    useState<ConfirmationSummary | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const today = useMemo(() => {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }, []);

  const combinedNotes = [
    `Demo mode: ${mode}`,
    preferredDemoDate ? `Preferred demo date: ${preferredDemoDate}` : null,
    preferredDemoTime ? `Preferred demo time: ${preferredDemoTime}` : null,
    additionalNotes ? `Additional notes: ${additionalNotes.trim()}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      const frameId = window.requestAnimationFrame(() => {
        setPreferredDemoDate("");
        setPreferredDemoTime("");
        setMode(demoModes[0].value);
        setAdditionalNotes("");
        setShowConfirmation(true);
      });

      return () => window.cancelAnimationFrame(frameId);
    }
  }, [state.status]);

  function handleSubmit() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    setConfirmationSummary({
      childAge: String(formData.get("childAge") ?? ""),
      childName: String(formData.get("childName") ?? ""),
      city: String(formData.get("city") ?? ""),
      email: String(formData.get("email") ?? ""),
      mode,
      parentName: String(formData.get("parentName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      preferredBatch: String(formData.get("programInterest") ?? ""),
      preferredDate: preferredDemoDate,
      preferredSlot: String(formData.get("preferredSlot") ?? ""),
      preferredTime: preferredDemoTime,
    });
    trackAnalyticsEvent("demo_form_submit", { location: "book_demo_form" });
  }

  if (showConfirmation && state.status === "success" && confirmationSummary) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
            Booking confirmed
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:text-4xl">
            We&apos;ve saved your demo request
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-600 sm:text-base sm:leading-8">
            We&apos;ll contact you shortly to confirm the schedule and help you
            with the best starting batch.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-sand-100/72 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.06)] sm:rounded-[32px] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700 sm:text-sm">
            Demo summary
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Parent", confirmationSummary.parentName],
              ["Phone", confirmationSummary.phone],
              ["Child", confirmationSummary.childName],
              ["Age", `${confirmationSummary.childAge} years`],
              ["Preferred batch", confirmationSummary.preferredBatch],
              ["Batch timing", confirmationSummary.preferredSlot],
              [
                "Preferred demo date",
                confirmationSummary.preferredDate || "To be confirmed",
              ],
              [
                "Preferred demo time",
                confirmationSummary.preferredTime || "To be confirmed",
              ],
              ["Mode", confirmationSummary.mode],
              ["Email", confirmationSummary.email],
              ["City", confirmationSummary.city],
            ].map(([label, value]) => (
              <div
                key={`${label}-${value}`}
                className="rounded-[22px] bg-white/85 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-700">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-navy-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-navy-900 p-5 text-white shadow-[0_22px_55px_rgba(16,37,61,0.16)] sm:rounded-[32px] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 sm:text-sm">
            What happens next
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Our admissions team will review the details and confirm a suitable time slot.",
              "You’ll receive a level recommendation after the demo experience.",
              "If you’re ready, we’ll guide you into the most suitable regular batch.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3"
              >
                <p className="text-sm leading-7 text-sand-50/90">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            className={buttonClassName("secondary", "w-full sm:w-auto")}
            onClick={() => {
              setShowConfirmation(false);
              setConfirmationSummary(null);
            }}
          >
            Book another demo
          </button>
          <ButtonLink
            className="w-full sm:w-auto"
            href="/programs"
            variant="ghost"
          >
            Explore programs
          </ButtonLink>
          <WhatsAppFollowUpLink href={whatsAppLink} />
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} ref={formRef}>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} />
        </label>
      </div>
      <input name="notes" type="hidden" value={combinedNotes} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
          Demo booking
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:mt-4 sm:text-4xl">
          Book a guided demo with a premium parent experience
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
          Share the details below and we&apos;ll arrange a demo that feels
          useful, calm, and clearly matched to your child&apos;s level.
        </p>
      </div>

      <div className="mt-6 space-y-6 sm:mt-8">
        <div className="rounded-[26px] border border-white/80 bg-sand-100/70 p-5 shadow-[0_16px_40px_rgba(16,37,61,0.05)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700 sm:text-sm">
            Parent details
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
            <label className="text-sm font-medium text-navy-900">
              Parent name
              <input
                className={fieldClasses}
                name="parentName"
                required
                aria-invalid={Boolean(state.fieldErrors?.parentName)}
              />
              {state.fieldErrors?.parentName ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.parentName}
                </p>
              ) : null}
            </label>
            <label className="text-sm font-medium text-navy-900">
              Phone number
              <input
                className={fieldClasses}
                name="phone"
                required
                type="tel"
                aria-invalid={Boolean(state.fieldErrors?.phone)}
              />
              {state.fieldErrors?.phone ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.phone}
                </p>
              ) : null}
            </label>
            <label className="text-sm font-medium text-navy-900">
              Email address
              <input
                className={fieldClasses}
                name="email"
                required
                type="email"
                aria-invalid={Boolean(state.fieldErrors?.email)}
              />
              {state.fieldErrors?.email ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.email}
                </p>
              ) : null}
            </label>
            <label className="text-sm font-medium text-navy-900">
              City
              <input
                className={fieldClasses}
                name="city"
                required
                aria-invalid={Boolean(state.fieldErrors?.city)}
              />
              {state.fieldErrors?.city ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.city}
                </p>
              ) : null}
            </label>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/80 bg-white/92 p-5 shadow-[0_16px_40px_rgba(16,37,61,0.06)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700 sm:text-sm">
            Child &amp; batch details
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
            <label className="text-sm font-medium text-navy-900">
              Child name
              <input
                className={fieldClasses}
                name="childName"
                required
                aria-invalid={Boolean(state.fieldErrors?.childName)}
              />
              {state.fieldErrors?.childName ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.childName}
                </p>
              ) : null}
            </label>
            <label className="text-sm font-medium text-navy-900">
              Child age
              <select
                className={fieldClasses}
                defaultValue=""
                name="childAge"
                required
                aria-invalid={Boolean(state.fieldErrors?.childAge)}
              >
                <option value="" disabled>
                  Select age
                </option>
                {Array.from({ length: 10 }).map((_, index) => {
                  const age = index + 5;
                  return (
                    <option key={age} value={age}>
                      {age} years
                    </option>
                  );
                })}
              </select>
              {state.fieldErrors?.childAge ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.childAge}
                </p>
              ) : null}
            </label>
            <label className="text-sm font-medium text-navy-900 sm:col-span-2">
              Preferred batch
              <select
                className={fieldClasses}
                defaultValue=""
                name="programInterest"
                required
                aria-invalid={Boolean(state.fieldErrors?.programInterest)}
              >
                <option value="" disabled>
                  Choose a preferred batch
                </option>
                {programs.map((program) => (
                  <option key={program.name} value={program.name}>
                    {program.name}
                  </option>
                ))}
                <option value="Need guidance">Need guidance</option>
              </select>
              {state.fieldErrors?.programInterest ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.programInterest}
                </p>
              ) : null}
            </label>
            <label className="text-sm font-medium text-navy-900 sm:col-span-2">
              Preferred batch timing
              <select
                className={fieldClasses}
                defaultValue=""
                name="preferredSlot"
                required
                aria-invalid={Boolean(state.fieldErrors?.preferredSlot)}
              >
                <option value="" disabled>
                  Choose a preferred batch timing
                </option>
                <option value="Weekday afternoon">Weekday afternoon</option>
                <option value="Weekday evening">Weekday evening</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              {state.fieldErrors?.preferredSlot ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.preferredSlot}
                </p>
              ) : null}
            </label>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/80 bg-white/92 p-5 shadow-[0_16px_40px_rgba(16,37,61,0.06)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700 sm:text-sm">
            Demo schedule
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
            <label className="text-sm font-medium text-navy-900">
              Preferred demo date
              <input
                className={fieldClasses}
                min={today}
                name="preferredDemoDate"
                required
                type="date"
                value={preferredDemoDate}
                onChange={(event) => setPreferredDemoDate(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-navy-900">
              Preferred demo time
              <input
                className={fieldClasses}
                name="preferredDemoTime"
                required
                type="time"
                value={preferredDemoTime}
                onChange={(event) => setPreferredDemoTime(event.target.value)}
              />
            </label>
            <div className="text-sm font-medium text-navy-900 sm:col-span-2">
              Demo mode
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {demoModes.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-[22px] border px-4 py-4 transition ${
                      mode === option.value
                        ? "border-navy-900 bg-navy-900 text-white shadow-[0_18px_46px_rgba(16,37,61,0.18)]"
                        : "border-navy-100 bg-white text-ink-600 hover:border-navy-200 hover:bg-sand-50/70"
                    }`}
                  >
                    <input
                      checked={mode === option.value}
                      className="mt-1"
                      name="demoMode"
                      type="radio"
                      value={option.value}
                      onChange={(event) => setMode(event.target.value)}
                    />
                    <div>
                      <p className="font-semibold">{option.label}</p>
                      <p
                        className={`mt-1 text-sm leading-6 ${
                          mode === option.value
                            ? "text-sand-50/80"
                            : "text-ink-600"
                        }`}
                      >
                        {option.value === "Online"
                          ? "Useful for convenience, continuity, and travel-friendly scheduling."
                          : "Ideal for parents who want the full in-center class feel."}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <label className="text-sm font-medium text-navy-900 sm:col-span-2">
              Anything else we should know?
              <textarea
                className={`${fieldClasses} min-h-28 resize-y`}
                name="additionalNotes"
                placeholder="Share any attention concerns, learning goals, or details that would help us prepare a better demo."
                value={additionalNotes}
                onChange={(event) => setAdditionalNotes(event.target.value)}
              />
              {state.fieldErrors?.notes ? (
                <p className="mt-2 text-xs text-coral-600">
                  {state.fieldErrors.notes}
                </p>
              ) : null}
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] bg-sand-100/70 p-4 text-sm leading-7 text-ink-600 sm:mt-8 sm:rounded-[26px] sm:p-5">
        A member of our team will review your request, confirm the demo slot,
        and help you choose the most suitable regular batch.
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className={buttonClassName(
            "primary",
            "w-full cursor-pointer border-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
          )}
          disabled={pending}
        >
          {pending ? "Saving booking..." : "Confirm demo booking"}
        </button>
        <ButtonLink className="w-full sm:w-auto" href="/programs" variant="ghost">
          Compare programs
        </ButtonLink>
        {state.status === "error" && state.message ? (
          <p className="text-sm font-medium text-coral-600">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
