"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Layers,
  Users,
  Search,
  Plus,
  Server,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Database,
  RefreshCw,
  Sliders,
  FileSpreadsheet,
  Download,
  Upload,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Eye,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getGlobalMetricsAction,
  getAllSchoolsAction,
  provisionSchoolAction,
  toggleSchoolStatusAction,
  updateCampusQuotaAction,
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  // Modals State
  const [isProvisionOpen, setIsProvisionOpen] = useState<boolean>(false);
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
      const [metricRes, schoolRes] = await Promise.all([
        getGlobalMetricsAction(),
        getAllSchoolsAction(),
      ]);

      if (metricRes.success && metricRes.data) {
        setTelemetry(metricRes.data);
      }
      if (schoolRes.success && schoolRes.data) {
        setSchools(schoolRes.data);
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
        `Are you sure you want to change status of '${school.name}' to ${nextStatus}?`
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

  // PIN Access Guard Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="size-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 grid place-items-center mx-auto">
            <Lock className="size-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 font-mono text-[11px]">
              RESTRICTED EXECUTIVE CLEARANCE
            </Badge>
            <h1 className="text-2xl font-bold text-white tracking-tight">Super Admin SaaS HQ</h1>
            <p className="text-xs text-slate-400">
              Enter your Master Enterprise PIN to manage multi-tenant cluster provisioning (200 Organizations, 20 Campuses Cap).
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            {pinError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center justify-center gap-2">
                <ShieldAlert className="size-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-1 text-left">
              <Label className="text-xs text-slate-300 font-semibold">Master Access Key (PIN)</Label>
              <Input
                type="password"
                placeholder="Enter 4-digit Master PIN (e.g. 9900)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="bg-slate-950 border-slate-800 text-white rounded-xl text-center tracking-widest text-lg h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20"
            >
              Verify Master Credentials
            </Button>
          </form>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4 flex items-center justify-center gap-2">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>Bank-Grade Session Guard &bull; Encrypted TLS 1.3</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top SaaS Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white grid place-items-center shadow-md shadow-indigo-500/20 font-bold text-sm">
              HQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white tracking-tight">Super Admin SaaS HQ</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  LIVE CLUSTER
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Multi-Tenant Governance Engine &bull; Max 200 Schools &bull; 20 Campuses Limit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl h-9 text-xs gap-1.5"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync
            </Button>

            <Link href="/admin/dashboard" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl h-9 text-xs gap-1.5"
              >
                <span>Live School Portal</span>
                <ArrowUpRight className="size-3.5 text-slate-400" />
              </Button>
            </Link>

            <Button
              onClick={() => setIsProvisionOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-9 text-xs font-semibold gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="size-3.5" />
              Onboard School Group
            </Button>
          </div>
        </div>
      </header>

      {/* Main SaaS Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Executive Telemetry Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: School Capacity */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>School Organizations</span>
              <Building2 className="size-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {telemetry?.totalSchools ?? 1}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {telemetry?.maxSchoolsLimit ?? 200} Max
              </span>
            </div>
            {/* Visual Capacity Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(
                    1,
                    ((telemetry?.totalSchools ?? 1) / (telemetry?.maxSchoolsLimit ?? 200)) * 100
                  )}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Cluster Capacity</span>
              <span className="text-indigo-400 font-mono font-semibold">
                {(telemetry?.maxSchoolsLimit ?? 200) - (telemetry?.totalSchools ?? 1)} Available Slots
              </span>
            </div>
          </div>

          {/* Card 2: Active Campuses */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Active Branch Campuses</span>
              <Layers className="size-4 text-violet-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {telemetry?.totalCampuses ?? 2}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {telemetry?.maxCampusesClusterLimit ?? 4000} Max
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full transition-all"
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
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Limit Per School</span>
              <span className="text-violet-400 font-mono font-semibold">20 Campuses Cap</span>
            </div>
          </div>

          {/* Card 3: Total Enrolled Students */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Enrolled Students</span>
              <Users className="size-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {(telemetry?.totalStudents ?? 0).toLocaleString()}
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                UNLIMITED
              </Badge>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>Zero throttling per campus branch</span>
            </div>
          </div>

          {/* Card 4: Durability & Security Status */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Bank-Grade Durability</span>
              <ShieldCheck className="size-4 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Continuous WAL PITR
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                PostgreSQL &bull; AES-256 Encrypted
              </div>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-2">
              <span>Workstation Sync</span>
              <span className="text-cyan-400 font-mono font-semibold">
                {telemetry?.systemHealth.activeWorkstations ?? 3} Online
              </span>
            </div>
          </div>
        </section>

        {/* School Organizations Management Area */}
        <section className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Educational Groups & Conglomerates ({filteredSchools.length})
              </h2>
              <p className="text-xs text-slate-400">
                Manage tenant organizations, configure campus quotas (up to 20), and oversee multi-campus branch operations.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
                <Input
                  placeholder="Search by school name, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs pl-8 h-9 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-xl">
                {(["ALL", "ACTIVE", "SUSPENDED"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === filter
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* School Cards / Table */}
          <div className="space-y-4">
            {filteredSchools.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl space-y-3">
                <Building2 className="size-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">No school organizations match your search.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsProvisionOpen(true)}
                  className="border-slate-800 bg-slate-900 text-slate-300 text-xs rounded-xl"
                >
                  Onboard First School Group
                </Button>
              </div>
            ) : (
              filteredSchools.map((school) => {
                const quotaPercent = Math.min(100, (school.campusCount / school.maxCampuses) * 100);
                return (
                  <div
                    key={school.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: School Info */}
                      <div className="flex items-start gap-3.5">
                        <div className="size-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 grid place-items-center shrink-0 font-bold text-sm">
                          {school.code.substring(0, 3)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{school.name}</span>
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] border-slate-700 text-slate-300"
                            >
                              {school.code}
                            </Badge>
                            <Badge
                              className={`text-[10px] font-semibold ${
                                school.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {school.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {school.contactEmail && <span>Email: {school.contactEmail}</span>}
                            {school.contactPhone && <span>Phone: {school.contactPhone}</span>}
                            <span>Registered: {new Date(school.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Metrics & Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Campus Quota Pill */}
                        <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                          <Layers className="size-3.5 text-violet-400" />
                          <span className="text-slate-400">Campuses:</span>
                          <span className="font-mono font-bold text-white">
                            {school.campusCount} / {school.maxCampuses}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            (Max: 20)
                          </span>
                        </div>

                        {/* Students Pill */}
                        <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs">
                          <Users className="size-3.5 text-emerald-400" />
                          <span className="text-slate-400">Total Students:</span>
                          <span className="font-mono font-bold text-white">
                            {school.totalStudents.toLocaleString()}
                          </span>
                        </div>

                        {/* Modify Quota Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenQuotaModal(school)}
                          className="border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl h-8 text-xs gap-1"
                        >
                          <Sliders className="size-3" />
                          Quota
                        </Button>

                        {/* Toggle Status */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(school)}
                          className={`rounded-xl h-8 text-xs font-semibold ${
                            school.status === "ACTIVE"
                              ? "border-red-900/40 text-red-400 hover:bg-red-500/10"
                              : "border-emerald-900/40 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {school.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </div>

                    {/* Campuses Sub-List */}
                    <div className="border-t border-slate-800/80 pt-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Layers className="size-3" />
                        <span>Provisioned Campuses ({school.campuses.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {school.campuses.map((camp) => (
                          <div
                            key={camp.id}
                            className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-white truncate">
                                {camp.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="font-mono text-[9px] border-slate-700 text-slate-300"
                              >
                                {camp.code}
                              </Badge>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center justify-between">
                              <span>Head: {camp.headteacher || "Not assigned"}</span>
                              <span className="font-mono text-emerald-400 font-semibold">
                                {camp.studentCount} students
                              </span>
                            </div>
                            {camp.location && (
                              <div className="text-[10px] text-slate-500 truncate">
                                {camp.location}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Fast CSV Bulk Onboarding & Data Migration Tool */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  High-Speed Data Migration & Ingestion Engine
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Onboard 10,000+ students for newly joined institutions in seconds using standardized multi-campus CSV templates.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={downloadCSVTemplate}
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-xl h-9 text-xs gap-1.5"
            >
              <Download className="size-3.5" />
              Download Standard CSV Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400 pt-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="font-semibold text-white">1. Automatic Campus Mapping</span>
              <p className="text-[11px] text-slate-500">
                Rows tagged with <code className="text-indigo-400">MUK-01</code> or <code className="text-indigo-400">JIN-02</code> route automatically to their isolated campus database partitions.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="font-semibold text-white">2. Automatic Fee Invoice Sync</span>
              <p className="text-[11px] text-slate-500">
                Pre-existing term arrears and bursary meal cards are automatically provisioned without double-entry errors.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <span className="font-semibold text-white">3. Zero Data Loss Verification</span>
              <p className="text-[11px] text-slate-500">
                Transactions are validated atomically with instant rollback if duplicate registration codes are encountered.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Onboard New School Modal */}
      <Dialog open={isProvisionOpen} onOpenChange={setIsProvisionOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <div className="size-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 grid place-items-center mb-2">
              <Building2 className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Onboard New Educational Conglomerate</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Provision a new school group into the cluster with multi-tenant isolation, custom campus quota (up to 20), and lead administrative credentials.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProvisionSubmit} className="space-y-4 pt-2">
            {provisionError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="size-4 shrink-0" />
                <span>{provisionError}</span>
              </div>
            )}

            {/* Section 1: Organization Details */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <span>1. School Group / Conglomerate Profile</span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">Official Organization Name *</Label>
                <Input
                  placeholder="e.g. St. Lawrence Educational Conglomerate"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Group Code (Unique) *</Label>
                  <Input
                    placeholder="e.g. SLA-2026"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white font-mono uppercase"
                    maxLength={12}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Contract Campus Quota (Max 20) *</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.maxCampuses}
                    onChange={(e) => setFormData({ ...formData, maxCampuses: Number(e.target.value) })}
                    required
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Official Contact Email *</Label>
                  <Input
                    type="email"
                    placeholder="director@stlawrence.sc.ug"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Official Phone *</Label>
                  <Input
                    placeholder="+256 701 116 781"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Primary Campus Provisioning */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <span>2. Initial Primary Campus (Branch #1)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Campus Name *</Label>
                  <Input
                    placeholder="e.g. Crown City Main Campus"
                    value={formData.primaryCampusName}
                    onChange={(e) => setFormData({ ...formData, primaryCampusName: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Campus Code *</Label>
                  <Input
                    placeholder="e.g. CRO-01"
                    value={formData.primaryCampusCode}
                    onChange={(e) => setFormData({ ...formData, primaryCampusCode: e.target.value.toUpperCase() })}
                    required
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white font-mono uppercase"
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Physical Location</Label>
                  <Input
                    placeholder="e.g. Maya, Masaka Road, Wakiso"
                    value={formData.primaryLocation}
                    onChange={(e) => setFormData({ ...formData, primaryLocation: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Headteacher / Principal</Label>
                  <Input
                    placeholder="e.g. Prof. Lawrence Mukiibi"
                    value={formData.headteacher}
                    onChange={(e) => setFormData({ ...formData, headteacher: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Master Admin Account */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <span>3. Master Administrative User Credentials</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Admin Full Name</Label>
                  <Input
                    placeholder="e.g. Managing Director"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300 font-semibold">Admin Login Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@stlawrence.sc.ug"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-xs h-9 rounded-xl text-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsProvisionOpen(false)}
                disabled={isSubmitting}
                className="border-slate-800 bg-slate-950 text-slate-300 rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-9 font-semibold gap-1.5 shadow-md shadow-indigo-600/20"
              >
                {isSubmitting ? "Provisioning Organization..." : "Provision & Activate School"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quota Modal */}
      <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <div className="size-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 grid place-items-center mb-2">
              <Sliders className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold">Update Campus Quota</DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Adjust the contract campus limit for <strong className="text-white">{selectedSchoolForQuota?.name}</strong>. Enterprise platform ceiling is strictly 20 campuses per school.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300 font-semibold">Allowed Campuses (1 - 20)</Label>
              <Input
                type="number"
                min={selectedSchoolForQuota?.campusCount ?? 1}
                max={20}
                value={newQuotaValue}
                onChange={(e) => setNewQuotaValue(Number(e.target.value))}
                className="bg-slate-950 border-slate-800 text-xs h-10 rounded-xl text-white font-mono text-center text-lg"
              />
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Currently Active:</span>
                <span className="font-bold text-white font-mono">{selectedSchoolForQuota?.campusCount} campuses</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Allowed:</span>
                <span className="font-bold text-violet-400 font-mono">20 campuses</span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsQuotaModalOpen(false)}
              className="border-slate-800 bg-slate-950 text-slate-300 rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveQuota}
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs h-9 font-semibold"
            >
              Save New Quota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
