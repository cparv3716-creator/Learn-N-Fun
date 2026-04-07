import { ButtonLink } from "@/components/ui/button-link";
import { Program } from "@/lib/site-data";

type ProgramCardProps = {
  program: Program;
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/92 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(16,37,61,0.13)] sm:rounded-[34px] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#efc264_0%,#ef9378_44%,#8ad0bb_100%)]" />
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-coral-200/70 bg-coral-400/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
        <span className="h-2 w-2 rounded-full bg-coral-500" />
        {program.ageRange}
      </div>
      <h3 className="mt-3 text-2xl font-semibold leading-tight text-navy-900 sm:mt-4 sm:text-[1.9rem]">
        {program.name}
      </h3>
      <p className="mt-4 text-sm leading-7 text-ink-600 sm:text-base sm:leading-8">
        {program.description}
      </p>
      <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
        <div className="rounded-[24px] bg-sand-100/72 p-4 transition-colors duration-300 group-hover:bg-sand-100">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-700">
            Duration
          </p>
          <p className="mt-2 text-sm font-semibold text-navy-900">
            {program.duration}
          </p>
        </div>
        <div className="rounded-[24px] bg-sand-100/72 p-4 transition-colors duration-300 group-hover:bg-sand-100">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-700">
            Format
          </p>
          <p className="mt-2 text-sm font-semibold text-navy-900">
            {program.format}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-3 sm:mt-6">
        {program.highlights.map((highlight) => (
          <div
            key={highlight}
            className="flex items-start gap-3 rounded-[22px] bg-navy-50/75 px-4 py-3 transition-colors duration-300 group-hover:bg-navy-50"
          >
            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gold-500" />
            <p className="text-sm leading-6 text-ink-600 sm:leading-7">
              {highlight}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-7 sm:mt-auto sm:pt-8">
        <ButtonLink
          className="w-full sm:w-auto"
          href="/book-demo"
          variant="secondary"
        >
          Book demo for this level
        </ButtonLink>
      </div>
    </article>
  );
}
