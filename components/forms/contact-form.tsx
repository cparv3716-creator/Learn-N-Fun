"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactMessage } from "@/app/actions/enquiries";
import { contactMessageInitialState } from "@/app/actions/form-states";
import { buttonClassName } from "@/components/ui/button-link";
import { WhatsAppFollowUpLink } from "@/components/ui/whatsapp-follow-up-link";

const fieldClasses =
  "mt-2 w-full rounded-[22px] border border-navy-100 bg-white px-4 py-3.5 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    contactMessageInitialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form action={formAction} ref={formRef}>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} />
        </label>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral-600">
          Contact form
        </p>
        <h2 className="mt-4 text-4xl font-semibold text-navy-900">
          Tell us how we can help
        </h2>
        <p className="mt-4 text-sm leading-7 text-ink-600">
          Use this form for admissions, general questions, support requests, or
          franchise conversations.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
        <label className="text-sm font-medium text-navy-900 sm:col-span-2">
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
        <label className="text-sm font-medium text-navy-900 sm:col-span-2">
          Enquiry type
          <select
            className={fieldClasses}
            defaultValue=""
            name="enquiryType"
            required
            aria-invalid={Boolean(state.fieldErrors?.enquiryType)}
          >
            <option value="" disabled>
              Choose a topic
            </option>
            <option value="Admissions">Admissions</option>
            <option value="Programs">Programs</option>
            <option value="Parent support">Parent support</option>
            <option value="Franchise">Franchise</option>
            <option value="General">General</option>
          </select>
          {state.fieldErrors?.enquiryType ? (
            <p className="mt-2 text-xs text-coral-600">
              {state.fieldErrors.enquiryType}
            </p>
          ) : null}
        </label>
        <label className="text-sm font-medium text-navy-900 sm:col-span-2">
          Message
          <textarea
            className={`${fieldClasses} min-h-36 resize-y`}
            name="message"
            placeholder="Share your question or tell us what support you need."
            required
            aria-invalid={Boolean(state.fieldErrors?.message)}
          />
          {state.fieldErrors?.message ? (
            <p className="mt-2 text-xs text-coral-600">
              {state.fieldErrors.message}
            </p>
          ) : null}
        </label>
      </div>

      <div className="mt-8 rounded-[26px] bg-sand-100/70 p-5 text-sm leading-7 text-ink-600">
        Our team reviews every message and follows up using the contact details
        you share here.
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          className={buttonClassName(
            "primary",
            "cursor-pointer border-0 disabled:cursor-not-allowed disabled:opacity-60",
          )}
          disabled={pending}
        >
          {pending ? "Sending..." : "Send message"}
        </button>
        {state.message ? (
          <p
            className={`text-sm font-medium ${
              state.status === "success" ? "text-mint-500" : "text-coral-600"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        {state.status === "success" ? (
          <WhatsAppFollowUpLink message="Hi, I just sent a contact enquiry through your website and would like to continue on WhatsApp." />
        ) : null}
      </div>
    </form>
  );
}
