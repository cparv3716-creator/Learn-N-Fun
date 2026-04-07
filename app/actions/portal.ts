"use server";

import { redirect } from "next/navigation";
import type {
  PortalLoginState,
  PortalSignupState,
} from "@/app/actions/form-states";
import {
  createPortalSession,
  clearPortalSession,
  isPortalAuthConfigured,
  verifyPortalCredentials,
} from "@/server/portal-auth";
import {
  readPortalEmail,
  readPortalPassword,
  readPortalSignupInput,
  registerPortalAccount,
} from "@/server/portal-accounts";

const INVALID_PORTAL_LOGIN_DELAY_MS = 400;

async function waitForFailedLoginResponse() {
  await new Promise((resolve) =>
    setTimeout(resolve, INVALID_PORTAL_LOGIN_DELAY_MS),
  );
}

export async function loginPortal(
  _previousState: PortalLoginState,
  formData: FormData,
): Promise<PortalLoginState> {
  if (!isPortalAuthConfigured()) {
    return {
      message:
        "Portal login is not configured yet. Add PORTAL_SESSION_SECRET before enabling dashboard access.",
      status: "error",
    };
  }

  const email = readPortalEmail(formData.get("email"));
  const password = readPortalPassword(formData.get("password"));
  const fieldErrors: PortalLoginState["fieldErrors"] = {};

  if (!email) {
    fieldErrors.email = "Enter your email address.";
  }

  if (!password) {
    fieldErrors.password = "Enter your password.";
  }

  if (fieldErrors.email || fieldErrors.password) {
    await waitForFailedLoginResponse();
    return {
      fieldErrors,
      message: "Enter both your email and password.",
      status: "error",
    };
  }

  try {
    const account = await verifyPortalCredentials(email, password);

    if (!account) {
      await waitForFailedLoginResponse();
      return {
        message: "We couldn't sign you in with those credentials.",
        status: "error",
      };
    }

    await createPortalSession(account.accountId);
  } catch (error) {
    console.error("Portal login failed", error);
    await waitForFailedLoginResponse();
    return {
      message:
        "Portal login is temporarily unavailable. Please try again in a moment.",
      status: "error",
    };
  }

  redirect("/dashboard");
}

export async function signupPortal(
  _previousState: PortalSignupState,
  formData: FormData,
): Promise<PortalSignupState> {
  if (!isPortalAuthConfigured()) {
    return {
      message:
        "Portal signup is not configured yet. Add PORTAL_SESSION_SECRET before enabling dashboard accounts.",
      status: "error",
    };
  }

  try {
    const input = readPortalSignupInput(formData);
    const confirmPassword =
      typeof formData.get("confirmPassword") === "string"
        ? String(formData.get("confirmPassword"))
        : "";
    const result = await registerPortalAccount(input, confirmPassword);

    if (!result.ok) {
      return {
        fieldErrors: result.fieldErrors,
        message: "Please fix the highlighted details and try again.",
        status: "error",
      };
    }

    await createPortalSession(result.accountId);
  } catch (error) {
    console.error("Portal signup failed", error);
    return {
      message:
        "We couldn't create the account right now. Please try again in a moment.",
      status: "error",
    };
  }

  redirect("/dashboard?welcome=signup");
}

export async function logoutPortal() {
  await clearPortalSession();
  redirect("/dashboard/login");
}
