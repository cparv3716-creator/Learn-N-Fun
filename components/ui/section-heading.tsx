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
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral-600 sm:text-sm">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:mt-4 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-ink-600 sm:mt-5 sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  );
}
