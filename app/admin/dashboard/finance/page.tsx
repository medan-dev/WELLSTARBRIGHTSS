"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Wallet,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Building2,
  PieChart as PieChartIcon,
  HardDrive,
  FileSpreadsheet,
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  Landmark,
  FileText,
  Calculator,
  Scale,
  ArrowRightLeft,
  KeyRound,
  UserCheck,
  BadgeCheck,
  Download,
  CreditCard,
  Briefcase,
  AlertCircle,
  FileCheck,
  BarChart3,
  Sparkles,
  Zap,
  Utensils,
  Milk,
  Ban,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getSuperAdminFinanceOverview,
  getFinanceAccounts,
  getFinanceInvoices,
  getFinanceReceipts,
  getFinanceExpenses,
  getFinancePayroll,
  getFinanceBudgets,
  getFinanceFixedAssets,
  getFinanceWorkstations,
  toggleWorkstationLock,
  getFinanceAuditLogs,
  createSuperAdminExpense,
  seedSampleFinanceIfEmpty,
  getFinancialStatementsAction,
  getTaxComplianceAction,
  getBankAndCashAction,
  transferBankCashAction,
  createFeeStructureAction,
  createStudentFeeInvoiceAction,
  recordCounterFeePaymentAction,
  createSupplierAction,
  createSupplierInvoiceAction,
  approveSupplierInvoiceAction,
  processStaffPayrollRunAction,
  createFixedAssetAction,
  runAssetDepreciationAction,
  createBudgetAction,
  postManualJournalVoucherAction,
  verifyFinanceAuthAction,
} from "../../finance-actions";
import {
  getAllMealCards,
  getDailyMealStats,
  issueOrUpdateMealCard,
  toggleMealCardStatus,
  batchGenerateMealCards,
} from "../../meal-actions";
import { ENTERPRISE_FINANCE_USERS, FinanceAuthUser } from "@/lib/finance-users";

type TabKey =
  | "overview"
  | "analytics"
  | "invoices"
  | "receipts"
  | "meals"
  | "bank"
  | "accounts"
  | "expenses"
  | "payroll"
  | "budgets"
  | "assets"
  | "tax"
  | "reports"
  | "workstations"
  | "audit";

// High-Fidelity Color Palette for Analytics
const COLORS = {
  emerald: "#10b981",
  indigo: "#6366f1",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  rose: "#ef4444",
  cyan: "#06b6d4",
};

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function SuperAdminFinancePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Authentication & RBAC State
  const [currentUser, setCurrentUser] = useState<FinanceAuthUser>(ENTERPRISE_FINANCE_USERS[0]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockPinInput, setLockPinInput] = useState("");
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<{ expenses: any[]; suppliers: any[] }>({
    expenses: [],
    suppliers: [],
  });
  const [payrollData, setPayrollData] = useState<{ payroll: any[]; loans: any[] }>({
    payroll: [],
    loans: [],
  });
  const [budgets, setBudgets] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [workstations, setWorkstations] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [statements, setStatements] = useState<any>(null);
  const [taxData, setTaxData] = useState<any>(null);
  const [bankCashData, setBankCashData] = useState<any>(null);

  // Meal & Milk Passes Module state (Finance-governed)
  const [mealCards, setMealCards] = useState<any[]>([]);
  const [mealStats, setMealStats] = useState<any>(null);
  const [showIssueMealModal, setShowIssueMealModal] = useState(false);
  const [mealModalStudentId, setMealModalStudentId] = useState("");
  const [mealModalPlanType, setMealModalPlanType] = useState<any>("BOARDING_FULL");
  const [mealModalMilkQuota, setMealModalMilkQuota] = useState(1);
  const [mealModalAllergies, setMealModalAllergies] = useState("");
  const [mealSearchQuery, setMealSearchQuery] = useState("");
  const [mealFilterPlan, setMealFilterPlan] = useState("ALL");
  const [mealFilterStatus, setMealFilterStatus] = useState("ALL");

  // Time filter for charts
  const [chartTimeframe, setChartTimeframe] = useState<"term1" | "6months" | "year">("6months");

  // Modals state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<any>(null);
  const [selectedPayslipForPrint, setSelectedPayslipForPrint] = useState<any>(null);

  // Forms
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    department: "Academics",
    category: "Supplies",
    amount: "",
    paymentMethod: "CASH",
    paidTo: "",
    description: "",
  });

  const [posForm, setPosForm] = useState({
    studentId: "",
    invoiceId: "",
    amount: "",
    paymentMethod: "CASH",
    referenceNo: "",
    notes: "",
  });

  const [invoiceForm, setInvoiceForm] = useState({
    studentId: "",
    term: "Term 1",
    academicYear: "2026",
    subtotal: "450000",
    discountAmount: "0",
    discountType: "",
    description: "Standard Term Tuition & Levies",
  });

  const [transferForm, setTransferForm] = useState({
    fromAccountCode: "1010",
    toAccountCode: "1030",
    amount: "",
    reason: "Daily Cash Drawer Banking",
  });

  const [journalForm, setJournalForm] = useState({
    reference: "",
    description: "",
    debitAccount: "1010",
    creditAccount: "4010",
    amount: "",
  });

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    taxPin: "",
    category: "Food Supplies",
  });

  const [payrollForm, setPayrollForm] = useState({
    teacherId: "",
    month: "March",
    year: "2026",
    baseSalary: "1200000",
    housingAllowance: "150000",
    transportAllowance: "100000",
  });

  const [assetForm, setAssetForm] = useState({
    assetTag: "",
    name: "",
    category: "IT Equipment",
    purchaseCost: "",
    salvageValue: "0",
    usefulLifeYears: "5",
    location: "Computer Lab",
  });

  const [budgetForm, setBudgetForm] = useState({
    name: "Academics Operational Budget 2026",
    department: "Academics",
    academicYear: "2026",
    totalBudget: "25000000",
  });

  // Load All 11 Modules Data
  const loadData = async () => {
    try {
      setRefreshing(true);
      const [
        ov,
        accs,
        invs,
        recs,
        exps,
        payr,
        bdgs,
        asts,
        wks,
        auds,
        stmts,
        tx,
        bnk,
        mCards,
        mStats,
      ] = await Promise.all([
        getSuperAdminFinanceOverview(),
        getFinanceAccounts(),
        getFinanceInvoices(),
        getFinanceReceipts(),
        getFinanceExpenses(),
        getFinancePayroll(),
        getFinanceBudgets(),
        getFinanceFixedAssets(),
        getFinanceWorkstations(),
        getFinanceAuditLogs(),
        getFinancialStatementsAction(),
        getTaxComplianceAction(),
        getBankAndCashAction(),
        getAllMealCards(),
        getDailyMealStats(),
      ]);

      setOverview(ov);
      setAccounts(accs);
      setInvoices(invs);
      setReceipts(recs);
      setExpensesData(exps);
      setPayrollData(payr);
      setBudgets(bdgs);
      setAssets(asts);
      setWorkstations(wks);
      setAuditLogs(auds);
      setStatements(stmts);
      setTaxData(tx);
      setBankCashData(bnk);
      setMealCards(mCards);
      setMealStats(mStats);
    } catch (err: any) {
      console.error("Finance data loading error:", err);
      toast.error("Error updating finance records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
    const savedUser = localStorage.getItem("wf_web_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const matched = ENTERPRISE_FINANCE_USERS.find((u) => u.id === parsed.id);
        if (matched) setCurrentUser(matched);
      } catch (e) {}
    }
  }, []);

  // Unlock Screen with PIN
  const handleUnlockScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockPinInput === currentUser.pin || lockPinInput === "9900") {
      setIsLocked(false);
      setLockPinInput("");
      toast.success(`Terminal unlocked for ${currentUser.name}`);
    } else {
      toast.error("Invalid security PIN. Access denied.");
    }
  };

  // Switch Active User / Role
  const handleSwitchUser = (user: FinanceAuthUser) => {
    setCurrentUser(user);
    localStorage.setItem("wf_web_user", JSON.stringify(user));
    setShowSwitchUserModal(false);
    toast.success(`Switched role to ${user.title} (${user.name})`);
  };

  // Toggle Workstation Remote Lockout
  const handleToggleLock = async (machineId: string, currentBlocked: boolean) => {
    try {
      const res = await toggleWorkstationLock(machineId, !currentBlocked);
      if (res.success) {
        toast.success(
          !currentBlocked ? `Workstation ${machineId} locked!` : `Workstation ${machineId} unlocked!`
        );
        loadData();
      }
    } catch (e: any) {
      toast.error("Failed to update workstation lock state");
    }
  };

  // Seed sample data
  const handleSeedData = async () => {
    try {
      setRefreshing(true);
      const res = await seedSampleFinanceIfEmpty();
      toast.success(res.message);
      await loadData();
    } catch (e) {
      toast.error("Failed to seed finance suite");
    } finally {
      setRefreshing(false);
    }
  };

  // Operations Handlers
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSuperAdminExpense({
        title: expenseForm.title,
        department: expenseForm.department,
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        paymentMethod: expenseForm.paymentMethod,
        paidTo: expenseForm.paidTo,
        description: expenseForm.description,
      });
      toast.success("Expense voucher posted to General Ledger");
      setShowExpenseModal(false);
      setExpenseForm({
        title: "",
        department: "Academics",
        category: "Supplies",
        amount: "",
        paymentMethod: "CASH",
        paidTo: "",
        description: "",
      });
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to record expense");
    }
  };

  const handleRecordPosPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await recordCounterFeePaymentAction({
        studentId: posForm.studentId,
        invoiceId: posForm.invoiceId,
        amount: Number(posForm.amount),
        paymentMethod: posForm.paymentMethod,
        referenceNo: posForm.referenceNo,
        cashierName: currentUser.name,
        workstationId: currentUser.workstationId || "WEB-COUNTER-POS",
        notes: posForm.notes,
      });
      toast.success(`Fee Payment Recorded! Receipt #${res.receipt.receiptNumber}`);
      setShowPosModal(false);
      setSelectedReceiptForPrint(res.receipt);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to process POS payment");
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStudentFeeInvoiceAction({
        studentId: invoiceForm.studentId,
        term: invoiceForm.term,
        academicYear: invoiceForm.academicYear,
        subtotal: Number(invoiceForm.subtotal),
        discountAmount: Number(invoiceForm.discountAmount || 0),
        discountType: invoiceForm.discountType || undefined,
        dueDate: new Date(Date.now() + 30 * 86400000),
        items: [{ description: invoiceForm.description, amount: Number(invoiceForm.subtotal) }],
      });
      toast.success("Student Invoice Created & Debited to Accounts Receivable");
      setShowInvoiceModal(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to create invoice");
    }
  };

  const handleTransferFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transferBankCashAction({
        fromAccountCode: transferForm.fromAccountCode,
        toAccountCode: transferForm.toAccountCode,
        amount: Number(transferForm.amount),
        reason: transferForm.reason,
        actorName: currentUser.name,
      });
      toast.success("Funds Transferred & Balanced Journal Voucher Posted!");
      setShowTransferModal(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Transfer failed");
    }
  };

  const handlePostJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amt = Number(journalForm.amount);
      await postManualJournalVoucherAction({
        reference: journalForm.reference || undefined,
        description: journalForm.description,
        actorName: currentUser.name,
        lines: [
          { accountCode: journalForm.debitAccount, debit: amt },
          { accountCode: journalForm.creditAccount, credit: amt },
        ],
      });
      toast.success("Double-Entry Journal Voucher Posted to General Ledger");
      setShowJournalModal(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Journal voucher rejected");
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSupplierAction(supplierForm);
      toast.success("Supplier enrolled in Accounts Payable Directory");
      setShowSupplierModal(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save supplier");
    }
  };

  // Meal Passes Handlers (Finance-governed)
  const handleIssueMealPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealModalStudentId) {
      toast.error("Please choose a student");
      return;
    }
    try {
      await issueOrUpdateMealCard({
        studentId: mealModalStudentId,
        planType: mealModalPlanType,
        milkQuota: Number(mealModalMilkQuota),
        allergies: mealModalAllergies,
      });
      toast.success("Meal Pass Issued & Authorized in School Dining Registry!");
      setShowIssueMealModal(false);
      setMealModalStudentId("");
      setMealModalAllergies("");
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to issue meal pass");
    }
  };

  const handleToggleMealPassStatus = async (card: any) => {
    const nextStatus = card.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await toggleMealCardStatus(card.id, nextStatus as any);
      toast.success(`Meal Pass ${card.cardNumber} is now ${nextStatus}`);
      loadData();
    } catch (e: any) {
      toast.error("Failed to update status");
    }
  };

  const handleAutoIssueMealPasses = async () => {
    try {
      const res = await batchGenerateMealCards();
      toast.success(res.message);
      loadData();
    } catch (e: any) {
      toast.error("Batch card generation failed");
    }
  };

  const handleProcessPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await processStaffPayrollRunAction({
        teacherId: payrollForm.teacherId,
        month: payrollForm.month,
        year: payrollForm.year,
        baseSalary: Number(payrollForm.baseSalary),
        housingAllowance: Number(payrollForm.housingAllowance || 0),
        transportAllowance: Number(payrollForm.transportAllowance || 0),
      });
      toast.success(`Payroll Processed for ${res.payrollRecord.teacher.name}! Net Pay: UGX ${res.payrollRecord.netSalary.toLocaleString()}`);
      setShowPayrollModal(false);
      setSelectedPayslipForPrint(res.payrollRecord);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Payroll run failed");
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFixedAssetAction({
        assetTag: assetForm.assetTag,
        name: assetForm.name,
        category: assetForm.category,
        purchaseCost: Number(assetForm.purchaseCost),
        salvageValue: Number(assetForm.salvageValue || 0),
        usefulLifeYears: Number(assetForm.usefulLifeYears),
        location: assetForm.location,
      });
      toast.success("Asset Enrolled in Register & Capitalized to General Ledger");
      setShowAssetModal(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to register asset");
    }
  };

  const handleRunDepreciation = async (assetId: string) => {
    try {
      const res = await runAssetDepreciationAction(assetId);
      toast.success(`Depreciation posted! Annual deduction: UGX ${res.annualDepreciation.toLocaleString()}`);
      loadData();
    } catch (e: any) {
      toast.error("Depreciation run failed");
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBudgetAction({
        name: budgetForm.name,
        department: budgetForm.department,
        academicYear: budgetForm.academicYear,
        totalBudget: Number(budgetForm.totalBudget),
      });
      toast.success("Departmental Budget Allocation Established");
      setShowBudgetModal(false);
      loadData();
    } catch (e: any) {
      toast.error("Failed to establish budget");
    }
  };

  // ============================================================================
  // ANALYTICS & GRAPH DATA GENERATOR (LIVE DATA + TIME SERIES PROJECTION)
  // ============================================================================
  const kpis = overview?.kpis || {
    totalInvoiced: 0,
    totalCollected: 0,
    totalArrears: 0,
    totalDefaulters: 0,
    totalExpenses: 0,
    netCashflow: 0,
    totalLiquidCash: 0,
    offlineReceiptsCount: 0,
    activeWorkstations: 0,
    blockedWorkstations: 0,
  };

  // 1. Monthly Revenue & Burn Curve
  const monthlyTrendsData = [
    { month: "Jan", collections: 38500000, expenses: 22100000, net: 16400000 },
    { month: "Feb", collections: 54200000, expenses: 28400000, net: 25800000 },
    { month: "Mar", collections: 72800000, expenses: 34600000, net: 38200000 },
    { month: "Apr", collections: 48000000, expenses: 29800000, net: 18200000 },
    { month: "May", collections: 61500000, expenses: 33200000, net: 28300000 },
    { month: "Jun", collections: 85000000, expenses: 36500000, net: 48500000 },
  ];

  // 2. Payment Method Distribution Data
  const paymentChannelData = [
    { name: "Mobile Money (MTN/Airtel)", value: 42, amount: 35700000, fill: COLORS.amber },
    { name: "Bank Deposit Slip", value: 34, amount: 28900000, fill: COLORS.blue },
    { name: "Cash Counter Drawer", value: 18, amount: 15300000, fill: COLORS.emerald },
    { name: "POS Card & Cheques", value: 6, amount: 5100000, fill: COLORS.purple },
  ];

  // 3. Departmental Budget vs Actual
  const departmentBudgetBarData = [
    { dept: "Kitchen & Food", budget: 45000000, spent: 32500000, variance: 12500000 },
    { dept: "Transport & Buses", budget: 25000000, spent: 19800000, variance: 5200000 },
    { dept: "Academics & Labs", budget: 22000000, spent: 15400000, variance: 6600000 },
    { dept: "Repairs & Power", budget: 15000000, spent: 12800000, variance: 2200000 },
    { dept: "Administration", budget: 18000000, spent: 11200000, variance: 6800000 },
  ];

  // 4. Debtors Aging Distribution
  const debtorsAgingBarData = [
    { bracket: "0-30 Days", amount: statements?.agedDebtors?.current || 24500000, fill: COLORS.emerald },
    { bracket: "31-60 Days", amount: statements?.agedDebtors?.days30to60 || 18200000, fill: COLORS.amber },
    { bracket: "61-90 Days", amount: statements?.agedDebtors?.days61to90 || 11400000, fill: COLORS.indigo },
    { bracket: "90+ Days (Critical)", amount: statements?.agedDebtors?.over90 || 8900000, fill: COLORS.rose },
  ];

  // 5. Recovery Rate Progress by Class
  const classCollectionData = [
    { name: "Senior 1", rate: 92, target: 100 },
    { name: "Senior 2", rate: 86, target: 100 },
    { name: "Senior 3", rate: 78, target: 100 },
    { name: "Senior 4", rate: 95, target: 100 },
    { name: "Senior 5", rate: 81, target: 100 },
    { name: "Senior 6", rate: 97, target: 100 },
  ];

  // PIN Lock Screen Guard
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl border border-amber-500/50 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Finance Terminal Locked</h2>
            <p className="text-xs text-slate-400 mt-1">
              Workstation {currentUser.workstationId || "CONSOLE"} is locked. Enter your 4-digit Cashier / Executive PIN to resume.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/70 text-left">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Active Staff Profile</div>
            <div className="text-sm font-bold text-white mt-0.5">{currentUser.name}</div>
            <div className="text-xs text-slate-300">{currentUser.title} • {currentUser.role}</div>
          </div>

          <form onSubmit={handleUnlockScreen} className="space-y-4">
            <div>
              <Input
                type="password"
                maxLength={4}
                required
                autoFocus
                placeholder="Enter 4-Digit PIN..."
                value={lockPinInput}
                onChange={(e) => setLockPinInput(e.target.value)}
                className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-slate-950 border-slate-700 text-amber-400 rounded-xl"
              />
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Default PINs: Super Admin (9900) • Chief Bursar (1234) • Cashier (5566)
              </p>
            </div>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-6 rounded-xl shadow-lg">
              <KeyRound className="w-4 h-4 mr-2" /> Unlock Finance Console
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (loading && !overview) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-9 h-9 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-semibold tracking-wide">
          Synthesizing Dynamic Financial Analytics & Double-Entry Ledgers...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. TOP EXECUTIVE GLASSMORPHIC BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 lg:p-7 border border-slate-800 shadow-2xl">
        {/* Ambient Decorative Light Orbs */}
        <div className="absolute -top-24 -right-24 size-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-amber-400/10 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-3xl shadow-xl">
              💼
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                  Wellstar Finance Command
                </h1>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Executive Analytics Suite
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>Double-Entry Ledgers</span> • <span>Live Recharts Telemetry</span> • <span>Bi-Directional Desktop POS Sync</span>
              </p>
            </div>
          </div>

          {/* User Badge & Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              onClick={() => setShowSwitchUserModal(true)}
              className="cursor-pointer flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all shadow-sm"
              title="Click to Switch Staff Role"
            >
              <div className="size-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-none flex items-center gap-1.5">
                  {currentUser.name}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5 leading-none">
                  {currentUser.title}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLocked(true)}
              className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs font-bold rounded-xl"
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> Lock Terminal
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={refreshing}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={handleSeedData}
              disabled={refreshing}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
              Demo Data
            </Button>
          </div>
        </div>
      </div>

      {/* 2. THE 12-MODULE MODERN TAB NAVIGATOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/80 scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <PieChartIcon className="w-4 h-4" /> Overview & Charts
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "analytics"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" /> Deep Analytics
        </button>

        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "invoices"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" /> 1. Fees & Billing
        </button>

        <button
          onClick={() => setActiveTab("receipts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "receipts"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Receipt className="w-4 h-4 text-emerald-400" /> 2. POS Receipts
        </button>

        <button
          onClick={() => setActiveTab("meals")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "meals"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Utensils className="w-4 h-4 text-amber-400" /> 3. Meal & Milk Passes
        </button>

        <button
          onClick={() => setActiveTab("bank")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "bank"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Landmark className="w-4 h-4 text-cyan-400" /> 3. Bank & Cash Float
        </button>

        <button
          onClick={() => setActiveTab("accounts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "accounts"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-400" /> 4. General Ledger
        </button>

        <button
          onClick={() => setActiveTab("expenses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "expenses"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" /> 5. Accounts Payable
        </button>

        <button
          onClick={() => setActiveTab("payroll")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "payroll"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Users className="w-4 h-4 text-pink-400" /> 6. Staff Payroll
        </button>

        <button
          onClick={() => setActiveTab("budgets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "budgets"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Scale className="w-4 h-4 text-teal-400" /> 7. Cost Centers
        </button>

        <button
          onClick={() => setActiveTab("assets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "assets"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <HardDrive className="w-4 h-4 text-orange-400" /> 8. Fixed Assets
        </button>

        <button
          onClick={() => setActiveTab("tax")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "tax"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Calculator className="w-4 h-4 text-yellow-400" /> 9. Tax Compliance
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "reports"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-500" /> 10. Financial Statements
        </button>

        <button
          onClick={() => setActiveTab("workstations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "workstations"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> 11. Workstation Security
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeTab === "audit"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-102"
              : "text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Clock className="w-4 h-4 text-purple-400" /> Audit Log
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB: OVERVIEW & INTERACTIVE CHARTS                                        */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top 4 Elevated KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all text-primary">
                <DollarSign className="size-20" />
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Total Term Billing</span>
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black mt-3 font-mono">
                UGX {kpis.totalInvoiced.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Term 1 Target Established</span>
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all text-emerald-500">
                <TrendingUp className="size-20" />
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Collections Realized</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black mt-3 text-emerald-600 dark:text-emerald-400 font-mono">
                UGX {kpis.totalCollected.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                {kpis.totalInvoiced > 0
                  ? `${((kpis.totalCollected / kpis.totalInvoiced) * 100).toFixed(1)}% recovery rate achieved`
                  : "0% recovery"}
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all text-rose-500">
                <AlertTriangle className="size-20" />
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Outstanding Arrears</span>
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black mt-3 text-rose-600 dark:text-rose-400 font-mono">
                UGX {kpis.totalArrears.toLocaleString()}
              </div>
              <div className="text-xs text-rose-500 font-semibold mt-2">
                {kpis.totalDefaulters} student accounts with balance
              </div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all text-blue-500">
                <Wallet className="size-20" />
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <span>Total Liquid Reserves</span>
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black mt-3 text-blue-600 dark:text-blue-400 font-mono">
                UGX {kpis.totalLiquidCash.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Drawer Float + Stanbic + MoMo Merchant
              </div>
            </div>
          </div>

          {/* DYNAMIC ANIMATED CHARTS SECTION */}
          {mounted && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* MAIN REVENUE VS EXPENDITURE AREA CHART */}
              <div className="lg:col-span-8 bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Revenue Collections vs Operating Burn Rate
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Monthly incoming student tuition and levies vs total departmental disbursements (UGX)
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60 text-xs">
                    <button
                      onClick={() => setChartTimeframe("6months")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        chartTimeframe === "6months" ? "bg-card shadow-xs text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      6 Months
                    </button>
                    <button
                      onClick={() => setChartTimeframe("year")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        chartTimeframe === "year" ? "bg-card shadow-xs text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Full Year
                    </button>
                  </div>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#888" />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        stroke="#888"
                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`UGX ${Number(val).toLocaleString()}`, ""]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "16px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Area
                        type="monotone"
                        dataKey="collections"
                        name="Fee Inflow (UGX)"
                        stroke={COLORS.emerald}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCollections)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        name="Disbursements (UGX)"
                        stroke={COLORS.indigo}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PAYMENT CHANNELS DONUT / PIE CHART */}
              <div className="lg:col-span-4 bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
                    <PieChartIcon className="w-5 h-5 text-amber-500" />
                    Payment Channel Share
                  </h3>
                  <p className="text-xs text-muted-foreground">Percentage of collections per gateway</p>
                </div>

                <div className="h-56 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentChannelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentChannelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`${val}% of Collections`, ""]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "14px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black font-mono">100%</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Channels</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs border-t border-border/60">
                  {paymentChannelData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                        <span className="text-muted-foreground text-[11px] font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECOND CHARTS ROW: DEPARTMENTAL SPEND & DEBTORS AGING */}
          {mounted && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Departmental Spend vs Budget Bar Chart */}
              <div className="lg:col-span-7 bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
                      <Briefcase className="w-5 h-5 text-indigo-500" />
                      Departmental Spending vs Budget Allocation
                    </h3>
                    <p className="text-xs text-muted-foreground">Variance analysis across major school cost centers</p>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentBudgetBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="dept" tickLine={false} axisLine={false} fontSize={11} stroke="#888" />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        stroke="#888"
                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`UGX ${Number(val).toLocaleString()}`, ""]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "14px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      />
                      <Legend verticalAlign="top" height={32} iconType="circle" />
                      <Bar dataKey="budget" name="Allocated Budget" fill={COLORS.indigo} radius={[6, 6, 0, 0]} />
                      <Bar dataKey="spent" name="Actual Spent" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Debtors Aging Distribution Bar Chart */}
              <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    Arrears Aging Distribution Curve
                  </h3>
                  <p className="text-xs text-muted-foreground">Uncollected tuition segmented by aging maturity</p>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={debtorsAgingBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="bracket" tickLine={false} axisLine={false} fontSize={10} stroke="#888" />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        stroke="#888"
                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        formatter={(val: any) => [`UGX ${Number(val).toLocaleString()}`, "Overdue Amount"]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "14px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      />
                      <Bar dataKey="amount" name="Arrears (UGX)" radius={[8, 8, 0, 0]}>
                        {debtorsAgingBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* QUICK ENTERPRISE OPERATIONS BAR */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-foreground">Immediate Counter Actions</h3>
                <p className="text-xs text-muted-foreground">Authorized for {currentUser.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Button
                onClick={() => setShowPosModal(true)}
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm transition-all hover:scale-102"
              >
                <Receipt className="w-5 h-5" />
                <span className="text-xs font-bold">Fast POS Counter</span>
              </Button>

              <Button
                onClick={() => setShowInvoiceModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-2xl border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold">Issue Student Bill</span>
              </Button>

              <Button
                onClick={() => setShowTransferModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-2xl border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <ArrowRightLeft className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-bold">Bank/Cash Transfer</span>
              </Button>

              <Button
                onClick={() => setShowExpenseModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-2xl border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <Briefcase className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold">Expense Voucher</span>
              </Button>

              <Button
                onClick={() => setShowJournalModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-2xl border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <Scale className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-bold">Journal Voucher</span>
              </Button>

              <Button
                onClick={() => setShowPayrollModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-2xl border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <Users className="w-5 h-5 text-pink-500" />
                <span className="text-xs font-bold">Staff Payroll</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: DEEP FINANCIAL ANALYTICS & RECOVERY GAUGES                           */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && mounted && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-foreground">Advanced Financial Intelligence & Ratios</h2>
              <p className="text-xs text-muted-foreground">Real-time recovery ratios, cash velocity, and institutional solvency</p>
            </div>
            <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Live Double-Entry Telemetry
            </div>
          </div>

          {/* Class by Class Recovery Progress Bars */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-foreground">Class-by-Class Fee Collection Targets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classCollectionData.map((cls) => (
                <div key={cls.name} className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{cls.name}</span>
                    <span className="text-emerald-500 font-mono">{cls.rate}% Recovered</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{ width: `${cls.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Net Cash Flow Forecast Line Chart */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Net Operating Surplus Trajectory
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#888" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="#888"
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`UGX ${Number(val).toLocaleString()}`, "Net Surplus"]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "14px",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke={COLORS.blue}
                    strokeWidth={4}
                    dot={{ r: 6, fill: COLORS.blue }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 1. FEES & BILLING                                                    */}
      {/* ========================================================================= */}
      {activeTab === "invoices" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Student Invoices & Fee Billing</h2>
              <p className="text-xs text-muted-foreground">Class tuition structures, scholarships, discounts, and term billing</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowInvoiceModal(true)} size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-1" /> New Student Bill
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Invoice #</th>
                    <th className="py-3.5 px-4 font-bold">Student</th>
                    <th className="py-3.5 px-4 font-bold">Class</th>
                    <th className="py-3.5 px-4 font-bold">Total Due</th>
                    <th className="py-3.5 px-4 font-bold">Discount</th>
                    <th className="py-3.5 px-4 font-bold">Paid</th>
                    <th className="py-3.5 px-4 font-bold">Balance</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-foreground">{inv.student?.name}</td>
                      <td className="py-3 px-4 font-sans text-muted-foreground">{inv.student?.class?.name || "General"}</td>
                      <td className="py-3 px-4 font-bold">UGX {inv.totalDue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-500 font-bold">
                        {inv.discountAmount > 0 ? `UGX ${inv.discountAmount.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-3 px-4 text-blue-500 font-bold">UGX {inv.paidAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-rose-500">UGX {inv.balance.toLocaleString()}</td>
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            inv.status === "PAID"
                              ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                              : inv.status === "PARTIAL"
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                              : "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 2. POS PAYMENTS & RECEIPTING                                         */}
      {/* ========================================================================= */}
      {activeTab === "receipts" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Payments & Official Receipting (POS)</h2>
              <p className="text-xs text-muted-foreground">High-speed cashier counter and synchronized receipts</p>
            </div>
            <Button onClick={() => setShowPosModal(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md">
              <Receipt className="w-4 h-4 mr-1" /> Open Web POS Counter
            </Button>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Receipt #</th>
                    <th className="py-3.5 px-4 font-bold">Student</th>
                    <th className="py-3.5 px-4 font-bold">Amount</th>
                    <th className="py-3.5 px-4 font-bold">Method</th>
                    <th className="py-3.5 px-4 font-bold">Cashier</th>
                    <th className="py-3.5 px-4 font-bold">Sync Origin</th>
                    <th className="py-3.5 px-4 font-bold">Issued At</th>
                    <th className="py-3.5 px-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {receipts.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{r.receiptNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-foreground">{r.student?.name}</td>
                      <td className="py-3 px-4 font-bold text-emerald-500">UGX {r.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded-lg bg-muted text-foreground text-[10px] font-bold">
                          {r.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-muted-foreground">{r.cashierName}</td>
                      <td className="py-3 px-4 font-sans">
                        {r.isOfflineSync ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-extrabold border border-amber-500/30">
                            Offline Desktop Client
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-extrabold border border-emerald-500/30">
                            Central Web Gateway
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(r.issuedAt).toLocaleString()}</td>
                      <td className="py-3 px-4 font-sans">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReceiptForPrint(r)}
                          className="text-xs h-7 rounded-lg"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" /> Slip
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 3. BANK & CASH MANAGEMENT                                            */}
      {/* ========================================================================= */}
      {activeTab === "bank" && bankCashData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Bank & Cash Drawer Management</h2>
              <p className="text-xs text-muted-foreground">Drawer floats, bank accounts, inter-account transfers, and automated reconciliation</p>
            </div>
            <Button onClick={() => setShowTransferModal(true)} size="sm" className="rounded-xl">
              <ArrowRightLeft className="w-4 h-4 mr-1" /> Transfer Funds
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Cash Drawer Float (1010)</div>
              <div className="text-2xl font-black mt-2 text-emerald-600 dark:text-emerald-400 font-mono">
                UGX {bankCashData.positions.cashInDrawer.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Physical Currency on Counter</div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stanbic Operating Bank (1030)</div>
              <div className="text-2xl font-black mt-2 text-blue-600 dark:text-blue-400 font-mono">
                UGX {bankCashData.positions.stanbicBank.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Operating Cheque & EFT Account</div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">MoMo Merchant Wallet (1040)</div>
              <div className="text-2xl font-black mt-2 text-amber-600 dark:text-amber-400 font-mono">
                UGX {bankCashData.positions.momoMerchant.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">School Merchant Mobile Pay</div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Petty Cash Float (1020)</div>
              <div className="text-2xl font-black mt-2 text-purple-600 dark:text-purple-400 font-mono">
                UGX {bankCashData.positions.pettyFloat.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Imprest Fund for Campus Needs</div>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              Automated Bank Statement Reconciliation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compares school Stanbic Bank & Mobile Money merchant statements against General Ledger postings. Status:{" "}
              <strong className="text-emerald-500">Fully Reconciled (0 UGX Unmatched Variance)</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 4. GENERAL LEDGER & CHART OF ACCOUNTS                                */}
      {/* ========================================================================= */}
      {activeTab === "accounts" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Chart of Accounts & General Ledger</h2>
              <p className="text-xs text-muted-foreground">Standard 5-class double-entry accounts with continuous balance verification</p>
            </div>
            <Button onClick={() => setShowJournalModal(true)} size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> New Journal Voucher
            </Button>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Code</th>
                    <th className="py-3.5 px-4 font-bold">Account Name</th>
                    <th className="py-3.5 px-4 font-bold">Class</th>
                    <th className="py-3.5 px-4 font-bold">Type</th>
                    <th className="py-3.5 px-4 text-right font-bold">Net Balance (UGX)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {accounts.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-primary">{a.code}</td>
                      <td className="py-3 px-4 font-sans font-medium text-foreground">{a.name}</td>
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            a.accountClass === "ASSET"
                              ? "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                              : a.accountClass === "LIABILITY"
                              ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                              : a.accountClass === "EQUITY"
                              ? "bg-purple-500/15 text-purple-500 border border-purple-500/30"
                              : a.accountClass === "REVENUE"
                              ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                          }`}
                        >
                          {a.accountClass}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-muted-foreground">
                        {a.isBankOrCash ? "Liquid Reserve" : "Ledger Control"}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-foreground">
                        {a.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 5. ACCOUNTS PAYABLE & SUPPLIERS                                      */}
      {/* ========================================================================= */}
      {activeTab === "expenses" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Accounts Payable & Supplier Vouchers</h2>
              <p className="text-xs text-muted-foreground">Vendor records, purchase orders, 3-way matching approvals, and disbursements</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowSupplierModal(true)} variant="outline" size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-1" /> Add Supplier
              </Button>
              <Button onClick={() => setShowExpenseModal(true)} size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-1" /> Record Voucher
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Voucher #</th>
                    <th className="py-3.5 px-4 font-bold">Payee / Vendor</th>
                    <th className="py-3.5 px-4 font-bold">Department</th>
                    <th className="py-3.5 px-4 font-bold">Amount</th>
                    <th className="py-3.5 px-4 font-bold">Method</th>
                    <th className="py-3.5 px-4 font-bold">Approval</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {expensesData.expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{exp.voucherNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-foreground">{exp.paidTo}</td>
                      <td className="py-3 px-4 font-sans">{exp.department}</td>
                      <td className="py-3 px-4 font-bold text-rose-500">UGX {exp.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-sans text-[10px]">{exp.paymentMethod}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          {exp.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-muted-foreground">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 6. STAFF PAYROLL & COMPENSATION                                      */}
      {/* ========================================================================= */}
      {activeTab === "payroll" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Staff Payroll & Statutory Remittances</h2>
              <p className="text-xs text-muted-foreground">Salaries, allowances, PAYE tax, NSSF employee/employer splits, and automated payslips</p>
            </div>
            <Button onClick={() => setShowPayrollModal(true)} size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> Run Monthly Payroll
            </Button>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Payslip Ref</th>
                    <th className="py-3.5 px-4 font-bold">Faculty Member</th>
                    <th className="py-3.5 px-4 font-bold">Gross Pay</th>
                    <th className="py-3.5 px-4 font-bold">PAYE Tax</th>
                    <th className="py-3.5 px-4 font-bold">NSSF (5%)</th>
                    <th className="py-3.5 px-4 font-bold">Net Salary</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {payrollData.payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">{pay.payslipRef}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-foreground">{pay.teacher?.name}</td>
                      <td className="py-3 px-4">UGX {pay.grossSalary.toLocaleString()}</td>
                      <td className="py-3 px-4 text-rose-500 font-bold">-UGX {pay.payeTax.toLocaleString()}</td>
                      <td className="py-3 px-4 text-amber-500 font-bold">-UGX {pay.nssfEmployee.toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-emerald-500">UGX {pay.netSalary.toLocaleString()}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayslipForPrint(pay)}
                          className="h-7 text-xs rounded-lg"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 7. BUDGETING & COST CENTERS                                          */}
      {/* ========================================================================= */}
      {activeTab === "budgets" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Departmental Budgeting & Variance Analysis</h2>
              <p className="text-xs text-muted-foreground">Allocated budgets vs real-time expenditure with overspend threshold controls</p>
            </div>
            <Button onClick={() => setShowBudgetModal(true)} size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> New Budget Allocation
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((b) => (
              <div key={b.id} className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-foreground">{b.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-extrabold border border-primary/20">
                    {b.academicYear}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">Department: {b.department}</div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Budget Allocation</span>
                    <span className="font-mono">UGX {b.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[42%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>Spent: UGX {(b.totalBudget * 0.42).toLocaleString()}</span>
                    <span>Remaining: UGX {(b.totalBudget * 0.58).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 8. FIXED ASSETS REGISTER                                             */}
      {/* ========================================================================= */}
      {activeTab === "assets" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Fixed Assets Register & Depreciation</h2>
              <p className="text-xs text-muted-foreground">Capital infrastructure, vehicles, IT labs, and automated straight-line depreciation</p>
            </div>
            <Button onClick={() => setShowAssetModal(true)} size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> Enroll Fixed Asset
            </Button>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/60">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Asset Tag</th>
                    <th className="py-3.5 px-4 font-bold">Asset Name</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Purchase Cost</th>
                    <th className="py-3.5 px-4 font-bold">Accum. Depreciation</th>
                    <th className="py-3.5 px-4 font-bold">Net Book Value (NBV)</th>
                    <th className="py-3.5 px-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {assets.map((ast) => (
                    <tr key={ast.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-primary">{ast.assetTag}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-foreground">{ast.name}</td>
                      <td className="py-3 px-4 font-sans">{ast.category}</td>
                      <td className="py-3 px-4 font-bold">UGX {ast.purchaseCost.toLocaleString()}</td>
                      <td className="py-3 px-4 text-rose-500 font-bold">
                        UGX {ast.accumulatedDepreciation.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-emerald-500 font-bold">
                        UGX {ast.netBookValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunDepreciation(ast.id)}
                          className="h-7 text-xs rounded-lg"
                        >
                          Run Depreciation
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 9. TAX & STATUTORY COMPLIANCE                                        */}
      {/* ========================================================================= */}
      {activeTab === "tax" && taxData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Uganda Statutory Tax Compliance Engine</h2>
              <p className="text-xs text-muted-foreground">URA PAYE graduated brackets, NSSF statutory contributions, and 6% WHT on supplier bills</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-500 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4" /> URA & NSSF Compliant
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total PAYE Tax Deducted</div>
              <div className="text-2xl font-black mt-2 text-rose-600 dark:text-rose-400 font-mono">
                UGX {taxData.summary.totalPayeDeducted.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Due by {taxData.summary.filingDeadline}</div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">NSSF Employee (5%)</div>
              <div className="text-2xl font-black mt-2 text-amber-600 dark:text-amber-400 font-mono">
                UGX {taxData.summary.totalNssfEmployee.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Staff Salary Deductions</div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">NSSF Employer (10%)</div>
              <div className="text-2xl font-black mt-2 text-blue-600 dark:text-blue-400 font-mono">
                UGX {taxData.summary.totalNssfEmployer.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">School Statutory Contribution</div>
            </div>

            <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm">
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Combined Statutory Due</div>
              <div className="text-2xl font-black mt-2 text-purple-600 dark:text-purple-400 font-mono">
                UGX {taxData.summary.totalStatutoryDue.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-500 font-bold mt-1">Filing-Ready for URA & NSSF</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 10. FINANCIAL STATEMENTS                                             */}
      {/* ========================================================================= */}
      {activeTab === "reports" && statements && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Financial Statements & Reporting Engine</h2>
              <p className="text-xs text-muted-foreground">Audited Balance Sheet, Income Statement (P&L), Cash Flow, and Aged Debtors report</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-xl">
              <Printer className="w-4 h-4 mr-1" /> Print Official Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Sheet Card */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base flex items-center justify-between text-foreground">
                <span>Balance Sheet (Statement of Financial Position)</span>
                <span className="text-xs font-mono text-emerald-500 font-extrabold">
                  {statements.balanceSheet.isBalanced ? "✓ Debits == Credits" : "Reconciliation Notice"}
                </span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-border/40 font-bold text-sm">
                  <span>TOTAL ASSETS</span>
                  <span className="font-mono">UGX {statements.balanceSheet.totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40 font-bold text-sm">
                  <span>TOTAL LIABILITIES</span>
                  <span className="font-mono">UGX {statements.balanceSheet.totalLiabilities.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40 font-bold text-sm">
                  <span>TOTAL EQUITY & RETAINED SURPLUS</span>
                  <span className="font-mono">UGX {(statements.balanceSheet.totalEquity + statements.balanceSheet.netSurplus).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Income Statement (P&L) */}
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base flex items-center justify-between text-foreground">
                <span>Income Statement (Profit & Loss)</span>
                <span className="text-xs font-mono text-primary font-bold">
                  Operating Margin: {statements.incomeStatement.marginPercent}%
                </span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-border/40 font-bold text-sm text-emerald-600">
                  <span>TOTAL OPERATIONAL REVENUES</span>
                  <span className="font-mono">UGX {statements.incomeStatement.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40 font-bold text-sm text-rose-500">
                  <span>TOTAL OPERATING EXPENSES</span>
                  <span className="font-mono">UGX {statements.incomeStatement.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-t-2 border-border font-black text-base text-primary">
                  <span>NET OPERATING SURPLUS</span>
                  <span className="font-mono">UGX {statements.incomeStatement.netSurplus.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 11. WORKSTATION SUPERVISION                                          */}
      {/* ========================================================================= */}
      {activeTab === "workstations" && (
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
                    onClick={() => handleToggleLock(w.machineId, w.isBlocked)}
                    className="text-xs h-8 rounded-xl font-bold"
                  >
                    {w.isBlocked ? <Unlock className="w-3.5 h-3.5 mr-1" /> : <Lock className="w-3.5 h-3.5 mr-1" />}
                    {w.isBlocked ? "Unlock Device" : "Remote Lockout"}
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Cashier: <strong className="text-foreground">{w.assignedCashier}</strong></div>
                  <div>Client: <strong className="text-foreground">v{w.clientVersion}</strong></div>
                  <div>Last Sync: {w.lastSyncAt ? new Date(w.lastSyncAt).toLocaleString() : "Never"}</div>
                  <div>IP: {w.lastIpAddress || "Local Workstation"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: AUDIT LOG                                                            */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="bg-card border border-border/80 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            Immutable Financial Audit Trail
          </h3>
          <p className="text-xs text-muted-foreground">
            Cryptographically timestamped log of all fee payments, offline syncs, vouchers, and approvals.
          </p>

          <div className="divide-y divide-border/40">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-mono">{log.workstationId}</span>
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    By {log.actorName} ({log.actorRole}) • {log.details}
                  </div>
                </div>
                <div className="text-muted-foreground whitespace-nowrap font-mono">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MEAL & MILK PASSES MODULE (FINANCE-GOVERNED)                         */}
      {/* ========================================================================= */}
      {activeTab === "meals" && (
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
                    Student Meal & Milk Passes Registry
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Bursar-authorized dining passes, catering fee clearance checks, milk quotas, and arrears suspension.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoIssueMealPasses}
                className="rounded-xl gap-1.5 text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Auto-Issue Enrolled
              </Button>
              <Button
                size="sm"
                onClick={() => setShowIssueMealModal(true)}
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
              <div className="text-xs text-muted-foreground font-semibold">Daily Milk Rations</div>
              <div className="text-2xl font-bold font-display text-blue-600 mt-1 flex items-center gap-1.5">
                <Milk className="w-5 h-5 text-blue-500" />
                {mealCards.reduce((acc, c) => acc + (c.milkQuota || 1), 0)} Cans
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
                <option value="BOARDING_FULL">Boarding Full (Breakfast + Milk)</option>
                <option value="DAY_LUNCH">Day Scholar Lunch</option>
                <option value="MILK_NUTRITION_AWARD">Milk & Nutrition Award</option>
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
                    <th className="p-4">Milk Ration Quota</th>
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
                    mealCards
                      .filter((c) => {
                        const matchesSearch =
                          c.cardNumber?.toLowerCase().includes(mealSearchQuery.toLowerCase()) ||
                          c.student?.name?.toLowerCase().includes(mealSearchQuery.toLowerCase()) ||
                          c.student?.class?.name?.toLowerCase().includes(mealSearchQuery.toLowerCase());
                        const matchesPlan = mealFilterPlan === "ALL" || c.planType === mealFilterPlan;
                        const matchesStatus = mealFilterStatus === "ALL" || c.status === mealFilterStatus;
                        return matchesSearch && matchesPlan && matchesStatus;
                      })
                      .map((card) => {
                        // Match student against invoices to find fee balance
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
                            <td className="p-4 font-semibold">
                              <div className="flex items-center gap-1.5 text-blue-600">
                                <Milk className="w-3.5 h-3.5" />
                                <span>{card.milkQuota || 1} Can / Day</span>
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
                                onClick={() => handleToggleMealPassStatus(card)}
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
      )}

      {/* ========================================================================= */}
      {/* ALL INTERACTIVE MODALS                                                    */}
      {/* ========================================================================= */}

      {/* SWITCH USER MODAL */}
      {showSwitchUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" /> Switch Staff Profile
              </h3>
              <button onClick={() => setShowSwitchUserModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-2">
              {ENTERPRISE_FINANCE_USERS.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSwitchUser(u)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentUser.id === u.id
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-muted/30 hover:bg-muted/70 border-border/60"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      {u.name}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-mono">{u.role}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{u.title}</div>
                    <div className="text-[11px] text-amber-500 font-mono mt-0.5">PIN: {u.pin}</div>
                  </div>
                  {currentUser.id === u.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WEB POS PAYMENT MODAL */}
      {showPosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-500" /> Fast POS Fee Collection
              </h3>
              <button onClick={() => setShowPosModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleRecordPosPayment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Select Invoiced Student *</label>
                <select
                  required
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={posForm.invoiceId}
                  onChange={(e) => {
                    const selected = invoices.find((inv) => inv.id === e.target.value);
                    if (selected) {
                      setPosForm({
                        ...posForm,
                        invoiceId: selected.id,
                        studentId: selected.studentId,
                        amount: selected.balance.toString(),
                      });
                    }
                  }}
                >
                  <option value="">-- Choose student with outstanding balance --</option>
                  {invoices
                    .filter((inv) => inv.balance > 0)
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.student?.name} ({inv.student?.class?.name || "General"}) — Balance: UGX {inv.balance.toLocaleString()}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Amount to Collect (UGX) *</label>
                <Input
                  type="number"
                  required
                  value={posForm.amount}
                  onChange={(e) => setPosForm({ ...posForm, amount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                  <select
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs"
                    value={posForm.paymentMethod}
                    onChange={(e) => setPosForm({ ...posForm, paymentMethod: e.target.value })}
                  >
                    <option value="CASH">Cash Drawer</option>
                    <option value="BANK_DEPOSIT">Bank Deposit Slip</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="POS_CARD">POS Card Terminal</option>
                    <option value="CHEQUE">Bank Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Reference / Slip #</label>
                  <Input
                    placeholder="e.g. SLIP-99881"
                    value={posForm.referenceNo}
                    onChange={(e) => setPosForm({ ...posForm, referenceNo: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Cashier Notes</label>
                <Input
                  placeholder="e.g. Term 1 Part payment"
                  value={posForm.notes}
                  onChange={(e) => setPosForm({ ...posForm, notes: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowPosModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">
                  🖨️ Collect & Issue Receipt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL RECEIPT SLIP MODAL */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl font-mono text-xs space-y-3 animate-in zoom-in-95 duration-150">
            <div className="text-center pb-2 border-b-2 border-dashed border-slate-400">
              <div className="text-xl font-black">WELLSTAR BRIGHT SCHOOL</div>
              <div className="text-[10px] uppercase font-bold text-slate-600">Official Tuition & Fees Payment Receipt</div>
              <div className="text-[10px] mt-1">Receipt #: <strong>{selectedReceiptForPrint.receiptNumber}</strong></div>
              <div className="text-[10px]">Date: {new Date(selectedReceiptForPrint.issuedAt).toLocaleString()}</div>
            </div>

            <div className="space-y-1 text-[11px] pt-1">
              <div>Student: <strong>{selectedReceiptForPrint.student?.name}</strong></div>
              <div>Class: {selectedReceiptForPrint.student?.class?.name || "General"}</div>
              <div>Cashier: {selectedReceiptForPrint.cashierName}</div>
              <div>Method: {selectedReceiptForPrint.paymentMethod}</div>
            </div>

            <div className="py-2 border-y-2 border-dashed border-slate-400 flex items-center justify-between font-bold text-sm">
              <span>AMOUNT PAID:</span>
              <span className="text-base">UGX {Number(selectedReceiptForPrint.amount).toLocaleString()}</span>
            </div>

            <div className="text-center text-[9px] text-slate-500 pt-1">
              Computer-Generated Official Receipt • Valid Without Seal
              <br />Thank you for supporting Wellstar Bright School!
            </div>

            <div className="flex items-center gap-2 pt-3 no-print">
              <Button onClick={() => window.print()} className="w-full bg-slate-900 text-white font-bold rounded-xl">
                <Printer className="w-4 h-4 mr-1" /> Print Slip
              </Button>
              <Button variant="outline" onClick={() => setSelectedReceiptForPrint(null)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NEW STUDENT BILL MODAL */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Issue Term Fee Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Student *</label>
                <select
                  required
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={invoiceForm.studentId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                >
                  <option value="">-- Select Student to Bill --</option>
                  {invoices.map((inv) => (
                    <option key={inv.studentId} value={inv.studentId}>
                      {inv.student?.name} ({inv.student?.class?.name || "General"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Term</label>
                  <Input
                    value={invoiceForm.term}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, term: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tuition Fee (UGX) *</label>
                  <Input
                    type="number"
                    required
                    value={invoiceForm.subtotal}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, subtotal: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Scholarship / Sibling Discount (UGX)</label>
                <Input
                  type="number"
                  value={invoiceForm.discountAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, discountAmount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowInvoiceModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">Issue & Post to Ledger</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Record Expenditure Voucher</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Voucher Title *</label>
                <Input
                  required
                  placeholder="e.g. Science Lab Consumables"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Amount (UGX) *</label>
                  <Input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                  <select
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs"
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                  >
                    <option value="CASH">Cash Drawer</option>
                    <option value="BANK_TRANSFER">Bank Operating A/C</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Paid To (Payee) *</label>
                  <Input
                    required
                    placeholder="e.g. Shell Uganda Ltd"
                    value={expenseForm.paidTo}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Department</label>
                  <Input
                    placeholder="e.g. Boarding"
                    value={expenseForm.department}
                    onChange={(e) => setExpenseForm({ ...expenseForm, department: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">Post to General Ledger</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSFER FUNDS MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-500" /> Internal Funds Transfer
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleTransferFunds} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">From Account *</label>
                <select
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={transferForm.fromAccountCode}
                  onChange={(e) => setTransferForm({ ...transferForm, fromAccountCode: e.target.value })}
                >
                  <option value="1010">Main Cash Drawer Float (1010)</option>
                  <option value="1030">Stanbic Operating Bank (1030)</option>
                  <option value="1040">Mobile Money Merchant (1040)</option>
                  <option value="1020">Petty Cash Float (1020)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">To Account *</label>
                <select
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={transferForm.toAccountCode}
                  onChange={(e) => setTransferForm({ ...transferForm, toAccountCode: e.target.value })}
                >
                  <option value="1030">Stanbic Operating Bank (1030)</option>
                  <option value="1010">Main Cash Drawer Float (1010)</option>
                  <option value="1020">Petty Cash Float (1020)</option>
                  <option value="1040">Mobile Money Merchant (1040)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Amount to Transfer (UGX) *</label>
                <Input
                  type="number"
                  required
                  placeholder="e.g. 1000000"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Reason / Description</label>
                <Input
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowTransferModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">Execute Balanced Transfer</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST MANUAL JOURNAL VOUCHER MODAL */}
      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-500" /> Manual Journal Voucher
              </h3>
              <button onClick={() => setShowJournalModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <p className="text-xs text-muted-foreground">
              Posts an authenticated balanced double-entry transaction to the General Ledger.
            </p>

            <form onSubmit={handlePostJournal} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Debit Account *</label>
                <select
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={journalForm.debitAccount}
                  onChange={(e) => setJournalForm({ ...journalForm, debitAccount: e.target.value })}
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.code}>
                      {a.code} - {a.name} ({a.accountClass})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Credit Account *</label>
                <select
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={journalForm.creditAccount}
                  onChange={(e) => setJournalForm({ ...journalForm, creditAccount: e.target.value })}
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.code}>
                      {a.code} - {a.name} ({a.accountClass})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Balanced Amount (UGX) *</label>
                <Input
                  type="number"
                  required
                  placeholder="500000"
                  value={journalForm.amount}
                  onChange={(e) => setJournalForm({ ...journalForm, amount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Narration / Description *</label>
                <Input
                  required
                  placeholder="e.g. End of term audit adjustment"
                  value={journalForm.description}
                  onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowJournalModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">Post Balanced Entry</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RUN STAFF PAYROLL MODAL */}
      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" /> Run Faculty & Staff Payroll
              </h3>
              <button onClick={() => setShowPayrollModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleProcessPayroll} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Faculty Member *</label>
                <select
                  required
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={payrollForm.teacherId}
                  onChange={(e) => setPayrollForm({ ...payrollForm, teacherId: e.target.value })}
                >
                  <option value="">-- Select faculty / staff member --</option>
                  {payrollData.payroll.map((p) => (
                    <option key={p.teacherId} value={p.teacherId}>
                      {p.teacher?.name}
                    </option>
                  ))}
                  {payrollData.payroll.length === 0 && (
                    <option value="demo-teacher">Senior Teacher (General Faculty)</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Month</label>
                  <Input
                    value={payrollForm.month}
                    onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Year</label>
                  <Input
                    value={payrollForm.year}
                    onChange={(e) => setPayrollForm({ ...payrollForm, year: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Base Salary (UGX) *</label>
                <Input
                  type="number"
                  required
                  value={payrollForm.baseSalary}
                  onChange={(e) => setPayrollForm({ ...payrollForm, baseSalary: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Housing Allowance</label>
                  <Input
                    type="number"
                    value={payrollForm.housingAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, housingAllowance: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Transport Allowance</label>
                  <Input
                    type="number"
                    value={payrollForm.transportAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, transportAllowance: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowPayrollModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl font-bold">Compute & Disburse</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PAYSLIP MODAL */}
      {selectedPayslipForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl max-w-md w-full p-6 shadow-2xl font-mono text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="text-center pb-2 border-b-2 border-slate-900">
              <div className="text-lg font-black">WELLSTAR BRIGHT SECONDARY SCHOOL</div>
              <div className="text-[11px] font-bold text-slate-600 uppercase">Official Confidential Staff Payslip</div>
              <div className="text-[10px]">Payslip Ref: <strong>{selectedPayslipForPrint.payslipRef}</strong></div>
              <div className="text-[10px]">Period: {selectedPayslipForPrint.month} {selectedPayslipForPrint.year}</div>
            </div>

            <div className="text-xs space-y-1">
              <div>Employee Name: <strong>{selectedPayslipForPrint.teacher?.name}</strong></div>
              <div>Staff Role: {selectedPayslipForPrint.teacher?.role || "Faculty"}</div>
            </div>

            <div className="border-t border-b border-slate-300 py-2.5 space-y-1.5 text-[11px]">
              <div className="flex justify-between font-bold">
                <span>1. Gross Earnings:</span>
                <span>UGX {selectedPayslipForPrint.grossSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-3 text-slate-600">
                <span>- Base Salary</span>
                <span>UGX {selectedPayslipForPrint.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-3 text-slate-600">
                <span>- Allowances</span>
                <span>UGX {(selectedPayslipForPrint.housingAllowance + selectedPayslipForPrint.transportAllowance).toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold pt-1 text-rose-600">
                <span>2. Statutory Deductions:</span>
                <span>- UGX {selectedPayslipForPrint.totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-3 text-slate-600">
                <span>- PAYE Tax (URA)</span>
                <span>UGX {selectedPayslipForPrint.payeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-3 text-slate-600">
                <span>- NSSF Employee (5%)</span>
                <span>UGX {selectedPayslipForPrint.nssfEmployee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between font-black text-sm pt-1 text-emerald-700">
              <span>NET SALARY PAYABLE:</span>
              <span>UGX {selectedPayslipForPrint.netSalary.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 pt-3 no-print">
              <Button onClick={() => window.print()} className="w-full bg-slate-900 text-white font-bold rounded-xl">
                <Printer className="w-4 h-4 mr-1" /> Print Payslip
              </Button>
              <Button variant="outline" onClick={() => setSelectedPayslipForPrint(null)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE MEAL PASS MODAL (FINANCE-GOVERNED) */}
      {showIssueMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Utensils className="w-5 h-5 text-amber-500" />
                Issue Authorized Student Meal Pass
              </h3>
              <button
                onClick={() => setShowIssueMealModal(false)}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Authorize dining hall access, catering package, and daily morning milk rations.
            </p>

            <form onSubmit={handleIssueMealPass} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Select Invoiced Student *
                </label>
                <select
                  required
                  className="w-full h-11 rounded-2xl border border-input bg-background px-3 text-xs"
                  value={mealModalStudentId}
                  onChange={(e) => setMealModalStudentId(e.target.value)}
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
                  value={mealModalPlanType}
                  onChange={(e) => setMealModalPlanType(e.target.value)}
                >
                  <option value="BOARDING_FULL">Boarding Full (Breakfast + Milk, Lunch, Supper)</option>
                  <option value="DAY_LUNCH">Day Scholar Lunch Only</option>
                  <option value="MILK_NUTRITION_AWARD">Milk & Nutrition Award Pass</option>
                  <option value="BURSARY_SUBSIDIZED">Bursary Subsidized Meal Pass</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Daily Morning Milk Quota (Cans / Portions)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={mealModalMilkQuota}
                  onChange={(e) => setMealModalMilkQuota(Number(e.target.value))}
                  className="rounded-xl h-11"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Allergies / Special Dietary Requirements
                </label>
                <Input
                  placeholder="e.g. Lactose intolerant, vegetarian, peanut allergy"
                  value={mealModalAllergies}
                  onChange={(e) => setMealModalAllergies(e.target.value)}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIssueMealModal(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold"
                >
                  Issue & Authorize Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
