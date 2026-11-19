import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EDUREXA | Smart School Management Ecosystem",
  description: "Empowering Schools. Simplifying Education. The Complete Digital Ecosystem for Modern Schools.",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {children}
    </div>
  );
}
