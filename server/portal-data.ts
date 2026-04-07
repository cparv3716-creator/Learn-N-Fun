import "server-only";

import { prisma } from "@/lib/prisma";
import type { PortalDashboardData } from "@/lib/portal/types";
import type { PortalRole } from "@/server/portal-auth";

type PortalSessionLike = {
  accountId: string;
  email: string;
  role: PortalRole;
};

function parseNotesValue(notes: string | null | undefined, label: string) {
  if (!notes) {
    return null;
  }

  const pattern = new RegExp(`${label}:\\s*([^|]+)`);
  const match = notes.match(pattern);
  return match?.[1]?.trim() ?? null;
}

function createDisplayName(email: string) {
  const rawValue = email.split("@")[0]?.replace(/[._-]/g, " ") || "Portal user";

  return rawValue
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createPlaceholderDashboardData(
  email: string,
  role: PortalRole,
): PortalDashboardData {
  return {
    assessments: {
      nextAssessmentLabel: null,
      nextClassLabel: null,
      note: "Class schedules and assessments will appear here once enrollment data is connected.",
      state: "empty",
    },
    attendance: {
      attendanceRate: null,
      note: "Attendance will start syncing after the student is actively scheduled in regular classes.",
      presentCount: null,
      state: "empty",
      totalCount: null,
    },
    homework: {
      note: "Homework and practice status will appear here when the classroom reporting layer is connected.",
      pendingLabel: null,
      state: "empty",
      submittedLabel: null,
    },
    payments: {
      amountDueLabel: null,
      lastPaymentLabel: null,
      note: "Payments are not connected yet. This space is ready for invoices, renewals, and receipts.",
      state: "placeholder",
    },
    progress: {
      milestones: [],
      note: "Progress milestones will appear once the learning record system is connected.",
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
      note: "Teacher notes will appear here once classroom feedback is available.",
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
        profile: true,
      },
      where: { id: session.accountId },
    });

    if (!account) {
      return createPlaceholderDashboardData(session.email, session.role);
    }

    const profile = account.profile;
    const linkedDemoRequestFromProfile = profile?.sourceDemoRequestId
      ? await prisma.demoRequest.findUnique({
          where: { id: profile.sourceDemoRequestId },
        })
      : null;
    const linkedDemoRequest =
      linkedDemoRequestFromProfile ??
      (await prisma.demoRequest.findFirst({
        orderBy: { createdAt: "desc" },
        where: { email: account.email.toLowerCase() },
      }));

    const preferredDemoDate = parseNotesValue(
      linkedDemoRequest?.notes,
      "Preferred demo date",
    );
    const preferredDemoTime = parseNotesValue(
      linkedDemoRequest?.notes,
      "Preferred demo time",
    );
    const demoMode = parseNotesValue(linkedDemoRequest?.notes, "Demo mode");
    const notes = parseNotesValue(linkedDemoRequest?.notes, "Additional notes");
    const profileName = profile?.studentName || linkedDemoRequest?.childName;
    const parentName = profile?.fullName || linkedDemoRequest?.parentName;
    const profileEmail = account.email;

    return {
      assessments: {
        nextAssessmentLabel: linkedDemoRequest
          ? "Scheduled after first month of regular classes"
          : null,
        nextClassLabel:
          preferredDemoDate || preferredDemoTime
            ? `${preferredDemoDate ?? "Date pending"}${preferredDemoTime ? ` at ${preferredDemoTime}` : ""}`
            : null,
        note:
          preferredDemoDate || preferredDemoTime
            ? "The next scheduled touchpoint is based on the latest demo request on file."
            : linkedDemoRequest
              ? "A confirmed next class and assessment will appear here once the classroom calendar is connected."
              : "Your class schedule will appear here once admissions confirms the first regular batch.",
        state:
          preferredDemoDate || preferredDemoTime
            ? "placeholder"
            : linkedDemoRequest
              ? "placeholder"
              : "empty",
      },
      attendance: {
        attendanceRate: null,
        note: "Attendance sync is integration-ready and will become live once regular class records are available.",
        presentCount: null,
        state: linkedDemoRequest ? "placeholder" : "empty",
        totalCount: null,
      },
      homework: {
        note:
          "Homework tracking is ready for integration. Families will see practice completion once the reporting feed is connected.",
        pendingLabel: null,
        state: linkedDemoRequest ? "placeholder" : "empty",
        submittedLabel: null,
      },
      payments: {
        amountDueLabel: null,
        lastPaymentLabel: null,
        note:
          "Payments are not connected yet. This section is prepared for fee summaries, receipts, and renewal reminders.",
        state: "placeholder",
      },
      progress: {
        milestones: linkedDemoRequest
          ? [
              {
                detail: "Demo request completed and level guidance is being prepared.",
                id: "demo-booked",
                label: "Demo booked",
                status: "completed",
              },
              {
                detail: "Admissions team will confirm the recommended starting level.",
                id: "level-guidance",
                label: "Level recommendation",
                status: "in_progress",
              },
              {
                detail: "Regular batch onboarding starts after admissions confirmation.",
                id: "regular-class",
                label: "Regular class onboarding",
                status: "upcoming",
              },
            ]
          : [],
        note: linkedDemoRequest
          ? "These milestones are generated from the admissions workflow until academic progress data is connected."
          : "Progress milestones will appear once the learning record system is connected.",
        state: linkedDemoRequest ? "placeholder" : "empty",
      },
      source: linkedDemoRequest ? "demo_request" : "integration_ready_placeholder",
      student: {
        age: profile?.studentAge ?? linkedDemoRequest?.childAge ?? null,
        city: profile?.city ?? linkedDemoRequest?.city ?? null,
        email: profileEmail,
        modePreference: profile?.modePreference ?? demoMode ?? null,
        name: profileName ?? createDisplayName(profileEmail),
        parentName:
          parentName ??
          (session.role === "parent"
            ? createDisplayName(profileEmail)
            : "Parent account linked later"),
        preferredSlot:
          profile?.preferredSlot ?? linkedDemoRequest?.preferredSlot ?? null,
        programName:
          profile?.programName ?? linkedDemoRequest?.programInterest ?? null,
        recommendedLevel: profile?.recommendedLevel ?? null,
        role: session.role,
      },
      teacherNotes: {
        items: notes && linkedDemoRequest
          ? [
              {
                createdAtLabel: new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                }).format(linkedDemoRequest.createdAt),
                id: linkedDemoRequest.id,
                message: notes,
                teacherName: "Admissions team",
              },
            ]
          : [],
        note: notes
          ? "The latest admissions note is shown below. Classroom teacher notes will appear after onboarding."
          : "Teacher notes will appear once the student is enrolled and classroom reporting begins.",
        state: notes ? "live" : "empty",
      },
    };
  } catch (error) {
    console.error("Failed to load portal dashboard data", error);
    return createPlaceholderDashboardData(session.email, session.role);
  }
}
