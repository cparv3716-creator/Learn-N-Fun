import {
  AttendanceStatus,
  DemoOpsStatus,
  EnrollmentStatus,
  PaymentStatus,
  ProgressStatus,
  StudentProfileStatus,
} from "@prisma/client";
import { AdminStatusBadge, formatEnumLabel } from "@/components/admin/admin-ui";

export function DemoOpsStatusBadge({ status }: { status: DemoOpsStatus }) {
  const tone =
    status === DemoOpsStatus.NEW
      ? "gold"
      : status === DemoOpsStatus.CONTACTED
        ? "blue"
        : status === DemoOpsStatus.BOOKED
          ? "navy"
          : status === DemoOpsStatus.COMPLETED
            ? "green"
            : "coral";

  return <AdminStatusBadge label={formatEnumLabel(status)} tone={tone} />;
}

export function StudentProfileStatusBadge({
  status,
}: {
  status: StudentProfileStatus;
}) {
  return (
    <AdminStatusBadge
      label={formatEnumLabel(status)}
      tone={status === StudentProfileStatus.ACTIVE ? "green" : "gray"}
    />
  );
}

export function EnrollmentStatusBadge({
  status,
}: {
  status: EnrollmentStatus;
}) {
  const tone =
    status === EnrollmentStatus.ACTIVE
      ? "green"
      : status === EnrollmentStatus.PENDING
        ? "gold"
        : status === EnrollmentStatus.PAUSED
          ? "blue"
          : status === EnrollmentStatus.COMPLETED
            ? "navy"
            : "coral";

  return <AdminStatusBadge label={formatEnumLabel(status)} tone={tone} />;
}

export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const tone =
    status === AttendanceStatus.PRESENT
      ? "green"
      : status === AttendanceStatus.EXCUSED
        ? "blue"
        : "coral";

  return <AdminStatusBadge label={formatEnumLabel(status)} tone={tone} />;
}

export function ProgressStatusBadge({ status }: { status: ProgressStatus }) {
  const tone =
    status === ProgressStatus.COMPLETED
      ? "green"
      : status === ProgressStatus.IN_PROGRESS
        ? "gold"
        : "gray";

  return <AdminStatusBadge label={formatEnumLabel(status)} tone={tone} />;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const tone =
    status === PaymentStatus.PAID
      ? "green"
      : status === PaymentStatus.PENDING
        ? "gold"
        : status === PaymentStatus.FAILED
          ? "coral"
          : "gray";

  return <AdminStatusBadge label={formatEnumLabel(status)} tone={tone} />;
}
