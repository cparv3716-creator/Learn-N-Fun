import { AttendanceRecordForm } from "@/components/admin/admin-forms";
import { AttendanceStatusBadge } from "@/components/admin/admin-status-badges";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  formatAdminDateOnly,
} from "@/components/admin/admin-ui";
import { ButtonLink } from "@/components/ui/button-link";
import { getAttendanceData } from "@/server/admin-data";

export default async function AdminAttendancePage() {
  const data = await getAttendanceData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Classroom tracking"
        title="Attendance admin"
        description="Mark class presence cleanly so the parent dashboard can surface real attendance summaries instead of placeholder states."
        action={<ButtonLink href="/admin/students">Open student records</ButtonLink>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <AdminPanel
          title="Mark attendance"
          description="Select a learner, connect the record to an enrollment when available, and save the class-day outcome."
        >
          <AttendanceRecordForm profileOptions={data.profileOptions} />
        </AdminPanel>

        <AdminPanel
          title="Recent attendance records"
          description="The latest classroom attendance log, ready for review and future reporting."
        >
          {data.attendanceRecords.length === 0 ? (
            <AdminEmptyState
              title="No attendance records yet"
              message="Attendance entries will appear here after the first class presence is saved."
            />
          ) : (
            <div className="space-y-4">
              {data.attendanceRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[26px] border border-sand-200 bg-sand-100/55 px-5 py-4 shadow-[0_16px_36px_rgba(16,37,61,0.05)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-navy-900">
                          {record.profile.studentName}
                        </p>
                        <AttendanceStatusBadge status={record.status} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        Parent: {record.profile.fullName}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-ink-500">
                      {formatAdminDateOnly(record.classDate)}
                    </p>
                  </div>

                  <div className="mt-4 text-sm leading-7 text-ink-600">
                    <p>
                      {record.enrollment
                        ? `${record.enrollment.programName}${record.enrollment.batchName ? ` | ${record.enrollment.batchName}` : ""}`
                        : "Saved against the student profile"}
                    </p>
                    {record.note ? <p className="mt-2 text-ink-700">{record.note}</p> : null}
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
