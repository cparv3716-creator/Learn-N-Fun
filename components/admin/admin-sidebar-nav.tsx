"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/demo-bookings", label: "Demo bookings" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/enrollments", label: "Enrollments" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/progress", label: "Progress" },
] as const;

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex min-w-max items-center rounded-full border px-4 py-2.5 text-sm font-semibold transition lg:rounded-[18px] lg:px-4 lg:py-3",
              isActive
                ? "border-navy-900 bg-navy-900 text-white shadow-[0_18px_40px_rgba(16,37,61,0.16)]"
                : "border-navy-100 bg-white/88 text-ink-700 hover:border-navy-300 hover:bg-white hover:text-navy-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
