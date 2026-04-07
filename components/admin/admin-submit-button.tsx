"use client";

import { useFormStatus } from "react-dom";
import { buttonClassName } from "@/components/ui/button-link";

type AdminSubmitButtonProps = {
  className?: string;
  idleLabel: string;
  pendingLabel: string;
};

export function AdminSubmitButton({
  className,
  idleLabel,
  pendingLabel,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={buttonClassName(
        "primary",
        `w-full cursor-pointer border-0 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`,
      )}
      disabled={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
