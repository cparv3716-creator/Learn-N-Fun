import "server-only";

import {
  DemoBookingStatus,
  DemoOpsStatus,
  EnrollmentStatus,
  LeadStatus,
  PaymentProvider,
  PaymentStatus,
  ProgressStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getMonthlyFeeInr } from "@/server/student-records";

export async function completeManualPaymentForAccount(accountId: string) {
  const profile = await prisma.portalProfile.findUnique({
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
    where: { accountId },
  });

  if (!profile) {
    throw new Error("Student profile not found for this account.");
  }

  const enrollment =
    profile.enrollments.find(
      (item) =>
        item.status === EnrollmentStatus.ACTIVE ||
        item.status === EnrollmentStatus.PENDING,
    ) ?? profile.enrollments[0];

  if (!enrollment) {
    throw new Error("No enrollment is available for payment yet.");
  }

  const existingPendingPayment = profile.payments.find(
    (payment) =>
      payment.status === PaymentStatus.PENDING &&
      payment.enrollmentId === enrollment.id,
  );

  const payment =
    existingPendingPayment ??
    (await prisma.payment.create({
      data: {
        accountId,
        amountInr: enrollment.monthlyFeeInr ?? getMonthlyFeeInr(enrollment.programName),
        description: `${enrollment.programName} monthly fee`,
        enrollmentId: enrollment.id,
        profileId: profile.id,
        provider: PaymentProvider.MANUAL,
        status: PaymentStatus.PENDING,
      },
    }));

  const paidAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      data: {
        paidAt,
        providerReference: `manual-${payment.id}`,
        status: PaymentStatus.PAID,
      },
      where: { id: payment.id },
    });

    await tx.enrollment.update({
      data: {
        status: EnrollmentStatus.ACTIVE,
      },
      where: { id: enrollment.id },
    });

    if (profile.sourceDemoRequestId) {
      await tx.demoRequest.update({
        data: {
          bookingStatus: DemoBookingStatus.CONFIRMED,
          opsStatus: DemoOpsStatus.CONVERTED,
          status: LeadStatus.CONTACTED,
        },
        where: { id: profile.sourceDemoRequestId },
      });
    }

    const existingPaymentProgress = await tx.progress.findFirst({
      where: {
        profileId: profile.id,
        title: "Payment confirmed",
      },
    });

    if (!existingPaymentProgress) {
      await tx.progress.create({
        data: {
          achievedAt: paidAt,
          detail: "Payment was completed and the learner is ready to move into active classes.",
          enrollmentId: enrollment.id,
          profileId: profile.id,
          sortOrder: 4,
          status: ProgressStatus.COMPLETED,
          title: "Payment confirmed",
        },
      });
    }
  });

  return payment.id;
}
