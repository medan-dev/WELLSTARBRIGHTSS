import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0b2256",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bursar Financial Workstation & POS | Wellstar Bright Secondary School",
  description:
    "Official Bursar Financial Workstation, Point of Sale, Student Fee Collections, Thermal Receipt Printing, and Financial Ledger Management.",
};

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {children}
    </div>
  );
}
