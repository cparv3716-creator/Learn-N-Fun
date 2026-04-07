import "server-only";

import {
  AttendanceStatus,
  EnrollmentStatus,
  PaymentStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PortalDashboardData } from "@/lib/portal/types";
import type { PortalRole } from "@/server/portal-auth";
import { syncPortalProfileFromDemoRequest } from "@/server/student-records";

type PortalSessionLike = {
  accountId: string;
  email: string;
  role: PortalRole;
};

function createDisplayName(email: string) {
  const rawValue = email.split("@")[0]?.replace(/[._-]/g, " ") || "Portal user";

  return rawValue
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function formatDateTime(date: Date | null | undefined) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrencyInr(amountInr: number | null | undefined) {
  if (typeof amountInr !== "number") {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    style: "currency",
  }).format(amountInr);
}

function createPlaceholderDashboardData(
  email: string,
  role: PortalRole,
): PortalDashboardData {
  return {
    assessments: {
      nextAssessmentLabel: null,
      nextClassLabel: null,
      note: "Class schedules and assessments will appear here once your enrollment is confirmed.",
      state: "empty",
    },
    attendance: {
      attendanceRate: null,
      note: "Attendance will appear here once classes are underway.",
      presentCount: null,
      state: "empty",
      totalCount: null,
    },
    homework: {
      note: "Homework and practice status will appear here once assignments are tracked for your class.",
      pendingLabel: null,
      state: "empty",
      submittedLabel: null,
    },
    payments: {
      amountDueLabel: null,
      canPayNow: false,
      lastPaymentLabel: null,
      note: "Payments will appear here once an enrollment is set up.",
      pendingPaymentId: null,
      state: "empty",
    },
    progress: {
      milestones: [],
      note: "Progress milestones will appear once your learner journey is created.",
      state: "empty",
    },
    source: "integration_ready_placeholder",
    student: {
      age: null,
      city: null,
      email,
      modePreference: null,
      name: createDisplayName(email),
      parentName:
        role === "parent" ? "Portal account holder" : "Parent account linked later",
      preferredSlot: null,
      programName: null,
      recommendedLevel: null,
      role,
    },
    teacherNotes: {
      items: [],
      note: "Teacher notes will appear here once the learner record includes classroom feedback.",
      state: "empty",
    },
  };
}

export async function getPortalDashboardData(
  session: PortalSessionLike,
): Promise<PortalDashboardData> {
  try {
    const account = await prisma.portalAccount.findUnique({
      include: {
        profile: {
          include: {
            attendanceRecords: {
              orderBy: { classDate: "desc" },
              take: 12,
            },
            enrollments: {
              orderBy: { createdAt: "desc" },
            },
            payments: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
            progressRecords: {
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
              take: 10,
            },
            sourceDemoRequest: true,
            teacherNotes: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        },
      },
      where: { id: session.accountId },
    });

    if (!account?.profile) {
      return createPlaceholderDashboardData(session.email, session.role);
    }

    let profile = account.profile;

    if (
      !profile.sourceDemoRequestId &&
      profile.enrollments.length === 0 &&
      profile.progressRecords.length === 0
    ) {
      const latestDemoRequest = await prisma.demoRequest.findFirst({
        orderBy: { createdAt: "desc" },
        where: {
          OR: [{ accountId: account.id }, { email: account.email.toLowerCase() }],
        },
      });

      if (latestDemoRequest) {
        await prisma.demoRequest.update({
          data: {
            accountId: account.id,
            profileId: profile.id,
          },
          where: { id: latestDemoRequest.id },
        });
        await syncPortalProfileFromDemoRequest(profile.id, latestDemoRequest.id);

        const refreshedAccount = await prisma.portalAccount.findUnique({
          include: {
            profile: {
              include: {
                attendanceRecords: {
                  orderBy: { classDate: "desc" },
                  take: 12,
                },
                enrollments: {
                  orderBy: { createdAt: "desc" },
                },
                payments: {
                  orderBy: { createdAt: "desc" },
                  take: 10,
                },
                progressRecords: {
                  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                  take: 10,
                },
                sourceDemoRequest: true,
                teacherNotes: {
                  orderBy: { createdAt: "desc" },
                  take: 5,
                },
              },
            },
          },
          where: { id: session.accountId },
        });

        if (refreshedAccount?.profile) {
          profile = refreshedAccount.profile;
        }
      }
    }

    const currentEnrollment =
      profile.enrollments.find(
        (enrollment) =>
          enrollment.status === EnrollmentStatus.ACTIVE ||
          enrollment.status === EnrollmentStatus.PENDING ||
          enrollment.status === EnrollmentStatus.PAUSED,
      ) ??
      profile.enrollments[0] ??
      null;
    const attendanceRecords = currentEnrollment
      ? profile.attendanceRecords.filter(
          (record) =>
            !record.enrollmentId || record.enrollmentId === currentEnrollment.id,
        )
      : profile.attendanceRecords;
    const paidPayments = profile.payments.filter(
      (payment) => payment.status === PaymentStatus.PAID,
    );
    const pendingPayment = profile.payments.find(
      (payment) => payment.status === PaymentStatus.PENDING,
    );
    const presentCount = attendanceRecords.filter(
      (record) => record.status === AttendanceStatus.PRESENT,
    ).length;
    const totalAttendanceCount = attendanceRecords.length;
    const attendanceRate =
      totalAttendanceCount > 0
        ? Math.round((presentCount / totalAttendanceCount) * 100)
        : null;

    const teacherNotesItems =
      profile.teacherNotes.length > 0
        ? profile.teacherNotes.map((note) => ({
            createdAtLabel: formatDate(note.createdAt) ?? "",
            id: note.id,
            message: note.message,
            teacherName: note.teacherName,
          }))
        : profile.sourceDemoRequest?.notes
          ? [
              {
                createdAtLabel: formatDate(profile.sourceDemoRequest.createdAt) ?? "",
                id: profile.sourceDemoRequest.id,
                message: profile.sourceDemoRequest.notes,
                teacherName: "Admissions team",
              },
            ]
          : [];

    return {
      assessments: {
        nextAssessmentLabel:
          formatDateTime(currentEnrollment?.nextAssessmentAt) ?? null,
        nextClassLabel: formatDateTime(currentEnrollment?.nextClassAt) ?? null,
        note:
          currentEnrollment?.nextClassAt || currentEnrollment?.nextAssessmentAt
            ? "Upcoming class and assessment timings are now being tracked from the learner record."
            : "The next class and assessment will show here once scheduled.",
        state:
          currentEnrollment?.nextClassAt || currentEnrollment?.nextAssessmentAt
            ? "live"
            : "empty",
      },
      attendance: {
        attendanceRate,
        note:
          attendanceRate !== null
            ? "Attendance is calculated from recorded class entries."
            : "No attendance has been recorded yet.",
        presentCount: attendanceRate !== null ? presentCount : null,
        state: attendanceRate !== null ? "live" : "empty",
        totalCount: attendanceRate !== null ? totalAttendanceCount : null,
      },
      homework: {
        note: currentEnrollment
          ? "Practice completion is tracked from the current enrollment."
          : "Practice status will appear once a class enrollment is active.",
        pendingLabel:
          currentEnrollment &&
          currentEnrollment.practiceAssignedCount >
            currentEnrollment.practiceCompletedCount
            ? `${currentEnrollment.practiceAssignedCount - currentEnrollment.practiceCompletedCount} task(s) pending`
            : null,
        state: currentEnrollment ? "live" : "empty",
        submittedLabel: currentEnrollment
          ? `${currentEnrollment.practiceCompletedCount} / ${currentEnrollment.practiceAssignedCount} practice task(s) completed`
          : null,
      },
      payments: {
        amountDueLabel: pendingPayment
          ? formatCurrencyInr(pendingPayment.amountInr)
          : null,
        canPayNow: Boolean(pendingPayment),
        lastPaymentLabel: paidPayments[0]
          ? `${formatCurrencyInr(paidPayments[0].amountInr)} on ${formatDate(paidPayments[0].paidAt ?? paidPayments[0].createdAt)}`
          : null,
        note: pendingPayment
          ? "A pending payment is ready to be completed."
          : paidPayments[0]
            ? "Payment history is synced from completed records."
            : "No payment has been recorded yet.",
        pendingPaymentId: pendingPayment?.id ?? null,
        state: profile.payments.length > 0 ? "live" : "empty",
      },
      progress: {
        milestones: profile.progressRecords.map((record) => ({
          detail: record.detail,
          id: record.id,
          label: record.title,
          status:
            record.status === "COMPLETED"
              ? "completed"
              : record.status === "IN_PROGRESS"
                ? "in_progress"
                : "upcoming",
        })),
        note:
          profile.progressRecords.length > 0
            ? "Progress milestones are now loaded from stored learner records."
            : "No progress milestones have been recorded yet.",
        state: profile.progressRecords.length > 0 ? "live" : "empty",
      },
      source: "live_records",
      student: {
        age: profile.studentAge ?? null,
        city: profile.city ?? null,
        email: account.email,
        modePreference: profile.modePreference ?? null,
        name: profile.studentName ?? createDisplayName(account.email),
        parentName:
          profile.fullName ??
          (session.role === "parent"
            ? createDisplayName(account.email)
            : "Parent account linked later"),
        preferredSlot: currentEnrollment?.programName
          ? profile.preferredSlot ?? null
          : profile.preferredSlot ?? null,
        programName: currentEnrollment?.programName ?? profile.programName ?? null,
        recommendedLevel:
          currentEnrollment?.currentLevel ?? profile.recommendedLevel ?? null,
        role: session.role,
      },
      teacherNotes: {
        items: teacherNotesItems,
        note:
          profile.teacherNotes.length > 0
            ? "Teacher feedback is now loaded from the learner record."
            : profile.sourceDemoRequest?.notes
              ? "The latest admissions note is linked to this student profile until classroom notes are added."
              : "Teacher notes have not been added yet.",
        state: teacherNotesItems.length > 0 ? "live" : "empty",
      },
    };
  } catch (error) {
    console.error("Failed to load portal dashboard data", error);
    return createPlaceholderDashboardData(session.email, session.role);
  }
}
