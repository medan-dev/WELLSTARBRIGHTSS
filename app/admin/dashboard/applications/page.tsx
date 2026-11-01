"use client";

import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/Widgets";
import { getApplications, updateApplicationStatus as dbUpdateStatus } from "../../../actions";
import { toast } from "sonner";

type AppStatus = "Approved" | "Pending" | "Rejected";
type AppRow = { id: string; studentName: string; grade: string; previousSchool?: string; date: string; status: AppStatus };

const statusColors: Record<AppStatus, string> = {
  Approved: "bg-emerald-500/15 text-emerald-700",
  Pending: "bg-amber-500/15 text-amber-700",
  Rejected: "bg-red-500/15 text-red-700",
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "All">("All");

  useEffect(() => {
    getApplications().then(setApps);
  }, []);

  const updateStatus = async (id: string, status: AppStatus) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    await dbUpdateStatus(id, status);
    toast.success(`Application marked as ${status}`);
  };

  const visible = apps.filter((a) => {
    const matchQ = `${a.studentName} ${a.id} ${a.grade}`.toLowerCase().includes(q.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchQ && matchStatus;
  });

  return (
    <>
      <PageHeader title="Applications" subtitle="Review and manage formal admission applications" />

      <div className="rounded-2xl bg-card border shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student, ID, class…" className="pl-9" />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="size-4 text-muted-foreground" />
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border bg-secondary/30">
                <th className="px-4 py-3 font-medium">App ID</th>
                <th className="px-4 py-3 font-medium">Student Name</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Previous School</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/40 transition-smooth">
                  <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.studentName}</td>
                  <td className="px-4 py-3">{a.grade}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.previousSchool || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1 justify-end">
                      {a.status !== "Approved" && (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(a.id, "Approved")} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="Approve">
                          <CheckCircle className="size-4" />
                        </Button>
                      )}
                      {a.status !== "Pending" && (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(a.id, "Pending")} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Mark Pending">
                          <Clock className="size-4" />
                        </Button>
                      )}
                      {a.status !== "Rejected" && (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(a.id, "Rejected")} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Reject">
                          <XCircle className="size-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

