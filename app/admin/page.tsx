import { DemoBookingStatus, LeadStatus, PaymentStatus } from "@prisma/client";
import Link from "next/link";
import {
  logoutAdmin,
  updateContactMessageStatus,
  updateDemoRequestStatus,
  updateFranchiseApplicationStatus,
} from "@/app/actions/admin";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/server/admin-auth";

const enquiryLeadStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.CLOSED,
] as const;
const franchiseLeadStatuses = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.APPROVED,
  LeadStatus.REJECTED,
] as const;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatLeadStatus(status: LeadStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatBookingStatus(status: DemoBookingStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getStatusBadgeClass(status: LeadStatus) {
  switch (status) {
    case LeadStatus.NEW:
      return "border-gold-400/40 bg-gold-400/15 text-navy-900";
    case LeadStatus.CONTACTED:
      return "border-navy-200 bg-navy-100/80 text-navy-900";
    case LeadStatus.QUALIFIED:
      return "border-mint-500/30 bg-mint-500/10 text-mint-500";
    case LeadStatus.CLOSED:
      return "border-sand-200 bg-sand-100 text-ink-700";
    case LeadStatus.APPROVED:
      return "border-mint-500/30 bg-mint-500/10 text-mint-500";
    case LeadStatus.REJECTED:
      return "border-coral-400/30 bg-coral-400/10 text-coral-600";
    default:
      return "border-sand-200 bg-sand-100 text-ink-700";
  }
}

function getBookingStatusBadgeClass(status: DemoBookingStatus) {
  switch (status) {
    case DemoBookingStatus.PENDING:
      return "border-gold-400/40 bg-gold-400/15 text-navy-900";
    case DemoBookingStatus.CONFIRMED:
      return "border-navy-200 bg-navy-100/80 text-navy-900";
    case DemoBookingStatus.COMPLETED:
      return "border-mint-500/30 bg-mint-500/10 text-mint-500";
    case DemoBookingStatus.CANCELLED:
      return "border-coral-400/30 bg-coral-400/10 text-coral-600";
    default:
      return "border-sand-200 bg-sand-100 text-ink-700";
  }
}

function getCardClass(status: LeadStatus) {
  return status === LeadStatus.NEW
    ? "rounded-[26px] border border-gold-400/35 bg-white px-5 py-5 shadow-[0_22px_55px_rgba(16,37,61,0.1)] ring-1 ring-gold-400/20"
    : "rounded-[26px] border border-white/80 bg-white/95 px-5 py-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)]";
}

function getFilterValue(
  value: string | string[] | undefined,
  allowedStatuses: readonly LeadStatus[],
) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized && allowedStatuses.includes(normalized as LeadStatus)
    ? (normalized as LeadStatus)
    : "all";
}

function buildFilterHref(
  filters: Record<string, string | string[] | undefined>,
  key: string,
  value: LeadStatus | "all",
) {
  const params = new URLSearchParams();

  for (const [filterKey, filterValue] of Object.entries(filters)) {
    const normalized = Array.isArray(filterValue) ? filterValue[0] : filterValue;
    if (normalized && filterKey !== key) {
      params.set(filterKey, normalized);
    }
  }

  if (value !== "all") {
    params.set(key, value);
  }

  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

function FilterBar({
  allLabel,
  allowedStatuses,
  filterKey,
  filters,
  selectedStatus,
}: {
  allLabel: string;
  allowedStatuses: readonly LeadStatus[];
  filterKey: string;
  filters: Record<string, string | string[] | undefined>;
  selectedStatus: LeadStatus | "all";
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Link
        href={buildFilterHref(filters, filterKey, "all")}
        className={`inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
          selectedStatus === "all"
            ? "border-navy-900 bg-navy-900 text-white"
            : "border-navy-200 bg-white text-navy-900 hover:border-navy-300"
        }`}
      >
        {allLabel}
      </Link>
      {allowedStatuses.map((status) => (
        <Link
          key={status}
          href={buildFilterHref(filters, filterKey, status)}
          className={`inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            selectedStatus === status
              ? getStatusBadgeClass(status)
              : "border-sand-200 bg-white text-ink-700 hover:border-navy-200"
          }`}
        >
          {formatLeadStatus(status)}
        </Link>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClass(
        status,
      )}`}
    >
      {formatLeadStatus(status)}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: DemoBookingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getBookingStatusBadgeClass(
        status,
      )}`}
    >
      {formatBookingStatus(status)}
    </span>
  );
}

function SectionShell({
  eyebrow,
  title,
  subtitle,
  countLabel,
  filters,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  countLabel: string;
  filters: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 rounded-[30px] border border-sand-200/80 bg-white/60 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.05)] sm:mt-12 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-sand-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-sm">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-navy-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-600">
            {subtitle}
          </p>
          {filters}
        </div>
        <p className="text-sm font-medium text-ink-600">{countLabel}</p>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-navy-200 bg-white/70 p-6 text-sm leading-7 text-ink-600">
      {message}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] bg-sand-100/50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
        {label}
      </p>
      <div className="mt-1 break-words text-sm leading-6 text-navy-900">
        {value}
      </div>
    </div>
  );
}

function LongContentBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-sand-200 bg-sand-100/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
        {label}
      </p>
      <div className="mt-2 max-h-44 overflow-y-auto whitespace-pre-wrap break-words pr-1 text-sm leading-7 text-ink-700">
        {value}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireAdminSession();
  const filters = await searchParams;
  const demoStatus = getFilterValue(filters.demoStatus, enquiryLeadStatuses);
  const contactStatus = getFilterValue(
    filters.contactStatus,
    enquiryLeadStatuses,
  );
  const franchiseStatus = getFilterValue(
    filters.franchiseStatus,
    franchiseLeadStatuses,
  );

  let demoRequests: Awaited<ReturnType<typeof prisma.demoRequest.findMany>> = [];
  let contactMessages: Awaited<
    ReturnType<typeof prisma.contactMessage.findMany>
  > = [];
  let franchiseApplications: Awaited<
    ReturnType<typeof prisma.franchiseApplication.findMany>
  > = [];
  let studentProfiles: Array<{
    account: {
      email: string;
      role: "PARENT" | "STUDENT";
    };
    city: string | null;
    createdAt: Date;
    fullName: string;
    id: string;
    payments: Array<{
      amountInr: number;
      createdAt: Date;
      paidAt: Date | null;
      status: PaymentStatus;
    }>;
    programName: string | null;
    recommendedLevel: string | null;
    studentName: string;
    enrollments: Array<{
      currentLevel: string | null;
      monthlyFeeInr: number | null;
      programName: string;
      status: string;
    }>;
  }> = [];
  let demoRequestCount = 0;
  let contactMessageCount = 0;
  let franchiseApplicationCount = 0;
  let studentProfileCount = 0;
  let newDemoRequestCount = 0;
  let newContactMessageCount = 0;
  let newFranchiseApplicationCount = 0;
  let dashboardError: string | null = null;

  try {
    [
      demoRequests,
      contactMessages,
      franchiseApplications,
      studentProfiles,
      demoRequestCount,
      contactMessageCount,
      franchiseApplicationCount,
      studentProfileCount,
      newDemoRequestCount,
      newContactMessageCount,
      newFranchiseApplicationCount,
    ] = await Promise.all([
      prisma.demoRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        where:
          demoStatus === "all"
            ? undefined
            : {
                status: demoStatus,
              },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        where:
          contactStatus === "all"
            ? undefined
            : {
                status: contactStatus,
              },
      }),
      prisma.franchiseApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        where:
          franchiseStatus === "all"
            ? undefined
            : {
                status: franchiseStatus,
              },
      }),
      prisma.portalProfile.findMany({
        include: {
          account: {
            select: {
              email: true,
              role: true,
            },
          },
          enrollments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          payments: {
            orderBy: { createdAt: "desc" },
            take: 2,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.demoRequest.count(),
      prisma.contactMessage.count(),
      prisma.franchiseApplication.count(),
      prisma.portalProfile.count(),
      prisma.demoRequest.count({ where: { status: LeadStatus.NEW } }),
      prisma.contactMessage.count({ where: { status: LeadStatus.NEW } }),
      prisma.franchiseApplication.count({ where: { status: LeadStatus.NEW } }),
    ]);
  } catch (error) {
    console.error("Failed to load admin dashboard data", error);
    dashboardError =
      "We couldn't load submissions right now. Please check the database connection and try again.";
  }

  return (
    <main className="py-8 sm:py-12">
      <Container>
        <div className="rounded-[32px] bg-navy-900 px-6 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
                Admin dashboard
              </p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Submission management
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-sand-50/85 sm:text-base sm:leading-8">
                Signed in as {session.username}. Review the latest submissions,
                filter by follow-up status, and update leads without losing
                sight of new items.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink className="w-full sm:w-auto" href="/">
                View website
              </ButtonLink>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Demo bookings", value: demoRequestCount.toString() },
            { label: "Contact messages", value: contactMessageCount.toString() },
            {
              label: "Franchise applications",
              value: franchiseApplicationCount.toString(),
            },
            { label: "Students", value: studentProfileCount.toString() },
            { label: "New demos", value: newDemoRequestCount.toString() },
            { label: "New contacts", value: newContactMessageCount.toString() },
            {
              label: "New franchise leads",
              value: newFranchiseApplicationCount.toString(),
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-[24px] border p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] ${
                item.label.startsWith("New")
                  ? "border-gold-400/35 bg-gold-400/10"
                  : "border-white/80 bg-white/90"
              }`}
            >
              <p className="text-3xl font-semibold text-navy-900">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        {dashboardError ? (
          <div className="mt-8 rounded-[24px] border border-coral-200 bg-coral-400/10 p-5 text-sm leading-7 text-coral-700">
            {dashboardError}
          </div>
        ) : null}

        <SectionShell
          eyebrow="Booking records"
          title="Demo Booking Table"
          subtitle="A compact operational view of the latest demo bookings, their preferred schedule, and booking stage."
          countLabel={`Showing ${demoRequests.length} item${demoRequests.length === 1 ? "" : "s"}`}
          filters={
            <FilterBar
              allLabel="All demos"
              allowedStatuses={enquiryLeadStatuses}
              filterKey="demoStatus"
              filters={filters}
              selectedStatus={demoStatus}
            />
          }
        >
          {demoRequests.length === 0 ? (
            <EmptyState message="No demo bookings match the current filter." />
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-sand-200 bg-white">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.9fr_0.9fr] gap-4 border-b border-sand-200 bg-sand-100/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:grid">
                <span>Family</span>
                <span>Program</span>
                <span>Preferred schedule</span>
                <span>Booking</span>
                <span>Lead</span>
              </div>
              <div className="divide-y divide-sand-200">
                {demoRequests.map((request) => (
                  <div
                    key={`table-${request.id}`}
                    className="grid gap-4 px-5 py-4 lg:grid-cols-[1.2fr_1fr_1fr_0.9fr_0.9fr] lg:items-start"
                  >
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                        Family
                      </p>
                      <p className="text-base font-semibold text-navy-900">
                        {request.parentName}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {request.childName} | Age {request.childAge}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                        Program
                      </p>
                      <p className="text-sm font-medium text-navy-900">
                        {request.programInterest}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {request.preferredSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                        Preferred schedule
                      </p>
                      <p className="text-sm font-medium text-navy-900">
                        {request.preferredDemoDate
                          ? formatDate(request.preferredDemoDate)
                          : "Date pending"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {request.preferredDemoTime ?? "Time pending"}
                        {request.mode ? ` | ${request.mode}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                        Booking
                      </p>
                      <BookingStatusBadge status={request.bookingStatus} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                        Lead
                      </p>
                      <StatusBadge status={request.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionShell>

        <SectionShell
          eyebrow="Student records"
          title="Students"
          subtitle="A compact view of the live student records linked to portal accounts, current enrollments, and payment state."
          countLabel={`Showing ${studentProfiles.length} item${studentProfiles.length === 1 ? "" : "s"}`}
          filters={<></>}
        >
          {studentProfiles.length === 0 ? (
            <EmptyState message="No student profiles have been created yet." />
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-sand-200 bg-white">
              <div className="hidden grid-cols-[1.1fr_1fr_1fr_0.9fr_0.9fr] gap-4 border-b border-sand-200 bg-sand-100/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:grid">
                <span>Student</span>
                <span>Parent account</span>
                <span>Program</span>
                <span>Enrollment</span>
                <span>Payment</span>
              </div>
              <div className="divide-y divide-sand-200">
                {studentProfiles.map((profile) => {
                  const enrollment = profile.enrollments[0] ?? null;
                  const latestPayment = profile.payments[0] ?? null;

                  return (
                    <div
                      key={profile.id}
                      className="grid gap-4 px-5 py-4 lg:grid-cols-[1.1fr_1fr_1fr_0.9fr_0.9fr] lg:items-start"
                    >
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                          Student
                        </p>
                        <p className="text-base font-semibold text-navy-900">
                          {profile.studentName}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {profile.fullName}
                          {profile.city ? ` | ${profile.city}` : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                          Parent account
                        </p>
                        <p className="text-sm font-medium text-navy-900">
                          {profile.account.email}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {profile.account.role === "PARENT" ? "Parent login" : "Student login"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                          Program
                        </p>
                        <p className="text-sm font-medium text-navy-900">
                          {enrollment?.programName ?? profile.programName ?? "Program pending"}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {enrollment?.currentLevel ??
                            profile.recommendedLevel ??
                            "Level pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                          Enrollment
                        </p>
                        <p className="text-sm font-medium text-navy-900">
                          {enrollment?.status ?? "Not enrolled"}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {enrollment?.monthlyFeeInr
                            ? `INR ${enrollment.monthlyFeeInr.toLocaleString("en-IN")} / month`
                            : "Fee pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500 lg:hidden">
                          Payment
                        </p>
                        <p className="text-sm font-medium text-navy-900">
                          {latestPayment?.status ?? "No payment"}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {latestPayment
                            ? `INR ${latestPayment.amountInr.toLocaleString("en-IN")}`
                            : "No records yet"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionShell>

        <SectionShell
          eyebrow="Book demo submissions"
          title="Demo Bookings"
          subtitle="Review live demo bookings, preferred schedules, and both booking and outreach status from one place."
          countLabel={`Showing ${demoRequests.length} item${demoRequests.length === 1 ? "" : "s"}`}
          filters={
            <FilterBar
              allLabel="All demos"
              allowedStatuses={enquiryLeadStatuses}
              filterKey="demoStatus"
              filters={filters}
              selectedStatus={demoStatus}
            />
          }
        >
          {demoRequests.length === 0 ? (
            <EmptyState message="No demo requests match the current filter." />
          ) : (
            demoRequests.map((request) => {
              const updateStatusAction = updateDemoRequestStatus.bind(
                null,
                request.id,
              );

              return (
                <article key={request.id} className={getCardClass(request.status)}>
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-col gap-3 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-semibold text-navy-900">
                              {request.parentName}
                            </h3>
                            <StatusBadge status={request.status} />
                            <BookingStatusBadge status={request.bookingStatus} />
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-600">
                            Parent of {request.childName}, age {request.childAge}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-ink-500">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailItem label="Email" value={request.email} />
                        <DetailItem label="Phone" value={request.phone} />
                        <DetailItem label="City" value={request.city} />
                        <DetailItem
                          label="Program"
                          value={request.programInterest}
                        />
                        <DetailItem
                          label="Booking status"
                          value={formatBookingStatus(request.bookingStatus)}
                        />
                        <DetailItem
                          label="Preferred slot"
                          value={request.preferredSlot}
                        />
                        <DetailItem
                          label="Preferred date"
                          value={
                            request.preferredDemoDate
                              ? formatDate(request.preferredDemoDate)
                              : "Pending"
                          }
                        />
                        <DetailItem
                          label="Preferred time"
                          value={request.preferredDemoTime ?? "Pending"}
                        />
                        <DetailItem
                          label="Mode"
                          value={request.mode ?? "Pending"}
                        />
                        <DetailItem
                          label="Fresh item"
                          value={
                            request.status === LeadStatus.NEW ? "Yes" : "No"
                          }
                        />
                      </div>

                      {request.notes ? (
                        <LongContentBlock label="Notes for the trainer" value={request.notes} />
                      ) : null}
                    </div>

                    <div className="rounded-[22px] border border-sand-200 bg-sand-100/70 p-4 xl:w-72">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700">
                        Update status
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        Mark outreach progress and keep the queue current.
                      </p>

                      <form action={updateStatusAction} className="mt-4 space-y-3">
                        <select
                          name="status"
                          defaultValue={request.status}
                          className="w-full rounded-[16px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 focus:border-navy-300 focus:outline-none"
                        >
                          {enquiryLeadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {formatLeadStatus(status)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
                        >
                          Save status
                        </button>
                      </form>

                      <div className="mt-4 flex flex-col gap-2 text-sm">
                        <a
                          href={`mailto:${request.email}`}
                          className="text-navy-700 hover:text-navy-900"
                        >
                          Email parent
                        </a>
                        <a
                          href={`tel:${request.phone}`}
                          className="text-navy-700 hover:text-navy-900"
                        >
                          Call parent
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </SectionShell>

        <SectionShell
          eyebrow="Contact form submissions"
          title="Contact Messages"
          subtitle="Keep the broader inbound queue tidy with clear status filters and easier-to-read message cards."
          countLabel={`Showing ${contactMessages.length} item${contactMessages.length === 1 ? "" : "s"}`}
          filters={
            <FilterBar
              allLabel="All contacts"
              allowedStatuses={enquiryLeadStatuses}
              filterKey="contactStatus"
              filters={filters}
              selectedStatus={contactStatus}
            />
          }
        >
          {contactMessages.length === 0 ? (
            <EmptyState message="No contact messages match the current filter." />
          ) : (
            contactMessages.map((message) => {
              const updateStatusAction = updateContactMessageStatus.bind(
                null,
                message.id,
              );

              return (
                <article key={message.id} className={getCardClass(message.status)}>
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-col gap-3 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-semibold text-navy-900">
                              {message.name}
                            </h3>
                            <StatusBadge status={message.status} />
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-600">
                            {message.enquiryType}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-ink-500">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailItem label="Email" value={message.email} />
                        <DetailItem label="Phone" value={message.phone} />
                        <DetailItem label="Topic" value={message.enquiryType} />
                        <DetailItem
                          label="Fresh item"
                          value={
                            message.status === LeadStatus.NEW ? "Yes" : "No"
                          }
                        />
                      </div>

                      <LongContentBlock label="Message" value={message.message} />
                    </div>

                    <div className="rounded-[22px] border border-sand-200 bg-sand-100/70 p-4 xl:w-72">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700">
                        Update status
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        Keep general enquiries visible as they move from new to
                        resolved.
                      </p>

                      <form action={updateStatusAction} className="mt-4 space-y-3">
                        <select
                          name="status"
                          defaultValue={message.status}
                          className="w-full rounded-[16px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 focus:border-navy-300 focus:outline-none"
                        >
                          {enquiryLeadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {formatLeadStatus(status)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
                        >
                          Save status
                        </button>
                      </form>

                      <div className="mt-4 flex flex-col gap-2 text-sm">
                        <a
                          href={`mailto:${message.email}`}
                          className="text-navy-700 hover:text-navy-900"
                        >
                          Email sender
                        </a>
                        <a
                          href={`tel:${message.phone}`}
                          className="text-navy-700 hover:text-navy-900"
                        >
                          Call sender
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </SectionShell>

        <SectionShell
          eyebrow="Franchise applications"
          title="Franchise Applications"
          subtitle="Review partner interest separately from parent enquiries, with filters tuned to the franchise approval workflow."
          countLabel={`Showing ${franchiseApplications.length} item${franchiseApplications.length === 1 ? "" : "s"}`}
          filters={
            <FilterBar
              allLabel="All applications"
              allowedStatuses={franchiseLeadStatuses}
              filterKey="franchiseStatus"
              filters={filters}
              selectedStatus={franchiseStatus}
            />
          }
        >
          {franchiseApplications.length === 0 ? (
            <EmptyState message="No franchise applications match the current filter." />
          ) : (
            franchiseApplications.map((application) => {
              const updateStatusAction = updateFranchiseApplicationStatus.bind(
                null,
                application.id,
              );

              return (
                <article
                  key={application.id}
                  className={getCardClass(application.status)}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-col gap-3 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-semibold text-navy-900">
                              {application.name}
                            </h3>
                            <StatusBadge status={application.status} />
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-600">
                            Application from {application.city}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-ink-500">
                          {formatDate(application.createdAt)}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <DetailItem label="Email" value={application.email} />
                        <DetailItem label="Phone" value={application.phone} />
                        <DetailItem label="City" value={application.city} />
                        <DetailItem
                          label="Fresh item"
                          value={
                            application.status === LeadStatus.NEW ? "Yes" : "No"
                          }
                        />
                      </div>

                      {application.experience ? (
                        <LongContentBlock
                          label="Experience"
                          value={application.experience}
                        />
                      ) : null}

                      {application.message ? (
                        <LongContentBlock
                          label="Additional notes"
                          value={application.message}
                        />
                      ) : null}
                    </div>

                    <div className="rounded-[22px] border border-sand-200 bg-sand-100/70 p-4 xl:w-72">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700">
                        Update status
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        Move partner leads through outreach, approval, or
                        rejection with a clearer franchise workflow.
                      </p>

                      <form action={updateStatusAction} className="mt-4 space-y-3">
                        <select
                          name="status"
                          defaultValue={application.status}
                          className="w-full rounded-[16px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 focus:border-navy-300 focus:outline-none"
                        >
                          {franchiseLeadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {formatLeadStatus(status)}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="inline-flex w-full items-center justify-center rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
                        >
                          Save status
                        </button>
                      </form>

                      <div className="mt-4 flex flex-col gap-2 text-sm">
                        <a
                          href={`mailto:${application.email}`}
                          className="text-navy-700 hover:text-navy-900"
                        >
                          Email applicant
                        </a>
                        <a
                          href={`tel:${application.phone}`}
                          className="text-navy-700 hover:text-navy-900"
                        >
                          Call applicant
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </SectionShell>
      </Container>
    </main>
  );
}
