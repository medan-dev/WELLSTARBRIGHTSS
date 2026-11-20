"use client";

import { useEffect, useState, useCallback, useTransition, Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";
import edurexaMark from "@/assets/edurexa-mark.png";
import edurexaLogo from "@/assets/edurexa-logo.png";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Search,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Download,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  Menu,
  Lock,
  LogOut,
  Server,
  Database,
  Shield,
  FileText,
  AlertCircle,
  HardDrive,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

// Bulletproof Error Boundary
class SuperAdminErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Super Admin Dashboard Glitch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center space-y-4">
            <div className="size-12 rounded-xl bg-slate-100 text-slate-700 grid place-items-center mx-auto">
              <AlertCircle className="size-6" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Console Session Interrupted</h2>
            <p className="text-xs text-slate-500">
              A temporary display error was safely caught. Click below to reload your dashboard.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 text-xs font-medium"
            >
              Reload Console
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
  | "audit";

interface NavGroup {
  title: string;
  items: {
    id: NavSection;
    label: string;
    icon: any;
    badge?: string;
    badgeVariant?: "default" | "destructive" | "outline" | "secondary";
  }[];
}

export default function SuperAdminPage() {
  return (
    <SuperAdminErrorBoundary>
      <SuperAdminContent />
    </SuperAdminErrorBoundary>
  );
}

function SuperAdminContent() {
  const [isPending, startTransition] = useTransition();

  // Authentication State (Master PIN: 9900)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Layout State
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Data States
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

  // Migration State
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
    }
  }, []);

  const loadData = useCallback(async () => {
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
      console.error("Failed to load telemetry:", err);
    } finally {
      setLoading(false);
    }
  }, [migrationCampusId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "9900") {
      setIsAuthenticated(true);
      setPinError(null);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ws_super_admin_unlocked", "true");
      }
    } else {
      setPinError("Invalid Master PIN. Please check your credentials.");
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPinInput("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ws_super_admin_unlocked");
    }
  };

  const handleToggleSchoolStatus = async (schoolId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!confirm(`Are you sure you want to change status to ${nextStatus}?`)) return;
    await toggleSchoolStatusAction(schoolId, nextStatus);
    await loadData();
  };

  const handleEmergencyLockdown = async (campus: CampusHealthTelemetry) => {
    const reason = prompt(`Reason for locking down ${campus.campusName}:`, "Security Maintenance");
    if (!reason) return;
    const res = await emergencyLockdownAction(campus.campusId, reason);
    if (res.success) {
      await loadData();
    } else {
      alert(res.error || "Failed to lockdown campus.");
    }
  };

  const handleEmergencyRestore = async (campus: CampusHealthTelemetry) => {
    if (!confirm(`Restore operations for ${campus.campusName}?`)) return;
    const res = await emergencyRestoreAction(campus.campusId);
    if (res.success) {
      await loadData();
    } else {
      alert(res.error || "Failed to restore campus.");
    }
  };

  const handleTriggerSnapshot = async () => {
    setIsSubmitting(true);
    try {
      const res = await triggerSnapshotAction();
      if (res.success && res.data) {
        const record = res.data.backupRecord;
        // Also trigger file download for the administrator
        const blob = new Blob([res.data.payloadString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `edurexa-snapshot-${record.id.slice(0, 8)}-${Date.now()}.json`;
        a.click();

        alert(
          `Snapshot generated & downloaded successfully!\n\nBackup ID: ${record.id}\nChecksum: ${record.checksum}\nRecords: ${record.recordCount}`
        );
        await loadData();
      } else {
        alert(res.error || "Failed to generate snapshot.");
      }
    } catch (err: any) {
      alert(err.message || "Snapshot error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveError = async (logId: string) => {
    const res = await resolveErrorAction(logId);
    if (res.success) {
      await loadData();
    }
  };

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
      setFormData({
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
      await loadData();
    } catch (err: any) {
      setProvisionError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCampuses = campusesHealth.filter((c) => {
    const matchesSearch =
      c.campusName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.campusCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHealth = healthFilter === "ALL" || c.healthStatus === healthFilter;
    return matchesSearch && matchesHealth;
  });

  const unresolvedErrorCount = errorLogs.filter((e) => !e.isResolved).length;

  // =========================================================================
  // SIGN-IN VIEW: Clean, Authoritative, Zero AI Gimmicks
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-sm bg-white border border-slate-200/90 rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
          <div className="text-center space-y-4">
            <Image
              src={edurexaLogo}
              alt="EDUREXA"
              className="h-14 w-auto mx-auto object-contain"
              priority
            />
            <div className="space-y-1">
              <h1 className="text-sm font-semibold text-slate-900 tracking-tight">Super Admin Console</h1>
              <p className="text-xs text-slate-500">
                Enter your Master PIN to manage global cluster infrastructure.
              </p>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            {pinError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
                {pinError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">Master Access PIN</Label>
              <Input
                type="password"
                placeholder="&bull;&bull;&bull;&bull;"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="text-center tracking-widest text-lg h-10 rounded-lg bg-slate-50 border-slate-200 font-mono"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 font-medium text-xs transition-colors"
            >
              Unlock Console
            </Button>
          </form>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-3">
            EDUREXA Ecosystem &bull; Master PIN: 9900
          </div>
        </div>
      </div>
    );
  }

  // Navigation Groups (Clean Stripe/Linear Style)
  const navGroups: NavGroup[] = [
    {
      title: "PLATFORM FLEET",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "schools", label: "Organizations", icon: Building2, badge: `${schools.length}/200` },
        { id: "campuses", label: "Campuses & Speed", icon: Layers, badge: `${campusesHealth.length}` },
      ],
    },
    {
      title: "RELIABILITY & SAFETY",
      items: [
        {
          id: "errors",
          label: "Incident Logs",
          icon: AlertCircle,
          badge: unresolvedErrorCount > 0 ? `${unresolvedErrorCount}` : undefined,
          badgeVariant: unresolvedErrorCount > 0 ? "destructive" : "outline",
        },
        { id: "backups", label: "Disaster Recovery", icon: HardDrive },
        { id: "audit", label: "Audit Ledger", icon: FileText },
      ],
    },
    {
      title: "OPERATIONS",
      items: [{ id: "migration", label: "Batch Ingestion", icon: FileSpreadsheet }],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL SIDEBAR                                                    */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-200 lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            "h-14 px-4 flex items-center border-b border-slate-200 justify-between",
            sidebarCollapsed ? "justify-center px-2" : ""
          )}
        >
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <Image
                src={edurexaHorizontal}
                alt="EDUREXA"
                className="h-7 w-auto object-contain"
                priority
              />
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                OPS
              </span>
            </div>
          ) : (
            <Image
              src={edurexaMark}
              alt="EDUREXA"
              className="h-6 w-auto object-contain"
              priority
            />
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
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
                      "w-full flex items-center rounded-lg font-medium transition-colors text-xs",
                      sidebarCollapsed ? "justify-center p-2" : "gap-2.5 px-2.5 py-2",
                      active
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("shrink-0 size-4", active ? "text-slate-900" : "text-slate-500")} />
                    {!sidebarCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-mono font-medium",
                          item.badgeVariant === "destructive"
                            ? "bg-red-100 text-red-700 font-bold"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 space-y-1">
          <Link
            href="/admin/dashboard"
            target="_blank"
            className={cn(
              "flex items-center rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-xs font-medium",
              sidebarCollapsed ? "justify-center p-2" : "gap-2 px-2.5 py-2"
            )}
            title="Open Live School Portal (Tenant #1)"
          >
            <ArrowUpRight className="size-4 text-blue-600 shrink-0" />
            {!sidebarCollapsed && <span>Flagship Portal</span>}
          </Link>

          <button
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-medium",
              sidebarCollapsed ? "justify-center p-2" : "gap-2 px-2.5 py-2"
            )}
            title="Lock Console"
          >
            <LogOut className="size-4 shrink-0" />
            {!sidebarCollapsed && <span>Lock Session</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE                                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Minimalist Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-14 flex items-center px-4 sm:px-6 gap-4">
          <button
            className="lg:hidden p-1.5 -ml-1.5 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Infrastructure</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900 capitalize">
              {activeNav.replace("-", " ")}
            </span>
          </div>

          {/* Status Metric */}
          <div className="hidden sm:flex items-center gap-2 ml-4 text-xs text-slate-500 border-l border-slate-200 pl-4 font-mono">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database: {vitals?.databaseLatencyMs ?? 42}ms</span>
            <span className="text-slate-300">&bull;</span>
            <span>Uptime: {vitals?.clusterUptimePercent ?? 99.98}%</span>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={cn("size-3.5", loading ? "animate-spin" : "")} />
              <span className="hidden sm:inline">Sync</span>
            </Button>

            <Button
              onClick={() => setIsProvisionOpen(true)}
              className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="size-3.5" />
              <span>Onboard School</span>
            </Button>
          </div>
        </header>

        {/* Canvas Body */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW                                                           */}
          {/* ========================================================================= */}
          {activeNav === "overview" && (
            <div className="space-y-6">
              {/* Primary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="text-xs font-medium text-slate-500">School Organizations</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {telemetry?.totalSchools ?? 1}
                    <span className="text-xs text-slate-400 font-normal ml-1.5">/ {telemetry?.maxSchoolsLimit ?? 200} Max</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-0.5">
                    {(telemetry?.maxSchoolsLimit ?? 200) - (telemetry?.totalSchools ?? 1)} open onboarding slots
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="text-xs font-medium text-slate-500">Active Campuses</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {telemetry?.totalCampuses ?? 2}
                    <span className="text-xs text-slate-400 font-normal ml-1.5">/ {telemetry?.maxCampusesClusterLimit ?? 4000}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-0.5">
                    Hard Cap: 20 per Organization
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="text-xs font-medium text-slate-500">Enrolled Students</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {(telemetry?.totalStudents ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium pt-0.5">
                    Uncapped Throughput
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="text-xs font-medium text-slate-500">Cluster Durability</div>
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mt-1">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Neon PostgreSQL WAL
                  </div>
                  <div className="text-[11px] text-slate-400 pt-0.5 font-mono">
                    RPO &lt; 1s &bull; RTO &lt; 15m
                  </div>
                </div>
              </div>

              {/* Registered Organizations Table Right On Overview */}
              <div className="bg-white border border-slate-200/90 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Registered School Organizations</h2>
                    <p className="text-xs text-slate-500">Active institutional tenants with dedicated schemas.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveNav("schools")}
                    className="h-7 text-xs rounded-lg border-slate-200"
                  >
                    View All
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-5">Organization</th>
                        <th className="py-2.5 px-4">Code</th>
                        <th className="py-2.5 px-4">Campuses</th>
                        <th className="py-2.5 px-4">Students</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schools.map((school) => (
                        <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-5">
                            <div className="font-semibold text-slate-900">{school.name}</div>
                            <div className="text-[11px] text-slate-400">{school.contactEmail || "N/A"}</div>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-700">{school.code}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {school.campusCount} of {school.maxCampuses} (Max 20)
                          </td>
                          <td className="py-3 px-4 text-slate-700">{school.totalStudents.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                                school.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}
                            >
                              {school.status}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSchoolForQuota(school);
                                setNewQuotaValue(school.maxCampuses);
                                setIsQuotaModalOpen(true);
                              }}
                              className="h-7 text-xs rounded-lg border-slate-200"
                            >
                              Set Quota
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Campus Latency Matrix */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Campus Fleet Latency & Heartbeat</h3>
                    <p className="text-xs text-slate-500">Real-time roundtrip response time per campus partition.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveNav("campuses")}
                    className="h-7 text-xs rounded-lg border-slate-200"
                  >
                    Manage Campuses
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {campusesHealth.map((c) => (
                    <div
                      key={c.campusId}
                      className="border border-slate-200 rounded-lg p-3.5 flex items-center justify-between bg-slate-50/40"
                    >
                      <div className="space-y-0.5">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">{c.schoolName}</div>
                        <div className="text-xs font-semibold text-slate-900">{c.campusName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {c.campusCode} &bull; {c.studentCount} students
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            c.healthStatus === "HEALTHY"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {c.healthStatus}
                        </span>
                        <div className="text-xs font-mono font-bold text-slate-700">{c.latencyMs}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ORGANIZATIONS                                                      */}
          {/* ========================================================================= */}
          {activeNav === "schools" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    School Organizations ({schools.length} / 200)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Contract quotas, campus limits (max 20), and operational state.
                  </p>
                </div>
                <Button
                  onClick={() => setIsProvisionOpen(true)}
                  className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Plus className="size-3.5" />
                  <span>Onboard School</span>
                </Button>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-4">Organization</th>
                      <th className="py-2.5 px-4">Code</th>
                      <th className="py-2.5 px-4">Campuses</th>
                      <th className="py-2.5 px-4">Enrolled Students</th>
                      <th className="py-2.5 px-4">Contact</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schools.map((school) => (
                      <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">{school.name}</div>
                          <div className="text-[11px] text-slate-400">{school.website || "No website"}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{school.code}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {school.campusCount} of {school.maxCampuses} (Max 20)
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{school.totalStudents.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-slate-500">{school.contactEmail || "N/A"}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              school.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            )}
                          >
                            {school.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSchoolForQuota(school);
                              setNewQuotaValue(school.maxCampuses);
                              setIsQuotaModalOpen(true);
                            }}
                            className="h-7 text-xs rounded-lg border-slate-200"
                          >
                            Set Quota
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleSchoolStatus(school.id, school.status)}
                            className="h-7 text-xs rounded-lg border-slate-200 text-slate-600"
                          >
                            {school.status === "ACTIVE" ? "Suspend" : "Activate"}
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
          {/* TAB 3: CAMPUSES & SPEED                                                   */}
          {/* ========================================================================= */}
          {activeNav === "campuses" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-medium text-slate-500 mr-1.5">Status Filter:</span>
                  {(["ALL", "HEALTHY", "DEGRADED", "CRITICAL", "OFFLINE"] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHealthFilter(h)}
                      className={cn(
                        "px-2 py-1 rounded-md text-xs font-medium transition-colors",
                        healthFilter === h
                          ? "bg-slate-900 text-white font-semibold"
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input
                    placeholder="Search campus or school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-xs pl-8 h-8 rounded-lg"
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
                      className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold uppercase text-slate-400 block truncate">
                            {campus.schoolName}
                          </span>
                          <h4 className="font-semibold text-sm text-slate-900 truncate">
                            {campus.campusName}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0",
                            isHealthy
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isCritical
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {campus.healthStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg text-center text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400">Response</div>
                          <div className="font-bold text-slate-900 font-mono">{campus.latencyMs}ms</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Students</div>
                          <div className="font-bold text-slate-900 font-mono">{campus.studentCount}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Terminals</div>
                          <div className="font-bold text-slate-900 font-mono">{campus.workstationsOnline}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="font-mono text-slate-400 text-[11px]">{campus.campusCode}</span>
                        {isOffline || isCritical ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyRestore(campus)}
                            className="h-7 text-[11px] rounded-md border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          >
                            Restore Branch
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyLockdown(campus)}
                            className="h-7 text-[11px] rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
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
          {/* TAB 4: INCIDENTS & ERROR LOGS                                             */}
          {/* ========================================================================= */}
          {activeNav === "errors" && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Incident & Error Logs</h4>
                  <p className="text-xs text-slate-500">Real-time platform exceptions captured across all tenant operations.</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {unresolvedErrorCount} Unresolved
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      <th className="py-2.5 px-4">Severity</th>
                      <th className="py-2.5 px-4">Source Component</th>
                      <th className="py-2.5 px-4">Error Message</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {errorLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              log.severity === "CRITICAL"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">{log.source}</td>
                        <td className="py-3 px-4 max-w-md truncate text-slate-800">{log.message}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {log.isResolved ? (
                            <span className="text-[11px] text-emerald-600 font-medium">Resolved</span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveError(log.id)}
                              className="h-7 text-xs rounded-md"
                            >
                              Resolve
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
          {/* TAB 5: DISASTER RECOVERY & BACKUPS                                        */}
          {/* ========================================================================= */}
          {activeNav === "backups" && (
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Disaster Recovery & Snapshots
                  </h3>
                  <p className="text-xs text-slate-500">
                    Continuous WAL Point-in-Time Recovery with cryptographically signed SHA-256 integrity snapshots.
                  </p>
                </div>
                <Button
                  onClick={handleTriggerSnapshot}
                  disabled={isSubmitting}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs h-8 font-medium gap-1.5"
                >
                  <Download className="size-3.5" />
                  <span>{isSubmitting ? "Generating..." : "Export Database Snapshot"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Recovery Point Objective (RPO)</div>
                  <div className="text-lg font-bold text-slate-900">&lt; 1 Second</div>
                  <p className="text-[10px] text-slate-400">Continuous write-ahead log (WAL) streaming.</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Recovery Time Objective (RTO)</div>
                  <div className="text-lg font-bold text-slate-900">&lt; 15 Minutes</div>
                  <p className="text-[10px] text-slate-400">Automated failover standby replicas.</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Cryptographic Hash</div>
                  <div className="text-xs font-mono font-bold text-slate-800 truncate">SHA-256 Verifiable</div>
                  <p className="text-[10px] text-slate-400">Signed against silent bit rot & tampering.</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">SHA-256 Checksum</th>
                      <th className="py-2.5 px-3">Records</th>
                      <th className="py-2.5 px-3">Storage Target</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {backupHistory.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{b.backupType}</td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">{b.checksum}</td>
                        <td className="py-2.5 px-3 font-mono">{b.recordCount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">{b.storageTarget}</td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{new Date(b.createdAt).toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
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
          {/* TAB 6: DATA INGESTION                                                     */}
          {/* ========================================================================= */}
          {activeNav === "migration" && (
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Batch Data Ingestion Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bulk-import student rosters directly into designated campus partitions.
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
                  className="rounded-lg text-xs gap-1.5 h-8 border-slate-200"
                >
                  <Download className="size-3.5" />
                  Template CSV
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">Target Campus Branch</Label>
                  <select
                    value={migrationCampusId}
                    onChange={(e) => setMigrationCampusId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                    {campusesHealth.map((c) => (
                      <option key={c.campusId} value={c.campusId}>
                        {c.schoolName} — {c.campusName} ({c.campusCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-700">CSV Data (Comma-separated)</Label>
                  <Textarea
                    rows={6}
                    value={migrationCsvText}
                    onChange={(e) => setMigrationCsvText(e.target.value)}
                    className="font-mono text-xs rounded-lg bg-slate-50 border-slate-200"
                  />
                </div>

                <Button
                  onClick={handleRunMigration}
                  disabled={isMigrating}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 text-xs font-medium"
                >
                  <Play className="size-3.5 mr-1.5" />
                  <span>{isMigrating ? "Importing Data..." : "Execute Batch Migration"}</span>
                </Button>

                {migrationResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-slate-800">
                    <div className="font-semibold text-emerald-700">Migration Completed</div>
                    <div className="flex gap-4">
                      <span>Total: <strong>{migrationResult.totalRows}</strong></span>
                      <span>Imported: <strong className="text-emerald-700">{migrationResult.importedCount}</strong></span>
                      <span>Failed: <strong>{migrationResult.failedCount}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: AUDIT LEDGER                                                       */}
          {/* ========================================================================= */}
          {activeNav === "audit" && (
            <div className="bg-white border border-slate-200/90 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h4 className="font-semibold text-sm text-slate-900">Governance & Audit Ledger</h4>
                <p className="text-xs text-slate-500">Immutable chronological record of administrative cluster actions.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Actor</th>
                      <th className="py-2.5 px-4">Workstation / Terminal</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 font-mono font-medium text-slate-900 text-[11px]">{log.action}</td>
                        <td className="py-3 px-4 text-slate-600">{log.actorName}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{log.workstationId}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
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
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-xl p-6 bg-white border border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-slate-900">
              Onboard Educational Organization
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Register a new school tenant with a maximum 20-campus quota.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionSubmit} className="space-y-3 pt-2">
            {provisionError && (
              <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium">{provisionError}</div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">School Group Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-8 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Unique Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  className="h-8 rounded-lg text-xs uppercase font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Campus Quota (Max 20) *</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.maxCampuses}
                  onChange={(e) => setFormData({ ...formData, maxCampuses: Number(e.target.value) })}
                  required
                  className="h-8 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Primary Campus Name *</Label>
                <Input
                  value={formData.primaryCampusName}
                  onChange={(e) => setFormData({ ...formData, primaryCampusName: e.target.value })}
                  required
                  className="h-8 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Campus Code *</Label>
                <Input
                  value={formData.primaryCampusCode}
                  onChange={(e) => setFormData({ ...formData, primaryCampusCode: e.target.value.toUpperCase() })}
                  required
                  className="h-8 rounded-lg text-xs uppercase font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Contact Email *</Label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="h-8 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-slate-700">Contact Phone *</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                  className="h-8 rounded-lg text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsProvisionOpen(false)} className="text-xs h-8 rounded-lg">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs h-8 rounded-lg bg-slate-900 text-white font-medium">
                {isSubmitting ? "Provisioning..." : "Provision School"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
        <DialogContent className="sm:max-w-[380px] rounded-xl p-6 bg-white border border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-slate-900">Configure Campus Quota</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update authorized campus ceiling for {selectedSchoolForQuota?.name}. Hard limit is 20 campuses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Allowed Campuses (1 - 20)</Label>
              <Input
                type="number"
                min={selectedSchoolForQuota?.campusCount ?? 1}
                max={20}
                value={newQuotaValue}
                onChange={(e) => setNewQuotaValue(Number(e.target.value))}
                className="h-9 text-center text-sm font-mono font-bold rounded-lg"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsQuotaModalOpen(false)} className="text-xs h-8 rounded-lg">
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
              className="text-xs h-8 rounded-lg bg-slate-900 text-white font-medium"
            >
              Update Quota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
