"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { GraduationCap, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { DynamicYear } from "./DynamicYear";
import { useSchoolBrand } from "@/context/SchoolBrandContext";

export function SchoolFooter() {
  const { brand } = useSchoolBrand();
  const schoolName = brand?.name || "Wellstar Bright Secondary School";
  const shortName = brand?.name ? (brand.name.includes("Secondary") ? brand.name.replace("Secondary School", "").trim() : brand.name) : "Wellstar Bright";

  return (
    <footer className="relative mt-12 sm:mt-16 border-t border-border bg-secondary/20">
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-12">
        <div className="col-span-2 space-y-4">
          <Link href="/front-site" className="flex items-center gap-2">
            <div className="relative size-8 sm:size-10 shrink-0">
              <Image 
                src={brand?.badgeUrl || logo} 
                alt={`${schoolName} Logo`} 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain" 
              />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl">
              {shortName}
            </span>
          </Link>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            {brand?.motto 
              ? `${brand.motto}. A dedicated secondary school preparing students for a life of purpose, character, and service.`
              : "Shaping the next generation through curiosity, character, and creativity. A Seventh-day Adventist secondary school preparing students for a life of purpose and service."}
          </p>
          <div className="flex gap-2 pt-2">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="size-8 sm:size-10 rounded-lg border border-border grid place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
                aria-label="Social link"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-4">Explore</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground transition-smooth">About</Link></li>
            <li><Link href="/academics" className="hover:text-foreground transition-smooth">Academics</Link></li>
            <li><Link href="/admissions" className="hover:text-foreground transition-smooth">Admissions</Link></li>
            <li><Link href="/media" className="hover:text-foreground transition-smooth">Media</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-4">Visit Us</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
            <li className="flex gap-2 items-start"><MapPin className="size-3.5 sm:size-4 mt-0.5 text-primary shrink-0" /> <span>{brand?.location || "off Kayunga Road, Kabembe, Mukono District, Uganda"}</span></li>
            <li className="flex gap-2 items-start"><Phone className="size-3.5 sm:size-4 mt-0.5 text-primary shrink-0" /> <span>{brand?.phone || "+256 772 589 430"}</span></li>
            <li className="flex gap-2 items-start"><Mail className="size-3.5 sm:size-4 mt-0.5 text-primary shrink-0" /> <span className="break-all">{brand?.email || "info@wellstarbright.sc.ug"}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          <p suppressHydrationWarning>© <DynamicYear /> {schoolName}. All rights reserved.</p>
          <p>
            Developed professionally by{' '}
            <a 
              href="https://mctech-hubsystems.kesug.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-primary hover:text-primary/80 transition-smooth"
            >
              Mctech-hub Systems
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
