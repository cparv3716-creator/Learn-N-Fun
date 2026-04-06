import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <span className="inline-flex rounded-full bg-gold-400/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-navy-700">
          Page not found
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-navy-900 sm:text-5xl">
          Let&apos;s guide you back to the main classroom.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink-600">
          The page you were looking for is not available right now, but the rest
          of the Learn &apos;N&apos; Fun experience is ready for you.
        </p>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/">Return home</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
