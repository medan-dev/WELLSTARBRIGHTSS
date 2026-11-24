"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utensils, X } from "lucide-react";

interface IssueMealCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: any[];
  onSubmit: (data: {
    studentId: string;
    planType: string;
    dailyQuota: number;
    allergies: string;
  }) => Promise<void>;
}

export function IssueMealCardModal({
  isOpen,
  onClose,
  invoices,
  onSubmit,
}: IssueMealCardModalProps) {
  const [studentId, setStudentId] = useState("");
  const [planType, setPlanType] = useState("BOARDING_FULL");
  const [dailyQuota, setDailyQuota] = useState(3);
  const [allergies, setAllergies] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    setSubmitting(true);
    try {
      await onSubmit({
        studentId,
        planType,
        dailyQuota: Number(dailyQuota),
        allergies,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-500" />
            Issue Student Dining Pass
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-sm"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Authorize dining hall access, catering package, and daily meal allowances.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Select Invoiced Student *
            </label>
            <select
              required
              className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">-- Choose student from billing records --</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.studentId}>
                  {inv.student?.name} ({inv.student?.class?.name || "General"}) —{" "}
                  {inv.balance > 0 ? `Arrears: UGX ${Number(inv.balance).toLocaleString()}` : "Fees Paid"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Meal Plan Allocation *
            </label>
            <select
              className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <option value="BOARDING_FULL">Boarding Full (Breakfast, Lunch, Supper)</option>
              <option value="DAY_LUNCH">Day Scholar Lunch Only</option>
              <option value="SPECIAL_DIET">Special Dietary Meal Pass</option>
              <option value="BURSARY_SUBSIDIZED">Bursary Subsidized Meal Pass</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Daily Meal Quota (Meals / Day)
            </label>
            <Input
              type="number"
              min="1"
              max="5"
              value={dailyQuota}
              onChange={(e) => setDailyQuota(Number(e.target.value))}
              className="rounded-xl h-11"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Allergies / Special Dietary Requirements
            </label>
            <Input
              placeholder="e.g. Lactose intolerant, vegetarian, peanut allergy"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="rounded-xl h-11"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
            >
              {submitting ? "Issuing..." : "Issue Meal Pass"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
