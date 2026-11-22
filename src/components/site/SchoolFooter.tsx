"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import { DynamicYear } from "./DynamicYear";

export function SchoolFooter() {
  const { brand } = useSchoolBrand();

  return (
    <footer className="bg-[#081a42] text-white border-t border-white/10 font-sans">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: School Identity & Accreditations */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-none bg-white text-[#0b2256] font-black text-sm grid place-items-center shrink-0 border border-amber-400">
              {brand.badgeUrl ? (
                <img
                  src={brand.badgeUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif tracking-widest">{brand.badgeInitials || "SC"}</span>
              )}
            </div>
            <div>
              <div className="font-serif font-bold text-sm tracking-tight uppercase leading-tight">
                {brand.name}
              </div>
              <div className="text-[10px] text-amber-300 font-mono">
                UNEB CENTER #{brand.unebCenterNumber}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            &ldquo;{brand.motto}&rdquo; — Dedicated to academic rigor, holistic integrity, and transformative character development from Senior 1 to Senior 6.
          </p>

          <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-300">
            <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
            <span>Ministry of Education & Sports Certified Center</span>
          </div>
        </div>

        {/* Column 2: Academics & UNEB Curriculum */}
        <div className="space-y-3 text-xs">
          <div className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Academics & UNEB
          </div>
          <ul className="space-y-2 text-slate-300">
            <li>
              <Link href="/academics" className="hover:text-amber-300 transition-colors">
                Lower Secondary (S.1–S.2 CBC Curriculum)
              </Link>
            </li>
            <li>
              <Link href="/academics" className="hover:text-amber-300 transition-colors">
                Upper Secondary (S.3–S.4 UCE Candidates)
              </Link>
            </li>
            <li>
              <Link href="/academics" className="hover:text-amber-300 transition-colors">
                Advanced Level (S.5–S.6 UACE Combinations)
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-amber-300 transition-colors">
                STEM Science Laboratories & ICT Tech Hub
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-amber-300 transition-colors">
                Teaching Faculty & Department Heads
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Admissions & Boarding Life */}
        <div className="space-y-3 text-xs">
          <div className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Admissions & Student Life
          </div>
          <ul className="space-y-2 text-slate-300">
            <li>
              <Link href="/admissions" className="hover:text-amber-300 transition-colors">
                2026 Academic Year Enrollment Procedure
              </Link>
            </li>
            <li>
              <Link href="/admissions" className="hover:text-amber-300 transition-colors">
                Fee Guidelines & Installment Structures
              </Link>
            </li>
            <li>
              <Link href="/admissions" className="hover:text-amber-300 transition-colors">
                Merit Bursaries & Academic Scholarships
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-amber-300 transition-colors">
                Boarding Section & Dining Hall Nutrition
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-300 transition-colors">
                Book a Guided Campus Visit
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Campus Inquiries & Visiting Hours */}
        <div className="space-y-3 text-xs">
          <div className="font-bold text-sm text-white uppercase tracking-wider border-b border-white/10 pb-2">
            Campus Administration
          </div>
          <div className="space-y-2 text-slate-300">
            <div className="flex items-start gap-2">
              <MapPin className="size-4 text-[#f26522] shrink-0 mt-0.5" />
              <span>{brand.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-[#f26522] shrink-0" />
              <span>Admissions: {brand.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-[#f26522] shrink-0" />
              <span>{brand.email}</span>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-white/10">
              <Clock className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div>Mon – Fri: 8:00 AM – 5:00 PM</div>
                <div>Visiting Day: Every First Sunday</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Attribution Bar */}
      <div className="border-t border-white/10 bg-[#05112c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © <DynamicYear /> {brand.name}. All institutional rights reserved.
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/demo" className="text-slate-300 hover:text-white transition-colors">
              Administrative Console
            </Link>
            <span>•</span>
            <Link href="/teacher" className="text-slate-300 hover:text-white transition-colors">
              Staff Gradebook
            </Link>
            <span>•</span>
            <Link href="/student" className="text-slate-300 hover:text-white transition-colors">
              Student & Parent Portal
            </Link>
          </div>

          <div className="text-[11px] text-slate-500">
            Institutional OS by EDUREXA Systems
          </div>
        </div>
      </div>
    </footer>
  );
}
