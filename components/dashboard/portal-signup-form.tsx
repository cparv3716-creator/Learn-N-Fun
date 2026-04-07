"use client";

import { useActionState } from "react";
import { portalSignupInitialState } from "@/app/actions/form-states";
import { signupPortal } from "@/app/actions/portal";
import { buttonClassName } from "@/components/ui/button-link";

const fieldClasses =
  "mt-2 w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

type PortalSignupFormProps = {
  isConfigured: boolean;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-coral-600">{message}</p>;
}

export function PortalSignupForm({ isConfigured }: PortalSignupFormProps) {
  const [state, formAction, pending] = useActionState(
    signupPortal,
    portalSignupInitialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-navy-900">
          Account type
          <select className={fieldClasses} defaultValue="PARENT" name="role">
            <option value="PARENT">Parent</option>
            <option value="STUDENT">Student</option>
          </select>
        </label>
        <FieldError message={state.fieldErrors?.role} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-navy-900">
            Your full name
            <input
              autoComplete="name"
              className={fieldClasses}
              name="fullName"
              required
              type="text"
            />
          </label>
          <FieldError message={state.fieldErrors?.fullName} />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900">
            Student name
            <input
              autoComplete="off"
              className={fieldClasses}
              name="studentName"
              required
              type="text"
            />
          </label>
          <FieldError message={state.fieldErrors?.studentName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-navy-900">
            Email address
            <input
              autoComplete="email"
              className={fieldClasses}
              name="email"
              required
              type="email"
            />
          </label>
          <FieldError message={state.fieldErrors?.email} />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900">
            Phone number
            <input
              autoComplete="tel"
              className={fieldClasses}
              name="phone"
              required
              type="tel"
            />
          </label>
          <FieldError message={state.fieldErrors?.phone} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_0.72fr]">
        <div>
          <label className="text-sm font-medium text-navy-900">
            City
            <input
              autoComplete="address-level2"
              className={fieldClasses}
              name="city"
              required
              type="text"
            />
          </label>
          <FieldError message={state.fieldErrors?.city} />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900">
            Student age
            <input
              className={fieldClasses}
              max="16"
              min="4"
              name="studentAge"
              required
              type="number"
            />
          </label>
          <FieldError message={state.fieldErrors?.studentAge} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-navy-900">
            Password
            <input
              autoComplete="new-password"
              className={fieldClasses}
              name="password"
              required
              type="password"
            />
          </label>
          <FieldError message={state.fieldErrors?.password} />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-900">
            Confirm password
            <input
              autoComplete="new-password"
              className={fieldClasses}
              name="confirmPassword"
              required
              type="password"
            />
          </label>
          <FieldError message={state.fieldErrors?.confirmPassword} />
        </div>
      </div>

      {state.status === "error" && state.message ? (
        <p className="rounded-[18px] bg-coral-400/10 px-4 py-3 text-sm text-coral-600">
          {state.message}
        </p>
      ) : null}

      {!isConfigured ? (
        <p className="rounded-[18px] bg-sand-100/80 px-4 py-3 text-sm text-ink-600">
          Set `PORTAL_SESSION_SECRET` before enabling dashboard sign-up.
        </p>
      ) : null}

      <button
        type="submit"
        className={buttonClassName(
          "primary",
          "w-full cursor-pointer border-0 disabled:cursor-not-allowed disabled:opacity-60",
        )}
        disabled={pending || !isConfigured}
      >
        {pending ? "Creating account..." : "Create dashboard account"}
      </button>
    </form>
  );
}
