"use client";

import dynamic from "next/dynamic";

const FinanceWorkstationView = dynamic(
  () => import("@/components/finance/FinanceWorkstationView"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] flex flex-col items-center justify-center gap-3 text-slate-900 dark:text-slate-100 font-sans">
        <div className="size-10 rounded-full border-3 border-amber-500 border-t-transparent animate-spin" />
        <div className="text-xs font-mono tracking-widest text-slate-500 uppercase">
          Initializing Bursar Workstation...
        </div>
      </div>
    ),
  }
);

export default function AdminFinancePage() {
  return <FinanceWorkstationView />;
}
