import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
      <Navbar />
      <main className="flex-1" suppressHydrationWarning>{children}</main>
      <Footer />
    </div>
  );
}
