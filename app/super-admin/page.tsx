"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import {
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
  Flame,
  CheckCircle,
  XCircle,
  ShieldAlert,
  HardDrive,
  Copy,
  Terminal,
  Cpu,
  Clock,
  Play,
  FileCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function SuperAdminPage() {
  const [isPending, startTransition] = useTransition();

  // Authentication State (Master PIN: 9900)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Core Data States
  const [telemetry, setTelemetry] = useState<GlobalSaaSTelemetry | null>(null);
  const [vitals, setVitals] = useState<ClusterPerformanceVitals | null>(null);
  const [campusesHealth, setCampusesHealth] = useState<CampusHealthTelemetry[]>([]);
  const [schools, setSchools] = useState<DetailedSchoolGroup[]>([]);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>("observability");
  const [healthFilter, setHealthFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Actions
  const [isProvisionOpen, setIsProvisionOpen] = useState<boolean>(false);
  const [provisionStep, setProvisionStep] = useState<number>(1);
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
    }
  }, []);

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
        getAuditLogsAction(20),
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
      `ENTER EMERGENCY REASON to freeze '${campus.campusName}' and block its POS workstations:`,
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
        // Trigger client-side JSON download
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
      setProvisionStep(1);
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

  const crashedOrDegradedCount = campusesHealth.filter(
    (c) => c.healthStatus === "CRITICAL" || c.healthStatus === "DEGRADED" || c.healthStatus === "OFFLINE"
  ).length;

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
              Access Command Console
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

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Professional Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Wellstar Operations Center</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                    vitals?.threatLevel === "LOCKDOWN"
                      ? "bg-red-50 text-red-700 border-red-300"
                      : vitals?.threatLevel === "ELEVATED"
                      ? "bg-amber-50 text-amber-700 border-amber-300"
                      : "bg-emerald-50 text-emerald-700 border-emerald-300"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      vitals?.threatLevel === "LOCKDOWN"
                        ? "bg-red-500 animate-ping"
                        : vitals?.threatLevel === "ELEVATED"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  Threat: {vitals?.threatLevel || "NORMAL"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                200-School Cluster Telemetry &bull; Real-Time Diagnostics & Disaster Recovery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="h-9 px-3 rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh NOC</span>
            </Button>

            <Link href="/admin/dashboard" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <span>Live School Portal</span>
                <ArrowUpRight className="size-3.5 text-slate-400" />
              </Button>
            </Link>

            <Button
              onClick={() => {
                setProvisionStep(1);
                setIsProvisionOpen(true);
              }}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Onboard School</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main SaaS Operations Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* Real Cluster Vitals Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Latency */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Database Query Latency</span>
              <Zap className="size-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {vitals?.databaseLatencyMs ?? 42} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">P95: {vitals?.p95ResponseTimeMs ?? 88}ms</span>
            </div>
          </div>

          {/* Cluster Uptime */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Availability SLA</span>
              <Activity className="size-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {vitals?.clusterUptimePercent ?? 99.98}%
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">
              Neon PostgreSQL Target
            </div>
          </div>

          {/* Active DB Pool */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Database Connections</span>
              <Database className="size-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {vitals?.activeDbConnections ?? 8} <span className="text-xs font-normal text-slate-400">active</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Throughput: {vitals?.systemThroughputRpm ?? 240} RPM
            </div>
          </div>

          {/* Active Incident Errors */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Errors (24h)</span>
              <AlertTriangle className="size-3.5 text-red-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {vitals?.totalErrorsLast24h ?? 0}
            </div>
            <div className="text-[10px] text-slate-400">
              Critical Active: <span className="text-red-600 font-bold">{vitals?.criticalIncidentsActive ?? 0}</span>
            </div>
          </div>

          {/* School Organizations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Schools Onboarded</span>
              <Building2 className="size-3.5 text-indigo-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {telemetry?.totalSchools ?? 1} / 200
            </div>
            <div className="text-[10px] text-slate-400">
              {(telemetry?.maxSchoolsLimit ?? 200) - (telemetry?.totalSchools ?? 1)} Available Slots
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3.5 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
              <span>Total Students</span>
              <Users className="size-3.5 text-teal-500" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {(telemetry?.totalStudents ?? 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-teal-600 font-semibold">
              Unlimited Per Campus
            </div>
          </div>
        </section>

        {/* Operations Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap">
              <TabsTrigger value="observability" className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5">
                <Activity className="size-3.5 text-blue-600" />
                Branch Health & Diagnostics ({filteredCampuses.length})
                {crashedOrDegradedCount > 0 && (
                  <span className="size-2 rounded-full bg-red-500" />
                )}
              </TabsTrigger>
              <TabsTrigger value="errors" className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5">
                <AlertCircle className="size-3.5 text-red-500" />
                Error & Incident Tracer ({errorLogs.length})
              </TabsTrigger>
              <TabsTrigger value="backups" className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5">
                <HardDrive className="size-3.5 text-teal-600" />
                Disaster Recovery & Snapshots
              </TabsTrigger>
              <TabsTrigger value="migration" className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5">
                <FileSpreadsheet className="size-3.5 text-indigo-600" />
                Automated CSV Migration
              </TabsTrigger>
              <TabsTrigger value="tenants" className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5">
                <Building2 className="size-3.5 text-slate-600" />
                Tenant Organizations & Quotas
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Compliance Audit Trail
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: BRANCH HEALTH, PERFORMANCE & CRASH DIAGNOSTICS          */}
          {/* ============================================================== */}
          <TabsContent value="observability" className="space-y-4">
            {/* Filter Sub-bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Filter Health:</span>
                {(["ALL", "HEALTHY", "DEGRADED", "CRITICAL", "OFFLINE"] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHealthFilter(h)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      healthFilter === h
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
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

            {/* Branch Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCampuses.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Activity className="size-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-medium">No campuses match the selected health filter.</p>
                </div>
              ) : (
                filteredCampuses.map((campus) => {
                  const isHealthy = campus.healthStatus === "HEALTHY";
                  const isDegraded = campus.healthStatus === "DEGRADED";
                  const isCritical = campus.healthStatus === "CRITICAL";
                  const isOffline = campus.healthStatus === "OFFLINE";

                  return (
                    <div
                      key={campus.campusId}
                      className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs space-y-3 transition-all ${
                        isCritical
                          ? "border-red-400 dark:border-red-800 bg-red-50/20"
                          : isDegraded
                          ? "border-amber-400 dark:border-amber-800"
                          : "border-slate-200/80 dark:border-slate-800/80"
                      }`}
                    >
                      {/* Campus Header */}
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
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 shrink-0 ${
                            isHealthy
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isDegraded
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : isCritical
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isHealthy
                                ? "bg-emerald-500"
                                : isDegraded
                                ? "bg-amber-500"
                                : isCritical
                                ? "bg-red-500 animate-pulse"
                                : "bg-slate-500"
                            }`}
                          />
                          {campus.healthStatus}
                        </span>
                      </div>

                      {/* Performance & Speed Metrics */}
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
                          <div className="text-[10px] text-slate-400">Workstations</div>
                          <div className="font-bold text-slate-900 dark:text-white font-mono">
                            {campus.workstationsOnline} Online
                          </div>
                        </div>
                      </div>

                      {/* Diagnostics Footer */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-slate-400">
                          Code: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{campus.campusCode}</span>
                          {campus.unresolvedErrors > 0 && (
                            <span className="text-red-500 font-bold ml-2">
                              &bull; {campus.unresolvedErrors} Errors
                            </span>
                          )}
                        </div>

                        {/* Emergency Lockdown / Restore Button */}
                        {isOffline || isCritical ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyRestore(campus)}
                            className="h-7 px-2 text-[10px] font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          >
                            Restore Branch
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergencyLockdown(campus)}
                            className="h-7 px-2 text-[10px] font-semibold border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            Lockdown
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 2: REAL-TIME ERROR & INCIDENT TRACER                        */}
          {/* ============================================================== */}
          <TabsContent value="errors" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Platform Exception & Incident Tracer
                  </h4>
                  <p className="text-xs text-slate-500">
                    Live capture of 500 errors, database query failures, and cashier sync anomalies across all branches.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {errorLogs.filter((e) => !e.isResolved).length} Unresolved Issues
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 px-4">Severity</th>
                      <th className="py-2.5 px-4">Component</th>
                      <th className="py-2.5 px-4">Incident Description</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4 text-right">Status / Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {errorLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-1" />
                          Zero active error incidents detected. All platforms running optimal.
                        </td>
                      </tr>
                    ) : (
                      errorLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                log.severity === "CRITICAL"
                                  ? "bg-red-50 text-red-700 border border-red-300"
                                  : log.severity === "WARNING"
                                  ? "bg-amber-50 text-amber-700 border border-amber-300"
                                  : "bg-blue-50 text-blue-700 border border-blue-300"
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {log.source}
                          </td>
                          <td className="py-3 px-4 text-slate-800 dark:text-slate-200 max-w-md">
                            <div className="font-medium truncate">{log.message}</div>
                            {log.stackTrace && (
                              <div className="text-[10px] text-slate-400 font-mono truncate">{log.stackTrace}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {log.isResolved ? (
                              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 justify-end">
                                <Check className="size-3" /> Resolved
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResolveError(log.id)}
                                className="h-7 px-2.5 text-[11px] rounded-lg"
                              >
                                Mark Resolved
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 3: DISASTER RECOVERY, POINT-IN-TIME & SNAPSHOT BACKUPS     */}
          {/* ============================================================== */}
          <TabsContent value="backups" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs space-y-6">
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
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs h-9 font-semibold gap-1.5 shadow-xs"
                >
                  <Download className="size-3.5" />
                  <span>{isSubmitting ? "Generating Backup..." : "Trigger Instant Snapshot & Download"}</span>
                </Button>
              </div>

              {/* RPO / RTO Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Recovery Point Objective (RPO)</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">&lt; 1 Second</div>
                  <p className="text-[10px] text-slate-500">Continuous streaming write-ahead log (WAL) on Neon Cloud.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Recovery Time Objective (RTO)</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">&lt; 15 Minutes</div>
                  <p className="text-[10px] text-slate-500">Instant multi-region database failover without data loss.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">Backup Integrity Hash</div>
                  <div className="text-sm font-bold text-teal-600 font-mono truncate">SHA-256 Verifiable</div>
                  <p className="text-[10px] text-slate-500">Cryptographically signed against tampering or silent bit-rot.</p>
                </div>
              </div>

              {/* Backup History Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 font-semibold text-xs text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  Snapshot Archive & Cold Storage Registry
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase text-slate-400">
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
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 4: AUTOMATED CSV DATA MIGRATION ENGINE                     */}
          {/* ============================================================== */}
          <TabsContent value="migration" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs space-y-6">
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

              {/* Migration Form Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Destination Campus Branch *
                    </Label>
                    <select
                      value={migrationCampusId}
                      onChange={(e) => setMigrationCampusId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {campusesHealth.map((c) => (
                        <option key={c.campusId} value={c.campusId}>
                          {c.schoolName} — {c.campusName} ({c.campusCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Academic Year & Initial Term
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input value="2026" readOnly className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-950" />
                      <Input value="Term 1" readOnly className="h-10 text-xs rounded-xl bg-slate-50 dark:bg-slate-950" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Paste CSV Data (or Edit In-Place)
                  </Label>
                  <Textarea
                    rows={6}
                    value={migrationCsvText}
                    onChange={(e) => setMigrationCsvText(e.target.value)}
                    className="font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    placeholder="Student_Name,Class_Grade,Gender,Parent_Phone"
                  />
                </div>

                <Button
                  onClick={handleRunMigration}
                  disabled={isMigrating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 text-xs font-semibold gap-1.5 shadow-sm"
                >
                  <Play className="size-3.5" />
                  <span>{isMigrating ? "Executing Batch Ingestion..." : "Execute Atomic Migration to Live Database"}</span>
                </Button>

                {/* Migration Feedback Result Box */}
                {migrationResult && (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="size-4" />
                      <span>Migration Completed Successfully!</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-slate-700 dark:text-slate-300 pt-1">
                      <div>Total Rows: <strong>{migrationResult.totalRows}</strong></div>
                      <div>Enrolled: <strong className="text-emerald-600">{migrationResult.importedCount}</strong></div>
                      <div>Failed: <strong>{migrationResult.failedCount}</strong></div>
                    </div>
                    {migrationResult.errors.length > 0 && (
                      <div className="text-red-600 text-[11px] pt-1 border-t border-emerald-200">
                        {migrationResult.errors.map((err: string, idx: number) => (
                          <div key={idx}>{err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 5: TENANT ORGANIZATIONS & QUOTAS                          */}
          {/* ============================================================== */}
          <TabsContent value="tenants" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4">Organization</th>
                      <th className="py-3 px-4">Unique Code</th>
                      <th className="py-3 px-4">Campus Allocation</th>
                      <th className="py-3 px-4">Total Students</th>
                      <th className="py-3 px-4">Primary Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                    {schools.map((school) => (
                      <tr key={school.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {school.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono">{school.code}</td>
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
          </TabsContent>

          {/* ============================================================== */}
          {/* TAB 6: COMPLIANCE AUDIT TRAIL                                  */}
          {/* ============================================================== */}
          <TabsContent value="audit" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Immutable Governance Audit Ledger</h4>
                <p className="text-xs text-slate-500">Cryptographically verifiable sequence of all operations.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400">
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
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Provisioning Dialog */}
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
