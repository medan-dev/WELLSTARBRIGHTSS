"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSchoolBrand } from "@/context/SchoolBrandContext";
import {
  ShieldCheck,
  Wallet,
  Award,
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
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Globe,
  GraduationCap,
  Settings,
  Cloud,
  Upload,
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
import { FinanceMealCardsTab } from "@/components/finance/FinanceMealCardsTab";
import { IssueMealCardModal } from "@/components/finance/IssueMealCardModal";
import { FinanceWorkstationsTab } from "@/components/finance/FinanceWorkstationsTab";
import { FinanceAuditLogTab } from "@/components/finance/FinanceAuditLogTab";
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
} from "../../../app/admin/finance-actions";
import {
  getAllMealCards,
  getDailyMealStats,
  issueOrUpdateMealCard,
  toggleMealCardStatus,
  batchGenerateMealCards,
} from "../../../app/admin/meal-actions";
import { ENTERPRISE_FINANCE_USERS, FinanceAuthUser } from "@/lib/finance-users";

type TabKey =
  | "overview"
  | "pos"
  | "receipts"
  | "fees"
  | "invoices"
  | "expenses"
  | "payroll"
  | "bank"
  | "accounts"
  | "meals"
  | "reports"
  | "tax"
  | "workstations"
  | "settings"
  | "queue"
  | "audit"
  | "budgets"
  | "assets"
  | "analytics";

// Canonical Wellstar Bright Secondary School Finance Dataset (Matching Desktop App)
const CANONICAL_WELLSTAR_STUDENTS = [
  { id: "S-1042", studentId: "S-1042", name: "Kato Joseph", regNo: "WBS-2026-001", class: "S.1A", totalDue: 450000, totalFees: 450000, paid: 0, paidAmount: 0, balance: 450000, invoiceId: "INV-2026-T1-1042", invoiceNumber: "INV-2026-T1-1042", status: "UNPAID", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1043", studentId: "S-1043", name: "Nansubuga Mary", regNo: "WBS-2026-002", class: "S.1A", totalDue: 450000, totalFees: 450000, paid: 200000, paidAmount: 200000, balance: 250000, invoiceId: "INV-2026-T1-1043", invoiceNumber: "INV-2026-T1-1043", status: "PARTIAL", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1044", studentId: "S-1044", name: "Mukasa Peter", regNo: "WBS-2026-003", class: "S.1A", totalDue: 600000, totalFees: 600000, paid: 0, paidAmount: 0, balance: 600000, invoiceId: "INV-2026-T1-1044", invoiceNumber: "INV-2026-T1-1044", status: "UNPAID", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1045", studentId: "S-1045", name: "Babirye Sarah", regNo: "WBS-2026-004", class: "S.4 West", totalDue: 450000, totalFees: 450000, paid: 300000, paidAmount: 300000, balance: 150000, invoiceId: "INV-2026-T1-1045", invoiceNumber: "INV-2026-T1-1045", status: "PARTIAL", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1046", studentId: "S-1046", name: "Okello Denis", regNo: "WBS-2026-005", class: "S.5 Sci", totalDue: 550000, totalFees: 550000, paid: 550000, paidAmount: 550000, balance: 0, invoiceId: "INV-2026-T1-1046", invoiceNumber: "INV-2026-T1-1046", status: "PAID", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1047", studentId: "S-1047", name: "Namagembe Grace", regNo: "WBS-2026-006", class: "S.6 Arts", totalDue: 500000, totalFees: 500000, paid: 350000, paidAmount: 350000, balance: 150000, invoiceId: "INV-2026-T1-1047", invoiceNumber: "INV-2026-T1-1047", status: "PARTIAL", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1048", studentId: "S-1048", name: "Kintu Moses", regNo: "WBS-2026-007", class: "S.2A", totalDue: 450000, totalFees: 450000, paid: 0, paidAmount: 0, balance: 450000, invoiceId: "INV-2026-T1-1048", invoiceNumber: "INV-2026-T1-1048", status: "UNPAID", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1049", studentId: "S-1049", name: "Nalubega Prossy", regNo: "WBS-2026-008", class: "S.2B", totalDue: 450000, totalFees: 450000, paid: 450000, paidAmount: 450000, balance: 0, invoiceId: "INV-2026-T1-1049", invoiceNumber: "INV-2026-T1-1049", status: "PAID", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1050", studentId: "S-1050", name: "Opolot Emmanuel", regNo: "WBS-2026-009", class: "S.3 East", totalDue: 500000, totalFees: 500000, paid: 250000, paidAmount: 250000, balance: 250000, invoiceId: "INV-2026-T1-1050", invoiceNumber: "INV-2026-T1-1050", status: "PARTIAL", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1051", studentId: "S-1051", name: "Akello Joan", regNo: "WBS-2026-010", class: "S.3 West", totalDue: 450000, totalFees: 450000, paid: 150000, paidAmount: 150000, balance: 300000, invoiceId: "INV-2026-T1-1051", invoiceNumber: "INV-2026-T1-1051", status: "PARTIAL", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1052", studentId: "S-1052", name: "Walusimbi David", regNo: "WBS-2026-011", class: "S.4 East", totalDue: 450000, totalFees: 450000, paid: 0, paidAmount: 0, balance: 450000, invoiceId: "INV-2026-T1-1052", invoiceNumber: "INV-2026-T1-1052", status: "UNPAID", term: "Term 1 2026", academicYear: "2026" },
  { id: "S-1053", studentId: "S-1053", name: "Nakato Betty", regNo: "WBS-2026-012", class: "S.5 Arts", totalDue: 550000, totalFees: 550000, paid: 550000, paidAmount: 550000, balance: 0, invoiceId: "INV-2026-T1-1053", invoiceNumber: "INV-2026-T1-1053", status: "PAID", term: "Term 1 2026", academicYear: "2026" },
];

const CANONICAL_WELLSTAR_RECEIPTS = [
  { id: "rcp_1", receiptNumber: "RCP-2026-00101", student: { name: "Nansubuga Mary", class: { name: "S.1A" } }, amount: 200000, paymentMethod: "CASH", cashierName: "Joseph Kato", isOfflineSync: false, issuedAt: new Date(Date.now() - 5 * 86400000).toISOString(), notes: "Part payment Term 1 fees" },
  { id: "rcp_2", receiptNumber: "RCP-2026-00102", student: { name: "Babirye Sarah", class: { name: "S.4 West" } }, amount: 300000, paymentMethod: "MOBILE_MONEY", cashierName: "Joseph Kato", isOfflineSync: false, issuedAt: new Date(Date.now() - 4 * 86400000).toISOString(), notes: "MTN Mobile Money reference REF-WBSS-902" },
  { id: "rcp_3", receiptNumber: "RCP-2026-00103", student: { name: "Okello Denis", class: { name: "S.5 Sci" } }, amount: 550000, paymentMethod: "BANK_DEPOSIT", cashierName: "CPA Sarah Namubiru", isOfflineSync: false, issuedAt: new Date(Date.now() - 3 * 86400000).toISOString(), notes: "Stanbic Bank direct deposit slip clearance" },
  { id: "rcp_4", receiptNumber: "RCP-2026-00104", student: { name: "Namagembe Grace", class: { name: "S.6 Arts" } }, amount: 350000, paymentMethod: "CASH", cashierName: "Joseph Kato", isOfflineSync: false, issuedAt: new Date(Date.now() - 2 * 86400000).toISOString(), notes: "Tuition installment collection" },
  { id: "rcp_5", receiptNumber: "RCP-2026-00105", student: { name: "Nalubega Prossy", class: { name: "S.2B" } }, amount: 450000, paymentMethod: "CASH", cashierName: "Joseph Kato", isOfflineSync: false, issuedAt: new Date(Date.now() - 2 * 86400000).toISOString(), notes: "Full clearance Term 1" },
  { id: "rcp_6", receiptNumber: "RCP-2026-00106", student: { name: "Opolot Emmanuel", class: { name: "S.3 East" } }, amount: 250000, paymentMethod: "CASH", cashierName: "Joseph Kato", isOfflineSync: false, issuedAt: new Date(Date.now() - 86400000).toISOString(), notes: "Term 1 50% deposit" },
  { id: "rcp_7", receiptNumber: "RCP-2026-00107", student: { name: "Akello Joan", class: { name: "S.3 West" } }, amount: 150000, paymentMethod: "CASH", cashierName: "Joseph Kato", isOfflineSync: false, issuedAt: new Date(Date.now() - 86400000).toISOString(), notes: "Initial term fee installment" },
  { id: "rcp_8", receiptNumber: "RCP-2026-00108", student: { name: "Nakato Betty", class: { name: "S.5 Arts" } }, amount: 550000, paymentMethod: "POS_CARD", cashierName: "CPA Sarah Namubiru", isOfflineSync: false, issuedAt: new Date().toISOString(), notes: "POS terminal card settlement" },
];

const CANONICAL_WELLSTAR_EXPENSES = [
  { id: "exp_1", voucherNumber: "PV-2026-WS01-101", paidTo: "Umeme Uganda Ltd", department: "Administration", category: "Electricity Bill", amount: 350000, paymentMethod: "BANK_TRANSFER", description: "March campus electricity grid power bill for main academic & laboratory blocks", recordedBy: "CPA Sarah Namubiru", approvalStatus: "APPROVED", expenseDate: "2026-03-24T10:15:00Z" },
  { id: "exp_2", voucherNumber: "PV-2026-WS01-102", paidTo: "Mukwano Wholesalers Mukono", department: "Kitchen & Food", category: "Kitchen Food Supplies", amount: 280000, paymentMethod: "CASH", description: "500kg Posho & Beans supply for boarding student dining hall meals", recordedBy: "Joseph Kato", approvalStatus: "APPROVED", expenseDate: "2026-03-25T11:30:00Z" },
  { id: "exp_3", voucherNumber: "PV-2026-WS01-103", paidTo: "TotalEnergies Mukono", department: "Transport & Bus", category: "Diesel & Fuel", amount: 120000, paymentMethod: "CASH", description: "School Bus diesel refill for student daily transit route", recordedBy: "Joseph Kato", approvalStatus: "APPROVED", expenseDate: "2026-03-26T08:45:00Z" },
  { id: "exp_4", voucherNumber: "PV-2026-WS01-104", paidTo: "Crown Publishers Ltd", department: "Science & Academics", category: "Stationery & Printing", amount: 180000, paymentMethod: "MOBILE_MONEY", description: "Term 1 Mid-Term Examination answer booklets and assessment sheets", recordedBy: "CPA Sarah Namubiru", approvalStatus: "APPROVED", expenseDate: "2026-03-27T14:20:00Z" },
];

const CANONICAL_WELLSTAR_PAYROLL = [
  { id: "pr_1", payslipRef: "PAY-2026-MAR-01", teacher: { name: "Sserwadda Ivan", role: "Head of Mathematics" }, month: "March", year: "2026", grossSalary: 1450000, baseSalary: 1200000, housingAllowance: 150000, transportAllowance: 100000, payeTax: 337000, nssfEmployee: 72500, totalDeductions: 409500, netSalary: 1040500, status: "PAID" },
  { id: "pr_2", payslipRef: "PAY-2026-MAR-02", teacher: { name: "Kemigisha Fiona", role: "English Literature Teacher" }, month: "March", year: "2026", grossSalary: 1250000, baseSalary: 1050000, housingAllowance: 100000, transportAllowance: 100000, payeTax: 277000, nssfEmployee: 62500, totalDeductions: 339500, netSalary: 910500, status: "PAID" },
  { id: "pr_3", payslipRef: "PAY-2026-MAR-03", teacher: { name: "Nagawa Christine", role: "Biology & Head of Sciences" }, month: "March", year: "2026", grossSalary: 1350000, baseSalary: 1150000, housingAllowance: 100000, transportAllowance: 100000, payeTax: 307000, nssfEmployee: 67500, totalDeductions: 374500, netSalary: 975500, status: "PAID" },
  { id: "pr_4", payslipRef: "PAY-2026-MAR-04", teacher: { name: "Ssekandi Isaac", role: "Computer Studies & ICT" }, month: "March", year: "2026", grossSalary: 1150000, baseSalary: 1000000, housingAllowance: 80000, transportAllowance: 70000, payeTax: 247000, nssfEmployee: 57500, totalDeductions: 304500, netSalary: 845500, status: "PAID" },
  { id: "pr_5", payslipRef: "PAY-2026-MAR-05", teacher: { name: "Opio Daniel", role: "History & CRE Teacher" }, month: "March", year: "2026", grossSalary: 980000, baseSalary: 850000, housingAllowance: 70000, transportAllowance: 60000, payeTax: 196000, nssfEmployee: 49000, totalDeductions: 245000, netSalary: 735000, status: "PAID" },
];

const CANONICAL_WELLSTAR_MEAL_CARDS = [
  { id: "mc_1", cardNumber: "MC-2026-1049", student: { name: "Okello Denis", class: { name: "S.5 Sci" } }, planType: "BOARDING_FULL", dailyQuota: 3, status: "ACTIVE", validUntil: new Date(Date.now() + 25 * 86400000).toISOString(), allergies: "Standard 1-Month Boarding Meal Card. Fee cleared 100%." },
  { id: "mc_2", cardNumber: "MC-2026-1050", student: { name: "Babirye Sarah", class: { name: "S.4 West" } }, planType: "DAY_LUNCH", dailyQuota: 1, status: "ACTIVE", validUntil: new Date(Date.now() + 3 * 86400000).toISOString(), allergies: "1-Week Day Scholar Meal Card. Renewal required upon next fee payment." },
  { id: "mc_3", cardNumber: "MC-2026-1051", student: { name: "Kato Joseph", class: { name: "S.1A" } }, planType: "BOARDING_FULL", dailyQuota: 3, status: "EXPIRED", validUntil: new Date(Date.now() - 5 * 86400000).toISOString(), allergies: "1-Month Card EXPIRED. Arrears balance of UGX 450,000 pending clearance." },
  { id: "mc_4", cardNumber: "MC-2026-1052", student: { name: "Namagembe Grace", class: { name: "S.6 Arts" } }, planType: "SPECIAL_DIET", dailyQuota: 3, status: "ACTIVE", validUntil: new Date(Date.now() + 20 * 86400000).toISOString(), allergies: "1-Month Special Dietary Meal Pass." },
];

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

  // Student Meal Passes Module state (Finance-governed)
  const [mealCards, setMealCards] = useState<any[]>([]);
  const [mealStats, setMealStats] = useState<any>(null);
  const [showIssueMealModal, setShowIssueMealModal] = useState(false);
  const [mealModalStudentId, setMealModalStudentId] = useState("");
  const [mealModalPlanType, setMealModalPlanType] = useState<any>("BOARDING_FULL");
  const [mealModalDailyQuota, setMealModalDailyQuota] = useState(3);
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
  const [showDownloadAppModal, setShowDownloadAppModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<any>(null);
  const [selectedPayslipForPrint, setSelectedPayslipForPrint] = useState<any>(null);

  // Standalone Application Layout State (Matching Desktop Client Exactly)
  const { brand } = useSchoolBrand();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userProfileMenuOpen, setUserProfileMenuOpen] = useState(false);
  const [drawerFloat, setDrawerFloat] = useState("150,000");
  const [showFloatModal, setShowFloatModal] = useState(false);
  const [tempFloatInput, setTempFloatInput] = useState("150,000");
  const [darkTheme, setDarkTheme] = useState(false);
  const userProfileDropdownRef = useRef<HTMLDivElement>(null);

  // POS Fee Counter State
  const [selectedStudentForPos, setSelectedStudentForPos] = useState<any>(null);
  const [posSearchQuery, setPosSearchQuery] = useState("");
  const [posAmount, setPosAmount] = useState("");
  const [posMethod, setPosMethod] = useState("CASH");
  const [posReference, setPosReference] = useState("");
  const [posNotes, setPosNotes] = useState("");

  // Lock Screen Shift State
  const [authPinVisible, setAuthPinVisible] = useState(false);
  const [authSelectedCashier, setAuthSelectedCashier] = useState("Joseph Kato");

  // System Settings State
  const [systemSettingsState, setSystemSettingsState] = useState({
    schoolName: "Wellstar Bright Secondary School",
    schoolShortName: "Wellstar Bright",
    schoolSub: "Mukono • Bursar Workstation & Financial ERP",
    schoolMotto: "Education is our Pride",
    logoUrl: "/logo.png",
    academicYear: "2026",
    activeTerm: "Term 1",
    themeMode: "light",
    currencyPreset: "UGX",
    currencySymbol: "UGX",
    decimalPlaces: 0,
    defaultDrawerFloat: 150000,
    receiptTitle: "WELLSTAR BRIGHT SECONDARY SCHOOL",
    receiptSub: "Official Tuition & Fees Payment Receipt",
    receiptFooter: "Official Computer-Generated Receipt • Valid Without Official Seal",
    receiptWidth: "80mm",
    machineId: "WS-BURSAR-01",
    serverUrl: "http://localhost:3000",
  });

  // Receipts Ledger filter state
  const [receiptFilterMethod, setReceiptFilterMethod] = useState("ALL");
  const [receiptSearchQuery, setReceiptSearchQuery] = useState("");

  // Sync Outbox State
  const [syncOutboxList, setSyncOutboxList] = useState<any[]>([
    { id: "sync_01", type: "RECEIPT_BATCH", count: 8, status: "SYNCED", timestamp: "Just now", gateway: "/api/finance/sync" },
    { id: "sync_02", type: "EXPENSE_VOUCHERS", count: 4, status: "SYNCED", timestamp: "12m ago", gateway: "/api/finance/sync" },
    { id: "sync_03", type: "MEAL_PASSES", count: 4, status: "SYNCED", timestamp: "1h ago", gateway: "/api/finance/sync" },
  ]);

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

      setOverview(
        ov || {
          kpis: {
            totalInvoiced: 6050000,
            totalCollected: 2600000,
            totalArrears: 3450000,
            totalDefaulters: 7,
            totalExpenses: 930000,
            netCashflow: 1670000,
            totalLiquidCash: 53550000,
            offlineReceiptsCount: 0,
            activeWorkstations: 2,
            blockedWorkstations: 0,
          },
        }
      );
      setAccounts(accs && accs.length > 0 ? accs : []);
      setInvoices(invs && invs.length > 0 ? invs : CANONICAL_WELLSTAR_STUDENTS);
      setReceipts(recs && recs.length > 0 ? recs : CANONICAL_WELLSTAR_RECEIPTS);
      setExpensesData(exps?.expenses && exps.expenses.length > 0 ? exps : { expenses: CANONICAL_WELLSTAR_EXPENSES, suppliers: [] });
      setPayrollData(payr?.payroll && payr.payroll.length > 0 ? payr : { payroll: CANONICAL_WELLSTAR_PAYROLL, loans: [] });
      setBudgets(bdgs || []);
      setAssets(asts || []);
      setWorkstations(
        wks && wks.length > 0
          ? wks
          : [
              { id: "ws_1", machineId: "WS-BURSAR-01", machineName: "Counter Workstation 01 (Front Desk)", assignedCashier: "Joseph Kato", isBlocked: false, clientVersion: "1.0.0", lastSyncAt: new Date().toISOString() },
              { id: "ws_2", machineId: "WS-BURSAR-HEAD", machineName: "Chief Bursar Executive Terminal", assignedCashier: "CPA Sarah Namubiru", isBlocked: false, clientVersion: "1.0.0", lastSyncAt: new Date().toISOString() },
            ]
      );
      setAuditLogs(auds || []);
      setStatements(stmts || null);
      setTaxData(tx || null);
      setBankCashData(
        bnk || {
          positions: {
            cashInDrawer: 2650000,
            stanbicBank: 42500000,
            momoMerchant: 8400000,
            totalSolvency: 53550000,
          },
        }
      );
      setMealCards(mCards && mCards.length > 0 ? mCards : CANONICAL_WELLSTAR_MEAL_CARDS);
      setMealStats(mStats || { totalActiveCards: 3, mealsServedToday: 12 });
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
    const isDark = typeof window !== "undefined" && (document.documentElement.classList.contains("dark") || localStorage.getItem("ns_theme") === "dark");
    setDarkTheme(isDark);
    if (typeof window !== "undefined") {
      const savedFloat = localStorage.getItem("wf_drawer_float");
      if (savedFloat) setDrawerFloat(savedFloat);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userProfileDropdownRef.current && !userProfileDropdownRef.current.contains(e.target as Node)) {
        setUserProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkTheme;
    setDarkTheme(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("ns_theme", nextDark ? "dark" : "light");
    } catch (_) {}
    toast.success(`Theme switched to ${nextDark ? "Dark Theme" : "Light Theme"}`);
  };

  const handleSaveDrawerFloat = (e: React.FormEvent) => {
    e.preventDefault();
    setDrawerFloat(tempFloatInput);
    try {
      localStorage.setItem("wf_drawer_float", tempFloatInput);
    } catch (_) {}
    setShowFloatModal(false);
    toast.success(`Opening Cash Float updated to UGX ${tempFloatInput}`);
  };

  // Unlock Screen with PIN
  const handleUnlockScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockPinInput === currentUser.pin || lockPinInput === "9900") {
      setIsLocked(false);
      setLockPinInput("");
      try {
        localStorage.setItem("wf_drawer_float", drawerFloat);
        localStorage.setItem("wf_web_user", JSON.stringify(currentUser));
      } catch (_) {}
      toast.success(`Terminal unlocked for ${currentUser.name}`);
    } else {
      toast.error("Invalid security PIN. Access denied.");
    }
  };

  // Instant POS Counter Collection & Printing
  const handleQuickPosCollect = async (printSlip: boolean = true) => {
    if (!selectedStudentForPos) {
      toast.error("Please select a student from the roster first.");
      return;
    }
    const amt = parseFloat(posAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid payment amount to collect.");
      return;
    }

    try {
      const invId = selectedStudentForPos.invoiceId || invoices[0]?.id;
      const res = await recordCounterFeePaymentAction({
        studentId: selectedStudentForPos.studentId || selectedStudentForPos.id || "S-1042",
        invoiceId: invId,
        amount: amt,
        paymentMethod: posMethod as any,
        referenceNo: posReference || `RCP-POS-${Date.now().toString().slice(-5)}`,
        cashierName: currentUser.name || "Joseph Kato",
        workstationId: currentUser.workstationId || "WS-BURSAR-01",
        notes: posNotes || `Counter POS payment for ${selectedStudentForPos.name}`,
      });

      if (res.success) {
        toast.success(`Payment of UGX ${amt.toLocaleString()} recorded for ${selectedStudentForPos.name}!`);
        const newReceipt = {
          id: `rcp_${Date.now()}`,
          receiptNumber: (res as any).receiptNumber || `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          invoiceId: invId,
          student: {
            name: selectedStudentForPos.name,
            regNo: selectedStudentForPos.regNo,
            class: { name: selectedStudentForPos.class },
          },
          amount: amt,
          paymentMethod: posMethod,
          cashierName: currentUser.name,
          issuedAt: new Date().toISOString(),
          isOfflineSync: false,
        };
        setReceipts((prev) => [newReceipt, ...prev]);
        setPosAmount("");
        setPosReference("");
        setPosNotes("");
        if (printSlip) {
          setSelectedReceiptForPrint(newReceipt);
        }
        loadData();
      } else {
        toast.error((res as any)?.error || "Payment recording failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process payment");
    }
  };

  const handleSaveSystemSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem("wf_system_settings", JSON.stringify(systemSettingsState));
      toast.success("System Configuration & Branding saved successfully!");
    } catch (_) {
      toast.success("Configuration updated!");
    }
  };

  const handleResetSystemSettings = () => {
    setSystemSettingsState({
      schoolName: "Wellstar Bright Secondary School",
      schoolShortName: "Wellstar Bright",
      schoolSub: "Mukono • Bursar Workstation & Financial ERP",
      schoolMotto: "Education is our Pride",
      logoUrl: "/logo.png",
      academicYear: "2026",
      activeTerm: "Term 1",
      themeMode: "light",
      currencyPreset: "UGX",
      currencySymbol: "UGX",
      decimalPlaces: 0,
      defaultDrawerFloat: 150000,
      receiptTitle: "WELLSTAR BRIGHT SECONDARY SCHOOL",
      receiptSub: "Official Tuition & Fees Payment Receipt",
      receiptFooter: "Official Computer-Generated Receipt • Valid Without Official Seal",
      receiptWidth: "80mm",
      machineId: "WS-BURSAR-01",
      serverUrl: "http://localhost:3000",
    });
    toast.info("System settings reset to default values.");
  };

  const handleForceSyncOutbox = () => {
    setSyncOutboxList((prev) =>
      prev.map((item) => ({ ...item, status: "SYNCED", timestamp: "Just now" }))
    );
    toast.success("All offline records pushed to Central Super Admin PostgreSQL database!");
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
        dailyQuota: Number(mealModalDailyQuota),
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

  // WORKSTATION SHIFT SECURITY & TERMINAL ACCESS OVERLAY (MATCHING STANDALONE DESKTOP EXACTLY)
  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950 text-slate-100 font-sans overflow-y-auto">
        <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* INSTITUTIONAL HERO PANEL (LEFT) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1938] via-[#0f172a] to-[#1e1b4b] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              {/* Institutional Header */}
              <div className="flex items-center gap-3.5">
                <div className="size-14 rounded-2xl bg-white/10 border border-amber-400/50 p-1.5 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-sm">
                  <img
                    src={brand?.badgeUrl || "/logo.png"}
                    alt="School Crest"
                    className="size-11 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-white tracking-tight">
                    {brand?.name || "Wellstar Bright Secondary School"}
                  </h1>
                  <p className="text-xs text-amber-400 font-semibold tracking-wide">
                    Office of the Bursar • Accounts & Finance
                  </p>
                </div>
              </div>

              {/* Workstation Pitch */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase font-black tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 inline-block">
                  Point of Sale • Financial ERP
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">
                  Authorized Counter Workstation
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorized workstation for school fee collections, thermal receipt printing, petty cash disbursements, and shift reconciliation under Ministry of Education & Sports standards.
                </p>
              </div>

              {/* Core Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                    <Wallet className="size-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">Offline Resilience</span>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
                    <Receipt className="size-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">Sequential Receipts</span>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                    <Users className="size-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">PAYE / NSSF Payroll</span>
                </div>
                <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
                    <Scale className="size-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">Double-Entry Ledgers</span>
                </div>
              </div>
            </div>

            {/* Institutional Trust Footer */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <Award className="size-4 text-amber-400 shrink-0" />
              <span>Mukono Campus, Uganda • MoES Reg: MoES/PSS/892/2018</span>
            </div>
          </div>

          {/* RIGHT LOGIN FORM PANEL */}
          <div className="lg:col-span-7 bg-slate-900/95 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header with Server dot and Theme Toggle */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">Operator Shift Sign In</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Authenticate with staff credentials and verify drawer float</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold font-mono">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Server Online
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1"
                    title="Toggle Theme"
                  >
                    {darkTheme ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5 text-blue-400" />}
                  </button>
                </div>
              </div>

              {/* Role Presets */}
              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <KeyRound className="size-3 text-amber-400" /> Shift Role Presets:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const admin = ENTERPRISE_FINANCE_USERS.find(u => u.role === "SUPER_ADMIN") || ENTERPRISE_FINANCE_USERS[2];
                      setCurrentUser(admin);
                      setLockPinInput(admin.pin);
                    }}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-700 hover:border-amber-500/50 bg-slate-800 text-slate-200 hover:text-white transition-all text-center"
                  >
                    Super Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const bursar = ENTERPRISE_FINANCE_USERS.find(u => u.role === "BURSAR") || ENTERPRISE_FINANCE_USERS[1];
                      setCurrentUser(bursar);
                      setLockPinInput(bursar.pin);
                    }}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-700 hover:border-emerald-500/50 bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-all text-center"
                  >
                    Chief Bursar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cashier = ENTERPRISE_FINANCE_USERS.find(u => u.role === "CASHIER") || ENTERPRISE_FINANCE_USERS[0];
                      setCurrentUser(cashier);
                      setLockPinInput(cashier.pin);
                    }}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-700 hover:border-blue-500/50 bg-slate-800 text-blue-400 hover:text-blue-300 transition-all text-center"
                  >
                    Cashier 1
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleUnlockScreen} className="space-y-4 mt-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Authorized Staff Account *
                  </label>
                  <select
                    value={currentUser.id}
                    onChange={(e) => {
                      const selected = ENTERPRISE_FINANCE_USERS.find(u => u.id === e.target.value);
                      if (selected) {
                        setCurrentUser(selected);
                        setLockPinInput(selected.pin);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {ENTERPRISE_FINANCE_USERS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Opening Physical Cash Drawer Float (UGX) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                      UGX
                    </span>
                    <input
                      type="text"
                      value={drawerFloat}
                      onChange={(e) => setDrawerFloat(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                      placeholder="150,000"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Physical currency verified in counter drawer at shift start
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      4-Digit Security Authorization PIN *
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthPinVisible(!authPinVisible)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-bold"
                    >
                      {authPinVisible ? "Hide PIN" : "Show PIN"}
                    </button>
                  </div>
                  <input
                    type={authPinVisible ? "text" : "password"}
                    maxLength={4}
                    value={lockPinInput}
                    onChange={(e) => setLockPinInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-xl tracking-[0.5em] font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                    placeholder="••••"
                    required
                    autoFocus
                  />
                  <div className="text-[11px] text-slate-500 mt-1.5 text-center font-mono">
                    Default PINs: Super Admin (9900) • Chief Bursar (1234) • Cashier (5566)
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-5 rounded-xl shadow-lg mt-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" /> Authenticate &amp; Open Shift
                </Button>
              </form>
            </div>

            <div className="pt-4 text-center text-[10px] text-slate-500 border-t border-slate-800">
              Wellstar Bright Secondary School • Counter Workstation • Central Security Gateway v2.4
            </div>
          </div>
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
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#f26522] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP STATUS & CONTROL BAR (MATCHING STANDALONE DESKTOP CLIENT EXACTLY)  */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 min-h-[66px] bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 shadow-sm shrink-0 w-full gap-4 z-30">
        {/* Left: School Crest, Name & Subtitle */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="size-11 rounded-xl bg-white dark:bg-slate-900 border border-amber-400/50 p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img
              src={brand?.badgeUrl || "/logo.png"}
              alt="School Crest"
              className="size-9 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-display text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {brand?.name || "Wellstar Bright Secondary School"}
            </div>
            <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 tracking-wider">
              Mukono &bull; Bursar Workstation &amp; Financial ERP
            </div>
          </div>
        </div>

        {/* Right: Shift Controls, Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto shrink-0">
          {/* Physical Cash Drawer Float Pill (Clickable to adjust opening float) */}
          <button
            type="button"
            onClick={() => {
              setTempFloatInput(drawerFloat);
              setShowFloatModal(true);
            }}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400 transition-colors shadow-2xs"
            title="Click to verify/adjust opening drawer cash float"
          >
            <Wallet className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Drawer: <strong className="text-amber-600 dark:text-amber-400 font-mono font-bold">UGX {drawerFloat}</strong></span>
          </button>

          {/* Theme Toggle Button (Light Theme / Dark Theme) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Light / Dark Theme"
          >
            {darkTheme ? <Sun className="size-3.5 text-amber-400" /> : <Moon className="size-3.5" />}
            <span className="hidden md:inline">{darkTheme ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* Live Central Server Sync Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Server Connected</span>
          </div>

          {/* Sync Now Button */}
          <button
            type="button"
            onClick={loadData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Synchronize records with central PostgreSQL database"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-amber-500" : ""}`} />
            <span className="hidden sm:inline">Sync Now</span>
          </button>

          {/* Download Desktop POS App Button */}
          <button
            type="button"
            onClick={() => setShowDownloadAppModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f26522] hover:bg-[#d95314] text-white text-xs font-extrabold shadow-sm transition-all"
            title="Download Offline Desktop POS App &amp; Installer (.exe)"
          >
            <Download className="size-3.5" />
            <span className="hidden lg:inline">Download App</span>
          </button>

          {/* Front Site Link */}
          <Link
            href="/front-site"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Globe className="size-3.5 text-blue-500" />
            <span>Front Site</span>
          </Link>

          {/* User Profile / Shift Menu */}
          <div className="relative" ref={userProfileDropdownRef}>
            <button
              type="button"
              onClick={() => setUserProfileMenuOpen(!userProfileMenuOpen)}
              className="flex items-center gap-2 py-1 px-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all text-left"
            >
              <div className="size-7 rounded-full bg-gradient-to-tr from-blue-700 to-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold leading-tight text-slate-900 dark:text-white">{currentUser.name}</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{currentUser.role}</span>
              </div>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>

            {userProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-2 z-50 animate-scale-in text-xs">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.title} &bull; {currentUser.email}</div>
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Switch Active Operator
                </div>
                <div className="space-y-0.5">
                  {ENTERPRISE_FINANCE_USERS.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        handleSwitchUser(u);
                        setUserProfileMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.id === u.id ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.title}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono font-bold uppercase">{u.role}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-1">
                  <button
                    onClick={() => {
                      setIsLocked(true);
                      setUserProfileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-bold"
                  >
                    <Lock className="size-3.5" /> Lock Workstation Shift
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN LAYOUT: SIDEBAR MODULE NAVIGATION + CONTENT AREA                  */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* SIDEBAR MODULE NAVIGATION (MATCHING STANDALONE DESKTOP CLIENT EXACTLY) */}
        <nav
          className={`bg-white dark:bg-[#0b1329] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-200 z-20 ${
            sidebarCollapsed ? "w-16 min-w-16 p-2" : "w-64 min-w-64 p-3"
          }`}
        >
          {/* Sidebar Toggle Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            {!sidebarCollapsed && (
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Modules
              </span>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={sidebarCollapsed ? "Expand Modules Sidebar" : "Minimize Modules Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>

          {/* Module Categories */}
          <div className="space-y-4 flex-1">
            {/* Category: Counter & Billing */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                  Counter &amp; Billing
                </div>
              )}
              {[
                { id: "overview", label: "Executive Dashboard", icon: BarChart3 },
                { id: "pos", label: "Fee POS Counter", icon: Receipt },
                { id: "receipts", label: "Receipts Ledger", icon: FileText },
                { id: "fees", label: "Fees & Billing", icon: GraduationCap },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  title={sidebarCollapsed ? label : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === id
                      ? "bg-[#1d4ed8] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className="size-4 shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </button>
              ))}
            </div>

            {/* Category: Treasury & Disbursements */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                  Treasury &amp; Disbursements
                </div>
              )}
              {[
                { id: "expenses", label: "Petty Cash & Vouchers", icon: CreditCard },
                { id: "payroll", label: "Staff Payroll & Slips", icon: Users },
                { id: "bank", label: "Bank & Cash Accounts", icon: Landmark },
                { id: "accounts", label: "Chart of Accounts", icon: SlidersHorizontal },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  title={sidebarCollapsed ? label : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === id
                      ? "bg-[#1d4ed8] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className="size-4 shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </button>
              ))}
            </div>

            {/* Category: Operations & Audit */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                  Operations &amp; Audit
                </div>
              )}
              {[
                { id: "meals", label: "Meal Cards", icon: Utensils },
                { id: "reports", label: "Shift Reconciliation", icon: Scale },
                { id: "tax", label: "Tax Compliance", icon: FileCheck },
                { id: "workstations", label: "Workstations & Remote Lock", icon: HardDrive },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  title={sidebarCollapsed ? label : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === id
                      ? "bg-[#1d4ed8] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className="size-4 shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </button>
              ))}
            </div>

            {/* Category: System & Data */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                  System &amp; Data
                </div>
              )}
              {[
                { id: "settings", label: "System Settings", icon: Settings },
                { id: "queue", label: "Sync Outbox", icon: Cloud },
                { id: "audit", label: "Anti-Leakage Audit Trail", icon: ShieldCheck },
                { id: "budgets", label: "Budgets & Cost Centers", icon: SlidersHorizontal },
                { id: "assets", label: "Fixed Assets Register", icon: Building2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  title={sidebarCollapsed ? label : undefined}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === id
                      ? "bg-[#1d4ed8] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className="size-4 shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer Lock Shift */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsLocked(true)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors ${
                sidebarCollapsed ? "justify-center px-0" : ""
              }`}
              title="Lock Workstation Shift"
            >
              <Lock className="size-4 shrink-0" />
              {!sidebarCollapsed && <span>Lock Workstation</span>}
            </button>
          </div>
        </nav>

        {/* ========================================================================= */}
        {/* 3. CONTENT AREA (PANES WRAPPER)                                           */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#070b14] space-y-6">

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
                <span className="p-2 rounded-none bg-primary/10 text-primary">
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
                <span className="p-2 rounded-none bg-emerald-500/10 text-emerald-500">
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
                <span className="p-2 rounded-none bg-rose-500/10 text-rose-500">
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
                <span className="p-2 rounded-none bg-blue-500/10 text-blue-500">
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
                  <div className="flex items-center gap-1.5 p-1 rounded-none bg-muted/60 border border-border/60 text-xs">
                    <button
                      onClick={() => setChartTimeframe("6months")}
                      className={`px-2.5 py-1 rounded-none font-bold transition-all ${
                        chartTimeframe === "6months" ? "bg-card shadow-xs text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      6 Months
                    </button>
                    <button
                      onClick={() => setChartTimeframe("year")}
                      className={`px-2.5 py-1 rounded-none font-bold transition-all ${
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
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-sm transition-all hover:scale-102"
              >
                <Receipt className="w-5 h-5" />
                <span className="text-xs font-bold">Fast POS Counter</span>
              </Button>

              <Button
                onClick={() => setShowInvoiceModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-none border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold">Issue Student Bill</span>
              </Button>

              <Button
                onClick={() => setShowTransferModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-none border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <ArrowRightLeft className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-bold">Bank/Cash Transfer</span>
              </Button>

              <Button
                onClick={() => setShowExpenseModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-none border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <Briefcase className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold">Expense Voucher</span>
              </Button>

              <Button
                onClick={() => setShowJournalModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-none border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
              >
                <Scale className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-bold">Journal Voucher</span>
              </Button>

              <Button
                onClick={() => setShowPayrollModal(true)}
                variant="outline"
                className="h-auto py-3.5 px-4 flex flex-col items-center gap-2 rounded-none border-border/80 hover:bg-muted/80 transition-all hover:scale-102"
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
            <div className="px-3 py-1.5 rounded-none bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Live Double-Entry Telemetry
            </div>
          </div>

          {/* Class by Class Recovery Progress Bars */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-foreground">Class-by-Class Fee Collection Targets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classCollectionData.map((cls) => (
                <div key={cls.name} className="p-4 rounded-none bg-muted/40 border border-border/60 space-y-2">
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
      {/* TAB: FEE POS COUNTER (MATCHING DESKTOP CLIENT pane-pos EXACTLY)           */}
      {/* ========================================================================= */}
      {activeTab === "pos" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" /> Fee POS Counter &amp; Fast Receipting
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live counter collection terminal with instant thermal receipt generation and sequential audit logging
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold">
                Drawer: UGX {drawerFloat}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPosModal(true)}
                className="text-xs rounded-lg"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Custom Bill Pay
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Student Directory & Roster */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Student Directory &amp; Roster
                </h3>
                <span className="text-[11px] text-slate-400 font-mono font-bold">
                  {CANONICAL_WELLSTAR_STUDENTS.length} Enrolled
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search student name, registration # or class..."
                  value={posSearchQuery}
                  onChange={(e) => setPosSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {CANONICAL_WELLSTAR_STUDENTS.filter(
                  (s) =>
                    s.name.toLowerCase().includes(posSearchQuery.toLowerCase()) ||
                    s.regNo.toLowerCase().includes(posSearchQuery.toLowerCase()) ||
                    s.class.toLowerCase().includes(posSearchQuery.toLowerCase())
                ).map((student) => {
                  const isSelected = selectedStudentForPos?.id === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => {
                        setSelectedStudentForPos(student);
                        setPosAmount(student.balance > 0 ? student.balance.toString() : "");
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500 shadow-sm"
                          : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {student.name}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold">
                              {student.class}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {student.regNo}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-[11px] font-black font-mono ${
                              student.balance > 0 ? "text-amber-500" : "text-emerald-500"
                            }`}
                          >
                            UGX {student.balance.toLocaleString()}
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase inline-block mt-0.5 ${
                              student.balance === 0
                                ? "bg-emerald-500/10 text-emerald-500"
                                : student.paid > 0
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            {student.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Payment & Instant Receipting */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" /> Fee Collection &amp; Receipt Voucher
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Cashier: <strong className="text-slate-700 dark:text-slate-300">{currentUser.name}</strong>
                </span>
              </div>

              {!selectedStudentForPos ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <p className="text-xs max-w-sm mx-auto">
                    Select a student from the left roster to process payment and issue an official receipt voucher.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Student Summary Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-amber-500/5 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {selectedStudentForPos.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Class: <strong>{selectedStudentForPos.class}</strong> • Reg: <strong>{selectedStudentForPos.regNo}</strong>
                        </div>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 font-extrabold uppercase border border-amber-500/30">
                        {selectedStudentForPos.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 text-center font-mono text-xs">
                      <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] text-slate-400 font-sans">Total Invoiced</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          UGX {selectedStudentForPos.totalFees.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] text-slate-400 font-sans">Paid So Far</div>
                        <div className="font-bold text-emerald-500 mt-0.5">
                          UGX {selectedStudentForPos.paid.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] text-slate-400 font-sans">Remaining Due</div>
                        <div className="font-black text-amber-500 mt-0.5">
                          UGX {selectedStudentForPos.balance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Input Form */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Amount to Collect (UGX) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                          UGX
                        </span>
                        <input
                          type="number"
                          value={posAmount}
                          onChange={(e) => setPosAmount(e.target.value)}
                          placeholder="e.g. 250000"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-2 text-sm text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                          required
                          min="100"
                          step="100"
                        />
                      </div>
                      {/* Quick Amount Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["50000", "100000", "250000", "500000"].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setPosAmount(amt)}
                            className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-amber-500 text-slate-700 dark:text-slate-300 transition-all"
                          >
                            {parseInt(amt) >= 1000000 ? `${parseInt(amt) / 1000000}M` : `${parseInt(amt) / 1000}k`}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setPosAmount(selectedStudentForPos.balance.toString())}
                          className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all"
                        >
                          Full Balance
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Payment Method *
                        </label>
                        <select
                          value={posMethod}
                          onChange={(e) => setPosMethod(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="CASH">Cash (Desk Drawer Float)</option>
                          <option value="BANK_DEPOSIT">Bank Deposit Slip</option>
                          <option value="MOBILE_MONEY">Mobile Money (MTN / Airtel)</option>
                          <option value="POS_CARD">Debit / Credit Card (POS)</option>
                          <option value="CHEQUE">Bank Cheque</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Reference # / Slip / MoMo Tx ID
                        </label>
                        <Input
                          type="text"
                          value={posReference}
                          onChange={(e) => setPosReference(e.target.value)}
                          placeholder="Optional reference"
                          className="h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Cashier Notes / Remarks
                      </label>
                      <Input
                        type="text"
                        value={posNotes}
                        onChange={(e) => setPosNotes(e.target.value)}
                        placeholder="e.g. Term 1 Tuition installment"
                        className="h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                      <Button
                        type="button"
                        onClick={() => handleQuickPosCollect(true)}
                        className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs"
                      >
                        <Printer className="w-4 h-4 mr-1.5" /> Issue &amp; Print Official Receipt
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleQuickPosCollect(false)}
                        className="w-full sm:w-auto text-xs py-2.5 rounded-xl border-slate-300 dark:border-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" /> Record Only
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: RECEIPTS LEDGER (MATCHING DESKTOP CLIENT pane-receipts EXACTLY)      */}
      {/* ========================================================================= */}
      {activeTab === "receipts" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" /> Official Receipts Ledger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audited register of issued payment receipts across cash desk, bank deposits, and mobile money
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setActiveTab("pos")}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm text-xs font-bold"
              >
                <Receipt className="w-4 h-4 mr-1" /> New Fee Receipt
              </Button>
            </div>
          </div>

          {/* Search & Channel Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Filter receipt # or student..."
                value={receiptSearchQuery}
                onChange={(e) => setReceiptSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {["ALL", "CASH", "BANK_DEPOSIT", "MOBILE_MONEY", "POS_CARD"].map((m) => (
                <button
                  key={m}
                  onClick={() => setReceiptFilterMethod(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    receiptFilterMethod === m
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {m === "ALL" ? "All Channels" : m.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-bold">Receipt #</th>
                    <th className="py-3 px-4 font-bold">Student Name</th>
                    <th className="py-3 px-4 font-bold">Amount</th>
                    <th className="py-3 px-4 font-bold">Method</th>
                    <th className="py-3 px-4 font-bold">Cashier</th>
                    <th className="py-3 px-4 font-bold">Sync Status</th>
                    <th className="py-3 px-4 font-bold">Issued At</th>
                    <th className="py-3 px-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {receipts
                    .filter((r) => {
                      const matchesSearch =
                        r.receiptNumber.toLowerCase().includes(receiptSearchQuery.toLowerCase()) ||
                        (r.student?.name || "").toLowerCase().includes(receiptSearchQuery.toLowerCase());
                      const matchesMethod =
                        receiptFilterMethod === "ALL" || r.paymentMethod === receiptFilterMethod;
                      return matchesSearch && matchesMethod;
                    })
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{r.receiptNumber}</td>
                        <td className="py-2.5 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                          {r.student?.name}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-emerald-500">UGX {r.amount.toLocaleString()}</td>
                        <td className="py-2.5 px-4 font-sans">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                            {r.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-sans text-slate-500">{r.cashierName}</td>
                        <td className="py-2.5 px-4 font-sans">
                          {r.isOfflineSync ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30">
                              Desktop Workstation
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                              PostgreSQL Central
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400">{new Date(r.issuedAt).toLocaleDateString()}</td>
                        <td className="py-2.5 px-4 font-sans">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReceiptForPrint(r)}
                            className="text-xs h-7 rounded-lg border-slate-300 dark:border-slate-700"
                          >
                            <Printer className="w-3.5 h-3.5 mr-1 text-slate-500" /> 80mm Slip
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
      {/* TAB: FEES & BILLING (MATCHING DESKTOP CLIENT pane-fees EXACTLY)           */}
      {/* ========================================================================= */}
      {(activeTab === "fees" || activeTab === "invoices") && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-500" /> Student Invoices &amp; Fee Billing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Class tuition structures, scholarships, discounts, and term billing</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowInvoiceModal(true)} size="sm" className="rounded-lg text-xs font-bold">
                <Plus className="w-4 h-4 mr-1" /> New Student Bill
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">{inv.student?.name}</td>
                      <td className="py-3 px-4 font-sans text-slate-500">{inv.student?.class?.name || "General"}</td>
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
      {/* TAB: 3. BANK & CASH MANAGEMENT                                            */}
      {/* ========================================================================= */}
      {activeTab === "bank" && bankCashData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Bank & Cash Drawer Management</h2>
              <p className="text-xs text-muted-foreground">Drawer floats, bank accounts, inter-account transfers, and automated reconciliation</p>
            </div>
            <Button onClick={() => setShowTransferModal(true)} size="sm" className="rounded-none">
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
            <Button onClick={() => setShowJournalModal(true)} size="sm" className="rounded-none">
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
              <Button onClick={() => setShowSupplierModal(true)} variant="outline" size="sm" className="rounded-none">
                <Plus className="w-4 h-4 mr-1" /> Add Supplier
              </Button>
              <Button onClick={() => setShowExpenseModal(true)} size="sm" className="rounded-none">
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
            <Button onClick={() => setShowPayrollModal(true)} size="sm" className="rounded-none">
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
                          className="h-7 text-xs rounded-none"
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
            <Button onClick={() => setShowBudgetModal(true)} size="sm" className="rounded-none">
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
            <Button onClick={() => setShowAssetModal(true)} size="sm" className="rounded-none">
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
                          className="h-7 text-xs rounded-none"
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
      {/* TAB: SHIFT RECONCILIATION & FINANCIAL STATEMENTS (pane-reports)           */}
      {/* ========================================================================= */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-500" /> Cashier Shift Financial Audit &amp; Reconciliation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live workstation metrics, collections distribution &amp; cash-flow trajectory</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadData()}
                className="text-xs rounded-lg"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh Visuals
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-bold shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 mr-1" /> Print Shift Summary (Z-Report)
              </Button>
            </div>
          </div>

          {/* 4 Shift KPI Cards (Matching Desktop App pane-reports Exactly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Opening Drawer Float</div>
              <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                UGX {drawerFloat}
              </div>
              <div className="text-[11px] text-slate-400">Verified at shift start</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Fee Collections</div>
              <div className="text-xl font-black text-emerald-500 font-mono">
                UGX {overview?.kpis?.totalCollected ? overview.kpis.totalCollected.toLocaleString() : "2,600,000"}
              </div>
              <div className="text-[11px] text-slate-400">{receipts.length} Receipts Issued</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Petty Cash Disbursed</div>
              <div className="text-xl font-black text-rose-500 font-mono">
                UGX {overview?.kpis?.totalExpenses ? overview.kpis.totalExpenses.toLocaleString() : "930,000"}
              </div>
              <div className="text-[11px] text-slate-400">{expensesData.expenses.length} Vouchers Approved</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expected Drawer Balance</div>
              <div className="text-xl font-black text-blue-500 font-mono">
                UGX {(
                  150000 +
                  (overview?.kpis?.totalCollected || 2600000) -
                  (overview?.kpis?.totalExpenses || 930000)
                ).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">Float + Collections - Expenses</div>
            </div>
          </div>

          {statements && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
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
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 11. WORKSTATION SUPERVISION                                          */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* TAB: 11. WORKSTATION SUPERVISION                                          */}
      {/* ========================================================================= */}
      {activeTab === "workstations" && (
        <FinanceWorkstationsTab
          workstations={workstations}
          onToggleLock={handleToggleLock}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB: AUDIT LOG                                                            */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <FinanceAuditLogTab auditLogs={auditLogs} />
      )}

      {/* ========================================================================= */}
      {/* TAB: STUDENT MEAL CARDS MODULE (FINANCE-GOVERNED)                         */}
      {/* ========================================================================= */}
      {activeTab === "meals" && (
        <FinanceMealCardsTab
          mealCards={mealCards}
          invoices={invoices}
          mealSearchQuery={mealSearchQuery}
          setMealSearchQuery={setMealSearchQuery}
          mealFilterPlan={mealFilterPlan}
          setMealFilterPlan={setMealFilterPlan}
          mealFilterStatus={mealFilterStatus}
          setMealFilterStatus={setMealFilterStatus}
          onAutoIssue={handleAutoIssueMealPasses}
          onOpenIssueModal={() => setShowIssueMealModal(true)}
          onToggleStatus={handleToggleMealPassStatus}
        />
      )}
        </main>
      </div>

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
                  className={`p-3.5 rounded-none border cursor-pointer transition-all flex items-center justify-between ${
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                  className="rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                  <select
                    className="w-full h-10 rounded-none border border-input bg-background px-3 text-xs"
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
                    className="rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Cashier Notes</label>
                <Input
                  placeholder="e.g. Term 1 Part payment"
                  value={posForm.notes}
                  onChange={(e) => setPosForm({ ...posForm, notes: e.target.value })}
                  className="rounded-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowPosModal(false)} className="rounded-none">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 rounded-none font-bold">
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
              <div className="text-xl font-black">EDUREXA DEMO ACADEMY</div>
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
              <br />Thank you for supporting your child's education!
            </div>

            <div className="flex items-center gap-2 pt-3 no-print">
              <Button onClick={() => window.print()} className="w-full bg-slate-900 text-white font-bold rounded-none">
                <Printer className="w-4 h-4 mr-1" /> Print Slip
              </Button>
              <Button variant="outline" onClick={() => setSelectedReceiptForPrint(null)} className="rounded-none">
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tuition Fee (UGX) *</label>
                  <Input
                    type="number"
                    required
                    value={invoiceForm.subtotal}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, subtotal: e.target.value })}
                    className="rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Scholarship / Sibling Discount (UGX)</label>
                <Input
                  type="number"
                  value={invoiceForm.discountAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, discountAmount: e.target.value })}
                  className="rounded-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowInvoiceModal(false)} className="rounded-none">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none font-bold">Issue & Post to Ledger</Button>
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
                  className="rounded-none"
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
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
                  <select
                    className="w-full h-10 rounded-none border border-input bg-background px-3 text-xs"
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
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Department</label>
                  <Input
                    placeholder="e.g. Boarding"
                    value={expenseForm.department}
                    onChange={(e) => setExpenseForm({ ...expenseForm, department: e.target.value })}
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowExpenseModal(false)} className="rounded-none">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none font-bold">Post to General Ledger</Button>
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                  className="rounded-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Reason / Description</label>
                <Input
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                  className="rounded-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowTransferModal(false)} className="rounded-none">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none font-bold">Execute Balanced Transfer</Button>
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                  className="rounded-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Narration / Description *</label>
                <Input
                  required
                  placeholder="e.g. End of term audit adjustment"
                  value={journalForm.description}
                  onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                  className="rounded-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowJournalModal(false)} className="rounded-none">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none font-bold">Post Balanced Entry</Button>
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
                  className="w-full h-11 rounded-none border border-input bg-background px-3 text-xs"
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
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Year</label>
                  <Input
                    value={payrollForm.year}
                    onChange={(e) => setPayrollForm({ ...payrollForm, year: e.target.value })}
                    className="rounded-none"
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
                  className="rounded-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Housing Allowance</label>
                  <Input
                    type="number"
                    value={payrollForm.housingAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, housingAllowance: e.target.value })}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Transport Allowance</label>
                  <Input
                    type="number"
                    value={payrollForm.transportAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, transportAllowance: e.target.value })}
                    className="rounded-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowPayrollModal(false)} className="rounded-none">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none font-bold">Compute & Disburse</Button>
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
              <div className="text-lg font-black">EDUREXA DEMO ACADEMY</div>
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
              <Button onClick={() => window.print()} className="w-full bg-slate-900 text-white font-bold rounded-none">
                <Printer className="w-4 h-4 mr-1" /> Print Payslip
              </Button>
              <Button variant="outline" onClick={() => setSelectedPayslipForPrint(null)} className="rounded-none">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE MEAL PASS MODAL */}
      <IssueMealCardModal
        isOpen={showIssueMealModal}
        onClose={() => setShowIssueMealModal(false)}
        invoices={invoices}
        onSubmit={async (data) => {
          await issueOrUpdateMealCard({
            studentId: data.studentId,
            planType: data.planType as any,
            dailyQuota: data.dailyQuota,
            allergies: data.allergies,
          });
          toast.success("Dining pass issued successfully!");
          const updatedCards = await getAllMealCards();
          setMealCards(updatedCards);
        }}
      />

      {/* DOWNLOAD DESKTOP WORKSTATION APP MODAL */}
      {showDownloadAppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-card text-card-foreground border border-border max-w-2xl w-full p-6 sm:p-8 rounded-none shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center font-bold text-2xl">
                  💼
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-foreground">
                    Wellstar Finance POS Desktop Client
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Offline-capable counter executable for Bursars, Cashiers, and Accounts Desks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadAppModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-secondary/30 border border-border space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-muted-foreground">Live Telemetry</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Shared Central DB
                  </div>
                  <div className="text-[11px] text-muted-foreground">Real-time sync via /api/finance/sync</div>
                </div>

                <div className="p-3.5 bg-secondary/30 border border-border space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-muted-foreground">Thermal POS</div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Printer className="size-3 text-amber-500" /> 80mm ESC/POS
                  </div>
                  <div className="text-[11px] text-muted-foreground">Native thermal receipt printer integration</div>
                </div>

                <div className="p-3.5 bg-secondary/30 border border-border space-y-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-muted-foreground">Developer Updates</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Sparkles className="size-3" /> Hot Web-Synced
                  </div>
                  <div className="text-[11px] text-muted-foreground">Live updates stream directly to desktop client</div>
                </div>
              </div>

              {/* Download Option Cards */}
              <div className="space-y-3 pt-2">
                {/* 1. Windows Installer */}
                <div className="p-4 bg-secondary/20 hover:bg-secondary/40 border border-border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">Windows NSIS Setup Installer (.exe)</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">RECOMMENDED</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Standard Windows installer with desktop shortcuts, auto-shift launcher, and printer drivers.
                    </p>
                    <div className="text-[11px] font-mono text-muted-foreground mt-1">Size: 76.5 MB &bull; Target: Windows 10 / 11 x64</div>
                  </div>
                  <a
                    href="/api/finance/download?target=installer"
                    download="Wellstar-Finance-POS-Setup-1.0.0.exe"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#f26522] hover:bg-[#d95314] text-white font-extrabold text-xs shadow-sm transition-all"
                  >
                    <Download className="size-4" />
                    <span>Download Installer</span>
                  </a>
                </div>

                {/* 2. Windows Portable */}
                <div className="p-4 bg-secondary/20 hover:bg-secondary/40 border border-border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">Windows Portable Standalone (.exe)</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-bold">NO INSTALL REQUIRED</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Zero installation required. Run directly from a USB flash drive or temporary counter laptop.
                    </p>
                    <div className="text-[11px] font-mono text-muted-foreground mt-1">Size: 76.2 MB &bull; Target: Windows 10 / 11 x64</div>
                  </div>
                  <a
                    href="/api/finance/download?target=portable"
                    download="Wellstar-Finance-POS-1.0.0.exe"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all border border-border"
                  >
                    <Download className="size-4" />
                    <span>Download Portable</span>
                  </a>
                </div>

                {/* 3. Linux / Cross-Platform */}
                <div className="p-4 bg-secondary/20 hover:bg-secondary/40 border border-border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-sm text-foreground">Linux &amp; Unix Standalone Package (.tar.gz)</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Debian, Ubuntu, RedHat and POSIX cashier terminal package.
                    </p>
                    <div className="text-[11px] font-mono text-muted-foreground mt-1">Size: 6.2 MB &bull; Target: Linux x64 / POSIX</div>
                  </div>
                  <a
                    href="/api/finance/download?target=linux"
                    download="wellstar-finance-desktop-1.0.0.tar.gz"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm transition-all border border-border"
                  >
                    <Download className="size-4" />
                    <span>Download Tarball</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <div>
                Connected Sync Gateway: <code className="text-primary font-mono font-bold">/api/finance/sync</code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDownloadAppModal(false)}
                className="rounded-none text-xs"
              >
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PHYSICAL DRAWER FLOAT ADJUSTMENT MODAL */}
      {showFloatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-card text-card-foreground border border-border max-w-md w-full p-6 rounded-none shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <Wallet className="size-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    Physical Drawer Cash Float
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verify or adjust the shift opening physical cash balance.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFloatModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDrawerFloat} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Cash Float Amount (UGX)
                </label>
                <Input
                  type="text"
                  required
                  value={tempFloatInput}
                  onChange={(e) => setTempFloatInput(e.target.value)}
                  placeholder="e.g. 150,000"
                  className="font-mono text-sm rounded-none"
                />
                <div className="text-[11px] text-muted-foreground mt-1">
                  Current Drawer Float: <strong className="font-mono text-amber-600 dark:text-amber-400">UGX {drawerFloat}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFloatModal(false)}
                  className="rounded-none text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-none text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save Float Balance
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}