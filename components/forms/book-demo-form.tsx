"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitDemoRequest } from "@/app/actions/enquiries";
import { demoRequestInitialState } from "@/app/actions/form-states";
import { buttonClassName } from "@/components/ui/button-link";
import { WhatsAppFollowUpLink } from "@/components/ui/whatsapp-follow-up-link";
import { programs } from "@/lib/site-data";

const fieldClasses =
  "mt-2 w-full rounded-[22px] border border-navy-100 bg-white px-4 py-3.5 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

export function BookDemoForm() {
  const [state, formAction, pending] = useActionState(
    submitDemoRequest,
    demoRequestInitialState,
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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
          Demo request
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:mt-4 sm:text-4xl">
          Tell us a little about your child
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-600 sm:mt-4">
          We&apos;ll use these details to recommend the right batch and prepare a
          more useful first conversation.
        </p>
        <p className="mt-3 text-sm leading-6 text-navy-700/80">
          A quick, no-pressure first step for parents who want the right fit.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
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
        <label className="text-sm font-medium text-navy-900">
          Parent email
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
          Parent phone
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
          Program interest
          <select
            className={fieldClasses}
            defaultValue=""
            name="programInterest"
            required
            aria-invalid={Boolean(state.fieldErrors?.programInterest)}
          >
            <option value="" disabled>
              Choose a program
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
          Preferred time
          <select
            className={fieldClasses}
            defaultValue=""
            name="preferredSlot"
            required
            aria-invalid={Boolean(state.fieldErrors?.preferredSlot)}
          >
            <option value="" disabled>
              Choose a preferred slot
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
        <label className="text-sm font-medium text-navy-900 sm:col-span-2">
          Notes for the trainer
          <textarea
            className={`${fieldClasses} min-h-32 resize-y`}
            name="notes"
            placeholder="Share any learning goals, attention concerns, or previous class experience."
            aria-invalid={Boolean(state.fieldErrors?.notes)}
          />
          {state.fieldErrors?.notes ? (
            <p className="mt-2 text-xs text-coral-600">
              {state.fieldErrors.notes}
            </p>
          ) : null}
        </label>
      </div>

      <div className="mt-6 rounded-[24px] bg-sand-100/70 p-4 text-sm leading-7 text-ink-600 sm:mt-8 sm:rounded-[26px] sm:p-5">
        A member of our team will review your request and help you choose the
        most suitable starting batch.
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
          {pending ? "Submitting..." : "Submit demo request"}
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
          <WhatsAppFollowUpLink message="Hi, I just submitted a Book Demo request and would like to continue the conversation on WhatsApp." />
        ) : null}
      </div>
    </form>
  );
}
