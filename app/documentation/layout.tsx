"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { X } from "lucide-react";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Extract active slug from pathname e.g. /documentation/academics -> academics
  const parts = pathname.split("/").filter(Boolean);
  const activeSlug = parts.length > 1 ? parts[1] : "introduction";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Top Docs Header */}
      <DocsHeader
        onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        mobileMenuOpen={mobileSidebarOpen}
      />

      {/* Main Documentation Frame */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* Desktop Left Sidebar (Sticky) */}
        <div className="hidden lg:block w-72 shrink-0 border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <DocsSidebar activeSlug={activeSlug} />
        </div>

        {/* Mobile Left Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Documentation Topics
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DocsSidebar
                  activeSlug={activeSlug}
                  onLinkClick={() => setMobileSidebarOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Content & Dynamic Right TOC Area */}
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
