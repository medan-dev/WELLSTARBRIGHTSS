"use client";

import { Utensils, Sparkles, Plus, Search, CheckCircle2, Ban, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FinanceMealCardsTabProps {
  mealCards: any[];
  invoices: any[];
  mealSearchQuery: string;
  setMealSearchQuery: (q: string) => void;
  mealFilterPlan: string;
  setMealFilterPlan: (p: string) => void;
  mealFilterStatus: string;
  setMealFilterStatus: (s: string) => void;
  onAutoIssue: () => void;
  onOpenIssueModal: () => void;
  onToggleStatus: (card: any) => void;
}

export function FinanceMealCardsTab({
  mealCards,
  invoices,
  mealSearchQuery,
  setMealSearchQuery,
  mealFilterPlan,
  setMealFilterPlan,
  mealFilterStatus,
  setMealFilterStatus,
  onAutoIssue,
  onOpenIssueModal,
  onToggleStatus,
}: FinanceMealCardsTabProps) {
  const filteredCards = mealCards.filter((c) => {
    const matchesSearch =
      c.cardNumber?.toLowerCase().includes(mealSearchQuery.toLowerCase()) ||
      c.student?.name?.toLowerCase().includes(mealSearchQuery.toLowerCase()) ||
      c.student?.class?.name?.toLowerCase().includes(mealSearchQuery.toLowerCase());
    const matchesPlan = mealFilterPlan === "ALL" || c.planType === mealFilterPlan;
    const matchesStatus = mealFilterStatus === "ALL" || c.status === mealFilterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Banner & Action Bar */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Student Meal Cards Registry
              </h3>
              <p className="text-xs text-muted-foreground">
                Bursar-authorized dining passes, catering fee clearance checks, daily meal quotas, and arrears suspension.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onAutoIssue}
            className="rounded-xl gap-1.5 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Auto-Issue Enrolled
          </Button>
          <Button
            size="sm"
            onClick={onOpenIssueModal}
            className="rounded-xl gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            Issue Dining Pass
          </Button>
        </div>
      </div>

      {/* Quick Financial Telemetry Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="text-xs text-muted-foreground font-semibold">Total Passes Issued</div>
          <div className="text-2xl font-bold font-display text-foreground mt-1">
            {mealCards.length}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across all classes</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="text-xs text-muted-foreground font-semibold">Authorized / Active</div>
          <div className="text-2xl font-bold font-display text-emerald-600 mt-1">
            {mealCards.filter((c) => c.status === "ACTIVE").length}
          </div>
          <div className="text-[11px] text-emerald-600/80 font-medium mt-0.5">Eligible at counter</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="text-xs text-muted-foreground font-semibold">Suspended (Fee Arrears)</div>
          <div className="text-2xl font-bold font-display text-rose-500 mt-1">
            {mealCards.filter((c) => c.status === "SUSPENDED").length}
          </div>
          <div className="text-[11px] text-rose-500/80 font-medium mt-0.5">Dining access blocked</div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="text-xs text-muted-foreground font-semibold">Total Daily Meal Allowance</div>
          <div className="text-2xl font-bold font-display text-amber-600 mt-1 flex items-center gap-1.5">
            <Utensils className="w-5 h-5 text-amber-500" />
            {mealCards.reduce((acc, c) => acc + (c.dailyQuota || 3), 0)} Meals
          </div>
          <div className="text-[11px] text-blue-600/80 font-medium mt-0.5">Daily quota approved</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={mealSearchQuery}
            onChange={(e) => setMealSearchQuery(e.target.value)}
            placeholder="Search by student name, card ID or class..."
            className="pl-9 h-10 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={mealFilterPlan}
            onChange={(e) => setMealFilterPlan(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium"
          >
            <option value="ALL">All Meal Plans</option>
            <option value="BOARDING_FULL">Boarding Full (Breakfast, Lunch, Supper)</option>
            <option value="DAY_LUNCH">Day Scholar Lunch</option>
            <option value="SPECIAL_DIET">Special Diet</option>
            <option value="BURSARY_SUBSIDIZED">Bursary Subsidized</option>
          </select>

          <select
            value={mealFilterStatus}
            onChange={(e) => setMealFilterStatus(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Passes</option>
            <option value="SUSPENDED">Suspended Passes</option>
          </select>
        </div>
      </div>

      {/* Meal Cards Table with Financial Arrears Link */}
      <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Card Identifier</th>
                <th className="p-4">Student & Class</th>
                <th className="p-4">Meal Plan Package</th>
                <th className="p-4">Daily Meal Quota</th>
                <th className="p-4">Bursar Fee Clearance</th>
                <th className="p-4">Dining Status</th>
                <th className="p-4 text-right pr-6">Finance Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mealCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    No meal cards registered yet. Click &ldquo;Auto-Issue Enrolled&rdquo; or &ldquo;Issue Dining Pass&rdquo; to begin.
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => {
                  const studentInvoice = invoices.find((inv) => inv.studentId === card.studentId);
                  const balance = studentInvoice ? studentInvoice.balance : 0;
                  const hasArrears = balance > 0;

                  return (
                    <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {card.cardNumber}
                      </td>
                      <td className="p-4 font-semibold text-foreground">
                        <div>{card.student?.name || "Student"}</div>
                        <div className="text-muted-foreground font-normal text-[11px]">
                          {card.student?.class?.name || "General"}
                        </div>
                        {card.allergies && (
                          <div className="text-[10px] text-rose-500 font-normal">
                            ⚠️ Dietary: {card.allergies}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            card.planType === "SPECIAL_DIET"
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : card.planType === "BOARDING_FULL"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}
                        >
                          {card.planType?.includes("MILK")
                            ? "BURSARY SUBSIDIZED"
                            : card.planType?.replace(/_/g, " ") || "BOARDING FULL"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <Utensils className="w-3.5 h-3.5" />
                          <span>{card.dailyQuota || 3} Meals / Day</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {hasArrears ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 border border-rose-500/30">
                            ⚠️ Arrears: UGX {Number(balance).toLocaleString()}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Fees Cleared
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            card.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-rose-500/10 text-rose-600"
                          }`}
                        >
                          {card.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(card)}
                          className="rounded-xl text-xs h-8"
                        >
                          {card.status === "ACTIVE" ? (
                            <span className="text-rose-500 flex items-center gap-1 font-semibold">
                              <Ban className="w-3.5 h-3.5" /> Suspend
                            </span>
                          ) : (
                            <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                              <Check className="w-3.5 h-3.5" /> Authorize
                            </span>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
