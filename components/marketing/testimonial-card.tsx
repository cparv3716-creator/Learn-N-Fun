import { Testimonial } from "@/lib/site-data";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[30px] border border-white/80 bg-white/92 p-5 shadow-[0_20px_55px_rgba(16,37,61,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(16,37,61,0.12)] sm:rounded-[34px] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#8ad0bb_0%,#efc264_48%,#ef9378_100%)]" />
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500 sm:text-xs">
          Parent story
        </span>
        <div
          className="flex gap-1 text-sm text-gold-500 sm:text-base"
          aria-label="5 star testimonial"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>{"\u2605"}</span>
          ))}
        </div>
      </div>
      <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-2xl font-semibold text-navy-700 shadow-[inset_0_0_0_1px_rgba(189,209,234,0.5)] transition-transform duration-300 group-hover:scale-105">
        &quot;
      </div>
      <p className="mt-4 text-sm leading-6 text-ink-600 sm:mt-5 sm:text-base sm:leading-8">
        &quot;{testimonial.quote}&quot;
      </p>
      <div className="mt-5 border-t border-sand-200 pt-4 sm:mt-6 sm:pt-5">
        <p className="text-base font-semibold text-navy-900 sm:text-[1.05rem]">
          {testimonial.parentName}
        </p>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Parent of {testimonial.childName}, {testimonial.program}
        </p>
      </div>
    </article>
  );
}
