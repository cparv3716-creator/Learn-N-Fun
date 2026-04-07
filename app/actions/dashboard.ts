"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePortalSession } from "@/server/portal-auth";
import { completeManualPaymentForAccount } from "@/server/payments";

export async function payDashboardFees() {
  const session = await requirePortalSession();

  await completeManualPaymentForAccount(session.accountId);
  revalidatePath("/dashboard");
  redirect("/dashboard?payment=success");
}
