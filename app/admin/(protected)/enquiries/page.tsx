import { LeadStatus } from "@prisma/client";
import Link from "next/link";
import {
  updateContactMessageStatus,
  updateFranchiseApplicationStatus,
} from "@/app/actions/admin";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import {
  AdminEmptyState,
  AdminMetaList,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  formatAdminDate,
  formatEnumLabel,
} from "@/components/admin/admin-ui";
import { prisma } from "@/lib/prisma";

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

function getTone(status: LeadStatus) {
  switch (status) {
    case LeadStatus.NEW:
      return "gold";
    case LeadStatus.CONTACTED:
      return "blue";
    case LeadStatus.QUALIFIED:
      return "green";
    case LeadStatus.CLOSED:
      return "gray";
    case LeadStatus.APPROVED:
      return "green";
    case LeadStatus.REJECTED:
      return "coral";
    default:
      return "gray";
  }
}

function getSelectedStatus(
  value: string | string[] | undefined,
  allowed: readonly LeadStatus[],
): LeadStatus | "all" {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized && allowed.includes(normalized as LeadStatus)
    ? (normalized as LeadStatus)
    : "all";
}

function buildFilterHref(
  key: string,
  value: LeadStatus | "all",
  filters: Record<string, string | string[] | undefined>,
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
  return query ? `/admin/enquiries?${query}` : "/admin/enquiries";
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const contactStatus = getSelectedStatus(
    filters.contactStatus,
    enquiryLeadStatuses,
  );
  const franchiseStatus = getSelectedStatus(
    filters.franchiseStatus,
    franchiseLeadStatuses,
  );

  const [contactMessages, franchiseApplications] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      where: contactStatus === "all" ? undefined : { status: contactStatus },
    }),
    prisma.franchiseApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      where:
        franchiseStatus === "all" ? undefined : { status: franchiseStatus },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Inbound management"
        title="Contact and franchise enquiries"
        description="Keep the wider public enquiry queue intact while student operations move into the new internal admin workspace."
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel
          title="Contact messages"
          description="General parent and public enquiries with daily follow-up states."
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterHref("contactStatus", "all", filters)}
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
                contactStatus === "all"
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-100 bg-white text-navy-900 hover:border-navy-300"
              }`}
            >
              All contacts
            </Link>
            {enquiryLeadStatuses.map((status) => (
              <Link
                key={status}
                href={buildFilterHref("contactStatus", status, filters)}
                className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  contactStatus === status
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-100 bg-white text-navy-900 hover:border-navy-300"
                }`}
              >
                {formatEnumLabel(status)}
              </Link>
            ))}
          </div>

          {contactMessages.length === 0 ? (
            <div className="mt-5">
              <AdminEmptyState
                title="No contact enquiries"
                message="No contact messages match the current filter."
              />
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {contactMessages.map((message) => {
                const action = updateContactMessageStatus.bind(null, message.id);

                return (
                  <article
                    key={message.id}
                    className={`rounded-[26px] border px-5 py-5 shadow-[0_16px_36px_rgba(16,37,61,0.05)] ${
                      message.status === LeadStatus.NEW
                        ? "border-gold-400/35 bg-white ring-1 ring-gold-400/18"
                        : "border-sand-200 bg-sand-100/55"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold text-navy-900">
                            {message.name}
                          </h2>
                          <AdminStatusBadge
                            label={formatEnumLabel(message.status)}
                            tone={getTone(message.status)}
                          />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {message.enquiryType}
                        </p>
                      </div>
                      <p className="text-sm text-ink-500">
                        {formatAdminDate(message.createdAt)}
                      </p>
                    </div>

                    <div className="mt-4">
                      <AdminMetaList
                        items={[
                          { label: "Email", value: message.email },
                          { label: "Phone", value: message.phone },
                          { label: "Topic", value: message.enquiryType },
                        ]}
                      />
                    </div>

                    <div className="mt-4 rounded-[20px] border border-sand-200 bg-white/75 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                        Message
                      </p>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-ink-700">
                        {message.message}
                      </p>
                    </div>

                    <form action={action} className="mt-4 space-y-3">
                      <select
                        name="status"
                        defaultValue={message.status}
                        className="w-full rounded-[16px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 focus:border-navy-300 focus:outline-none"
                      >
                        {enquiryLeadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {formatEnumLabel(status)}
                          </option>
                        ))}
                      </select>
                      <AdminSubmitButton
                        idleLabel="Save enquiry status"
                        pendingLabel="Saving..."
                      />
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </AdminPanel>

        <AdminPanel
          title="Franchise applications"
          description="Partner leads remain available here with their own approval workflow."
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildFilterHref("franchiseStatus", "all", filters)}
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
                franchiseStatus === "all"
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-100 bg-white text-navy-900 hover:border-navy-300"
              }`}
            >
              All franchise
            </Link>
            {franchiseLeadStatuses.map((status) => (
              <Link
                key={status}
                href={buildFilterHref("franchiseStatus", status, filters)}
                className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  franchiseStatus === status
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-100 bg-white text-navy-900 hover:border-navy-300"
                }`}
              >
                {formatEnumLabel(status)}
              </Link>
            ))}
          </div>

          {franchiseApplications.length === 0 ? (
            <div className="mt-5">
              <AdminEmptyState
                title="No franchise applications"
                message="No franchise applications match the current filter."
              />
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {franchiseApplications.map((application) => {
                const action = updateFranchiseApplicationStatus.bind(
                  null,
                  application.id,
                );

                return (
                  <article
                    key={application.id}
                    className={`rounded-[26px] border px-5 py-5 shadow-[0_16px_36px_rgba(16,37,61,0.05)] ${
                      application.status === LeadStatus.NEW
                        ? "border-gold-400/35 bg-white ring-1 ring-gold-400/18"
                        : "border-sand-200 bg-sand-100/55"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold text-navy-900">
                            {application.name}
                          </h2>
                          <AdminStatusBadge
                            label={formatEnumLabel(application.status)}
                            tone={getTone(application.status)}
                          />
                        </div>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {application.city}
                        </p>
                      </div>
                      <p className="text-sm text-ink-500">
                        {formatAdminDate(application.createdAt)}
                      </p>
                    </div>

                    <div className="mt-4">
                      <AdminMetaList
                        items={[
                          { label: "Email", value: application.email },
                          { label: "Phone", value: application.phone },
                          { label: "City", value: application.city },
                        ]}
                      />
                    </div>

                    {application.experience ? (
                      <div className="mt-4 rounded-[20px] border border-sand-200 bg-white/75 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                          Experience
                        </p>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-ink-700">
                          {application.experience}
                        </p>
                      </div>
                    ) : null}

                    {application.message ? (
                      <div className="mt-4 rounded-[20px] border border-sand-200 bg-white/75 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                          Additional notes
                        </p>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-ink-700">
                          {application.message}
                        </p>
                      </div>
                    ) : null}

                    <form action={action} className="mt-4 space-y-3">
                      <select
                        name="status"
                        defaultValue={application.status}
                        className="w-full rounded-[16px] border border-navy-100 bg-white px-4 py-3 text-sm text-ink-600 focus:border-navy-300 focus:outline-none"
                      >
                        {franchiseLeadStatuses.map((status) => (
                          <option key={status} value={status}>
                            {formatEnumLabel(status)}
                          </option>
                        ))}
                      </select>
                      <AdminSubmitButton
                        idleLabel="Save partner status"
                        pendingLabel="Saving..."
                      />
                    </form>
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
