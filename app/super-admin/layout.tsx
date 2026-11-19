import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Command Center | Educational Group SaaS HQ",
  description: "Global multi-tenant governance, cluster capacity management, and school conglomerate onboarding.",
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-indigo-500 selection:text-white">
      {children}
    </div>
  );
}
