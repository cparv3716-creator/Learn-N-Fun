"use server";

import { LeadStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AdminLoginState } from "@/app/actions/form-states";
import { prisma } from "@/lib/prisma";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthConfigured,
  requireAdminSession,
  verifyAdminCredentials,
} from "@/server/admin-auth";

const INVALID_ADMIN_LOGIN_DELAY_MS = 400;
const enquiryLeadStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.CLOSED,
];
const franchiseLeadStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.APPROVED,
  LeadStatus.REJECTED,
];

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

async function waitForFailedLoginResponse() {
  await new Promise((resolve) =>
    setTimeout(resolve, INVALID_ADMIN_LOGIN_DELAY_MS),
  );
}

function revalidateAdminRoutes() {
  revalidatePath("/admin");
  revalidatePath("/admin/demo-bookings");
  revalidatePath("/admin/enquiries");
}

function parseLeadStatus(
  value: FormDataEntryValue | null,
  allowedStatuses: LeadStatus[],
) {
  if (typeof value !== "string") {
    return null;
  }

  return allowedStatuses.includes(value as LeadStatus)
    ? (value as LeadStatus)
    : null;
}

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  if (!isAdminAuthConfigured()) {
    return {
      message:
        "Admin authentication is not configured yet. Please set the required environment variables.",
      status: "error",
    };
  }

  const username = normalizeText(formData.get("username"));
  const password = readPassword(formData.get("password"));

  if (!username || !password) {
    await waitForFailedLoginResponse();
    return {
      message: "Enter both your username and password.",
      status: "error",
    };
  }

  const isValid = await verifyAdminCredentials(username, password);

  if (!isValid) {
    await waitForFailedLoginResponse();
    return {
      message: "Invalid admin credentials.",
      status: "error",
    };
  }

  await createAdminSession(username);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function updateDemoRequestStatus(id: string, formData: FormData) {
  await requireAdminSession();

  const status = parseLeadStatus(formData.get("status"), enquiryLeadStatuses);

  if (!status) {
    return;
  }

  await prisma.demoRequest.updateMany({
    data: { status },
    where: { id },
  });

  revalidateAdminRoutes();
}

export async function updateContactMessageStatus(
  id: string,
  formData: FormData,
) {
  await requireAdminSession();

  const status = parseLeadStatus(formData.get("status"), enquiryLeadStatuses);

  if (!status) {
    return;
  }

  await prisma.contactMessage.updateMany({
    data: { status },
    where: { id },
  });

  revalidateAdminRoutes();
}

export async function updateFranchiseApplicationStatus(
  id: string,
  formData: FormData,
) {
  await requireAdminSession();

  const status = parseLeadStatus(formData.get("status"), franchiseLeadStatuses);

  if (!status) {
    return;
  }

  await prisma.franchiseApplication.updateMany({
    data: { status },
    where: { id },
  });

  revalidateAdminRoutes();
}
