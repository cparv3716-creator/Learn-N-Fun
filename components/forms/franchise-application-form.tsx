"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFranchiseApplication } from "@/app/actions/enquiries";
import { franchiseApplicationInitialState } from "@/app/actions/form-states";
import { buttonClassName } from "@/components/ui/button-link";
import { WhatsAppFollowUpLink } from "@/components/ui/whatsapp-follow-up-link";
import { trackAnalyticsEvent } from "@/lib/analytics";

const fieldClasses =
  "mt-2 w-full rounded-[22px] border border-navy-100 bg-white px-4 py-3.5 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

type FranchiseApplicationFormProps = {
  whatsAppLink?: string | null;
};

export function FranchiseApplicationForm({
  whatsAppLink = null,
}: FranchiseApplicationFormProps) {
  const [state, formAction, pending] = useActionState(
    submitFranchiseApplication,
    franchiseApplicationInitialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={() =>
        trackAnalyticsEvent("franchise_form_submit", {
          location: "franchise_form",
        })
      }
    >
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} />
        </label>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
          Franchise application
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:mt-4 sm:text-4xl">
          Tell us about your interest
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
          Share a few details about your city, background, and why you&apos;re
          exploring a center with us.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
        <label className="text-sm font-medium text-navy-900">
          Full name
          <input
            className={fieldClasses}
            name="name"
            required
            aria-invalid={Boolean(state.fieldErrors?.name)}
          />
          {state.fieldErrors?.name ? (
            <p className="mt-2 text-xs text-coral-600">
              {state.fieldErrors.name}
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

        <label className="text-sm font-medium text-navy-900 sm:col-span-2">
          Relevant experience or background
          <textarea
            className={`${fieldClasses} min-h-32 resize-y`}
            name="experience"
            placeholder="Tell us about your education, operations, business, or community background."
            required
            aria-invalid={Boolean(state.fieldErrors?.experience)}
          />
          {state.fieldErrors?.experience ? (
            <p className="mt-2 text-xs text-coral-600">
              {state.fieldErrors.experience}
            </p>
          ) : null}
        </label>

        <label className="text-sm font-medium text-navy-900 sm:col-span-2">
          Anything else we should know?
          <textarea
            className={`${fieldClasses} min-h-28 resize-y`}
            name="message"
            placeholder="Optional notes about your goals, timeline, or questions."
            aria-invalid={Boolean(state.fieldErrors?.message)}
          />
          {state.fieldErrors?.message ? (
            <p className="mt-2 text-xs text-coral-600">
              {state.fieldErrors.message}
            </p>
          ) : null}
        </label>
      </div>

      <div className="mt-6 rounded-[24px] bg-sand-100/70 p-4 text-sm leading-7 text-ink-600 sm:mt-8 sm:rounded-[26px] sm:p-5">
        Our team reviews each application personally and follows up with the
        next-step conversation if there&apos;s a good fit.
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
          {pending ? "Submitting..." : "Submit application"}
        </button>

        {state.message ? (
          state.status === "success" ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium text-mint-500">We&apos;ll contact you shortly.</p>
              <p className="text-ink-600">{state.message}</p>
            </div>
          ) : (
            <p className="text-sm font-medium text-coral-600">
              {state.message}
            </p>
          )
        ) : null}
        {state.status === "success" ? (
          <WhatsAppFollowUpLink href={whatsAppLink} />
        ) : null}
      </div>
    </form>
  );
}
