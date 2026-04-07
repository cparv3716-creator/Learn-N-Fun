import { payDashboardFees } from "@/app/actions/dashboard";
import { logoutPortal } from "@/app/actions/portal";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { PaymentButton } from "@/components/dashboard/payment-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { AnalyticsViewTracker } from "@/components/ui/analytics-view-tracker";
import type {
  DataState,
  PortalDashboardData,
  PortalProgressMilestone,
} from "@/lib/portal/types";
import { requirePortalSession } from "@/server/portal-auth";
import { getPortalDashboardData } from "@/server/portal-data";

export const dynamic = "force-dynamic";

function StatusPill({
  label,
  state,
}: {
  label: string;
  state: DataState;
}) {
  const className =
    state === "live"
      ? "border-mint-500/25 bg-mint-500/10 text-mint-500"
      : state === "placeholder"
        ? "border-gold-400/30 bg-gold-400/12 text-navy-900"
        : "border-sand-200 bg-sand-100 text-ink-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      {label}
    </span>
  );
}

function EmptyBlock({
  message,
  title,
}: {
  message: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-navy-200 bg-white/70 px-4 py-5">
      <p className="text-sm font-semibold text-navy-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink-600">{message}</p>
    </div>
  );
}

function MilestoneRow({ milestone }: { milestone: PortalProgressMilestone }) {
  const style =
    milestone.status === "completed"
      ? "bg-mint-500 text-white"
      : milestone.status === "in_progress"
        ? "bg-gold-400/18 text-navy-900"
        : "bg-white text-navy-700 shadow-[inset_0_0_0_1px_rgba(189,209,234,0.6)]";

  return (
    <div className="flex items-start gap-3 rounded-[22px] bg-sand-100/72 px-4 py-4">
      <span
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${style}`}
      >
        {milestone.status === "completed"
          ? "OK"
          : milestone.status === "in_progress"
            ? "GO"
            : "UP"}
      </span>
      <div>
        <p className="text-sm font-semibold text-navy-900">{milestone.label}</p>
        <p className="mt-1 text-sm leading-6 text-ink-600">{milestone.detail}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-navy-50/88 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(189,209,234,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-navy-900">{value}</p>
    </div>
  );
}

function formatStateLabel(data: PortalDashboardData) {
  return data.source === "live_records"
    ? "Connected from student records"
    : "Awaiting student records";
}

export default async function PortalDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await requirePortalSession();
  const dashboardData = await getPortalDashboardData(session);
  const query = searchParams ? await searchParams : {};
  const welcomeMessage =
    query.welcome === "signup"
      ? "Your dashboard account is ready. We'll contact you shortly with the next admissions steps."
      : null;
  const paymentMessage =
    query.payment === "success"
      ? "Payment recorded successfully. Your dashboard has been updated with the latest status."
      : null;

  return (
    <main className="py-8 sm:py-12">
      <AnalyticsViewTracker
        eventName="dashboard_open"
        payload={{ role: session.role }}
      />
      <Container>
        {welcomeMessage || paymentMessage ? (
          <div className="mb-5 rounded-[26px] border border-mint-500/20 bg-mint-500/10 px-5 py-4 text-sm text-navy-900 shadow-[0_14px_32px_rgba(16,37,61,0.05)]">
            <p className="font-semibold">
              {paymentMessage ? "Dashboard updated." : "Welcome to the dashboard."}
            </p>
            <p className="mt-1 leading-7 text-ink-600">
              {paymentMessage ?? welcomeMessage}
            </p>
          </div>
        ) : null}
        <div className="rounded-[34px] bg-[linear-gradient(135deg,#10253d_0%,#1b476f_58%,#336e9b_100%)] px-6 py-8 text-white shadow-[0_28px_75px_rgba(16,37,61,0.2)] sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Parent &amp; student dashboard
              </p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Welcome back, {dashboardData.student.parentName}
              </h1>
              <p className="mt-4 text-sm leading-7 text-sand-50/85 sm:text-base sm:leading-8">
                This dashboard is protected and now reads from persisted student
                records for profile details, enrollment progress, attendance
                summaries, and payments.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <StatusPill
                  label={session.role === "parent" ? "Parent access" : "Student access"}
                  state="live"
                />
                <StatusPill
                  label={formatStateLabel(dashboardData)}
                  state={dashboardData.source === "live_records" ? "live" : "placeholder"}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink className="w-full sm:w-auto" href="/">
                Back to website
              </ButtonLink>
              <form action={logoutPortal}>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <DashboardCard>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-navy-900 text-xl font-semibold text-white shadow-[0_18px_40px_rgba(16,37,61,0.18)]">
                  {dashboardData.student.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600">
                    Student profile
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-navy-900">
                    {dashboardData.student.name}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Parent: {dashboardData.student.parentName}
                    {dashboardData.student.age
                      ? ` | Age ${dashboardData.student.age}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="rounded-[24px] bg-sand-100/78 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-700">
                  Current program
                </p>
                <p className="mt-2 text-base font-semibold text-navy-900">
                  {dashboardData.student.programName ?? "Program pending"}
                </p>
                <p className="mt-1 text-sm leading-6 text-ink-600">
                  {dashboardData.student.recommendedLevel ??
                    "Recommendation available after admissions confirmation"}
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryCard
                label="City"
                value={dashboardData.student.city ?? "Awaiting sync"}
              />
              <SummaryCard
                label="Preferred slot"
                value={dashboardData.student.preferredSlot ?? "Pending"}
              />
              <SummaryCard
                label="Mode"
                value={dashboardData.student.modePreference ?? "To be confirmed"}
              />
              <SummaryCard label="Portal email" value={dashboardData.student.email} />
            </div>
          </DashboardCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <DashboardCard title="Attendance summary">
            <div className="space-y-4">
              <StatusPill
                label={
                  dashboardData.attendance.state === "live"
                    ? "Live data"
                    : dashboardData.attendance.state === "placeholder"
                      ? "Integration-ready"
                      : "Awaiting sync"
                }
                state={dashboardData.attendance.state}
              />
              {dashboardData.attendance.attendanceRate !== null ? (
                <div className="rounded-[24px] bg-navy-50/88 px-4 py-5 shadow-[inset_0_0_0_1px_rgba(189,209,234,0.45)]">
                  <p className="text-3xl font-semibold text-navy-900">
                    {dashboardData.attendance.attendanceRate}%
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-600">
                    {dashboardData.attendance.presentCount}/{dashboardData.attendance.totalCount} classes attended
                  </p>
                </div>
              ) : (
                <EmptyBlock
                  title="Attendance sync pending"
                  message={dashboardData.attendance.note}
                />
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Progress milestones">
            <div className="space-y-4">
              <StatusPill
                label={
                  dashboardData.progress.state === "live"
                    ? "Live data"
                    : dashboardData.progress.state === "placeholder"
                      ? "Guided roadmap"
                      : "Awaiting sync"
                }
                state={dashboardData.progress.state}
              />
              {dashboardData.progress.milestones.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.progress.milestones.map((milestone) => (
                    <MilestoneRow key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              ) : (
                <EmptyBlock
                  title="No milestones yet"
                  message={dashboardData.progress.note}
                />
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-3">
          <DashboardCard title="Teacher notes">
            <div className="space-y-4">
              <StatusPill
                label={
                  dashboardData.teacherNotes.state === "live"
                    ? "Latest note"
                    : dashboardData.teacherNotes.state === "placeholder"
                      ? "Integration-ready"
                      : "Awaiting sync"
                }
                state={dashboardData.teacherNotes.state}
              />
              {dashboardData.teacherNotes.items.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.teacherNotes.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-white/80 bg-white/85 px-4 py-4 shadow-[0_14px_36px_rgba(16,37,61,0.05)]"
                    >
                      <p className="text-sm font-semibold text-navy-900">
                        {item.teacherName}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-500">
                        {item.createdAtLabel}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-ink-600">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyBlock
                  title="No teacher notes yet"
                  message={dashboardData.teacherNotes.note}
                />
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Homework / practice status">
            <div className="space-y-4">
              <StatusPill
                label={
                  dashboardData.homework.state === "live"
                    ? "Live tracking"
                    : dashboardData.homework.state === "placeholder"
                      ? "Integration-ready"
                      : "Awaiting sync"
                }
                state={dashboardData.homework.state}
              />
              {dashboardData.homework.submittedLabel ? (
                <div className="rounded-[24px] bg-navy-50/88 px-4 py-5 shadow-[inset_0_0_0_1px_rgba(189,209,234,0.45)]">
                  <p className="text-base font-semibold text-navy-900">
                    {dashboardData.homework.submittedLabel}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-600">
                    {dashboardData.homework.pendingLabel ?? dashboardData.homework.note}
                  </p>
                </div>
              ) : (
                <EmptyBlock
                  title="Practice tracking pending"
                  message={dashboardData.homework.note}
                />
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Next class / next assessment">
            <div className="space-y-4">
              <StatusPill
                label={
                  dashboardData.assessments.state === "live"
                    ? "Live schedule"
                    : dashboardData.assessments.state === "placeholder"
                      ? "Current admissions step"
                      : "Awaiting schedule"
                }
                state={dashboardData.assessments.state}
              />
              {dashboardData.assessments.nextClassLabel ||
              dashboardData.assessments.nextAssessmentLabel ? (
                <div className="space-y-3">
                  <SummaryCard
                    label="Next class"
                    value={
                      dashboardData.assessments.nextClassLabel ?? "Pending"
                    }
                  />
                  <SummaryCard
                    label="Assessment"
                    value={
                      dashboardData.assessments.nextAssessmentLabel ?? "Pending"
                    }
                  />
                </div>
              ) : (
                <EmptyBlock
                  title="No schedule synced yet"
                  message={dashboardData.assessments.note}
                />
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="mt-5">
          <DashboardCard title="Payment summary">
            <div className="space-y-4">
              <StatusPill
                label={
                  dashboardData.payments.state === "live"
                    ? "Live billing"
                    : dashboardData.payments.state === "placeholder"
                      ? "Placeholder"
                      : "Awaiting billing"
                }
                state={dashboardData.payments.state}
              />
              {dashboardData.payments.canPayNow ? (
                <form action={payDashboardFees}>
                  <PaymentButton />
                </form>
              ) : null}
              {dashboardData.payments.lastPaymentLabel ||
              dashboardData.payments.amountDueLabel ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryCard
                    label="Last payment"
                    value={
                      dashboardData.payments.lastPaymentLabel ?? "No payment recorded"
                    }
                  />
                  <SummaryCard
                    label="Amount due"
                    value={dashboardData.payments.amountDueLabel ?? "No dues"}
                  />
                </div>
              ) : (
                <EmptyBlock
                  title="Payment integration pending"
                  message={dashboardData.payments.note}
                />
              )}
            </div>
          </DashboardCard>
        </div>
      </Container>
    </main>
  );
}
