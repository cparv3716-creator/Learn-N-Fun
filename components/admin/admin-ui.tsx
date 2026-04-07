import { cn } from "@/lib/utils";

type Tone =
  | "blue"
  | "coral"
  | "gold"
  | "gray"
  | "green"
  | "navy"
  | "red";

const toneClasses: Record<Tone, string> = {
  blue: "border-navy-200 bg-navy-100/80 text-navy-900",
  coral: "border-coral-400/25 bg-coral-400/10 text-coral-600",
  gold: "border-gold-400/35 bg-gold-400/15 text-navy-900",
  gray: "border-sand-200 bg-sand-100 text-ink-700",
  green: "border-mint-500/25 bg-mint-500/10 text-mint-500",
  navy: "border-navy-900/15 bg-navy-900 text-white",
  red: "border-coral-400/30 bg-coral-400/10 text-coral-700",
};

export function formatAdminDate(date: Date | null | undefined) {
  if (!date) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatAdminDateOnly(date: Date | null | undefined) {
  if (!date) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function AdminPageHeader({
  action,
  description,
  eyebrow,
  title,
}: {
  action?: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="rounded-[32px] border border-white/80 bg-white/85 px-5 py-6 shadow-[0_24px_60px_rgba(16,37,61,0.06)] sm:px-6 sm:py-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-navy-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-600 sm:text-base sm:leading-8">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}

export function AdminStatCard({
  emphasis = false,
  label,
  value,
}: {
  emphasis?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[26px] border px-5 py-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)]",
        emphasis
          ? "border-gold-400/35 bg-gold-400/10"
          : "border-white/80 bg-white/90",
      )}
    >
      <p className="text-3xl font-semibold text-navy-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-ink-600">{label}</p>
    </div>
  );
}

export function AdminPanel({
  children,
  className,
  description,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_50px_rgba(16,37,61,0.06)] sm:p-6",
        className,
      )}
    >
      <div className="border-b border-sand-200/80 pb-4">
        <h2 className="text-2xl font-semibold text-navy-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-ink-600">{description}</p>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function AdminEmptyState({
  message,
  title,
}: {
  message: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-navy-200 bg-navy-50/55 px-5 py-5">
      <p className="text-base font-semibold text-navy-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink-600">{message}</p>
    </div>
  );
}

export function AdminStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}

export function AdminMetaList({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[20px] bg-sand-100/70 px-4 py-3 shadow-[inset_0_0_0_1px_rgba(223,214,197,0.7)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            {item.label}
          </p>
          <div className="mt-1 break-words text-sm leading-6 text-navy-900">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
