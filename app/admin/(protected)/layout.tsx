import { AdminLayoutShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/server/admin-auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminLayoutShell username={session.username}>{children}</AdminLayoutShell>;
}
