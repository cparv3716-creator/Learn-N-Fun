import { ButtonLink } from "@/components/ui/button-link";
import { Program } from "@/lib/site-data";

type ProgramCardProps = {
  program: Program;
};

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] sm:rounded-[34px] sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral-600 sm:text-sm">
        {program.ageRange}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-navy-900 sm:mt-4 sm:text-3xl">
        {program.name}
      </h3>
      <p className="mt-4 text-sm leading-7 text-ink-600 sm:text-base sm:leading-8">
        {program.description}
      </p>
      <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
        <div className="rounded-3xl bg-sand-100/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-navy-700">
            Duration
          </p>
          <p className="mt-2 text-sm font-semibold text-navy-900">
            {program.duration}
          </p>
        </div>
        <div className="rounded-3xl bg-sand-100/70 p-4">
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
          <div key={highlight} className="flex items-start gap-3">
            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gold-500" />
            <p className="text-sm leading-6 text-ink-600 sm:leading-7">{highlight}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 sm:mt-auto sm:pt-8">
        <ButtonLink className="w-full sm:w-auto" href="/book-demo" variant="secondary">
          Book demo for this level
        </ButtonLink>
      </div>
    </article>
  );
}
