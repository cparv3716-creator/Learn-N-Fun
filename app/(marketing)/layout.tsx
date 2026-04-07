import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdmissionsAssistantWidget } from "@/components/ui/admissions-assistant-widget";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsAppHref = getWhatsAppLink(
    "Hi, I'm interested in Learn N Fun Abacus classes",
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <AdmissionsAssistantWidget whatsAppHref={whatsAppHref} />
      <SiteFooter />
    </>
  );
}
