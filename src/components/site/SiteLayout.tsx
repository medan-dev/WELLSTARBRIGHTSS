import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative" suppressHydrationWarning>
      <Navbar />
      <main className="flex-1" suppressHydrationWarning>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
