"use client";

import Link from "next/link";
import { useState } from "react";
import { DOC_CATEGORIES } from "@/lib/docs-data";
import { Search, BookOpen, Layers, Lock, Cpu, MessageSquare, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  activeSlug: string;
  onLinkClick?: () => void;
}

export function DocsSidebar({ activeSlug, onLinkClick }: DocsSidebarProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredCategories = DOC_CATEGORIES.map((category) => {
    const matchingItems = category.items.filter(
      (item) =>
        item.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        category.title.toLowerCase().includes(filterQuery.toLowerCase())
    );
    return {
      ...category,
      items: matchingItems,
    };
  }).filter((category) => category.items.length > 0);

  return (
    <aside className="w-full flex flex-col h-full bg-white text-slate-800">
      {/* Search Input Filter */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter documentation..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0b2256] focus:border-[#0b2256] transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {cat.title}
            </div>

            <div className="space-y-0.5">
              {cat.items.map((item) => {
                const isActive = activeSlug === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/documentation/${item.slug}`}
                    onClick={onLinkClick}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-[#0b2256] text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <span className="truncate">{item.title}</span>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight",
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor || "bg-slate-100 text-slate-600"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {!isActive && (
                        <ChevronRight className="size-3 text-slate-300 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Assistance Card */}
      <div className="p-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Implementation Support</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Need guidance configuring UNEB grading or POS printers?
          </p>
          <a
            href="https://wa.me/256758611414"
            target="_blank"
            rel="noreferrer"
            className="block text-center py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
          >
            Chat with Engineer (+256 758 611 414)
          </a>
        </div>
      </div>
    </aside>
  );
}
