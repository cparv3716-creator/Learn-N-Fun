import { AdminPanel } from "@/components/admin/admin-ui";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <section className="h-44 animate-pulse rounded-[32px] border border-white/80 bg-white/70" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-[26px] border border-white/80 bg-white/70"
          />
        ))}
      </div>
      <AdminPanel title="Loading data...">
        <div className="h-56 animate-pulse rounded-[24px] bg-sand-100/70" />
      </AdminPanel>
    </div>
  );
}
