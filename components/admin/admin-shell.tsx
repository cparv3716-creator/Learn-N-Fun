import Link from "next/link";
import { logoutAdmin } from "@/app/actions/admin";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";

type AdminLayoutShellProps = {
  children: React.ReactNode;
  username: string;
};

export function AdminLayoutShell({
  children,
  username,
}: AdminLayoutShellProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f3eb_0%,#eef4fb_100%)] py-6 sm:py-8">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_60px_rgba(16,37,61,0.08)] backdrop-blur lg:sticky lg:top-6">
            <div className="rounded-[28px] bg-[linear-gradient(135deg,#10253d_0%,#1b476f_60%,#336e9b_100%)] px-5 py-5 text-white shadow-[0_22px_55px_rgba(16,37,61,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400">
                Internal admin
              </p>
              <h1 className="mt-3 text-2xl font-semibold">Operations hub</h1>
              <p className="mt-3 text-sm leading-7 text-sand-50/85">
                Manage admissions, students, enrollments, attendance, and
                learner progress from one protected workspace.
              </p>
            </div>

            <div className="mt-5">
              <AdminSidebarNav />
            </div>

            <div className="mt-6 rounded-[24px] border border-sand-200 bg-sand-100/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-500">
                Signed in
              </p>
              <p className="mt-2 text-base font-semibold text-navy-900">
                {username}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink className="w-full" href="/" variant="secondary">
                  View website
                </ButtonLink>
                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-900 transition hover:border-navy-300 hover:bg-navy-50"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/80 px-5 py-5 shadow-[0_20px_50px_rgba(16,37,61,0.06)] backdrop-blur sm:px-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600">
                  Learn &apos;N&apos; Fun Abacus
                </p>
                <p className="mt-2 text-lg font-semibold text-navy-900">
                  Protected admin workspace
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-ink-600">
                <Link
                  href="/admin/demo-bookings"
                  className="inline-flex rounded-full border border-sand-200 bg-sand-100/70 px-4 py-2 font-medium text-navy-900 transition hover:border-navy-200 hover:bg-white"
                >
                  Review demos
                </Link>
                <Link
                  href="/admin/students"
                  className="inline-flex rounded-full border border-sand-200 bg-sand-100/70 px-4 py-2 font-medium text-navy-900 transition hover:border-navy-200 hover:bg-white"
                >
                  Manage students
                </Link>
              </div>
            </div>

            {children}
          </div>
        </div>
      </Container>
    </main>
  );
}
