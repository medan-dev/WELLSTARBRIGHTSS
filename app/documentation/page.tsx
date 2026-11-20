import Link from "next/link";
import {
  BookOpen,
  Receipt,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock,
  Phone,
  FileSpreadsheet,
  Server,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsTOC } from "@/components/docs/DocsTOC";
import { DocsCallout } from "@/components/docs/DocsCallout";
import { DocsFeedback } from "@/components/docs/DocsFeedback";

export const metadata = {
  title: "Documentation & Knowledge Base | EDUREXA",
  description:
    "Official documentation for EDUREXA - The intelligent multi-tenant school management ecosystem for Ugandan & African institutions.",
};

export default function DocumentationPage() {
  const quickLinks = [
    {
      title: "Academic & UNEB Engine",
      desc: "CBC competence scoring, automated Division 1-4 calculation, and instant terminal report cards.",
      href: "/documentation/academics",
      icon: BookOpen,
      badge: "CBC Ready",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Finance & Anti-Leakage POS",
      desc: "Thermal receipts, bank statement auto-matching, and sibling ledger consolidation.",
      href: "/documentation/finance",
      icon: Receipt,
      badge: "Core Anti-Leakage",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Free 4-Hour Sandbox Demo",
      desc: "Experience every module live in a private sandbox environment before onboarding.",
      href: "/documentation/sandbox-demo",
      icon: Sparkles,
      badge: "100% Free",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    },
    {
      title: "Direct Portal Slashing Guide",
      desc: "How staff, teachers, bursars, and students access their dedicated workstations via URL slashes.",
      href: "/documentation/portals",
      badge: "Portals",
      icon: Lock,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ];

  const tocItems = [
    { id: "overview", title: "Platform Overview" },
    { id: "quick-start", title: "Popular Modules" },
    { id: "architecture-summary", title: "Multi-Tenant Architecture" },
    { id: "sandbox-invitation", title: "Request Sandbox Demo" },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row">
      {/* Central Content Column */}
      <div className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-4xl mx-auto w-full">
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0b2256]">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Documentation</span>
          <span>/</span>
          <span className="text-[#f26522] font-semibold">Overview</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 pb-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0b2256] text-white">
              EDUREXA Docs
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5 text-slate-400" />
              <span>4 min read</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Updated November 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            EDUREXA Documentation & Knowledge Base
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Welcome to the official technical and operational documentation for <strong>EDUREXA</strong>.
            Whether you are a School Director deploying across multiple campuses, a Bursar seeking to stop fee leakage, or a Director of Studies automating UNEB report cards, these guides provide complete step-by-step instructions.
          </p>
        </div>

        {/* Section 1: Overview */}
        <div id="overview" className="pt-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Platform Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            EDUREXA is built from the ground up to replace fragmented spreadsheets, slow desktop-locked databases, and paper ledgers with a unified, browser-based operating system.
          </p>

          <DocsCallout
            type="info"
            title="Zero Complex Hardware Required"
            message="EDUREXA runs entirely inside modern web browsers on PCs, laptops, and tablets. All database backups, software upgrades, and UNEB curriculum adjustments happen automatically in the cloud with 99.98% uptime."
          />
        </div>

        {/* Section 2: Quick Start Cards (Pure Flexbox Side-by-Side) */}
        <div id="quick-start" className="pt-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Popular Guides & Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select a core module below to explore detailed workflows, configuration parameters, and screenshots:
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex-1 min-w-[280px] p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#0b2256]/30 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${item.color}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {item.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0b2256] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 flex items-center text-xs font-bold text-[#f26522] group-hover:translate-x-1 transition-transform gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="size-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section 3: Architecture Summary */}
        <div id="architecture-summary" className="pt-10 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Enterprise Architecture & Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Every onboarded school operates in a dedicated, cryptographically isolated tenant. Data cannot bleed across institutions, and bursar ledgers feature complete cryptographic audit trails.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex-1 min-w-[220px] p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b2256]">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Isolated Tenants</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Independent tenant databases and daily point-in-time encrypted cloud backups.
              </p>
            </div>

            <div className="flex-1 min-w-[220px] p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b2256]">
                <Lock className="size-4 text-amber-500" />
                <span>Role-Based Access</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Staff only access authorized modules; teachers cannot alter financial ledgers.
              </p>
            </div>

            <div className="flex-1 min-w-[220px] p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0b2256]">
                <Server className="size-4 text-blue-600" />
                <span>Offline POS Resiliency</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Cashier desks continue issuing thermal slips during internet interruptions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Sandbox Demo Invitation */}
        <div id="sandbox-invitation" className="pt-10">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b2256] to-[#081a42] text-white space-y-4 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="size-3 text-emerald-300" />
              <span>Free 4-Hour Sandbox Evaluation</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white">
              Test EDUREXA Freely for 4 Hours Before Onboarding
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              We provide full, unrestricted access to our live staging environment for 4 hours. Test thermal receipt printing, calculate UNEB division aggregates, and explore all administrative controls with zero cost or commitment.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/256758611414?text=Hello%20EDUREXA!%20We%20would%20like%20to%20request%20the%20free%204-hour%20live%20interactive%20sandbox%20demo."
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-[#f26522] hover:bg-[#d95314] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-sm gap-2">
                  <span>Request Instant 4h Sandbox via WhatsApp</span>
                  <ArrowRight className="size-4" />
                </Button>
              </a>

              <Link href="/documentation/sandbox-demo">
                <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs h-10 px-4 rounded-xl">
                  <span>Read Sandbox Guide</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Next / Previous Page Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
          <div />
          <Link
            href="/documentation/architecture"
            className="flex items-center gap-2 text-right group"
          >
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Next Article</div>
              <div className="text-xs font-bold text-slate-800 group-hover:text-[#f26522] transition-colors">
                Multi-Tenant Architecture →
              </div>
            </div>
          </Link>
        </div>

        {/* Page Feedback */}
        <DocsFeedback />
      </div>

      {/* Right Table of Contents (Sticky on Desktop) */}
      <div className="hidden xl:block w-64 shrink-0 px-6 py-8 border-l border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <DocsTOC items={tocItems} />
      </div>
    </div>
  );
}
