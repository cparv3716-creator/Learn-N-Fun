import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalSignupForm } from "@/components/dashboard/portal-signup-form";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { getPortalSession, isPortalAuthConfigured } from "@/server/portal-auth";

export default async function PortalSignupPage() {
  const session = await getPortalSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center py-12 sm:py-20">
      <Container className="max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[32px] bg-[linear-gradient(135deg,#10253d_0%,#1b476f_58%,#336e9b_100%)] px-6 py-8 text-white shadow-[0_26px_70px_rgba(16,37,61,0.18)] sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400 sm:text-sm">
              Parent &amp; student access
            </p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Create your dashboard account
            </h1>
            <p className="mt-4 text-sm leading-7 text-sand-50/85 sm:text-base sm:leading-8">
              Register once, stay signed in across refreshes, and access the
              protected learning dashboard tied to your admissions profile.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Secure cookie-based session handling",
                "Automatic profile linkage from the latest matching demo request",
                "A clean path into the live parent dashboard experience",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3"
                >
                  <p className="text-sm leading-7 text-sand-50/90">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink className="w-full sm:w-auto" href="/">
                Back to website
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/92 p-6 shadow-[0_22px_55px_rgba(16,37,61,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-sm">
              Secure sign-up
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-navy-900 sm:text-4xl">
              Start your family dashboard
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-600 sm:text-base">
              Create a real account with your email and password, then continue
              straight into the dashboard.
            </p>

            <div className="mt-8">
              <PortalSignupForm isConfigured={isPortalAuthConfigured()} />
            </div>

            <p className="mt-6 text-sm text-ink-600">
              Already have an account?{" "}
              <Link className="font-semibold text-navy-900" href="/dashboard/login">
                Sign in here
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
