"use client";

import { useActionState } from "react";
import { loginPortal } from "@/app/actions/portal";
import { portalLoginInitialState } from "@/app/actions/form-states";
import { buttonClassName } from "@/components/ui/button-link";
import { trackAnalyticsEvent } from "@/lib/analytics";

const fieldClasses =
  "mt-2 w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

type PortalLoginFormProps = {
  isConfigured: boolean;
};

export function PortalLoginForm({ isConfigured }: PortalLoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginPortal,
    portalLoginInitialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5"
      onSubmit={() =>
        trackAnalyticsEvent("login_click", { location: "portal_login_form" })
      }
    >
      <div>
        <label className="text-sm font-medium text-navy-900">
          Email address
          <input
            className={fieldClasses}
            name="email"
            required
            type="email"
            autoComplete="username"
          />
        </label>
        {state.fieldErrors?.email ? (
          <p className="mt-2 text-sm text-coral-600">{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium text-navy-900">
          Password
          <input
            className={fieldClasses}
            name="password"
            required
            type="password"
            autoComplete="current-password"
          />
        </label>
        {state.fieldErrors?.password ? (
          <p className="mt-2 text-sm text-coral-600">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      {state.status === "error" ? (
        <p className="rounded-[18px] bg-coral-400/10 px-4 py-3 text-sm text-coral-600">
          {state.message}
        </p>
      ) : null}

      {!isConfigured ? (
        <p className="rounded-[18px] bg-sand-100/80 px-4 py-3 text-sm text-ink-600">
          Set `PORTAL_SESSION_SECRET` before enabling dashboard sign-in and
          signup.
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
        {pending ? "Signing in..." : "Sign in to dashboard"}
      </button>
    </form>
  );
}
