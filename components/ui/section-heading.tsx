import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  align?: "left" | "center";
  description: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({
  align = "left",
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-coral-200/70 bg-white/80 px-3 py-2 shadow-[0_10px_24px_rgba(16,37,61,0.06)] backdrop-blur",
          centered && "justify-center",
        )}
      >
        <span className="h-2 w-2 rounded-full bg-coral-500" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-xs">
          {eyebrow}
        </p>
      </div>
      <h2 className="mt-4 text-3xl font-semibold leading-[1.04] text-navy-900 sm:mt-5 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600 sm:mt-5 sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  );
}
