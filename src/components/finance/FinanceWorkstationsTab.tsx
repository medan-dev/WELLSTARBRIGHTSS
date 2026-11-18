"use client";

import { ShieldCheck, Unlock, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinanceWorkstationsTabProps {
  workstations: any[];
  onToggleLock: (machineId: string, currentStatus: boolean) => Promise<void>;
}

export function FinanceWorkstationsTab({
  workstations,
  onToggleLock,
}: FinanceWorkstationsTabProps) {
  return (
    <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Workstation Supervision & Remote Lockout
          </h3>
          <p className="text-xs text-muted-foreground">
            Audit and monitor all authorized desktop bursar PC clients with instant kill-switch locking
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workstations.map((w) => (
          <div
            key={w.id}
            className={`p-5 rounded-2xl border transition-all ${
              w.isBlocked
                ? "bg-rose-500/10 border-rose-500/40"
                : "bg-muted/30 border-border/80"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{w.machineName}</span>
                  {w.isBlocked ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500">
                      SUSPENDED
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">
                  Machine ID: {w.machineId}
                </div>
              </div>

              <Button
                size="sm"
                variant={w.isBlocked ? "default" : "destructive"}
                onClick={() => onToggleLock(w.machineId, w.isBlocked)}
                className="text-xs h-8 rounded-xl font-bold"
              >
                {w.isBlocked ? <Unlock className="w-3.5 h-3.5 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}
                {w.isBlocked ? "Unlock Device" : "Remote Lockout"}
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Cashier: <strong className="text-foreground">{w.assignedCashier}</strong></div>
              <div>Client: <strong className="text-foreground">v{w.clientVersion || "1.0.0"}</strong></div>
              <div>Last Sync: {w.lastSyncAt ? new Date(w.lastSyncAt).toLocaleString() : "Never"}</div>
              <div>IP: {w.lastIpAddress || "Local Workstation"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
