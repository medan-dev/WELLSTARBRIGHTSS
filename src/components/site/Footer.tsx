import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { DynamicYear } from "./DynamicYear";

export function Footer() {
  return (
    <footer className="relative mt-12 sm:mt-16 border-t border-border bg-secondary/20">
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-12">
        <div className="col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src={edurexaHorizontal} alt="EDUREXA Logo" className="h-8 sm:h-9 w-auto object-contain" />
          </Link>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            The complete operating system for modern institutions. Enterprise multi-campus governance, real-time fiscal telemetry, and automated academic grading.
          </p>
          <div className="flex gap-2 pt-2">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="size-8 sm:size-10 rounded-none border border-border grid place-items-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                aria-label="Social link"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-4">Solutions</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
            <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
            <li><Link href="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="font-display font-semibold text-sm sm:text-base mb-3 sm:mb-4">Contact Sales</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
            <li className="flex gap-2 items-start"><MapPin className="size-3.5 sm:size-4 mt-0.5 text-primary shrink-0" /> <span>Plot 14 Lumumba Avenue,<br/>Kampala, Uganda</span></li>
            <li className="flex gap-2 items-start"><Phone className="size-3.5 sm:size-4 mt-0.5 text-primary shrink-0" /> <span>+256 758 611 414</span></li>
            <li className="flex gap-2 items-start"><Mail className="size-3.5 sm:size-4 mt-0.5 text-primary shrink-0" /> <span className="break-all">sales@edurexa.com</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          <p suppressHydrationWarning>© <DynamicYear /> EDUREXA Enterprise Platform. All rights reserved.</p>
          <p>
            Official Enterprise Delivery by{' '}
            <a 
              href="https://edurexa.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              EDUREXA Systems
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
