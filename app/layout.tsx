import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Learn 'N' Fun Abacus",
    template: "%s | Learn 'N' Fun Abacus",
  },
  description:
    "Professional abacus training for children with joyful learning, structured programs, and confident skill-building.",
  keywords: [
    "abacus classes",
    "kids mental math",
    "child development",
    "abacus franchise",
    "after school program",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
