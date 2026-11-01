"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Utensils,
  Coffee,
  Soup,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Printer,
  Sparkles,
  CreditCard,
  Plus,
  RefreshCw,
  Users,
  ShieldCheck,
  Ban,
  Clock,
  Award,
  Filter,
  Check,
  ArrowRight,
  Flame,
  Milk,
  Eye,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getAllMealCards,
  getDailyMealStats,
  getRecentMealLogs,
  serveMealCheckIn,
  issueOrUpdateMealCard,
  batchGenerateMealCards,
  toggleMealCardStatus,
  MealPlanType,
  MealSession,
  MealCardStatus,
} from "../../meal-actions";
import { getStudents, getClasses } from "../../../actions";

type TabView = "terminal" | "cards" | "print" | "analytics";

export default function MealCardsManagementPage() {
  const [activeTab, setActiveTab] = useState<TabView>("terminal");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Data
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Terminal Scanner state
  const [selectedSession, setSelectedSession] = useState<MealSession>("BREAKFAST_MILK");
  const [scanInput, setScanInput] = useState("");
  const [verifiedResult, setVerifiedResult] = useState<any>(null);
  const [servingStudent, setServingStudent] = useState<any>(null);
  const [servingLoading, setServingLoading] = useState(false);

  // Filters for Cards table
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("ALL");
  const [filterClass, setFilterClass] = useState<string>("ALL");

  // Issue Card Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [modalStudentId, setModalStudentId] = useState("");
  const [modalPlanType, setModalPlanType] = useState<MealPlanType>("BOARDING_FULL");
  const [modalMilkQuota, setModalMilkQuota] = useState(1);
  const [modalAllergies, setModalAllergies] = useState("");
  const [modalPoints, setModalPoints] = useState(120);

  // Load Data
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [cardsData, statsData, logsData, studentsData, classesData] = await Promise.all([
        getAllMealCards(),
        getDailyMealStats(),
        getRecentMealLogs(25),
        getStudents(),
        getClasses(),
      ]);

      setCards(cardsData);
      setStats(statsData);
      setRecentLogs(logsData);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err: any) {
      console.error("Error loading meal cards data:", err);
      toast.error("Failed to load cafeteria records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Scanner Search / Lookup
  const handleScanLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanInput.trim();
    if (!query) return;

    setServingLoading(true);
    setVerifiedResult(null);

    try {
      // Find matching card by card number or student name
      const matchedCard = cards.find(
        (c) =>
          c.cardNumber.toUpperCase() === query.toUpperCase() ||
          c.student?.name?.toLowerCase().includes(query.toLowerCase())
      );

      if (!matchedCard) {
        toast.error(`No meal card found for "${query}"`);
        setServingLoading(false);
        return;
      }

      setServingStudent(matchedCard);

      // Verify and perform check-in
      const res = await serveMealCheckIn({
        cardNumber: matchedCard.cardNumber,
        mealSession: selectedSession,
      });

      setVerifiedResult(res);

      if (res.success) {
        toast.success(res.message);
        loadData(true);
      } else if (res.alreadyServed) {
        toast.warning(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to process meal check-in");
    } finally {
      setServingLoading(false);
    }
  };

  // Quick Direct Serve Button
  const handleDirectServe = async (card: any) => {
    setServingLoading(true);
    try {
      const res = await serveMealCheckIn({
        cardNumber: card.cardNumber,
        mealSession: selectedSession,
      });

      setVerifiedResult(res);
      setServingStudent(card);

      if (res.success) {
        toast.success(res.message);
        loadData(true);
      } else if (res.alreadyServed) {
        toast.warning(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error("Check-in error");
    } finally {
      setServingLoading(false);
    }
  };

  // Batch Generate Cards
  const handleBatchGenerate = async () => {
    startTransition(async () => {
      try {
        const res = await batchGenerateMealCards();
        toast.success(res.message);
        loadData(true);
      } catch (e: any) {
        toast.error("Batch creation failed");
      }
    });
  };

  // Toggle Card Status
  const handleToggleStatus = async (card: any) => {
    const nextStatus: MealCardStatus = card.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await toggleMealCardStatus(card.id, nextStatus);
      toast.success(`Card ${card.cardNumber} is now ${nextStatus}`);
      loadData(true);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  // Save Modal
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStudentId) {
      toast.error("Please select a student");
      return;
    }

    try {
      await issueOrUpdateMealCard({
        studentId: modalStudentId,
        planType: modalPlanType,
        milkQuota: Number(modalMilkQuota),
        allergies: modalAllergies,
        points: Number(modalPoints),
      });

      toast.success("Meal card issued successfully!");
      setShowIssueModal(false);
      setModalStudentId("");
      loadData(true);
    } catch (e) {
      toast.error("Failed to save meal card");
    }
  };

  // Filtered Cards
  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.cardNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student?.class?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan === "ALL" || c.planType === filterPlan;
    const matchesClass = filterClass === "ALL" || c.student?.class?.id === filterClass;

    return matchesSearch && matchesPlan && matchesClass;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
                Dining Hall & Meal Cards Command
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                School cafeteria check-in, anti-double-serving protection, and daily milk rations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="gap-2 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : ""}`} />
            Sync
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTab("print");
              setTimeout(() => window.print(), 300);
            }}
            className="gap-2 rounded-xl"
          >
            <Printer className="w-4 h-4" />
            Print Badges
          </Button>

          <Button
            size="sm"
            onClick={() => setShowIssueModal(true)}
            className="gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Issue Meal Card
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("terminal")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "terminal"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <QrCode className="w-4 h-4" />
          Serving Terminal & Scanner
        </button>

        <button
          onClick={() => setActiveTab("cards")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "cards"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          All Student Passes ({cards.length})
        </button>

        <button
          onClick={() => setActiveTab("print")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "print"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Printer className="w-4 h-4" />
          Printable Badges Sheet
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "analytics"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Daily Dining Telemetry
        </button>
      </div>

      {/* QUICK KPI TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Total Meals Served Today</div>
            <div className="text-xl md:text-2xl font-bold font-display mt-0.5">
              {stats?.totalMealsServed || 0}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Milk className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Breakfast & Milk Cans</div>
            <div className="text-xl md:text-2xl font-bold font-display mt-0.5">
              {stats?.breakfastAndMilkCount || 0}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Soup className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Lunches Served</div>
            <div className="text-xl md:text-2xl font-bold font-display mt-0.5">
              {stats?.lunchCount || 0}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Active Passes Issued</div>
            <div className="text-xl md:text-2xl font-bold font-display mt-0.5">
              {stats?.activeCards || 0} <span className="text-xs text-muted-foreground font-normal">/ {stats?.totalCards || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: SERVING TERMINAL & SCANNER */}
      {/* ===================================================================== */}
      {activeTab === "terminal" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Terminal Controller */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div>
                  <h2 className="text-lg font-bold font-display flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-amber-500" />
                    Kitchen Serving Counter & Barcode Punch
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Scan card barcode, type card number or student name to record meal allocation.
                  </p>
                </div>

                {/* Session Picker */}
                <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedSession("BREAKFAST_MILK")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSession === "BREAKFAST_MILK"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Milk className="w-3.5 h-3.5" />
                    Breakfast & Milk
                  </button>

                  <button
                    onClick={() => setSelectedSession("LUNCH")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSession === "LUNCH"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Soup className="w-3.5 h-3.5" />
                    Lunch
                  </button>

                  <button
                    onClick={() => setSelectedSession("DINNER")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSession === "DINNER"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    Supper
                  </button>
                </div>
              </div>

              {/* Barcode / Input Bar */}
              <form onSubmit={handleScanLookup} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Scan Barcode or Enter Card No (e.g. MC-2026-1001) / Name..."
                    className="pl-11 h-12 text-base rounded-2xl border-amber-500/30 focus-visible:ring-amber-500/30"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={servingLoading || !scanInput.trim()}
                  className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm"
                >
                  {servingLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Verify & Punch"}
                </Button>
              </form>

              {/* Verification Feedback Banner */}
              {verifiedResult && (
                <div
                  className={`p-5 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-200 ${
                    verifiedResult.success
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                      : verifiedResult.alreadyServed
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-950 dark:text-amber-100"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 shrink-0">
                      {verifiedResult.success ? (
                        <div className="p-2 rounded-xl bg-emerald-500 text-white">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      ) : verifiedResult.alreadyServed ? (
                        <div className="p-2 rounded-xl bg-amber-500 text-white">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-rose-500 text-white">
                          <XCircle className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="font-bold text-base md:text-lg">
                        {verifiedResult.success
                          ? "APPROVED: Meal Ration Allocated"
                          : verifiedResult.alreadyServed
                          ? "DUPLICATE PREVENTED: Already Served Today!"
                          : "RESTRICTED: Cannot Issue Meal"}
                      </div>
                      <p className="text-sm opacity-90">{verifiedResult.message}</p>

                      {verifiedResult.student && (
                        <div className="flex items-center gap-4 text-xs font-medium pt-2">
                          <div>
                            Student: <span className="font-bold">{verifiedResult.student.name}</span>
                          </div>
                          <div>
                            Class: <span className="font-bold">{verifiedResult.student.class?.name || "N/A"}</span>
                          </div>
                          {verifiedResult.card?.planType && (
                            <div>
                              Plan: <span className="font-bold">{verifiedResult.card.planType}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Tap Student Cards Queue */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Quick Dining Line (Tap to punch meal)</span>
                  <span>{filteredCards.slice(0, 6).length} students shown</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredCards.slice(0, 6).map((card) => (
                    <div
                      key={card.id}
                      className="p-3.5 rounded-2xl bg-card hover:bg-muted/40 border border-border/80 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                          {card.student?.name?.charAt(0) || "S"}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{card.student?.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span>{card.student?.class?.name || "No Class"}</span>
                            <span>•</span>
                            <span className="font-mono">{card.cardNumber}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDirectServe(card)}
                        disabled={servingLoading || card.status !== "ACTIVE"}
                        className="rounded-xl shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-all text-xs"
                      >
                        Punch
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail: Real-time Live Log Feed */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="font-bold text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Live Cafeteria Activity
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </div>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {recentLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No meals punched yet today.
                  </div>
                ) : (
                  recentLogs.map((log) => {
                    const time = new Date(log.servedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                            {log.mealSession === "BREAKFAST_MILK" ? (
                              <Milk className="w-3.5 h-3.5" />
                            ) : log.mealSession === "LUNCH" ? (
                              <Soup className="w-3.5 h-3.5" />
                            ) : (
                              <Coffee className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">
                              {log.mealCard?.student?.name || "Student"}
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <span>{log.mealCard?.student?.class?.name || "Class"}</span>
                              <span>•</span>
                              <span>{log.mealSession.replace("_", " ")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-muted-foreground">{time}</div>
                          <span className="text-[10px] text-emerald-600 font-bold">Served</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: ALL STUDENT PASSES & MANAGEMENT */}
      {/* ===================================================================== */}
      {activeTab === "cards" && (
        <div className="space-y-6">
          {/* Action & Filter Toolbar */}
          <div className="p-5 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by student name, card ID or class..."
                  className="pl-10 h-10 rounded-xl"
                />
              </div>

              {/* Filter Plan */}
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="h-10 px-3 rounded-xl border border-border bg-background text-sm"
              >
                <option value="ALL">All Meal Plans</option>
                <option value="BOARDING_FULL">Full Boarding + Milk</option>
                <option value="DAY_LUNCH">Day Scholar Lunch</option>
                <option value="MILK_NUTRITION_AWARD">Milk & Nutrition Award</option>
                <option value="BURSARY_SUBSIDIZED">Bursary Subsidized</option>
              </select>

              {/* Filter Class */}
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="h-10 px-3 rounded-xl border border-border bg-background text-sm"
              >
                <option value="ALL">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatchGenerate}
                disabled={isPending}
                className="rounded-xl gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Auto-Issue Missing Cards
              </Button>
            </div>
          </div>

          {/* Cards Table */}
          <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border/80 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Card Identifier</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Meal Plan</th>
                    <th className="p-4">Daily Milk Quota</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCards.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        No meal cards found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCards.map((card) => (
                      <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {card.cardNumber}
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          {card.student?.name || "Unknown"}
                          {card.allergies && (
                            <span className="block text-xs font-normal text-rose-500">
                              ⚠️ {card.allergies}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">{card.student?.class?.name || "Unassigned"}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              card.planType === "MILK_NUTRITION_AWARD"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : card.planType === "BOARDING_FULL"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {card.planType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-semibold text-xs">
                            <Milk className="w-3.5 h-3.5 text-blue-500" />
                            <span>{card.milkQuota || 1} Can / Day</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
                            onClick={() => handleToggleStatus(card)}
                            className="rounded-xl text-xs h-8"
                          >
                            {card.status === "ACTIVE" ? (
                              <span className="text-rose-500 flex items-center gap-1">
                                <Ban className="w-3.5 h-3.5" /> Suspend
                              </span>
                            ) : (
                              <span className="text-emerald-500 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Activate
                              </span>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: PRINTABLE BADGES SHEET (WINDOW.PRINT READY) */}
      {/* ===================================================================== */}
      {activeTab === "print" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
            <div className="text-sm">
              <span className="font-bold">Print Preview Mode:</span> Click the button to print wallet-sized
              laminated badges with school crest and QR code.
            </div>
            <Button
              onClick={() => window.print()}
              className="gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
            >
              <Printer className="w-4 h-4" />
              Print All ({filteredCards.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-background border-2 border-amber-500/30 shadow-md space-y-4 relative overflow-hidden"
              >
                {/* School Header on Card */}
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div>
                    <div className="text-[10px] tracking-wider uppercase font-bold text-amber-600 dark:text-amber-400">
                      Wellstar Bright School
                    </div>
                    <div className="text-xs font-extrabold text-foreground tracking-tight">
                      STUDENT MEAL PASS
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 font-bold text-xs">
                    WB
                  </div>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                    {card.student?.name?.charAt(0) || "S"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate">{card.student?.name}</div>
                    <div className="text-xs text-muted-foreground">{card.student?.class?.name || "Class"}</div>
                    <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {card.cardNumber}
                    </div>
                  </div>
                </div>

                {/* Plan Badge & Milk Quota */}
                <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Meal Package:</span>
                    <span className="font-bold text-foreground text-[11px]">{card.planType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Daily Milk Ration:</span>
                    <span className="font-bold text-blue-600 text-[11px]">{card.milkQuota || 1} Can / Day</span>
                  </div>
                </div>

                {/* Barcode Mock */}
                <div className="pt-1 text-center">
                  <div className="h-7 bg-foreground/10 rounded flex items-center justify-center font-mono text-[9px] tracking-widest text-muted-foreground">
                    ||| | |||| | ||| || ||| | |||
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1">Academic Year 2026 • Cafeteria Valid</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: DAILY DINING TELEMETRY & CONSUMPTION ANALYTICS */}
      {/* ===================================================================== */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6">
            <h2 className="text-lg font-bold font-display">Cafeteria Kitchen Consumption & Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm">Breakfast & Milk Session</div>
                  <Milk className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-display font-bold text-blue-600">
                  {stats?.breakfastAndMilkCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Morning milk rations distributed across senior and junior streams.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm">Main Lunch Service</div>
                  <Soup className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-display font-bold text-amber-600">
                  {stats?.lunchCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes both day scholars and boarding students dining today.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm">Dinner & Supper Service</div>
                  <Coffee className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-display font-bold text-emerald-600">
                  {stats?.dinnerCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Exclusive to boarding students enrolled in full residential dining.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ISSUE / EDIT CARD MODAL */}
      {/* ===================================================================== */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Issue Student Meal Pass
              </h3>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Select Student
                </label>
                <select
                  value={modalStudentId}
                  onChange={(e) => setModalStudentId(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.class?.name || "Class"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Meal Plan Allocation
                </label>
                <select
                  value={modalPlanType}
                  onChange={(e) => setModalPlanType(e.target.value as MealPlanType)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm"
                >
                  <option value="BOARDING_FULL">Boarding Full (Breakfast + Milk, Lunch, Supper)</option>
                  <option value="DAY_LUNCH">Day Scholar Lunch Only</option>
                  <option value="MILK_NUTRITION_AWARD">Milk & Nutrition Award Pass</option>
                  <option value="BURSARY_SUBSIDIZED">Bursary Subsidized Meal Pass</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Daily Milk Cans Quota
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={modalMilkQuota}
                    onChange={(e) => setModalMilkQuota(Number(e.target.value))}
                    className="rounded-xl h-11"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Starting Credits
                  </label>
                  <Input
                    type="number"
                    value={modalPoints}
                    onChange={(e) => setModalPoints(Number(e.target.value))}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Allergies / Special Dietary Needs
                </label>
                <Input
                  value={modalAllergies}
                  onChange={(e) => setModalAllergies(e.target.value)}
                  placeholder="e.g. Lactose intolerant, peanut allergy, vegetarian"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIssueModal(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
                >
                  Issue Meal Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
