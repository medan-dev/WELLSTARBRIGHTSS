"use client";

import { useEffect, useState } from "react";
import {
  Utensils,
  Milk,
  Soup,
  Coffee,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/admin/Widgets";
import { getMealCardByStudent } from "../../../admin/meal-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function StudentMealCardPage() {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");

  const loadCard = async () => {
    const studentId = sessionStorage.getItem("ns_student_id");
    setStudentName(sessionStorage.getItem("ns_student_name") || "Student");

    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMealCardByStudent(studentId);
      setCard(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load your meal card details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-2" />
        <p>Loading digital meal pass...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="My Digital Meal Pass"
        subtitle="Present your digital pass or barcode at the school dining hall and milk ration counters."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Digital Card Pass */}
        <div className="md:col-span-1">
          {card ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white shadow-xl relative overflow-hidden space-y-6">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl"></div>

              {/* School Crest & Header */}
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div>
                  <div className="text-[10px] tracking-wider uppercase font-bold text-amber-200">
                    Wellstar Bright School
                  </div>
                  <div className="text-sm font-extrabold tracking-tight">DINING & MEAL PASS</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xs">
                  WB
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-1">
                <div className="text-xs text-amber-100 font-medium">Student Name</div>
                <div className="text-xl font-bold font-display">{card.student?.name || studentName}</div>
                <div className="text-xs text-amber-200">
                  {card.student?.class?.name || "Senior Student"}
                </div>
              </div>

              {/* Card Identifier & Plan */}
              <div className="p-3.5 rounded-2xl bg-black/15 backdrop-blur-sm border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-amber-200">Card Identifier:</span>
                  <span className="font-mono font-bold text-white text-sm">{card.cardNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200">Meal Plan:</span>
                  <span className="font-bold text-white">{card.planType.replace("_", " ")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200">Daily Milk Quota:</span>
                  <span className="font-bold text-amber-200 flex items-center gap-1">
                    <Milk className="w-3.5 h-3.5" /> {card.milkQuota || 1} Can / Day
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      card.status === "ACTIVE"
                        ? "bg-emerald-400 text-emerald-950"
                        : "bg-rose-400 text-rose-950"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="text-center pt-2">
                <div className="h-9 bg-white/90 rounded-xl flex items-center justify-center font-mono text-black font-bold text-xs tracking-widest">
                  ||||| |||| || ||||||| |||| ||||
                </div>
                <div className="text-[10px] text-amber-200 mt-1.5 font-mono">{card.cardNumber}</div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">No Meal Card Assigned</h3>
              <p className="text-xs text-muted-foreground">
                Your digital meal pass is currently being generated by the school bursar and kitchen administration.
              </p>
            </div>
          )}
        </div>

        {/* Benefits & History */}
        <div className="md:col-span-2 space-y-6">
          {/* Plan Entitlements */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Your Daily Dining Entitlements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-blue-600">
                  <div className="font-bold text-xs">Morning Session</div>
                  <Milk className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm">Breakfast & Milk</div>
                <p className="text-xs text-muted-foreground">
                  Includes warm milk ration/tea & wholesome baked breakfast.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-amber-600">
                  <div className="font-bold text-xs">Afternoon Session</div>
                  <Soup className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm">Full Lunch Service</div>
                <p className="text-xs text-muted-foreground">
                  Nutritious hot meal served daily from 12:30 PM to 02:00 PM.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-emerald-600">
                  <div className="font-bold text-xs">Evening Session</div>
                  <Coffee className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm">Supper & Dinner</div>
                <p className="text-xs text-muted-foreground">
                  Evening dining session for residential and boarding scholars.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Dining Logs */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Your Recent Dining Attendance
              </h3>
              <span className="text-xs text-muted-foreground">Verified by Kitchen Counter</span>
            </div>

            <div className="space-y-2.5">
              {!card || !card.logs || card.logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No dining scans recorded for this term yet.
                </div>
              ) : (
                card.logs.map((log: any) => {
                  const date = new Date(log.servedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const time = new Date(log.servedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                          {log.mealSession === "BREAKFAST_MILK" ? (
                            <Milk className="w-4 h-4" />
                          ) : log.mealSession === "LUNCH" ? (
                            <Soup className="w-4 h-4" />
                          ) : (
                            <Coffee className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm">
                            {log.mealSession === "BREAKFAST_MILK"
                              ? "Breakfast & Milk Rations"
                              : log.mealSession === "LUNCH"
                              ? "Lunch Service"
                              : "Supper / Dinner"}
                          </div>
                          <div className="text-muted-foreground">
                            {date} • Served by {log.servedBy}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-muted-foreground">{time}</div>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" /> Served
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
