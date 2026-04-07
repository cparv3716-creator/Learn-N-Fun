import { Container } from "@/components/ui/container";

export default function DashboardLoading() {
  return (
    <main className="py-8 sm:py-12">
      <Container>
        <div className="animate-pulse space-y-5">
          <div className="h-44 rounded-[36px] bg-white/80 shadow-[0_20px_55px_rgba(16,37,61,0.08)]" />
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="h-40 rounded-[34px] bg-white/80 shadow-[0_20px_55px_rgba(16,37,61,0.08)]" />
            <div className="h-40 rounded-[34px] bg-white/80 shadow-[0_20px_55px_rgba(16,37,61,0.08)]" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="h-72 rounded-[34px] bg-white/80 shadow-[0_20px_55px_rgba(16,37,61,0.08)]" />
            <div className="h-72 rounded-[34px] bg-white/80 shadow-[0_20px_55px_rgba(16,37,61,0.08)]" />
          </div>
        </div>
      </Container>
    </main>
  );
}
