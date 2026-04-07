"use client";

import { useActionState, useState } from "react";
import {
  attendanceInitialState,
  enrollmentInitialState,
  progressInitialState,
  studentProfileInitialState,
  teacherNoteInitialState,
} from "@/app/actions/form-states";
import {
  createAttendanceRecord,
  createTeacherNote,
  saveEnrollment,
  saveProgressRecord,
  saveStudentProfile,
} from "@/app/actions/admin-operations";
import {
  attendanceStatuses,
  enrollmentStatuses,
  progressStatuses,
  studentProfileStatuses,
} from "@/lib/admin/options";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { AdminStatusBadge, formatEnumLabel } from "@/components/admin/admin-ui";

const fieldClasses =
  "mt-2 w-full rounded-[18px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 shadow-sm transition focus:border-navy-300 focus:ring-4 focus:ring-navy-100/70 focus:outline-none";

function FormMessage({
  message,
  status,
}: {
  message?: string;
  status: "error" | "idle" | "success";
}) {
  if (!message || status === "idle") {
    return null;
  }

  return (
    <p
      className={
        status === "success"
          ? "rounded-[18px] bg-mint-500/10 px-4 py-3 text-sm text-mint-500"
          : "rounded-[18px] bg-coral-400/10 px-4 py-3 text-sm text-coral-600"
      }
    >
      {message}
    </p>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-xs text-coral-600">{message}</p> : null;
}

type PortalAccountOption = {
  email: string;
  id: string;
  profile: { id: string } | null;
  role: "PARENT" | "STUDENT";
};

type ProfileOption = {
  fullName: string;
  id: string;
  studentName: string;
  enrollments?: Array<{
    batchName: string | null;
    id: string;
    programName: string;
  }>;
};

export function StudentProfileForm({
  accountOptions,
  defaultValues,
  submitLabel,
}: {
  accountOptions: PortalAccountOption[];
  defaultValues?: {
    city: string | null;
    currentLevel: string | null;
    fullName: string;
    id: string;
    modePreference: string | null;
    phone: string | null;
    portalEmail: string;
    preferredSlot: string | null;
    programName: string | null;
    status: "ACTIVE" | "INACTIVE";
    studentAge: number | null;
    studentName: string;
  };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(
    saveStudentProfile,
    studentProfileInitialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="profileId" value={defaultValues?.id ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-navy-900">
          Linked portal email
          <select
            className={fieldClasses}
            name="portalEmail"
            defaultValue={defaultValues?.portalEmail ?? ""}
            required
          >
            <option value="">Select a portal account</option>
            {accountOptions.map((account) => (
              <option key={account.id} value={account.email}>
                {account.email} | {formatEnumLabel(account.role)}
                {account.profile ? " | Linked" : ""}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.portalEmail} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Profile status
          <select
            className={fieldClasses}
            name="status"
            defaultValue={defaultValues?.status ?? "ACTIVE"}
            required
          >
            {studentProfileStatuses.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status)}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.status} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Parent name
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.fullName ?? ""}
            name="fullName"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.fullName} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Student name
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.studentName ?? ""}
            name="studentName"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.studentName} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Student age
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.studentAge ?? ""}
            name="studentAge"
            type="number"
            min={3}
            max={18}
          />
          <FieldError message={state.fieldErrors?.studentAge} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Phone
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.phone ?? ""}
            name="phone"
            type="tel"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          City
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.city ?? ""}
            name="city"
            type="text"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Program
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.programName ?? ""}
            name="programName"
            type="text"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Current level
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.currentLevel ?? ""}
            name="currentLevel"
            type="text"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Preferred slot / batch
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.preferredSlot ?? ""}
            name="preferredSlot"
            type="text"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Mode preference
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.modePreference ?? ""}
            name="modePreference"
            type="text"
          />
        </label>
      </div>

      <FormMessage message={state.message} status={state.status} />
      <AdminSubmitButton
        idleLabel={submitLabel}
        pendingLabel="Saving student..."
      />
    </form>
  );
}

export function EnrollmentForm({
  defaultValues,
  profileOptions,
}: {
  defaultValues?: {
    batchName: string | null;
    currentLevel: string | null;
    id: string;
    monthlyFeeInr: number | null;
    portalProfileId: string;
    programName: string;
    startedAt: string;
    status: string;
  };
  profileOptions: ProfileOption[];
}) {
  const [state, formAction] = useActionState(saveEnrollment, enrollmentInitialState);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="hidden"
        name="enrollmentId"
        value={defaultValues?.id ?? ""}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-navy-900">
          Student
          <select
            className={fieldClasses}
            name="portalProfileId"
            defaultValue={defaultValues?.portalProfileId ?? ""}
            required
          >
            <option value="">Select a student</option>
            {profileOptions.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.studentName} | {profile.fullName}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.portalProfileId} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Enrollment status
          <select
            className={fieldClasses}
            name="status"
            defaultValue={defaultValues?.status ?? "PENDING"}
            required
          >
            {enrollmentStatuses.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status)}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.status} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Program name
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.programName ?? ""}
            name="programName"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.programName} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Batch
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.batchName ?? ""}
            name="batchName"
            type="text"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Current level
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.currentLevel ?? ""}
            name="currentLevel"
            type="text"
          />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Fee amount (INR)
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.monthlyFeeInr ?? ""}
            name="monthlyFeeInr"
            type="number"
            min={0}
          />
          <FieldError message={state.fieldErrors?.monthlyFeeInr} />
        </label>

        <label className="text-sm font-medium text-navy-900 md:col-span-2">
          Start date
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.startedAt ?? ""}
            name="startedAt"
            required
            type="date"
          />
          <FieldError message={state.fieldErrors?.startedAt} />
        </label>
      </div>

      <FormMessage message={state.message} status={state.status} />
      <AdminSubmitButton
        idleLabel={defaultValues ? "Update enrollment" : "Create enrollment"}
        pendingLabel="Saving enrollment..."
      />
    </form>
  );
}

export function AttendanceRecordForm({
  profileOptions,
}: {
  profileOptions: ProfileOption[];
}) {
  const [state, formAction] = useActionState(
    createAttendanceRecord,
    attendanceInitialState,
  );
  const [selectedProfileId, setSelectedProfileId] = useState(
    profileOptions[0]?.id ?? "",
  );
  const selectedProfile =
    profileOptions.find((profile) => profile.id === selectedProfileId) ?? null;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-navy-900">
          Student
          <select
            className={fieldClasses}
            name="portalProfileId"
            onChange={(event) => setSelectedProfileId(event.target.value)}
            defaultValue={selectedProfileId}
            required
          >
            <option value="">Select a student</option>
            {profileOptions.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.studentName} | {profile.fullName}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.portalProfileId} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Enrollment
          <select className={fieldClasses} name="enrollmentId" defaultValue="">
            <option value="">Leave blank to record against the profile</option>
            {selectedProfile?.enrollments?.map((enrollment) => (
              <option key={enrollment.id} value={enrollment.id}>
                {enrollment.programName}
                {enrollment.batchName ? ` | ${enrollment.batchName}` : ""}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.enrollmentId} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Class date
          <input className={fieldClasses} name="classDate" required type="date" />
          <FieldError message={state.fieldErrors?.classDate} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Attendance status
          <select className={fieldClasses} name="status" defaultValue="PRESENT" required>
            {attendanceStatuses.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status)}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.status} />
        </label>

        <label className="text-sm font-medium text-navy-900 md:col-span-2">
          Note
          <textarea className={`${fieldClasses} min-h-28`} name="note" />
        </label>
      </div>

      <FormMessage message={state.message} status={state.status} />
      <AdminSubmitButton
        idleLabel="Mark attendance"
        pendingLabel="Saving attendance..."
      />
    </form>
  );
}

export function ProgressRecordForm({
  defaultValues,
  profileOptions,
}: {
  defaultValues?: {
    detail: string;
    enrollmentId: string | null;
    id: string;
    portalProfileId: string;
    sortOrder: number;
    status: string;
    title: string;
  };
  profileOptions: ProfileOption[];
}) {
  const [state, formAction] = useActionState(
    saveProgressRecord,
    progressInitialState,
  );
  const [selectedProfileId, setSelectedProfileId] = useState(
    defaultValues?.portalProfileId ?? profileOptions[0]?.id ?? "",
  );
  const selectedProfile =
    profileOptions.find((profile) => profile.id === selectedProfileId) ?? null;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="progressId" value={defaultValues?.id ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-navy-900">
          Student
          <select
            className={fieldClasses}
            name="portalProfileId"
            onChange={(event) => setSelectedProfileId(event.target.value)}
            defaultValue={selectedProfileId}
            required
          >
            <option value="">Select a student</option>
            {profileOptions.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.studentName} | {profile.fullName}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.portalProfileId} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Enrollment
          <select
            className={fieldClasses}
            name="enrollmentId"
            defaultValue={defaultValues?.enrollmentId ?? ""}
          >
            <option value="">Optional</option>
            {selectedProfile?.enrollments?.map((enrollment) => (
              <option key={enrollment.id} value={enrollment.id}>
                {enrollment.programName}
                {enrollment.batchName ? ` | ${enrollment.batchName}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-navy-900">
          Title
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.title ?? ""}
            name="title"
            required
            type="text"
          />
          <FieldError message={state.fieldErrors?.title} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Status
          <select
            className={fieldClasses}
            name="status"
            defaultValue={defaultValues?.status ?? "IN_PROGRESS"}
            required
          >
            {progressStatuses.map((status) => (
              <option key={status} value={status}>
                {formatEnumLabel(status)}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.status} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Sort order
          <input
            className={fieldClasses}
            defaultValue={defaultValues?.sortOrder ?? 0}
            name="sortOrder"
            type="number"
            min={0}
          />
          <FieldError message={state.fieldErrors?.sortOrder} />
        </label>

        <label className="text-sm font-medium text-navy-900 md:col-span-2">
          Detail
          <textarea
            className={`${fieldClasses} min-h-28`}
            defaultValue={defaultValues?.detail ?? ""}
            name="detail"
            required
          />
          <FieldError message={state.fieldErrors?.detail} />
        </label>
      </div>

      <FormMessage message={state.message} status={state.status} />
      <AdminSubmitButton
        idleLabel={defaultValues ? "Update milestone" : "Add milestone"}
        pendingLabel="Saving milestone..."
      />
    </form>
  );
}

export function TeacherNoteForm({
  profileOptions,
}: {
  profileOptions: ProfileOption[];
}) {
  const [state, formAction] = useActionState(
    createTeacherNote,
    teacherNoteInitialState,
  );
  const [selectedProfileId, setSelectedProfileId] = useState(
    profileOptions[0]?.id ?? "",
  );
  const selectedProfile =
    profileOptions.find((profile) => profile.id === selectedProfileId) ?? null;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-navy-900">
          Student
          <select
            className={fieldClasses}
            name="portalProfileId"
            onChange={(event) => setSelectedProfileId(event.target.value)}
            defaultValue={selectedProfileId}
            required
          >
            <option value="">Select a student</option>
            {profileOptions.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.studentName} | {profile.fullName}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.portalProfileId} />
        </label>

        <label className="text-sm font-medium text-navy-900">
          Enrollment
          <select className={fieldClasses} name="enrollmentId" defaultValue="">
            <option value="">Optional</option>
            {selectedProfile?.enrollments?.map((enrollment) => (
              <option key={enrollment.id} value={enrollment.id}>
                {enrollment.programName}
                {enrollment.batchName ? ` | ${enrollment.batchName}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-navy-900 md:col-span-2">
          Teacher / admin name
          <input className={fieldClasses} name="teacherName" required type="text" />
          <FieldError message={state.fieldErrors?.teacherName} />
        </label>

        <label className="text-sm font-medium text-navy-900 md:col-span-2">
          Note
          <textarea className={`${fieldClasses} min-h-32`} name="message" required />
          <FieldError message={state.fieldErrors?.message} />
        </label>
      </div>

      <FormMessage message={state.message} status={state.status} />
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
        <AdminStatusBadge label="Latest notes appear in the dashboard" tone="gold" />
      </div>
      <AdminSubmitButton
        idleLabel="Add teacher note"
        pendingLabel="Saving note..."
      />
    </form>
  );
}
