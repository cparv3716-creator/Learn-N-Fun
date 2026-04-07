"use server";

import {
  AttendanceStatus,
  DemoBookingStatus,
  DemoOpsStatus,
  EnrollmentStatus,
  LeadStatus,
  ProgressStatus,
  StudentProfileStatus,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import type {
  AttendanceFormState,
  EnrollmentFormState,
  ProgressFormState,
  StudentProfileFormState,
  TeacherNoteFormState,
} from "@/app/actions/form-states";
import { prisma } from "@/lib/prisma";
import {
  attendanceStatuses,
  demoOpsStatuses,
  enrollmentStatuses,
  progressStatuses,
  studentProfileStatuses,
} from "@/lib/admin/options";
import { requireAdminSession } from "@/server/admin-auth";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: FormDataEntryValue | null) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function parseOptionalInt(value: FormDataEntryValue | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseDateValue(value: FormDataEntryValue | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  const parsed = new Date(`${normalized}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseEnumValue<TValue extends string>(
  value: FormDataEntryValue | null,
  allowedValues: readonly TValue[],
) {
  if (typeof value !== "string") {
    return null;
  }

  return allowedValues.includes(value as TValue) ? (value as TValue) : null;
}

function revalidateAdminSurface(profileId?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/demo-bookings");
  revalidatePath("/admin/students");
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin/attendance");
  revalidatePath("/admin/progress");
  revalidatePath("/dashboard");

  if (profileId) {
    revalidatePath(`/admin/students/${profileId}`);
  }
}

function mapDemoOpsStatus(status: DemoOpsStatus) {
  switch (status) {
    case DemoOpsStatus.NEW:
      return {
        bookingStatus: DemoBookingStatus.PENDING,
        leadStatus: LeadStatus.NEW,
      };
    case DemoOpsStatus.CONTACTED:
      return {
        bookingStatus: DemoBookingStatus.PENDING,
        leadStatus: LeadStatus.CONTACTED,
      };
    case DemoOpsStatus.BOOKED:
      return {
        bookingStatus: DemoBookingStatus.CONFIRMED,
        leadStatus: LeadStatus.QUALIFIED,
      };
    case DemoOpsStatus.COMPLETED:
      return {
        bookingStatus: DemoBookingStatus.COMPLETED,
        leadStatus: LeadStatus.QUALIFIED,
      };
    case DemoOpsStatus.CONVERTED:
      return {
        bookingStatus: DemoBookingStatus.COMPLETED,
        leadStatus: LeadStatus.CLOSED,
      };
    default:
      return {
        bookingStatus: DemoBookingStatus.PENDING,
        leadStatus: LeadStatus.NEW,
      };
  }
}

export async function updateDemoBookingOpsStatus(
  id: string,
  formData: FormData,
) {
  await requireAdminSession();

  const opsStatus = parseEnumValue(formData.get("opsStatus"), demoOpsStatuses);

  if (!opsStatus) {
    return;
  }

  const mappedStatus = mapDemoOpsStatus(opsStatus);

  await prisma.demoRequest.updateMany({
    data: {
      bookingStatus: mappedStatus.bookingStatus,
      opsStatus,
      status: mappedStatus.leadStatus,
    },
    where: { id },
  });

  revalidateAdminSurface();
}

export async function saveStudentProfile(
  _previousState: StudentProfileFormState,
  formData: FormData,
): Promise<StudentProfileFormState> {
  await requireAdminSession();

  const profileId = normalizeText(formData.get("profileId"));
  const portalEmail = normalizeText(formData.get("portalEmail")).toLowerCase();
  const fullName = normalizeText(formData.get("fullName"));
  const studentName = normalizeText(formData.get("studentName"));
  const studentAge = parseOptionalInt(formData.get("studentAge"));
  const phone = normalizeOptionalText(formData.get("phone"));
  const city = normalizeOptionalText(formData.get("city"));
  const programName = normalizeOptionalText(formData.get("programName"));
  const currentLevel = normalizeOptionalText(formData.get("currentLevel"));
  const preferredSlot = normalizeOptionalText(formData.get("preferredSlot"));
  const modePreference = normalizeOptionalText(formData.get("modePreference"));
  const status = parseEnumValue(formData.get("status"), studentProfileStatuses);

  const fieldErrors: StudentProfileFormState["fieldErrors"] = {};

  if (!portalEmail) {
    fieldErrors.portalEmail = "Choose the linked parent or student portal email.";
  }

  if (!fullName) {
    fieldErrors.fullName = "Enter the parent or account holder name.";
  }

  if (!studentName) {
    fieldErrors.studentName = "Enter the learner's name.";
  }

  if (studentAge !== null && (!Number.isFinite(studentAge) || studentAge < 3 || studentAge > 18)) {
    fieldErrors.studentAge = "Enter a valid learner age between 3 and 18.";
  }

  if (!status) {
    fieldErrors.status = "Choose an active or inactive profile status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please review the highlighted student fields.",
      status: "error",
    };
  }

  const account = await prisma.portalAccount.findUnique({
    include: {
      profile: {
        select: { id: true },
      },
    },
    where: { email: portalEmail },
  });

  if (!account) {
    return {
      fieldErrors: {
        portalEmail:
          "No portal account exists for this email yet. Ask the family to sign up first.",
      },
      message: "A linked portal account is required before creating a student profile.",
      status: "error",
    };
  }

  if (!profileId && account.profile) {
    return {
      fieldErrors: {
        portalEmail:
          "This portal account already has a student profile. Open the detail view to edit it.",
      },
      message: "That account is already linked to a learner record.",
      status: "error",
    };
  }

  const data = {
    city,
    fullName,
    modePreference,
    phone,
    preferredSlot,
    programName,
    recommendedLevel: currentLevel,
    status: status as StudentProfileStatus,
    studentAge:
      studentAge !== null && Number.isFinite(studentAge) ? studentAge : null,
    studentName,
  };

  let savedProfileId = profileId || account.profile?.id || null;

  if (profileId) {
    const existingProfile = await prisma.portalProfile.findUnique({
      select: { accountId: true, id: true },
      where: { id: profileId },
    });

    if (!existingProfile) {
      return {
        message: "That student profile could not be found anymore.",
        status: "error",
      };
    }

    if (existingProfile.accountId !== account.id) {
      return {
        fieldErrors: {
          portalEmail:
            "This profile is already linked to a different portal account.",
        },
        message: "The selected email does not match this student record.",
        status: "error",
      };
    }

    await prisma.portalProfile.update({
      data,
      where: { id: profileId },
    });
  } else {
    const createdProfile = await prisma.portalProfile.create({
      data: {
        ...data,
        accountId: account.id,
      },
      select: { id: true },
    });

    savedProfileId = createdProfile.id;
  }

  revalidateAdminSurface(savedProfileId);

  return {
    message: profileId
      ? "Student profile updated successfully."
      : "Student profile created successfully.",
    status: "success",
  };
}

export async function saveEnrollment(
  _previousState: EnrollmentFormState,
  formData: FormData,
): Promise<EnrollmentFormState> {
  await requireAdminSession();

  const enrollmentId = normalizeText(formData.get("enrollmentId"));
  const portalProfileId = normalizeText(formData.get("portalProfileId"));
  const programName = normalizeText(formData.get("programName"));
  const batchName = normalizeOptionalText(formData.get("batchName"));
  const currentLevel = normalizeOptionalText(formData.get("currentLevel"));
  const monthlyFeeInr = parseOptionalInt(formData.get("monthlyFeeInr"));
  const startedAt = parseDateValue(formData.get("startedAt"));
  const status = parseEnumValue(formData.get("status"), enrollmentStatuses);

  const fieldErrors: EnrollmentFormState["fieldErrors"] = {};

  if (!portalProfileId) {
    fieldErrors.portalProfileId = "Choose a student record.";
  }

  if (!programName) {
    fieldErrors.programName = "Enter the program name.";
  }

  if (monthlyFeeInr !== null && (!Number.isFinite(monthlyFeeInr) || monthlyFeeInr < 0)) {
    fieldErrors.monthlyFeeInr = "Enter a valid fee amount in INR.";
  }

  if (!startedAt) {
    fieldErrors.startedAt = "Choose the enrollment start date.";
  }

  if (!status) {
    fieldErrors.status = "Choose the enrollment status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please review the enrollment fields.",
      status: "error",
    };
  }

  const profile = await prisma.portalProfile.findUnique({
    select: { id: true },
    where: { id: portalProfileId },
  });

  if (!profile) {
    return {
      message: "The selected student record no longer exists.",
      status: "error",
    };
  }

  const data = {
    batchName,
    currentLevel,
    monthlyFeeInr:
      monthlyFeeInr !== null && Number.isFinite(monthlyFeeInr)
        ? monthlyFeeInr
        : null,
    programName,
    startedAt: startedAt as Date,
    status: status as EnrollmentStatus,
  };

  if (enrollmentId) {
    await prisma.enrollment.update({
      data,
      where: { id: enrollmentId },
    });
  } else {
    await prisma.enrollment.create({
      data: {
        ...data,
        profileId: portalProfileId,
      },
    });
  }

  await prisma.portalProfile.update({
    data: {
      preferredSlot: batchName,
      programName,
      recommendedLevel: currentLevel,
    },
    where: { id: portalProfileId },
  });

  revalidateAdminSurface(portalProfileId);

  return {
    message: enrollmentId
      ? "Enrollment updated successfully."
      : "Enrollment created successfully.",
    status: "success",
  };
}

export async function createAttendanceRecord(
  _previousState: AttendanceFormState,
  formData: FormData,
): Promise<AttendanceFormState> {
  await requireAdminSession();

  const portalProfileId = normalizeText(formData.get("portalProfileId"));
  const enrollmentId = normalizeOptionalText(formData.get("enrollmentId"));
  const classDate = parseDateValue(formData.get("classDate"));
  const status = parseEnumValue(formData.get("status"), attendanceStatuses);
  const note = normalizeOptionalText(formData.get("note"));

  const fieldErrors: AttendanceFormState["fieldErrors"] = {};

  if (!portalProfileId) {
    fieldErrors.portalProfileId = "Choose a student record.";
  }

  if (!classDate) {
    fieldErrors.classDate = "Choose the class date.";
  }

  if (!status) {
    fieldErrors.status = "Choose the attendance status.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please review the attendance form.",
      status: "error",
    };
  }

  if (enrollmentId) {
    const enrollment = await prisma.enrollment.findFirst({
      select: { id: true },
      where: {
        id: enrollmentId,
        profileId: portalProfileId,
      },
    });

    if (!enrollment) {
      return {
        fieldErrors: {
          enrollmentId: "Choose an enrollment that belongs to this student.",
        },
        message: "The selected enrollment is invalid for this learner.",
        status: "error",
      };
    }
  }

  await prisma.attendance.create({
    data: {
      classDate: classDate as Date,
      enrollmentId,
      note,
      profileId: portalProfileId,
      status: status as AttendanceStatus,
    },
  });

  revalidateAdminSurface(portalProfileId);

  return {
    message: "Attendance recorded successfully.",
    status: "success",
  };
}

export async function saveProgressRecord(
  _previousState: ProgressFormState,
  formData: FormData,
): Promise<ProgressFormState> {
  await requireAdminSession();

  const progressId = normalizeText(formData.get("progressId"));
  const portalProfileId = normalizeText(formData.get("portalProfileId"));
  const enrollmentId = normalizeOptionalText(formData.get("enrollmentId"));
  const title = normalizeText(formData.get("title"));
  const detail = normalizeText(formData.get("detail"));
  const status = parseEnumValue(formData.get("status"), progressStatuses);
  const sortOrder = parseOptionalInt(formData.get("sortOrder"));

  const fieldErrors: ProgressFormState["fieldErrors"] = {};

  if (!portalProfileId) {
    fieldErrors.portalProfileId = "Choose a student record.";
  }

  if (!title) {
    fieldErrors.title = "Enter a milestone title.";
  }

  if (!detail) {
    fieldErrors.detail = "Enter milestone details.";
  }

  if (!status) {
    fieldErrors.status = "Choose the milestone status.";
  }

  if (sortOrder !== null && (!Number.isFinite(sortOrder) || sortOrder < 0)) {
    fieldErrors.sortOrder = "Enter a valid milestone order.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please review the milestone fields.",
      status: "error",
    };
  }

  const data = {
    achievedAt:
      status === ProgressStatus.COMPLETED ? new Date() : undefined,
    detail,
    enrollmentId,
    profileId: portalProfileId,
    sortOrder:
      sortOrder !== null && Number.isFinite(sortOrder) ? sortOrder : 0,
    status: status as ProgressStatus,
    title,
  };

  if (progressId) {
    await prisma.progress.update({
      data,
      where: { id: progressId },
    });
  } else {
    await prisma.progress.create({ data });
  }

  revalidateAdminSurface(portalProfileId);

  return {
    message: progressId
      ? "Milestone updated successfully."
      : "Milestone added successfully.",
    status: "success",
  };
}

export async function createTeacherNote(
  _previousState: TeacherNoteFormState,
  formData: FormData,
): Promise<TeacherNoteFormState> {
  await requireAdminSession();

  const portalProfileId = normalizeText(formData.get("portalProfileId"));
  const enrollmentId = normalizeOptionalText(formData.get("enrollmentId"));
  const teacherName = normalizeText(formData.get("teacherName"));
  const message = normalizeText(formData.get("message"));

  const fieldErrors: TeacherNoteFormState["fieldErrors"] = {};

  if (!portalProfileId) {
    fieldErrors.portalProfileId = "Choose a student record.";
  }

  if (!teacherName) {
    fieldErrors.teacherName = "Enter the teacher or admin name.";
  }

  if (!message) {
    fieldErrors.message = "Enter the note content.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please review the note fields.",
      status: "error",
    };
  }

  await prisma.teacherNote.create({
    data: {
      enrollmentId,
      message,
      profileId: portalProfileId,
      teacherName,
    },
  });

  revalidateAdminSurface(portalProfileId);

  return {
    message: "Teacher note added successfully.",
    status: "success",
  };
}
