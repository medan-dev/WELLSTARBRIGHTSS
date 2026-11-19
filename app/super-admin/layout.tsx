import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Console | Enterprise Multi-Tenant Governance",
  description: "Enterprise SaaS administration, multi-school tenant management, and campus quota governance.",
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
