import type { PortalRole } from "@/server/portal-auth";

export type DataState = "empty" | "live" | "placeholder";

export type PortalStudentProfile = {
  age: number | null;
  city: string | null;
  email: string;
  modePreference: string | null;
  name: string;
  parentName: string;
  preferredSlot: string | null;
  programName: string | null;
  recommendedLevel: string | null;
  role: PortalRole;
};

export type PortalAttendanceSummary = {
  attendanceRate: number | null;
  note: string;
  presentCount: number | null;
  state: DataState;
  totalCount: number | null;
};

export type PortalProgressMilestone = {
  detail: string;
  id: string;
  label: string;
  status: "completed" | "in_progress" | "upcoming";
};

export type PortalProgressSummary = {
  milestones: PortalProgressMilestone[];
  note: string;
  state: DataState;
};

export type PortalTeacherNote = {
  createdAtLabel: string;
  id: string;
  message: string;
  teacherName: string;
};

export type PortalTeacherNotesSummary = {
  items: PortalTeacherNote[];
  note: string;
  state: DataState;
};

export type PortalHomeworkSummary = {
  note: string;
  pendingLabel: string | null;
  state: DataState;
  submittedLabel: string | null;
};

export type PortalAssessmentSummary = {
  nextAssessmentLabel: string | null;
  nextClassLabel: string | null;
  note: string;
  state: DataState;
};

export type PortalPaymentSummary = {
  amountDueLabel: string | null;
  canPayNow: boolean;
  lastPaymentLabel: string | null;
  note: string;
  pendingPaymentId: string | null;
  state: DataState;
};

export type PortalDashboardData = {
  assessments: PortalAssessmentSummary;
  attendance: PortalAttendanceSummary;
  homework: PortalHomeworkSummary;
  payments: PortalPaymentSummary;
  progress: PortalProgressSummary;
  source: "integration_ready_placeholder" | "live_records";
  student: PortalStudentProfile;
  teacherNotes: PortalTeacherNotesSummary;
};
