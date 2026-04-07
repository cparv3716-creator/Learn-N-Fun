import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DemoOpsStatusBadge,
  EnrollmentStatusBadge,
  StudentProfileStatusBadge,
} from "@/components/admin/admin-status-badges";
import {
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
  formatAdminDate,
  formatEnumLabel,
} from "@/components/admin/admin-ui";
import { getAdminOverviewData } from "@/server/admin-data";

export default async function AdminOverviewPage() {
  const overview = await getAdminOverviewData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin overview"
        title="Operations dashboard"
        description="Keep admissions and learner operations moving with one clear view across demo bookings, student records, enrollments, attendance, and classroom progress."
        action={
          <ButtonLink href="/admin/demo-bookings">Open booking queue</ButtonLink>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          emphasis
          label="New demo bookings needing follow-up"
          value={overview.counts.newDemoCount.toString()}
        />
        <AdminStatCard
          label="Total student records"
          value={overview.counts.studentCount.toString()}
        />
        <AdminStatCard
          label="Active enrollments"
          value={overview.counts.activeEnrollmentCount.toString()}
        />
        <AdminStatCard
          label="Attendance records logged"
          value={overview.counts.attendanceCount.toString()}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminPanel
          title="Recent demo bookings"
          description="Admissions can jump straight into the latest families, preferred schedules, and operational stage."
        >
          {overview.recentDemoBookings.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-navy-200 bg-navy-50/55 px-5 py-5 text-sm text-ink-600">
              Demo bookings will appear here once families start booking.
            </div>
          ) : (
            <div className="space-y-4">
              {overview.recentDemoBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[24px] border border-sand-200 bg-sand-100/55 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-navy-900">
                        {booking.parentName}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {booking.childName}, age {booking.childAge} |{" "}
                        {booking.programInterest}
                      </p>
                    </div>
                    <DemoOpsStatusBadge status={booking.opsStatus} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-ink-600">
                    <span>{formatAdminDate(booking.createdAt)}</span>
                    <span>{booking.phone}</span>
                    <span>
                      {booking.preferredDemoDate
                        ? formatAdminDate(booking.preferredDemoDate)
                        : "Date pending"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-5">
            <Link
              href="/admin/demo-bookings"
              className="text-sm font-semibold text-navy-700 transition hover:text-navy-900"
            >
              View all demo bookings
            </Link>
          </div>
        </AdminPanel>

        <AdminPanel
          title="Recent student updates"
          description="Latest learner records, linkage state, and current class progression."
        >
          {overview.recentStudents.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-navy-200 bg-navy-50/55 px-5 py-5 text-sm text-ink-600">
              Student records will appear here once a profile is created.
            </div>
          ) : (
            <div className="space-y-4">
              {overview.recentStudents.map((profile) => {
                const latestEnrollment = profile.enrollments[0] ?? null;

                return (
                  <article
                    key={profile.id}
                    className="rounded-[24px] border border-sand-200 bg-sand-100/55 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-navy-900">
                          {profile.studentName}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          Parent: {profile.fullName}
                        </p>
                        <p className="text-sm leading-6 text-ink-600">
                          {profile.account.email} | {formatEnumLabel(profile.account.role)}
                        </p>
                      </div>
                      <StudentProfileStatusBadge status={profile.status} />
                    </div>
                    {latestEnrollment ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <EnrollmentStatusBadge status={latestEnrollment.status} />
                        <span className="text-sm text-ink-600">
                          {latestEnrollment.programName}
                          {latestEnrollment.currentLevel
                            ? ` | ${latestEnrollment.currentLevel}`
                            : ""}
                        </span>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
          <div className="mt-5">
            <Link
              href="/admin/students"
              className="text-sm font-semibold text-navy-700 transition hover:text-navy-900"
            >
              Manage student records
            </Link>
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <AdminPanel title="What is now live">
          <ul className="space-y-3 text-sm leading-7 text-ink-600">
            <li>Demo booking lifecycle management with internal ops statuses.</li>
            <li>Student profile creation and editing linked to portal accounts.</li>
            <li>Enrollment, attendance, milestone, and teacher note admin tools.</li>
          </ul>
        </AdminPanel>
        <AdminPanel title="Dashboard data source">
          <ul className="space-y-3 text-sm leading-7 text-ink-600">
            <li>Program, level, attendance, milestones, and notes now come from stored records where available.</li>
            <li>Graceful empty states remain in place if a learner has not been staffed or scheduled yet.</li>
          </ul>
        </AdminPanel>
        <AdminPanel title="Next operational focus">
          <ul className="space-y-3 text-sm leading-7 text-ink-600">
            <li>Batch scheduling and calendar assignment automation.</li>
            <li>Structured fee plans and invoice generation before gateway work.</li>
          </ul>
        </AdminPanel>
      </section>
    </div>
  );
}
