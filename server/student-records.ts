import "server-only";

import {
  DemoBookingStatus,
  DemoOpsStatus,
  EnrollmentStatus,
  PaymentProvider,
  PaymentStatus,
  ProgressStatus,
  StudentProfileStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROGRAM_FEE_INR = Number.parseInt(
  process.env.DEFAULT_PROGRAM_FEE_INR ?? "2500",
  10,
);

function fallbackFeeInr() {
  return Number.isFinite(DEFAULT_PROGRAM_FEE_INR) && DEFAULT_PROGRAM_FEE_INR > 0
    ? DEFAULT_PROGRAM_FEE_INR
    : 2500;
}

export function parseNotesValue(notes: string | null | undefined, label: string) {
  if (!notes) {
    return null;
  }

  const pattern = new RegExp(`${label}:\\s*([^|]+)`);
  const match = notes.match(pattern);
  return match?.[1]?.trim() ?? null;
}

export function getRecommendedLevel(programName: string | null) {
  switch (programName) {
    case "Spark Beginners":
      return "Foundation Entry";
    case "Focus Builders":
      return "Level 2 Starter";
    case "Championship Track":
      return "Advanced Track";
    case "Need guidance":
      return "Recommendation pending";
    default:
      return null;
  }
}

export function getMonthlyFeeInr(programName: string | null) {
  switch (programName) {
    case "Spark Beginners":
      return 2200;
    case "Focus Builders":
      return 2500;
    case "Championship Track":
      return 3000;
    default:
      return fallbackFeeInr();
  }
}

function createDateAtTime(
  preferredDemoDate: Date | null,
  preferredDemoTime: string | null,
) {
  if (!preferredDemoDate) {
    return null;
  }

  const combined = new Date(preferredDemoDate);

  if (!preferredDemoTime) {
    combined.setHours(10, 0, 0, 0);
    return combined;
  }

  const [hours, minutes] = preferredDemoTime.split(":").map((value) => {
    const numericValue = Number.parseInt(value, 10);
    return Number.isFinite(numericValue) ? numericValue : 0;
  });

  combined.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return combined;
}

function createNextAssessmentDate(nextClassAt: Date | null) {
  if (!nextClassAt) {
    return null;
  }

  const nextAssessmentAt = new Date(nextClassAt);
  nextAssessmentAt.setDate(nextAssessmentAt.getDate() + 30);
  return nextAssessmentAt;
}

export async function syncPortalProfileFromDemoRequest(
  profileId: string,
  demoRequestId: string,
) {
  const demoRequest = await prisma.demoRequest.findUnique({
    select: {
      accountId: true,
      childAge: true,
      childName: true,
      city: true,
      email: true,
      id: true,
      mode: true,
      phone: true,
      preferredDemoDate: true,
      preferredDemoTime: true,
      preferredSlot: true,
      programInterest: true,
    },
    where: { id: demoRequestId },
  });

  if (!demoRequest) {
    return;
  }

  const recommendedLevel = getRecommendedLevel(demoRequest.programInterest);
  const nextClassAt = createDateAtTime(
    demoRequest.preferredDemoDate,
    demoRequest.preferredDemoTime,
  );
  const nextAssessmentAt = createNextAssessmentDate(nextClassAt);
  const monthlyFeeInr = getMonthlyFeeInr(demoRequest.programInterest);

  await prisma.$transaction(async (tx) => {
    await tx.portalProfile.update({
      data: {
        city: demoRequest.city,
        modePreference: demoRequest.mode,
        phone: demoRequest.phone,
        preferredSlot: demoRequest.preferredSlot,
        programName: demoRequest.programInterest,
        recommendedLevel,
        sourceDemoRequestId: demoRequest.id,
        status: StudentProfileStatus.ACTIVE,
        studentAge: demoRequest.childAge,
        studentName: demoRequest.childName,
      },
      where: { id: profileId },
    });

    await tx.demoRequest.update({
      data: {
        bookingStatus: DemoBookingStatus.PENDING,
        opsStatus: DemoOpsStatus.NEW,
        profileId,
      },
      where: { id: demoRequest.id },
    });

    const existingEnrollment = await tx.enrollment.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        profileId,
        status: {
          in: [EnrollmentStatus.PENDING, EnrollmentStatus.ACTIVE],
        },
      },
    });

    const enrollment =
      existingEnrollment ??
      (await tx.enrollment.create({
        data: {
          batchName: demoRequest.preferredSlot,
          currentLevel: recommendedLevel,
          currency: "INR",
          monthlyFeeInr,
          nextAssessmentAt,
          nextClassAt,
          practiceAssignedCount: 8,
          practiceCompletedCount: 0,
          profileId,
          programName: demoRequest.programInterest,
          status: EnrollmentStatus.PENDING,
        },
      }));

    if (existingEnrollment) {
      await tx.enrollment.update({
        data: {
          batchName: demoRequest.preferredSlot,
          currentLevel: recommendedLevel,
          monthlyFeeInr,
          nextAssessmentAt,
          nextClassAt,
          programName: demoRequest.programInterest,
        },
        where: { id: existingEnrollment.id },
      });
    }

    const progressCount = await tx.progress.count({
      where: { profileId },
    });

    if (progressCount === 0) {
      await tx.progress.createMany({
        data: [
          {
            achievedAt: new Date(),
            detail: "Your demo booking was saved and is ready for scheduling confirmation.",
            enrollmentId: enrollment.id,
            profileId,
            sortOrder: 1,
            status: ProgressStatus.COMPLETED,
            title: "Demo booking received",
          },
          {
            detail: "Our team is preparing the right starting level recommendation.",
            enrollmentId: enrollment.id,
            profileId,
            sortOrder: 2,
            status: ProgressStatus.IN_PROGRESS,
            title: "Level recommendation in progress",
          },
          {
            detail: "Regular class onboarding begins after your demo is confirmed.",
            enrollmentId: enrollment.id,
            profileId,
            sortOrder: 3,
            status: ProgressStatus.UPCOMING,
            title: "Regular classes",
          },
        ],
      });
    }

    const existingPendingPayment = await tx.payment.findFirst({
      where: {
        enrollmentId: enrollment.id,
        status: PaymentStatus.PENDING,
      },
    });

    if (!existingPendingPayment) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      await tx.payment.create({
        data: {
          accountId: demoRequest.accountId,
          amountInr: monthlyFeeInr,
          description: `${demoRequest.programInterest} monthly fee`,
          dueDate,
          enrollmentId: enrollment.id,
          profileId,
          provider: PaymentProvider.MANUAL,
          status: PaymentStatus.PENDING,
        },
      });
    }
  });
}
