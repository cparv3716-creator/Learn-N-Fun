import {
  ProgressRecordForm,
  TeacherNoteForm,
} from "@/components/admin/admin-forms";
import { ProgressStatusBadge } from "@/components/admin/admin-status-badges";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
  formatAdminDate,
} from "@/components/admin/admin-ui";
import { ButtonLink } from "@/components/ui/button-link";
import { getProgressData } from "@/server/admin-data";

export default async function AdminProgressPage() {
  const data = await getProgressData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Learner progress"
        title="Milestones and teacher notes"
        description="Update classroom progress, save teacher notes, and keep the learner journey ready for the parent dashboard."
        action={<ButtonLink href="/admin/attendance">Open attendance</ButtonLink>}
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel
          title="Add or update milestones"
          description="These milestones power learner progress visibility and future reporting."
        >
          <ProgressRecordForm profileOptions={data.profileOptions} />
        </AdminPanel>

        <AdminPanel
          title="Add teacher note"
          description="Use short, readable notes that can later surface clearly in the parent dashboard."
        >
          <TeacherNoteForm profileOptions={data.profileOptions} />
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel
          title="Progress timeline"
          description="Latest milestone records across all learners."
        >
          {data.progressRecords.length === 0 ? (
            <AdminEmptyState
              title="No progress milestones yet"
              message="Add the first milestone from the form above to start building the learner journey."
            />
          ) : (
            <div className="space-y-4">
              {data.progressRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[26px] border border-sand-200 bg-sand-100/55 px-5 py-4 shadow-[0_16px_36px_rgba(16,37,61,0.05)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <ProgressStatusBadge status={record.status} />
                    <p className="text-lg font-semibold text-navy-900">
                      {record.title}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {record.profile.studentName} | {record.profile.fullName}
                  </p>
                  {record.enrollment ? (
                    <p className="text-sm leading-6 text-ink-600">
                      {record.enrollment.programName}
                      {record.enrollment.batchName
                        ? ` | ${record.enrollment.batchName}`
                        : ""}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-7 text-ink-700">
                    {record.detail}
                  </p>
                </article>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel
          title="Recent teacher notes"
          description="Latest notes recorded by teaching or operations staff."
        >
          {data.teacherNotes.length === 0 ? (
            <AdminEmptyState
              title="No teacher notes yet"
              message="Save the first note from the form above to start building classroom context for each learner."
            />
          ) : (
            <div className="space-y-4">
              {data.teacherNotes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-[26px] border border-sand-200 bg-sand-100/55 px-5 py-4 shadow-[0_16px_36px_rgba(16,37,61,0.05)]"
                >
                  <p className="text-lg font-semibold text-navy-900">
                    {note.teacherName}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    {note.profile.studentName} | {note.profile.fullName}
                  </p>
                  {note.enrollment ? (
                    <p className="text-sm leading-6 text-ink-600">
                      {note.enrollment.programName}
                      {note.enrollment.batchName
                        ? ` | ${note.enrollment.batchName}`
                        : ""}
                    </p>
                  ) : null}
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
