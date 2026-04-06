import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getAdminSession, isAdminAuthConfigured } from "@/server/admin-auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="flex flex-1 items-center py-12 sm:py-20">
      <Container className="max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-navy-900 px-6 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
              Admin access
            </p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Manage demo requests and contact enquiries in one place.
            </h1>
            <p className="mt-4 text-sm leading-7 text-sand-50/85 sm:text-base sm:leading-8">
              Sign in with your admin credentials to review submissions, update
              lead status, and keep follow-up work organized.
            </p>
            <div className="mt-8">
              <ButtonLink className="w-full sm:w-auto" href="/">
                Back to website
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_22px_55px_rgba(16,37,61,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-sm">
              Secure sign-in
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:text-4xl">
              Admin dashboard login
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-600 sm:text-base">
              Use the credentials configured in your environment variables.
            </p>

            <div className="mt-8">
              <AdminLoginForm isConfigured={isAdminAuthConfigured()} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
