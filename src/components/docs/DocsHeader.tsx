"use client";

import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Search, Phone, ExternalLink, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DocsHeaderProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function DocsHeader({ onMobileMenuToggle, mobileMenuOpen }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Docs Tag */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation sidebar"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2">
            <Image
              src={edurexaHorizontal}
              alt="EDUREXA Logo"
              className="h-8 sm:h-9 w-auto object-contain"
              priority
            />
          </Link>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#0b2256]/10 text-[#0b2256] border border-[#0b2256]/20">
            Docs
          </span>
        </div>

        {/* Center: Search Indicator / Quick Jump (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="w-full relative">
            <div className="flex items-center w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs gap-2">
              <Search className="size-3.5 text-slate-400" />
              <span>Search documentation, UNEB guides & POS...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#0b2256] transition-colors"
          >
            Main Website
          </Link>

          <a
            href="https://wa.me/256758611414"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Support: +256 758 611 414</span>
          </a>

          <a
            href="https://wa.me/256758611414?text=Hello%20EDUREXA!%20We%20would%20like%20to%20request%20the%20free%204-hour%20live%20interactive%20sandbox%20demo."
            target="_blank"
            rel="noreferrer"
          >
            <Button
              size="sm"
              className="bg-[#f26522] hover:bg-[#d95314] text-white rounded-lg text-xs font-bold px-3.5 h-8.5 shadow-sm gap-1.5"
            >
              <span>Try 4h Demo</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
