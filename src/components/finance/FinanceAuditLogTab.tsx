"use client";

import { Clock } from "lucide-react";

interface FinanceAuditLogTabProps {
  auditLogs: any[];
}

export function FinanceAuditLogTab({ auditLogs }: FinanceAuditLogTabProps) {
  return (
    <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4 animate-in fade-in duration-200">
      <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
        <Clock className="w-5 h-5 text-primary" />
        Immutable Financial Audit Trail
      </h3>
      <p className="text-xs text-muted-foreground">
        Cryptographically timestamped log of all fee payments, offline syncs, vouchers, and approvals.
      </p>

      <div className="divide-y divide-border/40">
        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No audit logs recorded yet.
          </div>
        ) : (
          auditLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-mono">
                    {log.workstationId || "SYSTEM"}
                  </span>
                </div>
                <div className="text-muted-foreground mt-0.5">
                  By {log.actorName} ({log.actorRole || "Staff"}) • {typeof log.details === "object" ? JSON.stringify(log.details) : log.details}
                </div>
              </div>
              <div className="text-muted-foreground whitespace-nowrap font-mono text-[11px]">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
