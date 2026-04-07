import { EnrollmentStatus } from "@prisma/client";
import Link from "next/link";
import { EnrollmentForm } from "@/components/admin/admin-forms";
import {
  EnrollmentStatusBadge,
  PaymentStatusBadge,
} from "@/components/admin/admin-status-badges";
import {
  AdminEmptyState,
  AdminMetaList,
  AdminPageHeader,
  AdminPanel,
  formatAdminDateOnly,
  formatEnumLabel,
} from "@/components/admin/admin-ui";
import { ButtonLink } from "@/components/ui/button-link";
import { getEnrollmentsData } from "@/server/admin-data";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getSelectedStatus(
  value: string | string[] | undefined,
): EnrollmentStatus | "all" {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized &&
    Object.values(EnrollmentStatus).includes(normalized as EnrollmentStatus)
    ? (normalized as EnrollmentStatus)
    : "all";
}

function buildHref(selectedStatus: EnrollmentStatus | "all") {
  return selectedStatus === "all"
    ? "/admin/enrollments"
    : `/admin/enrollments?status=${selectedStatus}`;
}

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const selectedStatus = getSelectedStatus(filters.status);
  const data = await getEnrollmentsData(selectedStatus);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Class operations"
        title="Enrollment management"
        description="Create the source-of-truth enrollment records that will later power scheduling, reporting, and payment setup."
        action={<ButtonLink href="/admin/students">Open student records</ButtonLink>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminPanel
          title="Create enrollment"
          description="Assign a learner to a program, batch, level, fee amount, and enrollment lifecycle."
        >
          <EnrollmentForm profileOptions={data.profileOptions} />
        </AdminPanel>

        <AdminPanel
          title="Enrollments"
          description="Filter the current enrollment roster, then edit records inline when details change."
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref("all")}
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedStatus === "all"
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-100 bg-white text-navy-900 hover:border-navy-300"
              }`}
            >
              All enrollments
            </Link>
            {Object.values(EnrollmentStatus).map((status) => (
              <Link
                key={status}
                href={buildHref(status)}
                className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selectedStatus === status
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-100 bg-white text-navy-900 hover:border-navy-300"
                }`}
              >
                {formatEnumLabel(status)}
              </Link>
            ))}
          </div>

          {data.enrollments.length === 0 ? (
            <div className="mt-5">
              <AdminEmptyState
                title="No enrollments yet"
                message="Create the first enrollment from the form on the left to activate student operations."
              />
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {data.enrollments.map((enrollment) => (
                <article
                  key={enrollment.id}
                  className="rounded-[28px] border border-sand-200 bg-sand-100/55 px-5 py-5 shadow-[0_16px_36px_rgba(16,37,61,0.05)]"
                >
                  <div className="flex flex-col gap-4 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold text-navy-900">
                          {enrollment.profile.studentName}
                        </h2>
                        <EnrollmentStatusBadge status={enrollment.status} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {enrollment.profile.fullName} | {enrollment.profile.account.email}
                      </p>
                    </div>
                    <ButtonLink
                      href={`/admin/students/${enrollment.profile.id}`}
                      variant="secondary"
                    >
                      Open student
                    </ButtonLink>
                  </div>

                  <div className="mt-4">
                    <AdminMetaList
                      items={[
                        { label: "Program", value: enrollment.programName },
                        {
                          label: "Batch",
                          value: enrollment.batchName ?? "Pending",
                        },
                        {
                          label: "Level",
                          value: enrollment.currentLevel ?? "Pending",
                        },
                        {
                          label: "Start date",
                          value: formatAdminDateOnly(enrollment.startedAt),
                        },
                        {
                          label: "Fee amount",
                          value: enrollment.monthlyFeeInr
                            ? `INR ${enrollment.monthlyFeeInr.toLocaleString("en-IN")}`
                            : "Pending",
                        },
                        {
                          label: "Practice tracking",
                          value: `${enrollment.practiceCompletedCount}/${enrollment.practiceAssignedCount} completed`,
                        },
                      ]}
                    />
                  </div>

                  {enrollment.payments.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {enrollment.payments.map((payment) => (
                        <PaymentStatusBadge key={payment.id} status={payment.status} />
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 rounded-[24px] border border-white/90 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-navy-900">
                      Edit enrollment
                    </p>
                    <div className="mt-4">
                      <EnrollmentForm
                        defaultValues={{
                          batchName: enrollment.batchName,
                          currentLevel: enrollment.currentLevel,
                          id: enrollment.id,
                          monthlyFeeInr: enrollment.monthlyFeeInr,
                          portalProfileId: enrollment.profileId,
                          programName: enrollment.programName,
                          startedAt: enrollment.startedAt
                            .toISOString()
                            .slice(0, 10),
                          status: enrollment.status,
                        }}
                        profileOptions={data.profileOptions}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </AdminPanel>
      </section>
    </div>
  );
}
