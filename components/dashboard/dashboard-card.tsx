import { cn } from "@/lib/utils";

type DashboardCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function DashboardCard({
  children,
  className,
  title,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "rounded-[30px] border border-white/80 bg-white/92 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] sm:rounded-[34px] sm:p-6",
        className,
      )}
    >
      {title ? (
        <h2 className="text-lg font-semibold text-navy-900 sm:text-[1.35rem]">
          {title}
        </h2>
      ) : null}
      {title ? <div className="mt-4">{children}</div> : children}
    </section>
  );
}
