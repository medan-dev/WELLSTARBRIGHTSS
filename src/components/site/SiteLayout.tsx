"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SchoolNavbar } from "./SchoolNavbar";
import { SchoolFooter } from "./SchoolFooter";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // If on the school front site or school institutional subpages, render the School Navbar & Footer
  const isSchoolSite =
    pathname?.startsWith("/front-site") ||
    pathname?.startsWith("/school") ||
    pathname?.startsWith("/wellstar") ||
    pathname === "/about" ||
    pathname === "/academics" ||
    pathname === "/admissions" ||
    pathname === "/gallery" ||
    pathname === "/media" ||
    pathname === "/contact" ||
    pathname === "/apply";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative" suppressHydrationWarning>
      {isSchoolSite ? <SchoolNavbar /> : <Navbar />}
      <main className="flex-1" suppressHydrationWarning>{children}</main>
      {isSchoolSite ? <SchoolFooter /> : <Footer />}
      <WhatsAppButton />
    </div>
  );
}
