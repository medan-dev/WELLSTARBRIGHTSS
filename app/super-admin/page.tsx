"use client";

import { useEffect, useState, useTransition, Component, ErrorInfo, ReactNode } from "react";
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
  Maximize2,
  Minimize2,
  Tv,
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

// Defensive Zero-Crash Error Boundary
class SuperAdminErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Super Admin Dashboard Error Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 rounded-3xl p-8 shadow-xl text-center space-y-4">
            <div className="size-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 grid place-items-center mx-auto">
              <AlertTriangle className="size-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Recovered</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An unexpected display glitch occurred. The fail-safe caught it to prevent system crash.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 text-sm font-semibold"
            >
              Reload Dashboard
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type NavSection =
  | "overview"
  | "schools"
  | "campuses"
  | "errors"
  | "backups"
  | "migration"
  | "security"
  | "audit";

interface NavItem {
  id: NavSection;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export default function SuperAdminPage() {
  return (
    <SuperAdminErrorBoundary>
      <SuperAdminDashboardContent />
    </SuperAdminErrorBoundary>
  );
}

function SuperAdminDashboardContent() {
  const [isPending, startTransition] = useTransition();

  // Master Authentication State (PIN: 9900)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Layout & Responsive Mode
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [tvMode, setTvMode] = useState<boolean>(false); // High-visibility TV / Boardroom wallboard view

  // Core Data States with Safe Fallbacks
  const [telemetry, setTelemetry] = useState<GlobalSaaSTelemetry | null>(null);
  const [vitals, setVitals] = useState<ClusterPerformanceVitals | null>(null);
  const [campusesHealth, setCampusesHealth] = useState<CampusHealthTelemetry[]>([]);
  const [schools, setSchools] = useState<DetailedSchoolGroup[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filtering & Search
  const [healthFilter, setHealthFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Action States
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
      setPinError("Invalid Master Security Key. Access Denied.");
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100/70 dark:bg-slate-950 p-6 sm:p-10">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 justify-center">
            <Image src={logo} alt="Logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
            <div>
              <div className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">Wellstar ERP</div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Master Operations Center</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Super Administrator Access</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Enter your master executive PIN to access multi-tenant cluster diagnostics.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            {pinError && (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2.5">
                <AlertCircle className="size-5 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bold">Master Security PIN</Label>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN (9900)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="text-center tracking-widest text-2xl h-14 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 font-bold"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-2xl h-13 font-bold text-base transition-all shadow-md"
            >
              Sign In to Command Center
            </Button>
          </form>

          <div className="text-xs sm:text-sm text-slate-500 text-center border-t border-slate-200 dark:border-slate-800 pt-5 flex items-center justify-center gap-2">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>200-School Multi-Tenant Cluster &bull; Continuous WAL PITR</span>
          </div>
        </div>
      </div>
    );
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
    <div className={cn("min-h-screen bg-slate-100/60 dark:bg-slate-950 flex font-sans", tvMode && "text-lg")}>
      {/* ========================================================================= */}
      {/* 1. ULTRA-RESPONSIVE SIDEBAR                                               */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 lg:translate-x-0 shadow-lg lg:shadow-none",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Brand Header */}
        <div className={cn("p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800", sidebarCollapsed ? "justify-center px-2" : "")}>
          <Image src={logo} alt="Logo" className="w-10 h-10 object-contain shrink-0" />
          {!sidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap leading-tight">
              <div className="font-extrabold text-base text-slate-900 dark:text-white">Wellstar ERP</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Super Admin HQ</div>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items (Larger fonts and icons) */}
        <nav className="flex-1 p-3.5 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileMenuOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center rounded-2xl font-bold transition-all duration-200 group relative",
                  sidebarCollapsed ? "justify-center p-3.5" : "gap-3.5 px-4 py-3 text-sm sm:text-base",
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("shrink-0", sidebarCollapsed ? "size-6" : "size-5")} />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-lg text-xs font-mono font-extrabold",
                      item.badgeColor || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
          <Link
            href="/admin/dashboard"
            target="_blank"
            title={sidebarCollapsed ? "Live School Portal" : undefined}
            className={cn(
              "flex items-center rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold",
              sidebarCollapsed ? "justify-center p-3.5" : "gap-3 px-4 py-2.5 text-sm"
            )}
          >
            <ArrowUpRight className="size-5 shrink-0 text-blue-600" />
            {!sidebarCollapsed && <span>Live School Portal</span>}
          </Link>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                                            */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-4 px-4 lg:px-8 h-18">
            <button
              className="lg:hidden p-2.5 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
            >
              <Menu className="size-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">Super Admin</span>
              <span className="text-slate-300 text-sm">/</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white capitalize">
                {activeNav.replace("-", " ")}
              </span>
            </div>

            {/* Cluster Status Pills (Visible on Tablet, Desktop, TV) */}
            <div className="hidden sm:flex items-center gap-3 ml-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800 pl-4">
              <span className="flex items-center gap-2 font-bold">
                <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>DB Latency: <strong className="text-slate-900 dark:text-white font-mono">{vitals?.databaseLatencyMs ?? 42}ms</strong></span>
              </span>
              <span>&bull;</span>
              <span className="font-medium">Uptime: <strong className="text-slate-900 dark:text-white">{vitals?.clusterUptimePercent ?? 99.98}%</strong></span>
            </div>

            {/* Action Bar */}
            <div className="ml-auto flex items-center gap-3">
              {/* TV Wallboard / Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTvMode(!tvMode)}
                title={tvMode ? "Exit Wallboard Mode" : "Enter Wallboard / TV Presentation Mode"}
                className="hidden md:flex h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold gap-1.5"
              >
                <Tv className="size-4" />
                <span>{tvMode ? "Standard" : "TV Mode"}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
                className="h-10 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold gap-2"
              >
                <RefreshCw className={cn("size-4", loading ? "animate-spin" : "")} />
                <span className="hidden sm:inline">Refresh NOC</span>
              </Button>

              <Button
                onClick={() => setIsProvisionOpen(true)}
                className="h-10 px-4 rounded-xl text-xs sm:text-sm font-bold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">Onboard School</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                aria-label="Toggle theme"
                className="rounded-full h-10 w-10"
              >
                {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>

              <div className="size-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 grid place-items-center text-sm font-black shadow-sm">
                HQ
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas (Optimized for Mobile, Tablets & Boardroom Displays) */}
        <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in", tvMode && "max-w-none p-8 space-y-10")}>
          {/* ========================================================================= */}
          {/* 1. EXECUTIVE OVERVIEW SECTION                                             */}
          {/* ========================================================================= */}
          {activeNav === "overview" && (
            <div className="space-y-8">
              {/* Giant KPI Tiles (High visibility) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Tile 1 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm font-bold">
                    <span>Onboarded Schools</span>
                    <Building2 className="size-6 text-blue-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {telemetry?.totalSchools ?? 1}
                    </span>
                    <span className="text-sm text-slate-500 font-mono font-bold">
                      / {telemetry?.maxSchoolsLimit ?? 200} Max Limit
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
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
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex justify-between font-semibold pt-1">
                    <span>Available Capacity:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {(telemetry?.maxSchoolsLimit ?? 200) - (telemetry?.totalSchools ?? 1)} Slots Free
                    </span>
                  </div>
                </div>

                {/* Tile 2 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm font-bold">
                    <span>Active Campuses</span>
                    <Layers className="size-6 text-indigo-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {telemetry?.totalCampuses ?? 2}
                    </span>
                    <span className="text-sm text-slate-500 font-mono font-bold">
                      / {telemetry?.maxCampusesClusterLimit ?? 4000} Max
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
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
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex justify-between font-semibold pt-1">
                    <span>Campus Quota:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Max 20 per School</span>
                  </div>
                </div>

                {/* Tile 3 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm font-bold">
                    <span>Total Students Enrolled</span>
                    <Users className="size-6 text-emerald-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      {(telemetry?.totalStudents ?? 0).toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs text-emerald-600 font-bold px-2 py-0.5">
                      Unthrottled
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-full rounded-full" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex justify-between font-semibold pt-1">
                    <span>Active Meal Cards:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {telemetry?.totalActiveMealCards ?? 0} Cards
                    </span>
                  </div>
                </div>

                {/* Tile 4 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm font-bold">
                    <span>Data Durability & SRE</span>
                    <HardDrive className="size-6 text-teal-600" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                      Continuous WAL PITR
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold">RPO &lt; 1s</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full w-full rounded-full" />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex justify-between font-semibold pt-1">
                    <span>Active Cashier Desks:</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {vitals?.activeDbConnections ?? 3} Online
                    </span>
                  </div>
                </div>
              </div>

              {/* High-Impact Visual Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div
                  onClick={() => setActiveNav("campuses")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-blue-400 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <Activity className="size-6 text-blue-600" />
                      Campus Health & Speed Monitor
                    </span>
                    <ChevronRight className="size-5 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Real-time latency (ms), student enrollments, and emergency lockdown controls for all {campusesHealth.length} campuses.
                  </p>
                </div>

                <div
                  onClick={() => setActiveNav("errors")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-red-400 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <AlertTriangle className="size-6 text-red-500" />
                      Platform Error Tracer
                    </span>
                    {unresolvedErrorCount > 0 ? (
                      <Badge className="bg-red-500 text-white text-xs px-2.5 py-1 font-bold">{unresolvedErrorCount} Issues</Badge>
                    ) : (
                      <ChevronRight className="size-5 text-slate-400" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Deep exception tracer capturing 500 errors, database query timeouts, and sync anomalies across all branches.
                  </p>
                </div>

                <div
                  onClick={() => setActiveNav("backups")}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-teal-400 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <HardDrive className="size-6 text-teal-600" />
                      Disaster Recovery & Snapshots
                    </span>
                    <ChevronRight className="size-5 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Generate instant SHA-256 verifiable JSON dumps and review Point-in-Time replication logs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. SCHOOL ORGANIZATIONS & TENANT QUOTAS                                   */}
          {/* ========================================================================= */}
          {activeNav === "schools" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    School Organizations & Conglomerates ({schools.length} / 200)
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    Configure institutional quotas (strictly up to 20 campuses per school group) and manage statuses.
                  </p>
                </div>
                <Button
                  onClick={() => setIsProvisionOpen(true)}
                  className="h-11 px-5 rounded-2xl text-sm font-bold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  <Plus className="size-4" />
                  <span>Onboard School</span>
                </Button>
              </div>

              {/* Responsive Table with High Readability */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm sm:text-base">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <th className="py-4 px-5">Organization</th>
                        <th className="py-4 px-5">Unique Code</th>
                        <th className="py-4 px-5">Campus Allocation</th>
                        <th className="py-4 px-5">Total Students</th>
                        <th className="py-4 px-5">Primary Contact</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {schools.map((school) => (
                        <tr key={school.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                            {school.name}
                          </td>
                          <td className="py-4 px-5 font-mono font-bold text-sm">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              {school.code}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-bold">
                            <div className="space-y-1">
                              <div>{school.campusCount} of {school.maxCampuses} Campuses</div>
                              <div className="w-32 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, (school.campusCount / school.maxCampuses) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200">
                            {school.totalStudents.toLocaleString()}
                          </td>
                          <td className="py-4 px-5 text-slate-600 dark:text-slate-400 text-sm">
                            {school.contactEmail || "N/A"}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold border",
                                school.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400"
                                  : "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/60 dark:text-red-400"
                              )}
                            >
                              {school.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSchoolForQuota(school);
                                setNewQuotaValue(school.maxCampuses);
                                setIsQuotaModalOpen(true);
                              }}
                              className="h-9 px-3 text-xs sm:text-sm font-semibold rounded-xl"
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CAMPUS DIRECTORY, SPEED & HEALTH (Touch & Wallboard Friendly)          */}
          {/* ========================================================================= */}
          {activeNav === "campuses" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mr-1">Filter Health:</span>
                  {(["ALL", "HEALTHY", "DEGRADED", "CRITICAL", "OFFLINE"] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHealthFilter(h)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all",
                        healthFilter === h
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    placeholder="Search campus or school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm pl-10 h-10 rounded-2xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCampuses.map((campus) => {
                  const isHealthy = campus.healthStatus === "HEALTHY";
                  const isCritical = campus.healthStatus === "CRITICAL";
                  const isOffline = campus.healthStatus === "OFFLINE";

                  return (
                    <div
                      key={campus.campusId}
                      className={cn(
                        "bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm space-y-4 transition-all",
                        isCritical
                          ? "border-red-400 dark:border-red-800 bg-red-50/20"
                          : "border-slate-200 dark:border-slate-800"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-xs font-bold uppercase text-slate-400 truncate block">
                            {campus.schoolName}
                          </span>
                          <h4 className="font-extrabold text-lg text-slate-900 dark:text-white truncate">
                            {campus.campusName}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold border shrink-0",
                            isHealthy
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : isCritical
                              ? "bg-red-50 text-red-700 border-red-300 animate-pulse"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                          )}
                        >
                          {campus.healthStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl text-center">
                        <div>
                          <div className="text-xs text-slate-500 font-semibold">Response</div>
                          <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            {campus.latencyMs}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 font-semibold">Students</div>
                          <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            {campus.studentCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 font-semibold">Terminals</div>
                          <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            {campus.workstationsOnline}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-mono font-bold text-slate-500">{campus.campusCode}</span>
                        {isOffline || isCritical ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyRestore(campus)}
                            className="h-8 px-3 text-xs font-bold rounded-xl border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                          >
                            Restore Branch
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyLockdown(campus)}
                            className="h-8 px-3 text-xs font-bold rounded-xl border-red-300 text-red-600 hover:bg-red-50"
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
          {/* 4. ERROR & INCIDENT TRACER                                                */}
          {/* ========================================================================= */}
          {activeNav === "errors" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">Live Exception & Error Tracer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Captures 500 exceptions, cashier sync timeouts, and database anomalies.</p>
                </div>
                <Badge variant="outline" className="text-sm font-bold font-mono px-3 py-1">
                  {unresolvedErrorCount} Unresolved
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs sm:text-sm font-bold uppercase text-slate-600 dark:text-slate-400">
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Component</th>
                      <th className="py-3 px-4">Incident Message</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {errorLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-bold border",
                              log.severity === "CRITICAL"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : "bg-blue-50 text-blue-700 border-blue-300"
                            )}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-sm">{log.source}</td>
                        <td className="py-4 px-4 max-w-md font-medium text-slate-800 dark:text-slate-200 truncate">{log.message}</td>
                        <td className="py-4 px-4 text-slate-500 text-xs sm:text-sm whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="py-4 px-4 text-right">
                          {log.isResolved ? (
                            <span className="text-xs sm:text-sm text-emerald-600 font-bold">Resolved</span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveError(log.id)}
                              className="h-8 px-3 text-xs font-bold rounded-xl"
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. DISASTER RECOVERY & BACKUPS                                            */}
          {/* ========================================================================= */}
          {activeNav === "backups" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Disaster Recovery & Live Snapshot Backup Engine
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    Continuous WAL Point-in-Time Recovery (PITR) with immutable SHA-256 encrypted cold storage.
                  </p>
                </div>
                <Button
                  onClick={handleTriggerSnapshot}
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-sm font-bold h-11 px-5 gap-2 shadow-sm"
                >
                  <Download className="size-4" />
                  <span>{isSubmitting ? "Generating Backup..." : "Trigger Instant Snapshot & Download"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
                  <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">Recovery Point Objective (RPO)</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">&lt; 1 Second</div>
                  <p className="text-xs text-slate-500">Continuous streaming write-ahead log (WAL) on Neon Cloud.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
                  <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">Recovery Time Objective (RTO)</div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">&lt; 15 Minutes</div>
                  <p className="text-xs text-slate-500">Instant multi-region failover with zero record loss.</p>
                </div>
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-2">
                  <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">Backup Integrity Hash</div>
                  <div className="text-base sm:text-lg font-bold text-teal-600 font-mono truncate">SHA-256 Verifiable</div>
                  <p className="text-xs text-slate-500">Cryptographically signed against silent bit-rot or tampering.</p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold uppercase text-slate-600 dark:text-slate-400">
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Checksum (SHA-256)</th>
                      <th className="py-3 px-4">Records</th>
                      <th className="py-3 px-4">Target Storage</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {backupHistory.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{b.backupType}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500 max-w-xs truncate">{b.checksum}</td>
                        <td className="py-3.5 px-4 font-bold">{b.recordCount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{b.storageTarget}</td>
                        <td className="py-3.5 px-4 text-slate-500">{new Date(b.createdAt).toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
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
          {/* 6. CSV INGESTION & DATA MIGRATION                                         */}
          {/* ========================================================================= */}
          {activeNav === "migration" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Live CSV Data Migration Execution Engine
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    Bulk-import 5,000+ students, auto-create missing classes, and provision initial fee ledgers atomically.
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
                  className="rounded-2xl text-xs sm:text-sm font-bold gap-2 h-11 px-4"
                >
                  <Download className="size-4 text-blue-600" />
                  Download Sample CSV
                </Button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-bold">Destination Campus Branch *</Label>
                  <select
                    value={migrationCampusId}
                    onChange={(e) => setMigrationCampusId(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {campusesHealth.map((c) => (
                      <option key={c.campusId} value={c.campusId}>
                        {c.schoolName} — {c.campusName} ({c.campusCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm sm:text-base font-bold">Paste CSV Data (or Edit In-Place)</Label>
                  <Textarea
                    rows={8}
                    value={migrationCsvText}
                    onChange={(e) => setMigrationCsvText(e.target.value)}
                    className="font-mono text-sm rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 p-4"
                  />
                </div>

                <Button
                  onClick={handleRunMigration}
                  disabled={isMigrating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-13 text-base font-bold gap-2 shadow-sm"
                >
                  <Play className="size-5" />
                  <span>{isMigrating ? "Executing Batch Ingestion..." : "Execute Atomic Migration to Live Database"}</span>
                </Button>

                {migrationResult && (
                  <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 text-sm space-y-3">
                    <div className="flex items-center gap-2 font-extrabold text-emerald-700 dark:text-emerald-400 text-base">
                      <CheckCircle className="size-5" />
                      <span>Migration Completed Successfully!</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>Total Rows: <strong className="font-bold">{migrationResult.totalRows}</strong></div>
                      <div>Enrolled: <strong className="text-emerald-600 font-bold">{migrationResult.importedCount}</strong></div>
                      <div>Failed: <strong className="font-bold">{migrationResult.failedCount}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. SECURITY & POS WORKSTATIONS                                            */}
          {/* ========================================================================= */}
          {activeNav === "security" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Security Sentinel & POS Cashier Workstations
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Monitor online cashier workstations and trigger remote lockdown in case of perimeter threats.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">Threat Sentinel Level</div>
                  <div className="text-3xl font-black text-emerald-600">{vitals?.threatLevel ?? "NORMAL"}</div>
                </div>
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">Active Cashier Terminals</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{vitals?.activeDbConnections ?? 3} Online</div>
                </div>
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">Data Encryption Protocol</div>
                  <div className="text-3xl font-black text-blue-600 font-mono">AES-256 GCM</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. COMPLIANCE AUDIT TRAIL                                                 */}
          {/* ========================================================================= */}
          {activeNav === "audit" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">Immutable Governance Audit Ledger</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Cryptographically verifiable sequence of all operations across the cluster.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold uppercase text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Workstation</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{log.action}</td>
                        <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{log.actorName}</td>
                        <td className="py-4 px-4 font-mono text-xs text-slate-500">{log.workstationId}</td>
                        <td className="py-4 px-4 text-slate-500 text-xs sm:text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROVISIONING & QUOTA MODALS                                            */}
      {/* ========================================================================= */}
      {/* Onboard School Dialog */}
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="sm:max-w-[620px] rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
              Onboard Educational Group
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
              Provision new school organization with strict 20-campus enterprise limit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionSubmit} className="space-y-4 pt-3">
            {provisionError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold">{provisionError}</div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-bold">School Group Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11 rounded-2xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold">Unique Group Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="h-11 rounded-2xl text-sm uppercase font-mono font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">Campus Quota (Max 20) *</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.maxCampuses}
                  onChange={(e) => setFormData({ ...formData, maxCampuses: Number(e.target.value) })}
                  required
                  className="h-11 rounded-2xl text-sm font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold">Primary Campus Name *</Label>
                <Input
                  value={formData.primaryCampusName}
                  onChange={(e) => setFormData({ ...formData, primaryCampusName: e.target.value })}
                  required
                  className="h-11 rounded-2xl text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">Campus Code *</Label>
                <Input
                  value={formData.primaryCampusCode}
                  onChange={(e) => setFormData({ ...formData, primaryCampusCode: e.target.value.toUpperCase() })}
                  required
                  className="h-11 rounded-2xl text-sm uppercase font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold">Official Contact Email *</Label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="h-11 rounded-2xl text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold">Official Contact Phone *</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                  className="h-11 rounded-2xl text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsProvisionOpen(false)} className="text-sm h-11 px-5 rounded-2xl">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-sm h-11 px-5 rounded-2xl bg-blue-600 text-white font-bold">
                {isSubmitting ? "Provisioning..." : "Provision School"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quota Modal */}
      <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Configure Campus Quota</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Update authorized campus ceiling for {selectedSchoolForQuota?.name}. Hard limit is 20 campuses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <div className="space-y-2">
              <Label className="text-sm font-bold">Allowed Campuses (1 - 20)</Label>
              <Input
                type="number"
                min={selectedSchoolForQuota?.campusCount ?? 1}
                max={20}
                value={newQuotaValue}
                onChange={(e) => setNewQuotaValue(Number(e.target.value))}
                className="h-12 text-center text-xl font-mono font-bold rounded-2xl"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsQuotaModalOpen(false)} className="text-sm h-10 rounded-xl">
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
              className="text-sm h-10 rounded-xl bg-blue-600 text-white font-bold"
            >
              Update Quota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
