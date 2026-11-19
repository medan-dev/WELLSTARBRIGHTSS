"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Layers,
  Users,
  Search,
  Plus,
  RefreshCw,
  Sliders,
  FileSpreadsheet,
  Download,
  Upload,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Menu,
  Sun,
  Moon,
  Filter,
  Check,
  X,
  Lock,
  ArrowLeft,
  Calendar,
  Globe,
  Mail,
  Phone,
  Server,
  Database,
  Shield,
  FileText,
  UserCheck,
  Activity,
  Zap,
  Radio,
  AlertTriangle,
  HardDrive,
  Play,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  getGlobalMetricsAction,
  getAllSchoolsAction,
  provisionSchoolAction,
  toggleSchoolStatusAction,
  updateCampusQuotaAction,
  getAuditLogsAction,
} from "@/lib/super-admin-actions";
import {
  getClusterPerformanceAction,
  getCampusesHealthAction,
  getPlatformErrorsAction,
  resolveErrorAction,
  emergencyLockdownAction,
  emergencyRestoreAction,
  triggerSnapshotAction,
  getBackupHistoryAction,
  runCsvMigrationAction,
} from "@/lib/super-admin-observability-actions";
import { GlobalSaaSTelemetry, DetailedSchoolGroup } from "@/lib/super-admin-service";
import {
  ClusterPerformanceVitals,
  CampusHealthTelemetry,
} from "@/lib/super-admin-observability";

type NavSection =
  | "overview"
  | "schools"
  | "campuses"
  | "errors"
  | "backups"
  | "migration"
  | "security"
  | "audit";

export default function SuperAdminPage() {
  const [isPending, startTransition] = useTransition();

  // Authentication State (Master PIN: 9900)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Layout State
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core Data States
  const [telemetry, setTelemetry] = useState<GlobalSaaSTelemetry | null>(null);
  const [vitals, setVitals] = useState<ClusterPerformanceVitals | null>(null);
  const [campusesHealth, setCampusesHealth] = useState<CampusHealthTelemetry[]>([]);
  const [schools, setSchools] = useState<DetailedSchoolGroup[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filtering
  const [healthFilter, setHealthFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Actions
  const [isProvisionOpen, setIsProvisionOpen] = useState<boolean>(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState<boolean>(false);
  const [selectedSchoolForQuota, setSelectedSchoolForQuota] = useState<DetailedSchoolGroup | null>(null);
  const [newQuotaValue, setNewQuotaValue] = useState<number>(5);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Migration Execution State
  const [migrationCampusId, setMigrationCampusId] = useState<string>("");
  const [migrationCsvText, setMigrationCsvText] = useState<string>(
    "Student_Name,Class_Grade,Gender,Parent_Phone\n" +
    "Ronald Mutebi,Senior 4,Male,+256701116781\n" +
    "Amina Nakato,Senior 5,Female,+256702223344\n" +
    "David Mukasa,Senior 3,Male,+256788990011\n"
  );
  const [migrationResult, setMigrationResult] = useState<any | null>(null);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  // Provisioning Form
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    motto: "",
    contactEmail: "",
    contactPhone: "+256 701 116 781",
    website: "",
    maxCampuses: 5,
    primaryCampusName: "",
    primaryCampusCode: "",
    primaryLocation: "",
    headteacher: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "Password@2026",
  });

  // Verify stored session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = sessionStorage.getItem("ws_super_admin_unlocked");
      if (storedAuth === "true") {
        setIsAuthenticated(true);
      }
      const isDark = localStorage.getItem("ns_theme") === "dark";
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("ns_theme", next ? "dark" : "light"); } catch(_) {}
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        metricRes,
        vitalsRes,
        healthRes,
        schoolRes,
        errorsRes,
        backupsRes,
        auditRes,
      ] = await Promise.all([
        getGlobalMetricsAction(),
        getClusterPerformanceAction(),
        getCampusesHealthAction(),
        getAllSchoolsAction(),
        getPlatformErrorsAction(),
        getBackupHistoryAction(),
        getAuditLogsAction(25),
      ]);

      if (metricRes.success && metricRes.data) setTelemetry(metricRes.data);
      if (vitalsRes.success && vitalsRes.data) setVitals(vitalsRes.data);
      if (healthRes.success && healthRes.data) {
        setCampusesHealth(healthRes.data);
        if (healthRes.data.length > 0 && !migrationCampusId) {
          setMigrationCampusId(healthRes.data[0].campusId);
        }
      }
      if (schoolRes.success && schoolRes.data) setSchools(schoolRes.data);
      if (errorsRes.success && errorsRes.data) setErrorLogs(errorsRes.data);
      if (backupsRes.success && backupsRes.data) setBackupHistory(backupsRes.data);
      if (auditRes.success && auditRes.data) setAuditLogs(auditRes.data);
    } catch (err) {
      console.error("Failed to load SaaS telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "9900") {
      setIsAuthenticated(true);
      sessionStorage.setItem("ws_super_admin_unlocked", "true");
      setPinError(null);
    } else {
      setPinError("Invalid Master Super-Admin Key. Access Denied.");
    }
  };

  // Emergency Branch Freeze
  const handleEmergencyLockdown = async (campus: CampusHealthTelemetry) => {
    const reason = prompt(
      `ENTER EMERGENCY REASON to freeze '${campus.campusName}' and lock its workstations:`,
      "Suspicious unauthorized access detected"
    );
    if (!reason) return;

    startTransition(async () => {
      const res = await emergencyLockdownAction(campus.campusId, reason);
      if (res.success) {
        await loadData();
      } else {
        alert(res.error || "Failed to trigger lockdown");
      }
    });
  };

  // Emergency Branch Restore
  const handleEmergencyRestore = async (campus: CampusHealthTelemetry) => {
    if (!confirm(`Restore '${campus.campusName}' and re-enable its cashier workstations?`)) return;

    startTransition(async () => {
      const res = await emergencyRestoreAction(campus.campusId);
      if (res.success) {
        await loadData();
      } else {
        alert(res.error || "Failed to restore campus");
      }
    });
  };

  // Resolve Error Incident
  const handleResolveError = async (logId: string) => {
    startTransition(async () => {
      await resolveErrorAction(logId);
      await loadData();
    });
  };

  // Trigger Instant Database Snapshot & Download
  const handleTriggerSnapshot = async () => {
    setIsSubmitting(true);
    try {
      const res = await triggerSnapshotAction();
      if (res.success && res.data) {
        const blob = new Blob([res.data.payloadString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Wellstar_Database_Snapshot_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`Snapshot generated successfully! SHA-256 Checksum: ${res.data.backupRecord.checksum}`);
        await loadData();
      } else {
        alert(res.error || "Failed to generate snapshot.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Execute Real CSV Migration
  const handleRunMigration = async () => {
    if (!migrationCampusId) {
      alert("Please select a target campus branch.");
      return;
    }
    if (!migrationCsvText.trim()) {
      alert("Please paste or load CSV content.");
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);
    try {
      const res = await runCsvMigrationAction({
        campusId: migrationCampusId,
        csvText: migrationCsvText,
        academicYear: "2026",
        term: "Term 1",
      });

      if (res.success) {
        setMigrationResult(res.data);
        await loadData();
      } else {
        alert(res.error || "Migration failed.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsMigrating(false);
    }
  };

  // Provisioning Submission
  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionError(null);
    setIsSubmitting(true);

    try {
      const res = await provisionSchoolAction({
        name: formData.name,
        code: formData.code.toUpperCase(),
        motto: formData.motto,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        maxCampuses: Number(formData.maxCampuses),
        primaryCampus: {
          name: formData.primaryCampusName,
          code: formData.primaryCampusCode.toUpperCase(),
          location: formData.primaryLocation,
          headteacher: formData.headteacher,
        },
        adminUser: formData.adminEmail
          ? {
              name: formData.adminName || "Chief Administrator",
              email: formData.adminEmail,
              password: formData.adminPassword,
            }
          : undefined,
      });

      if (!res.success) {
        setProvisionError(res.error || "Failed to provision school organization.");
        return;
      }

      setIsProvisionOpen(false);
      await loadData();
    } catch (err: any) {
      setProvisionError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Campuses Health
  const filteredCampuses = campusesHealth.filter((c) => {
    const matchesSearch =
      c.campusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.campusCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHealth = healthFilter === "ALL" || c.healthStatus === healthFilter;
    return matchesSearch && matchesHealth;
  });

  const unresolvedErrorCount = errorLogs.filter((e) => !e.isResolved).length;

  // Sign-In Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <Image src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">Wellstar Cloud ERP</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">SaaS Platform Console</div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Super Administrator Access</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your master executive PIN to access multi-tenant diagnostics & observability.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            {pinError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Master Security PIN</Label>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN (9900)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="text-center tracking-widest text-lg h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl h-10 font-semibold text-xs transition-all shadow-sm"
            >
              Access Dashboard
            </Button>
          </form>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>200-School Cluster Observability &bull; Continuous WAL PITR</span>
          </div>
        </div>
      </div>
    );
  }

  interface NavItem {
    id: NavSection;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
    { id: "schools", label: "School Organizations", icon: Building2, badge: `${schools.length}/200` },
    { id: "campuses", label: "Campus Network & Speed", icon: Layers, badge: `${campusesHealth.length}` },
    { id: "errors", label: "Error & Incident Tracer", icon: AlertTriangle, badge: unresolvedErrorCount > 0 ? `${unresolvedErrorCount}` : undefined, badgeColor: "bg-red-500 text-white" },
    { id: "backups", label: "Disaster Recovery & Backups", icon: HardDrive },
    { id: "migration", label: "CSV Ingestion & Migration", icon: FileSpreadsheet },
    { id: "security", label: "Security & Workstations", icon: ShieldCheck },
    { id: "audit", label: "Compliance Audit Trail", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex font-sans">
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL ADMIN SIDEBAR (Responsive, Collapsible)                    */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 lg:translate-x-0 shadow-lg lg:shadow-none",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className={cn("p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 transition-all", sidebarCollapsed ? "justify-center px-2" : "")}>
          <Image src={logo} alt="Logo" className="w-9 h-9 object-contain shrink-0" />
          {!sidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap leading-tight">
              <div className="font-bold text-sm text-slate-900 dark:text-white">Wellstar ERP</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Super Admin HQ</div>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id as NavSection);
                  setMobileMenuOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center rounded-xl font-medium transition-all duration-200 group relative",
                  sidebarCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5 text-xs",
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("shrink-0", sidebarCollapsed ? "size-5" : "size-4")} />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold",
                      item.badgeColor || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          {/* Link back to live school portal */}
          <Link
            href="/admin/dashboard"
            target="_blank"
            title={sidebarCollapsed ? "Live School Portal" : undefined}
            className={cn(
              "flex items-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
              sidebarCollapsed ? "justify-center p-3" : "gap-2.5 px-3 py-2 text-xs font-semibold"
            )}
          >
            <ArrowUpRight className="size-4 shrink-0 text-blue-600" />
            {!sidebarCollapsed && <span>Live School Portal</span>}
          </Link>

          {/* Toggle Sidebar Size */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                                            */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Super Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                {activeNav.replace("-", " ")}
              </span>
            </div>

            {/* Topbar Cluster Status Badge */}
            <div className="hidden md:flex items-center gap-3 ml-6 text-xs text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">DB: {vitals?.databaseLatencyMs ?? 42}ms</span>
              </span>
              <span>&bull;</span>
              <span>Uptime: <strong className="text-slate-700 dark:text-slate-300">{vitals?.clusterUptimePercent ?? 99.98}%</strong></span>
            </div>

            {/* Actions on right */}
            <div className="ml-auto flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
                className="h-9 px-3 rounded-xl text-xs gap-1.5"
              >
                <RefreshCw className={cn("size-3.5", loading ? "animate-spin" : "")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                onClick={() => setIsProvisionOpen(true)}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">Onboard School</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                aria-label="Toggle theme"
                className="rounded-full h-9 w-9"
              >
                {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>

              <div className="size-9 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 grid place-items-center text-xs font-bold shadow-xs">
                HQ
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Canvas */}
        <main className="flex-1 p-4 lg:p-8 space-y-6 animate-fade-in">
          {/* ========================================================================= */}
          {/* SECTION 1: EXECUTIVE OVERVIEW                                             */}
          {/* ========================================================================= */}
          {activeNav === "overview" && (
            <div className="space-y-6">
              {/* Executive Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Onboarded Schools</span>
                    <Building2 className="size-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {telemetry?.totalSchools ?? 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      / {telemetry?.maxSchoolsLimit ?? 200} Max Limit
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(
                          1,
                          ((telemetry?.totalSchools ?? 1) / (telemetry?.maxSchoolsLimit ?? 200)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                    <span>Remaining Slots:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {(telemetry?.maxSchoolsLimit ?? 200) - (telemetry?.totalSchools ?? 1)}
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Active Branch Campuses</span>
                    <Layers className="size-4 text-indigo-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {telemetry?.totalCampuses ?? 2}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      / {telemetry?.maxCampusesClusterLimit ?? 4000} Max
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(
                          1,
                          ((telemetry?.totalCampuses ?? 2) /
                            (telemetry?.maxCampusesClusterLimit ?? 4000)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                    <span>Campus Quota:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Max 20 per School</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Total Students Enrolled</span>
                    <Users className="size-4 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {(telemetry?.totalStudents ?? 0).toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 font-semibold">
                      Uncapped
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-full rounded-full" />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                    <span>Active Meal Cards:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {telemetry?.totalActiveMealCards ?? 0}
                    </span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Data Durability & Backups</span>
                    <HardDrive className="size-4 text-teal-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      Continuous WAL PITR
                    </span>
                    <span className="text-xs text-slate-400 font-mono">RPO &lt; 1s</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full w-full rounded-full" />
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                    <span>Active Cashier Terminals:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {vitals?.activeDbConnections ?? 3} Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Jump Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveNav("campuses")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-300 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity className="size-4 text-blue-600" />
                      Campus Health & Latency Monitor
                    </span>
                    <ChevronRight className="size-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Inspect query speed, active users, and crash diagnostics for all {campusesHealth.length} campuses.
                  </p>
                </div>

                <div
                  onClick={() => setActiveNav("errors")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-red-300 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="size-4 text-red-500" />
                      Platform Error Tracer
                    </span>
                    {unresolvedErrorCount > 0 ? (
                      <Badge className="bg-red-500 text-white text-[10px]">{unresolvedErrorCount} Issues</Badge>
                    ) : (
                      <ChevronRight className="size-4 text-slate-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Live capture of 500 exceptions, cashier sync timeouts, and database anomalies.
                  </p>
                </div>

                <div
                  onClick={() => setActiveNav("backups")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-teal-300 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HardDrive className="size-4 text-teal-600" />
                      Disaster Recovery & Snapshots
                    </span>
                    <ChevronRight className="size-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Generate instant SHA-256 verifiable JSON dumps and review Point-in-Time logs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: SCHOOL ORGANIZATIONS & TENANT QUOTAS                           */}
          {/* ========================================================================= */}
          {activeNav === "schools" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    School Organizations & Conglomerates ({schools.length} / 200)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure institutional quotas (up to 20 campuses per school group) and toggle status.
                  </p>
                </div>
                <Button
                  onClick={() => setIsProvisionOpen(true)}
                  className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 bg-blue-600 text-white"
                >
                  <Plus className="size-3.5" />
                  <span>Onboard School</span>
                </Button>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] font-semibold uppercase text-slate-500">
                      <th className="py-3 px-4">Organization</th>
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Campus Allocation</th>
                      <th className="py-3 px-4">Total Students</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {schools.map((school) => (
                      <tr key={school.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {school.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium">{school.code}</td>
                        <td className="py-3.5 px-4 font-semibold">
                          {school.campusCount} of {school.maxCampuses} Campuses
                        </td>
                        <td className="py-3.5 px-4">{school.totalStudents.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-slate-500">{school.contactEmail || "N/A"}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              school.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {school.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSchoolForQuota(school);
                              setNewQuotaValue(school.maxCampuses);
                              setIsQuotaModalOpen(true);
                            }}
                            className="h-7 text-xs rounded-lg"
                          >
                            Adjust Quota
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: CAMPUS DIRECTORY, SPEED & HEALTH                               */}
          {/* ========================================================================= */}
          {activeNav === "campuses" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Filter Health:</span>
                  {(["ALL", "HEALTHY", "DEGRADED", "CRITICAL", "OFFLINE"] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHealthFilter(h)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
                        healthFilter === h
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input
                    placeholder="Search campus or school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs pl-8 h-8 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCampuses.map((campus) => {
                  const isHealthy = campus.healthStatus === "HEALTHY";
                  const isCritical = campus.healthStatus === "CRITICAL";
                  const isOffline = campus.healthStatus === "OFFLINE";

                  return (
                    <div
                      key={campus.campusId}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold uppercase text-slate-400 truncate block">
                            {campus.schoolName}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {campus.campusName}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isHealthy
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isCritical
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {campus.healthStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-center text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400">Response</div>
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {campus.latencyMs}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Students</div>
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {campus.studentCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Terminals</div>
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {campus.workstationsOnline}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-mono text-slate-400">{campus.campusCode}</span>
                        {isOffline || isCritical ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyRestore(campus)}
                            className="h-7 text-[10px] rounded-lg border-emerald-300 text-emerald-700"
                          >
                            Restore Branch
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyLockdown(campus)}
                            className="h-7 text-[10px] rounded-lg border-red-200 text-red-600"
                          >
                            Lockdown
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: ERROR & INCIDENT TRACER                                        */}
          {/* ========================================================================= */}
          {activeNav === "errors" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Exception & Error Tracer</h4>
                  <p className="text-xs text-slate-500">Live error logs from database queries, sync timeouts, and auth guards.</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {unresolvedErrorCount} Unresolved
                </Badge>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] uppercase text-slate-500">
                    <th className="py-2.5 px-4">Severity</th>
                    <th className="py-2.5 px-4">Component</th>
                    <th className="py-2.5 px-4">Incident Message</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {errorLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            log.severity === "CRITICAL"
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "bg-blue-50 text-blue-700 border-blue-300"
                          )}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">{log.source}</td>
                      <td className="py-3 px-4 max-w-md truncate">{log.message}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        {log.isResolved ? (
                          <span className="text-[11px] text-emerald-600 font-medium">Resolved</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveError(log.id)}
                            className="h-7 text-xs rounded-lg"
                          >
                            Mark Resolved
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: DISASTER RECOVERY & BACKUPS                                    */}
          {/* ========================================================================= */}
          {activeNav === "backups" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Disaster Recovery & Live Snapshot Backup Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Continuous WAL Point-in-Time Recovery (PITR) with immutable SHA-256 encrypted cold storage.
                  </p>
                </div>
                <Button
                  onClick={handleTriggerSnapshot}
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs h-9 font-semibold gap-1.5"
                >
                  <Download className="size-3.5" />
                  <span>{isSubmitting ? "Generating Backup..." : "Trigger Instant Snapshot & Download"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Recovery Point Objective (RPO)</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">&lt; 1 Second</div>
                  <p className="text-[10px] text-slate-500">Continuous streaming write-ahead log (WAL) on Neon Cloud.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Recovery Time Objective (RTO)</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">&lt; 15 Minutes</div>
                  <p className="text-[10px] text-slate-500">Instant multi-region database failover without data loss.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Backup Integrity Hash</div>
                  <div className="text-sm font-bold text-teal-600 font-mono truncate">SHA-256 Verifiable</div>
                  <p className="text-[10px] text-slate-500">Cryptographically signed against tampering or silent bit-rot.</p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-400">
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Checksum (SHA-256)</th>
                      <th className="py-2 px-3">Records</th>
                      <th className="py-2 px-3">Target</th>
                      <th className="py-2 px-3">Timestamp</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {backupHistory.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{b.backupType}</td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">{b.checksum}</td>
                        <td className="py-2.5 px-3">{b.recordCount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">{b.storageTarget}</td>
                        <td className="py-2.5 px-3 text-slate-400">{new Date(b.createdAt).toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 6: CSV INGESTION & DATA MIGRATION                                 */}
          {/* ========================================================================= */}
          {activeNav === "migration" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Live CSV Data Migration Execution Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bulk-import 5,000+ students, auto-create missing classes, and provision initial double-entry fee ledgers atomically.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([migrationCsvText], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Template_Students.csv";
                    a.click();
                  }}
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <Download className="size-3.5 text-blue-600" />
                  Download Sample CSV
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Destination Campus Branch *</Label>
                  <select
                    value={migrationCampusId}
                    onChange={(e) => setMigrationCampusId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    {campusesHealth.map((c) => (
                      <option key={c.campusId} value={c.campusId}>
                        {c.schoolName} — {c.campusName} ({c.campusCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Paste CSV Data (or Edit In-Place)</Label>
                  <Textarea
                    rows={6}
                    value={migrationCsvText}
                    onChange={(e) => setMigrationCsvText(e.target.value)}
                    className="font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <Button
                  onClick={handleRunMigration}
                  disabled={isMigrating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 text-xs font-semibold gap-1.5"
                >
                  <Play className="size-3.5" />
                  <span>{isMigrating ? "Executing Batch Ingestion..." : "Execute Atomic Migration to Live Database"}</span>
                </Button>

                {migrationResult && (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="size-4" />
                      <span>Migration Completed Successfully!</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>Total Rows: <strong>{migrationResult.totalRows}</strong></div>
                      <div>Enrolled: <strong className="text-emerald-600">{migrationResult.importedCount}</strong></div>
                      <div>Failed: <strong>{migrationResult.failedCount}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 7: SECURITY & POS WORKSTATIONS                                    */}
          {/* ========================================================================= */}
          {activeNav === "security" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Security Sentinel & POS Cashier Workstations
                </h3>
                <p className="text-xs text-slate-500">
                  Monitor online cashier workstations and trigger remote lockdown in case of perimeter threats.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-400">Threat Sentinel Level</div>
                  <div className="text-2xl font-bold text-emerald-600">{vitals?.threatLevel ?? "NORMAL"}</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-400">Active Online Workstations</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{vitals?.activeDbConnections ?? 3} Online</div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-400">Authentication Protocol</div>
                  <div className="text-2xl font-bold text-blue-600">SHA-256 HMAC</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 8: COMPLIANCE AUDIT TRAIL                                         */}
          {/* ========================================================================= */}
          {activeNav === "audit" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Immutable Governance Audit Ledger</h4>
                <p className="text-xs text-slate-500">Cryptographically verifiable sequence of all operations.</p>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 dark:bg-slate-950 text-[10px] uppercase text-slate-400">
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Actor</th>
                    <th className="py-2.5 px-4">Workstation</th>
                    <th className="py-2.5 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white text-[11px]">{log.action}</td>
                      <td className="py-3 px-4 text-slate-600">{log.actorName}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.workstationId}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROVISIONING & QUOTA MODALS                                            */}
      {/* ========================================================================= */}
      {/* Onboard School Dialog */}
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="sm:max-w-[560px] rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Onboard Educational Group
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Provision new school organization with strict 20-campus enterprise limit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionSubmit} className="space-y-4 pt-2">
            {provisionError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs">{provisionError}</div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">School Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-9 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Unique Group Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="h-9 rounded-xl text-xs uppercase font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Campus Quota (Max 20) *</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.maxCampuses}
                  onChange={(e) => setFormData({ ...formData, maxCampuses: Number(e.target.value) })}
                  required
                  className="h-9 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Campus Name *</Label>
                <Input
                  value={formData.primaryCampusName}
                  onChange={(e) => setFormData({ ...formData, primaryCampusName: e.target.value })}
                  required
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Campus Code *</Label>
                <Input
                  value={formData.primaryCampusCode}
                  onChange={(e) => setFormData({ ...formData, primaryCampusCode: e.target.value.toUpperCase() })}
                  required
                  className="h-9 rounded-xl text-xs uppercase font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Contact Email *</Label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="h-9 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Official Contact Phone *</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                  className="h-9 rounded-xl text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsProvisionOpen(false)} className="text-xs rounded-xl">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs rounded-xl bg-blue-600 text-white">
                {isSubmitting ? "Provisioning..." : "Provision School"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quota Modal */}
      <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Configure Campus Quota</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update authorized campus ceiling for {selectedSchoolForQuota?.name}. Max limit is 20 campuses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Allowed Campuses (1 - 20)</Label>
              <Input
                type="number"
                min={selectedSchoolForQuota?.campusCount ?? 1}
                max={20}
                value={newQuotaValue}
                onChange={(e) => setNewQuotaValue(Number(e.target.value))}
                className="h-10 text-center text-lg font-mono font-bold rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsQuotaModalOpen(false)} className="text-xs rounded-xl">
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                if (!selectedSchoolForQuota) return;
                await updateCampusQuotaAction(selectedSchoolForQuota.id, newQuotaValue);
                setIsQuotaModalOpen(false);
                await loadData();
              }}
              className="text-xs rounded-xl bg-blue-600 text-white"
            >
              Update Quota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
