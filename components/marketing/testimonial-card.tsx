import { Testimonial } from "@/lib/site-data";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(16,37,61,0.07)] sm:rounded-[32px] sm:p-7">
      <div
        className="flex gap-1 text-sm text-gold-500 sm:text-base"
        aria-label="5 star testimonial"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>{"\u2605"}</span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-ink-600 sm:mt-5 sm:text-base sm:leading-8">
        &quot;{testimonial.quote}&quot;
      </p>
      <div className="mt-5 border-t border-sand-200 pt-4 sm:mt-6 sm:pt-5">
        <p className="text-base font-semibold text-navy-900 sm:text-lg">
          {testimonial.parentName}
        </p>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Parent of {testimonial.childName}, {testimonial.program}
        </p>
      </div>
    </article>
  );
}
