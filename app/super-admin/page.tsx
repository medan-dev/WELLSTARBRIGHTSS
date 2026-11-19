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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { GlobalSaaSTelemetry, DetailedSchoolGroup } from "@/lib/super-admin-service";

export default function SuperAdminPage() {
  const [isPending, startTransition] = useTransition();

  // Authentication State (Master PIN: 9900)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);

  // Data State
  const [telemetry, setTelemetry] = useState<GlobalSaaSTelemetry | null>(null);
  const [schools, setSchools] = useState<DetailedSchoolGroup[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [activeTab, setActiveTab] = useState<string>("tenants");
  const [loading, setLoading] = useState<boolean>(true);

  // Modals State
  const [isProvisionOpen, setIsProvisionOpen] = useState<boolean>(false);
  const [provisionStep, setProvisionStep] = useState<number>(1);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState<boolean>(false);
  const [selectedSchoolForQuota, setSelectedSchoolForQuota] = useState<DetailedSchoolGroup | null>(null);
  const [newQuotaValue, setNewQuotaValue] = useState<number>(5);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      const [metricRes, schoolRes, logsRes] = await Promise.all([
        getGlobalMetricsAction(),
        getAllSchoolsAction(),
        getAuditLogsAction(20),
      ]);

      if (metricRes.success && metricRes.data) {
        setTelemetry(metricRes.data);
      }
      if (schoolRes.success && schoolRes.data) {
        setSchools(schoolRes.data);
      }
      if (logsRes.success && logsRes.data) {
        setAuditLogs(logsRes.data);
      }
    } catch (err) {
      console.error("Failed to load super admin data:", err);
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

  const handleToggleStatus = (school: DetailedSchoolGroup) => {
    const nextStatus = school.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (
      !confirm(
        `Are you sure you want to change operational status of '${school.name}' to ${nextStatus}?`
      )
    )
      return;

    startTransition(async () => {
      await toggleSchoolStatusAction(school.id, nextStatus);
      await loadData();
    });
  };

  const handleOpenQuotaModal = (school: DetailedSchoolGroup) => {
    setSelectedSchoolForQuota(school);
    setNewQuotaValue(school.maxCampuses);
    setIsQuotaModalOpen(true);
  };

  const handleSaveQuota = async () => {
    if (!selectedSchoolForQuota) return;
    setIsSubmitting(true);
    try {
      const res = await updateCampusQuotaAction(selectedSchoolForQuota.id, newQuotaValue);
      if (res.success) {
        setIsQuotaModalOpen(false);
        await loadData();
      } else {
        alert(res.error || "Failed to update quota");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = "Student_Name,Class_Grade,Gender,Parent_Phone,Primary_Campus_Code\n";
    const sample =
      "John Baptist Ssentongo,Senior 4,Male,+256701116781,MUK-01\n" +
      "Grace Namakula,Senior 6,Female,+256702223344,MUK-01\n" +
      "Brian Okot,Senior 3,Male,+256788990011,JIN-02\n";
    const blob = new Blob([headers + sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Wellstar_Enterprise_Student_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Schools
  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contactEmail && s.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Enterprise Clean Sign-In Screen
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
              Please enter your executive security PIN to access multi-tenant cluster governance.
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
              <Label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Executive Security PIN</Label>
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
              Sign In to Management Console
            </Button>
          </form>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Multi-Tenant Architecture &bull; 200 School Capacity Limit</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Professional Executive Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
            <div className="border-l border-slate-200 dark:border-slate-800 pl-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Wellstar ERP Console</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                  SaaS Administration
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Multi-Tenant Governance &bull; 200 Organization Limit
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
              <span className="hidden sm:inline">Refresh</span>
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
              <span>Onboard New Tenant</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main SaaS Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* Executive Overview KPI Tiles */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Organizations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Tenant Organizations</span>
              <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {telemetry?.totalSchools ?? 1}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                of {telemetry?.maxSchoolsLimit ?? 200} Licensed
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(
                    1,
                    ((telemetry?.totalSchools ?? 1) / (telemetry?.maxSchoolsLimit ?? 200)) * 100
                  )}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
              <span>Available Capacity:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {(telemetry?.maxSchoolsLimit ?? 200) - (telemetry?.totalSchools ?? 1)} Slots Free
              </span>
            </div>
          </div>

          {/* Tile 2: Active Campuses */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Licensed Campuses</span>
              <Layers className="size-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {telemetry?.totalCampuses ?? 2}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                of {telemetry?.maxCampusesClusterLimit ?? 4000} Max
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all"
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
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
              <span>Contract Limit:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Max 20 per Tenant</span>
            </div>
          </div>

          {/* Tile 3: Total Students */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Total Enrolled Students</span>
              <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {(telemetry?.totalStudents ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Unthrottled
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 dark:bg-emerald-500 h-full w-full rounded-full" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
              <span>Scale Policy:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Unlimited / Campus</span>
            </div>
          </div>

          {/* Tile 4: Infrastructure Health */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>System & Data Durability</span>
              <ShieldCheck className="size-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Continuous WAL Active
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">99.99% Target SLA</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 dark:bg-teal-500 h-full w-full rounded-full" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
              <span>Active POS Workstations:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {telemetry?.systemHealth.activeWorkstations ?? 3} Online
              </span>
            </div>
          </div>
        </section>

        {/* Enterprise Workspace Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <TabsTrigger value="tenants" className="rounded-lg text-xs font-semibold px-3.5 py-1.5">
                Tenant Organizations ({filteredSchools.length})
              </TabsTrigger>
              <TabsTrigger value="campuses" className="rounded-lg text-xs font-semibold px-3.5 py-1.5">
                Campus Directory
              </TabsTrigger>
              <TabsTrigger value="migration" className="rounded-lg text-xs font-semibold px-3.5 py-1.5">
                Data Migration & CSV
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-lg text-xs font-semibold px-3.5 py-1.5">
                Compliance Audit Trail
              </TabsTrigger>
            </TabsList>

            {/* Quick Filter Bar */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <Input
                  placeholder="Filter by name, code, contact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs pl-8 h-9 rounded-xl"
                />
              </div>

              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 rounded-xl">
                {(["ALL", "ACTIVE", "SUSPENDED"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === filter
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TAB 1: TENANT ORGANIZATIONS (DATA TABLE) */}
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
                    {filteredSchools.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Building2 className="size-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                          <p className="font-medium text-xs">No school organizations found matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredSchools.map((school) => {
                        const isAtQuota = school.campusCount >= school.maxCampuses;
                        return (
                          <tr key={school.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold grid place-items-center shrink-0 border border-blue-200/60 dark:border-blue-900/40">
                                  {school.code.substring(0, 3)}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                                    {school.name}
                                  </div>
                                  {school.motto && (
                                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                      {school.motto}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
                                {school.code}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                  <span>{school.campusCount} of {school.maxCampuses} Campuses</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    (Max 20)
                                  </span>
                                </div>
                                <div className="w-28 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      isAtQuota ? "bg-amber-500" : "bg-blue-600"
                                    }`}
                                    style={{
                                      width: `${Math.min(100, (school.campusCount / school.maxCampuses) * 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                              <div className="flex items-center gap-1.5">
                                <Users className="size-3.5 text-slate-400" />
                                <span>{school.totalStudents.toLocaleString()}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-[11px] text-slate-500 space-y-0.5">
                              {school.contactEmail && <div className="truncate">{school.contactEmail}</div>}
                              {school.contactPhone && <div className="text-slate-400">{school.contactPhone}</div>}
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  school.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/40"
                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/40"
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    school.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                                  }`}
                                />
                                {school.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                    <MoreHorizontal className="size-4 text-slate-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                                  <DropdownMenuLabel className="text-xs">Manage Tenant</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleOpenQuotaModal(school)}
                                    className="text-xs cursor-pointer gap-2"
                                  >
                                    <Sliders className="size-3.5" />
                                    Configure Campus Quota
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleToggleStatus(school)}
                                    className={`text-xs cursor-pointer gap-2 ${
                                      school.status === "ACTIVE" ? "text-red-600 dark:text-red-400" : "text-emerald-600"
                                    }`}
                                  >
                                    {school.status === "ACTIVE" ? "Suspend Organization" : "Activate Organization"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CAMPUS DIRECTORY */}
          <TabsContent value="campuses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchools.flatMap((school) =>
                school.campuses.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                          {school.name}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {camp.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {camp.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">Enrolled Students</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {camp.studentCount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Teaching Staff</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {camp.teacherCount}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      {camp.headteacher && (
                        <div className="flex items-center gap-1.5 truncate">
                          <UserCheck className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">Head: {camp.headteacher}</span>
                        </div>
                      )}
                      {camp.location && (
                        <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-400">
                          <Globe className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{camp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* TAB 3: DATA MIGRATION & CSV INGESTION */}
          <TabsContent value="migration" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Tenant Data Migration & CSV Ingestion Engine
                  </h3>
                  <p className="text-xs text-slate-500">
                    Import historical student records and link them directly to their designated campus partitions.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCSVTemplate}
                  className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-800 h-9"
                >
                  <Download className="size-3.5 text-blue-600" />
                  Download Standard CSV Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-blue-100 text-blue-700 text-[10px] grid place-items-center font-bold">1</span>
                    Campus Partition Tagging
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Include the official campus code (e.g. <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border">MUK-01</code>) in the CSV to automatically route admissions into the correct branch.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-blue-100 text-blue-700 text-[10px] grid place-items-center font-bold">2</span>
                    Automated Fee Ledger Sync
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Initial term invoices and bursary grants are provisioned in double-entry ledgers with zero balance discrepancy.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                  <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-blue-100 text-blue-700 text-[10px] grid place-items-center font-bold">3</span>
                    Pre-Flight Validation
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Data is validated against unique phone and student ID constraints before committing to production databases.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone Preview */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
                <FileSpreadsheet className="size-10 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select a CSV file to validate and import students
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Supports files up to 50,000 student records per upload batch.
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert("Ready: Select your CSV file exported using the template above.")}
                  className="rounded-xl text-xs h-9"
                >
                  <Upload className="size-3.5 mr-1.5" />
                  Select File for Ingestion
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: COMPLIANCE AUDIT TRAIL */}
          <TabsContent value="audit" className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Enterprise Governance Audit Trail</h4>
                  <p className="text-xs text-slate-500">Immutable ledger of administrative actions, quota adjustments, and status changes.</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {auditLogs.length} Records
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Actor</th>
                      <th className="py-2.5 px-4">Workstation</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No audit entries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-white font-mono text-[11px]">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            {log.actorName} ({log.actorRole})
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {log.workstationId}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-400">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Structured Onboarding Wizard Dialog */}
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="sm:max-w-[560px] rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 grid place-items-center font-bold">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Onboard New Educational Group
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Step {provisionStep} of 2 &bull; Provision tenant organization & primary campus
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleProvisionSubmit} className="space-y-4 pt-2">
            {provisionError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{provisionError}</span>
              </div>
            )}

            {provisionStep === 1 && (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Organization / School Group Name *
                  </Label>
                  <Input
                    placeholder="e.g. St. Lawrence Educational Conglomerate"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Organization Code (Unique) *
                    </Label>
                    <Input
                      placeholder="e.g. SLA-2026"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      maxLength={12}
                      className="h-9 rounded-xl text-xs font-mono uppercase bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Contract Campus Quota (Max 20) *
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.maxCampuses}
                      onChange={(e) => setFormData({ ...formData, maxCampuses: Number(e.target.value) })}
                      required
                      className="h-9 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Official Contact Email *
                    </Label>
                    <Input
                      type="email"
                      placeholder="director@stlawrence.sc.ug"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      required
                      className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Official Contact Phone *
                    </Label>
                    <Input
                      placeholder="+256 701 116 781"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      required
                      className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Official Motto / Tagline (Optional)
                  </Label>
                  <Input
                    placeholder="e.g. Excellence, Leadership and Godliness"
                    value={formData.motto}
                    onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                    className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>
            )}

            {provisionStep === 2 && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Primary Campus Name *
                    </Label>
                    <Input
                      placeholder="e.g. Crown City Main Campus"
                      value={formData.primaryCampusName}
                      onChange={(e) => setFormData({ ...formData, primaryCampusName: e.target.value })}
                      required
                      className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Primary Campus Code *
                    </Label>
                    <Input
                      placeholder="e.g. CRO-01"
                      value={formData.primaryCampusCode}
                      onChange={(e) => setFormData({ ...formData, primaryCampusCode: e.target.value.toUpperCase() })}
                      required
                      maxLength={10}
                      className="h-9 rounded-xl text-xs font-mono uppercase bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Physical Location
                    </Label>
                    <Input
                      placeholder="e.g. Maya, Masaka Road"
                      value={formData.primaryLocation}
                      onChange={(e) => setFormData({ ...formData, primaryLocation: e.target.value })}
                      className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Principal / Headteacher
                    </Label>
                    <Input
                      placeholder="e.g. Dr. Arthur Ssentongo"
                      value={formData.headteacher}
                      onChange={(e) => setFormData({ ...formData, headteacher: e.target.value })}
                      className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Chief Administrator Credentials
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Administrator Name</Label>
                      <Input
                        placeholder="e.g. Managing Director"
                        value={formData.adminName}
                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Administrator Login Email</Label>
                      <Input
                        type="email"
                        placeholder="admin@stlawrence.sc.ug"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        className="h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {provisionStep === 1 ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProvisionOpen(false)}
                    className="text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (!formData.name.trim() || !formData.code.trim() || !formData.contactEmail.trim()) {
                        setProvisionError("Please complete all required fields (*).");
                        return;
                      }
                      setProvisionError(null);
                      setProvisionStep(2);
                    }}
                    className="text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Continue to Campus Setup &rarr;
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setProvisionStep(1)}
                    className="text-xs rounded-xl"
                  >
                    &larr; Back
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? "Provisioning..." : "Complete Tenant Provisioning"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quota Modal */}
      <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Configure Campus Quota
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Adjust the contract campus license for <strong className="text-slate-900 dark:text-white">{selectedSchoolForQuota?.name}</strong>. Enterprise platform ceiling is strictly 20 campuses per school group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Authorized Campuses (1 - 20)
              </Label>
              <Input
                type="number"
                min={selectedSchoolForQuota?.campusCount ?? 1}
                max={20}
                value={newQuotaValue}
                onChange={(e) => setNewQuotaValue(Number(e.target.value))}
                className="h-10 text-center text-lg font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Active Branch Campuses:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedSchoolForQuota?.campusCount}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Enterprise Max Ceiling:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">20 Campuses</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsQuotaModalOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveQuota}
              disabled={isSubmitting}
              className="text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Quota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
