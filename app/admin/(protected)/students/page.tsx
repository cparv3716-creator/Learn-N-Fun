import { StudentProfileStatus } from "@prisma/client";
import Link from "next/link";
import { StudentProfileForm } from "@/components/admin/admin-forms";
import {
  EnrollmentStatusBadge,
  StudentProfileStatusBadge,
} from "@/components/admin/admin-status-badges";
import {
  AdminEmptyState,
  AdminMetaList,
  AdminPageHeader,
  AdminPanel,
  formatAdminDate,
  formatEnumLabel,
} from "@/components/admin/admin-ui";
import { ButtonLink } from "@/components/ui/button-link";
import { getStudentsData } from "@/server/admin-data";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getSelectedStatus(
  value: string | string[] | undefined,
): StudentProfileStatus | "all" {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized &&
    Object.values(StudentProfileStatus).includes(normalized as StudentProfileStatus)
    ? (normalized as StudentProfileStatus)
    : "all";
}

function buildHref(selectedStatus: StudentProfileStatus | "all") {
  return selectedStatus === "all"
    ? "/admin/students"
    : `/admin/students?status=${selectedStatus}`;
}

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const selectedStatus = getSelectedStatus(filters.status);
  const data = await getStudentsData(selectedStatus);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Student records"
        title="Student management"
        description="Create and maintain learner records linked to real portal accounts, then hand off to enrollments, attendance, progress, and teacher updates."
        action={<ButtonLink href="/admin/enrollments">Manage enrollments</ButtonLink>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminPanel
          title="Create student profile"
          description="This internal profile links a learner to an existing parent or student portal account. The family should already have a portal login."
        >
          <StudentProfileForm
            accountOptions={data.accountOptions}
            submitLabel="Create student profile"
          />
        </AdminPanel>

        <AdminPanel
          title="Current students"
          description="Active and inactive learner records with account linkage, latest enrollment snapshot, and recent notes."
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
              All students
            </Link>
            {Object.values(StudentProfileStatus).map((status) => (
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

          {data.profiles.length === 0 ? (
            <div className="mt-5">
              <AdminEmptyState
                title="No student records yet"
                message="Create the first student profile from the form on the left, or ask a family to complete portal signup first."
              />
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {data.profiles.map((profile) => {
                const latestEnrollment = profile.enrollments[0] ?? null;
                const latestNote = profile.teacherNotes[0] ?? null;

                return (
                  <article
                    key={profile.id}
                    className="rounded-[26px] border border-sand-200 bg-sand-100/55 px-5 py-5 shadow-[0_16px_36px_rgba(16,37,61,0.05)]"
                  >
                    <div className="flex flex-col gap-4 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-semibold text-navy-900">
                            {profile.studentName}
                          </h2>
                          <StudentProfileStatusBadge status={profile.status} />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          Parent: {profile.fullName}
                        </p>
                        <p className="text-sm leading-6 text-ink-600">
                          {profile.account.email} | {formatEnumLabel(profile.account.role)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <ButtonLink
                          href={`/admin/students/${profile.id}`}
                          variant="secondary"
                        >
                          Open detail
                        </ButtonLink>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <AdminMetaList
                        items={[
                          { label: "Age", value: profile.studentAge ?? "Pending" },
                          { label: "City", value: profile.city ?? "Pending" },
                          { label: "Phone", value: profile.phone ?? "Pending" },
                          {
                            label: "Program",
                            value: latestEnrollment?.programName ?? profile.programName ?? "Pending",
                          },
                          {
                            label: "Level",
                            value:
                              latestEnrollment?.currentLevel ??
                              profile.recommendedLevel ??
                              "Pending",
                          },
                          {
                            label: "Updated",
                            value: formatAdminDate(profile.updatedAt),
                          },
                        ]}
                      />

                      {latestEnrollment ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <EnrollmentStatusBadge status={latestEnrollment.status} />
                          <span className="text-sm text-ink-600">
                            {latestEnrollment.batchName
                              ? `${latestEnrollment.programName} | ${latestEnrollment.batchName}`
                              : latestEnrollment.programName}
                          </span>
                        </div>
                      ) : null}

                      {latestNote ? (
                        <div className="rounded-[20px] border border-sand-200 bg-white/70 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                            Latest teacher note
                          </p>
                          <p className="mt-2 text-sm leading-7 text-ink-700">
                            {latestNote.message}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </AdminPanel>
      </section>
    </div>
  );
}
