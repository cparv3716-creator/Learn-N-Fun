import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { FloatingWhatsAppCTA } from "@/components/ui/floating-whatsapp-cta";
import { getWhatsAppLink } from "@/lib/whatsapp";
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
  const whatsAppHref = getWhatsAppLink(
    "Hi, I'm interested in Learn N Fun Abacus classes",
  );

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col antialiased">
        {children}
        <FloatingWhatsAppCTA href={whatsAppHref} />
        <Analytics />
      </body>
    </html>
  );
}
