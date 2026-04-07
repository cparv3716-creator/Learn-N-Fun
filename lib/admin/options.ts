import {
  AttendanceStatus,
  DemoOpsStatus,
  EnrollmentStatus,
  ProgressStatus,
  StudentProfileStatus,
} from "@prisma/client";

export const demoOpsStatuses = [
  DemoOpsStatus.NEW,
  DemoOpsStatus.CONTACTED,
  DemoOpsStatus.BOOKED,
  DemoOpsStatus.COMPLETED,
  DemoOpsStatus.CONVERTED,
] as const;

export const studentProfileStatuses = [
  StudentProfileStatus.ACTIVE,
  StudentProfileStatus.INACTIVE,
] as const;

export const enrollmentStatuses = [
  EnrollmentStatus.PENDING,
  EnrollmentStatus.ACTIVE,
  EnrollmentStatus.PAUSED,
  EnrollmentStatus.COMPLETED,
  EnrollmentStatus.CANCELLED,
] as const;

export const attendanceStatuses = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.ABSENT,
  AttendanceStatus.EXCUSED,
] as const;

export const progressStatuses = [
  ProgressStatus.COMPLETED,
  ProgressStatus.IN_PROGRESS,
  ProgressStatus.UPCOMING,
] as const;
