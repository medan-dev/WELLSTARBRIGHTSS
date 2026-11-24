import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bursar Dashboard & Financial Workstation | Wellstar Bright Secondary School",
  description:
    "Full-featured bursar dashboard for real-time fee tracking, collections, receipts, petty cash, payroll, and fiscal audits.",
};

export default function FinanceDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full h-full flex flex-col">
      {children}
    </div>
  );
}
