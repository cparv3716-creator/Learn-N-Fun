import { notFound } from "next/navigation";
import { StudentProfileForm } from "@/components/admin/admin-forms";
import {
  AttendanceStatusBadge,
  EnrollmentStatusBadge,
  PaymentStatusBadge,
  ProgressStatusBadge,
  StudentProfileStatusBadge,
} from "@/components/admin/admin-status-badges";
import {
  AdminEmptyState,
  AdminMetaList,
  AdminPageHeader,
  AdminPanel,
  formatAdminDate,
  formatAdminDateOnly,
  formatEnumLabel,
} from "@/components/admin/admin-ui";
import { ButtonLink } from "@/components/ui/button-link";
import { getStudentDetailData, getStudentsData } from "@/server/admin-data";

type Params = Promise<{ id: string }>;

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const [profile, studentsData] = await Promise.all([
    getStudentDetailData(id),
    getStudentsData("all"),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Student detail"
        title={profile.studentName}
        description="Update the learner profile, review enrollments, inspect attendance, and check the latest milestones and teacher notes from one place."
        action={<ButtonLink href="/admin/students">Back to students</ButtonLink>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminPanel
          title="Edit student profile"
          description="This student record stays linked to the existing portal account used for dashboard access."
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StudentProfileStatusBadge status={profile.status} />
            <span className="text-sm text-ink-600">
              {profile.account.email} | {formatEnumLabel(profile.account.role)}
            </span>
          </div>
          <StudentProfileForm
            accountOptions={studentsData.accountOptions}
            defaultValues={{
              city: profile.city,
              currentLevel: profile.recommendedLevel,
              fullName: profile.fullName,
              id: profile.id,
              modePreference: profile.modePreference,
              phone: profile.phone,
              portalEmail: profile.account.email,
              preferredSlot: profile.preferredSlot,
              programName: profile.programName,
              status: profile.status,
              studentAge: profile.studentAge,
              studentName: profile.studentName,
            }}
            submitLabel="Update student profile"
          />
        </AdminPanel>

        <AdminPanel
          title="Record summary"
          description="The dashboard reads from these stored learner details and attached records."
        >
          <AdminMetaList
            items={[
              { label: "Parent", value: profile.fullName },
              { label: "Student age", value: profile.studentAge ?? "Pending" },
              { label: "City", value: profile.city ?? "Pending" },
              { label: "Phone", value: profile.phone ?? "Pending" },
              { label: "Program", value: profile.programName ?? "Pending" },
              {
                label: "Preferred slot",
                value: profile.preferredSlot ?? "Pending",
              },
              {
                label: "Mode preference",
                value: profile.modePreference ?? "Pending",
              },
              {
                label: "Recommended level",
                value: profile.recommendedLevel ?? "Pending",
              },
              {
                label: "Created",
                value: formatAdminDate(profile.createdAt),
              },
            ]}
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href="/admin/enrollments" variant="secondary">
              Manage enrollments
            </ButtonLink>
            <ButtonLink href="/admin/attendance" variant="secondary">
              Mark attendance
            </ButtonLink>
            <ButtonLink href="/admin/progress" variant="secondary">
              Update progress
            </ButtonLink>
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminPanel
          title="Enrollments"
          description="Current and previous program records tied to this learner."
        >
          {profile.enrollments.length === 0 ? (
            <AdminEmptyState
              title="No enrollments yet"
              message="Create an enrollment from the admin enrollments page to make this student ready for attendance, progress, and payment setup."
            />
          ) : (
            <div className="space-y-4">
              {profile.enrollments.map((enrollment) => (
                <article
                  key={enrollment.id}
                  className="rounded-[24px] border border-sand-200 bg-sand-100/55 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <EnrollmentStatusBadge status={enrollment.status} />
                    <span className="text-base font-semibold text-navy-900">
                      {enrollment.programName}
                    </span>
                  </div>
                  <div className="mt-4">
                    <AdminMetaList
                      items={[
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
                          label: "Monthly fee",
                          value: enrollment.monthlyFeeInr
                            ? `INR ${enrollment.monthlyFeeInr.toLocaleString("en-IN")}`
                            : "Pending",
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
                </article>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel
          title="Attendance"
          description="Latest attendance entries recorded for this learner."
        >
          {profile.attendanceRecords.length === 0 ? (
            <AdminEmptyState
              title="No attendance yet"
              message="Attendance entries will appear after the admin team starts marking class presence."
            />
          ) : (
            <div className="space-y-4">
              {profile.attendanceRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[24px] border border-sand-200 bg-sand-100/55 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <AttendanceStatusBadge status={record.status} />
                    <p className="text-sm text-ink-600">
                      {formatAdminDateOnly(record.classDate)}
                    </p>
                  </div>
                  {record.note ? (
                    <p className="mt-3 text-sm leading-7 text-ink-700">
                      {record.note}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminPanel
          title="Progress milestones"
          description="Learner journey markers that can later drive parent dashboard updates and reports."
        >
          {profile.progressRecords.length === 0 ? (
            <AdminEmptyState
              title="No milestones yet"
              message="Milestones will appear once the admin or teaching team starts recording progress."
            />
          ) : (
            <div className="space-y-4">
              {profile.progressRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[24px] border border-sand-200 bg-sand-100/55 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ProgressStatusBadge status={record.status} />
                    <p className="text-base font-semibold text-navy-900">
                      {record.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-ink-700">
                    {record.detail}
                  </p>
                </article>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel
          title="Teacher notes"
          description="Recent classroom or follow-up notes that can later surface in the parent dashboard."
        >
          {profile.teacherNotes.length === 0 ? (
            <AdminEmptyState
              title="No teacher notes yet"
              message="Add notes from the progress page when the teaching or ops team has learner feedback to store."
            />
          ) : (
            <div className="space-y-4">
              {profile.teacherNotes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-[24px] border border-sand-200 bg-sand-100/55 px-4 py-4"
                >
                  <p className="text-base font-semibold text-navy-900">
                    {note.teacherName}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-500">
                    {formatAdminDate(note.createdAt)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ink-700">
                    {note.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </AdminPanel>
      </section>
    </div>
  );
}
