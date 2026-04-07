"use client";

import { useFormStatus } from "react-dom";

export function PaymentButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      disabled={pending}
    >
      {pending ? "Processing payment..." : "Pay now"}
    </button>
  );
}
