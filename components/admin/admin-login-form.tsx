"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/admin";
import { adminLoginInitialState } from "@/app/actions/form-states";
import { buttonClassName } from "@/components/ui/button-link";

const fieldClasses =
  "mt-2 w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

type AdminLoginFormProps = {
  isConfigured: boolean;
};

export function AdminLoginForm({ isConfigured }: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    adminLoginInitialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-navy-900">
          Username
          <input
            className={fieldClasses}
            name="username"
            required
            type="text"
            autoComplete="username"
          />
        </label>
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
      </div>

      {state.status === "error" ? (
        <p className="rounded-[18px] bg-coral-400/10 px-4 py-3 text-sm text-coral-600">
          {state.message}
        </p>
      ) : null}

      {!isConfigured ? (
        <p className="rounded-[18px] bg-sand-100/80 px-4 py-3 text-sm text-ink-600">
          Set `ADMIN_USERNAME`, `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`, and
          `ADMIN_SESSION_SECRET` before using the admin dashboard.
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
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
