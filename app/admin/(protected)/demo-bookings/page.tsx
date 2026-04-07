import { DemoOpsStatus } from "@prisma/client";
import Link from "next/link";
import { updateDemoBookingOpsStatus } from "@/app/actions/admin-operations";
import { DemoOpsStatusBadge } from "@/components/admin/admin-status-badges";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import {
  AdminEmptyState,
  AdminMetaList,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
  formatAdminDate,
  formatAdminDateOnly,
  formatEnumLabel,
} from "@/components/admin/admin-ui";
import { ButtonLink } from "@/components/ui/button-link";
import { getDemoBookingsData } from "@/server/admin-data";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getSelectedStatus(
  value: string | string[] | undefined,
): DemoOpsStatus | "all" {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized && Object.values(DemoOpsStatus).includes(normalized as DemoOpsStatus)
    ? (normalized as DemoOpsStatus)
    : "all";
}

function buildHref(selectedStatus: DemoOpsStatus | "all") {
  return selectedStatus === "all"
    ? "/admin/demo-bookings"
    : `/admin/demo-bookings?opsStatus=${selectedStatus}`;
}

export default async function AdminDemoBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const selectedStatus = getSelectedStatus(filters.opsStatus);
  const data = await getDemoBookingsData(selectedStatus);
  const totalCount = data.counts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admissions queue"
        title="Demo booking management"
        description="Track demo enquiries from fresh lead through booking, completion, and conversion without losing the original parent details or preferred schedule."
        action={<ButtonLink href="/book-demo">Open booking page</ButtonLink>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard
          emphasis={selectedStatus === "all"}
          label="All demo bookings"
          value={totalCount.toString()}
        />
        {data.counts.map((item) => (
          <AdminStatCard
            key={item.status}
            emphasis={item.status === DemoOpsStatus.NEW}
            label={formatEnumLabel(item.status)}
            value={item.count.toString()}
          />
        ))}
      </section>

      <AdminPanel
        title="Filter by booking stage"
        description="Use the operational status below to keep the admissions queue tidy for daily follow-up."
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
            All bookings
          </Link>
          {Object.values(DemoOpsStatus).map((status) => (
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
      </AdminPanel>

      <AdminPanel
        title="Demo bookings"
        description="Recent demo submissions with parent details, preferred schedule, and a safe operational status updater."
      >
        {data.demoBookings.length === 0 ? (
          <AdminEmptyState
            title="No demo bookings found"
            message="Try another booking status filter or wait for new families to submit a booking."
          />
        ) : (
          <div className="space-y-5">
            {data.demoBookings.map((booking) => {
              const updateStatusAction = updateDemoBookingOpsStatus.bind(
                null,
                booking.id,
              );

              return (
                <article
                  key={booking.id}
                  className={`rounded-[28px] border px-5 py-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] ${
                    booking.opsStatus === DemoOpsStatus.NEW
                      ? "border-gold-400/35 bg-white ring-1 ring-gold-400/18"
                      : "border-sand-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-col gap-3 border-b border-sand-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-semibold text-navy-900">
                              {booking.parentName}
                            </h2>
                            <DemoOpsStatusBadge status={booking.opsStatus} />
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-600">
                            Parent of {booking.childName}, age {booking.childAge}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-ink-500">
                          {formatAdminDate(booking.createdAt)}
                        </p>
                      </div>

                      <AdminMetaList
                        items={[
                          { label: "Phone", value: booking.phone },
                          { label: "Email", value: booking.email },
                          { label: "City", value: booking.city },
                          { label: "Program", value: booking.programInterest },
                          {
                            label: "Preferred batch",
                            value: booking.preferredSlot || "Pending",
                          },
                          {
                            label: "Preferred date",
                            value: formatAdminDateOnly(booking.preferredDemoDate),
                          },
                          {
                            label: "Preferred time",
                            value: booking.preferredDemoTime ?? "Pending",
                          },
                          { label: "Mode", value: booking.mode ?? "Pending" },
                          {
                            label: "Student record",
                            value: booking.profile ? (
                              <Link
                                href={`/admin/students/${booking.profile.id}`}
                                className="font-medium text-navy-700 hover:text-navy-900"
                              >
                                Open {booking.profile.studentName}
                              </Link>
                            ) : (
                              "Not linked yet"
                            ),
                          },
                        ]}
                      />

                      {booking.notes ? (
                        <div className="rounded-[22px] border border-sand-200 bg-sand-100/65 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                            Trainer notes
                          </p>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-ink-700">
                            {booking.notes}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-[24px] border border-sand-200 bg-sand-100/70 p-4 xl:w-80">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-700">
                        Update booking stage
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        Keep admissions progress accurate across outreach, scheduling,
                        completion, and conversion.
                      </p>

                      <form action={updateStatusAction} className="mt-4 space-y-3">
                        <select
                          name="opsStatus"
                          defaultValue={booking.opsStatus}
                          className="w-full rounded-[16px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 focus:border-navy-300 focus:outline-none"
                        >
                          {Object.values(DemoOpsStatus).map((status) => (
                            <option key={status} value={status}>
                              {formatEnumLabel(status)}
                            </option>
                          ))}
                        </select>
                        <AdminSubmitButton
                          idleLabel="Save booking stage"
                          pendingLabel="Saving..."
                        />
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
