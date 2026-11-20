"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MessageCircle, HelpCircle } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
}

interface DocsTOCProps {
  items: TOCItem[];
}

export function DocsTOC({ items }: DocsTOCProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -70% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full space-y-6 text-xs">
      <div className="space-y-3">
        <div className="font-extrabold uppercase tracking-wider text-[11px] text-slate-400">
          On this page
        </div>
        <nav className="space-y-1 border-l border-slate-200 pl-3">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block py-1 text-xs transition-colors ${
                  isActive
                    ? "text-[#f26522] font-bold -ml-[13px] pl-3 border-l-2 border-[#f26522]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="font-extrabold uppercase tracking-wider text-[11px] text-slate-400">
          Assistance & Sandbox
        </div>
        <div className="space-y-2">
          <a
            href="https://wa.me/256758611414?text=Hello%20EDUREXA!%20We%20would%20like%20to%20request%20the%20free%204-hour%20live%20interactive%20sandbox%20demo."
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-slate-600 hover:text-[#0b2256] transition-colors group"
          >
            <span>Request 4h Sandbox</span>
            <ArrowUpRight className="size-3 text-slate-400 group-hover:text-[#0b2256]" />
          </a>
          <a
            href="https://wa.me/256758611414"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-slate-600 hover:text-emerald-600 transition-colors group"
          >
            <span>WhatsApp Implementation Desk</span>
            <MessageCircle className="size-3 text-slate-400 group-hover:text-emerald-600" />
          </a>
        </div>
      </div>
    </div>
  );
}
