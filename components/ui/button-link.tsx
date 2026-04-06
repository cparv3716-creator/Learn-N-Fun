import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-900 text-white shadow-[0_18px_40px_rgba(16,37,61,0.14)] hover:bg-navy-700",
  secondary:
    "border border-navy-200 bg-white/90 text-navy-900 hover:border-navy-300 hover:bg-white",
  ghost: "bg-transparent text-navy-900 hover:bg-white/70",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 sm:px-6 sm:py-3.5",
    variantClasses[variant],
    className,
  );
}

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClassName(variant, className)}>
      {children}
    </Link>
  );
}
