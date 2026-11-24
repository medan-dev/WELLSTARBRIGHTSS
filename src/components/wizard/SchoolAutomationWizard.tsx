"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  Building2,
  Award,
  Phone,
  Mail,
  MapPin,
  QrCode,
  ShieldCheck,
  CreditCard,
  FileText,
  Utensils,
  RefreshCw,
  X,
  ArrowRight,
  Sliders,
  Check,
  FileArchive,
  Loader2,
  Download,
  AlertCircle,
  Globe,
  BookOpen,
  Calendar,
  Wallet,
  Clock,
  Users,
  Briefcase,
  Layers,
  GraduationCap,
  Barcode,
  Receipt,
  Settings,
  Tag,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSchoolBrand, SchoolBrandConfig, PRESET_SCHOOLS, DEFAULT_SCHOOL_BRAND } from "@/context/SchoolBrandContext";
import {
  analyzeSchoolFile,
  extractBrandFromText,
  SAMPLE_DOCUMENTS,
  DocumentAnalysisResult,
  generateStarterDocumentTemplate,
} from "@/lib/school-document-analyzer";

interface SchoolAutomationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardTab =
  | "doc_ingest"
  | "identity"
  | "academics"
  | "finance"
  | "operations"
  | "badge"
  | "identification"
  | "presets";

export function SchoolAutomationWizard({ isOpen, onClose }: SchoolAutomationWizardProps) {
  const { brand, updateBrand, loadPreset, resetToDefault } = useSchoolBrand();

  const [form, setForm] = useState<SchoolBrandConfig>({
    ...DEFAULT_SCHOOL_BRAND,
    ...brand,
    coreValues: brand.coreValues || [...DEFAULT_SCHOOL_BRAND.coreValues],
    classesOffered: brand.classesOffered || [...DEFAULT_SCHOOL_BRAND.classesOffered],
    subjectOfferings: brand.subjectOfferings || [...DEFAULT_SCHOOL_BRAND.subjectOfferings],
    mealsOffered: brand.mealsOffered || [...DEFAULT_SCHOOL_BRAND.mealsOffered],
    boardingHouses: brand.boardingHouses || [...DEFAULT_SCHOOL_BRAND.boardingHouses],
    frontSiteStats: brand.frontSiteStats || { ...DEFAULT_SCHOOL_BRAND.frontSiteStats },
  });

  const [activeTab, setActiveTab] = useState<WizardTab>("doc_ingest");
  const [activePreview, setActivePreview] = useState<"id_card" | "meal_pass" | "report_card" | "receipt" | "staff_badge">("id_card");
  const [badgePreview, setBadgePreview] = useState<string>(brand.badgeUrl || "/logo.png");

  // Document & ZIP Analyzer States
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [showPasteBox, setShowPasteBox] = useState(false);

  // Quick tag inputs
  const [newClassInput, setNewClassInput] = useState("");
  const [newSubjectInput, setNewSubjectInput] = useState("");
  const [newDormInput, setNewDormInput] = useState("");

  if (!isOpen) return null;

  // Process Document or ZIP File Upload
  const handleFileAnalysis = async (file: File) => {
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeSchoolFile(file);
      setAnalysisResult(result);
      setForm(result.extractedBrand);
      if (result.extractedBrand.badgeUrl) {
        setBadgePreview(result.extractedBrand.badgeUrl);
      }
      toast.success(`Successfully analyzed ${file.name}! Detected ${result.detectedFieldsCount} institutional & system configurations.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse document or ZIP archive.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Process Built-in Real-World Sample
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (!sample) return;

    setAnalyzing(true);
    setTimeout(() => {
      const { brand: extractedBrand, detected } = extractBrandFromText(sample.content);
      const score = Math.min(100, Math.round((detected.length / 15) * 100));

      const result: DocumentAnalysisResult = {
        success: true,
        fileName: sample.filename,
        fileType: sample.type.includes("JSON") ? "json" : "document",
        detectedFieldsCount: detected.length,
        confidenceScore: Math.max(score, 80),
        extractedBrand,
        detectedItems: detected,
        extractedImages: [],
        rawTextPreview: sample.content.slice(0, 1500),
        summary: `Parsed ${sample.title}. Extracted ${detected.length} preferences & system settings with ${score}% structural confidence.`,
        categoryBreakdown: {
          identity: detected.filter((i) => i.category === "identity").length,
          academics: detected.filter((i) => i.category === "academics").length,
          finance: detected.filter((i) => i.category === "finance").length,
          operations: detected.filter((i) => i.category === "operations").length,
          leadership: detected.filter((i) => i.category === "leadership").length,
          branding: detected.filter((i) => i.category === "branding").length,
        }
      };

      setAnalysisResult(result);
      setForm(extractedBrand);
      setBadgePreview(extractedBrand.badgeUrl);
      setAnalyzing(false);
      toast.success(`Loaded sample: ${sample.title}`);
    }, 350);
  };

  // Process Pasted Raw Text
  const handleAnalyzePastedText = () => {
    if (!pastedText.trim()) {
      toast.error("Please paste some document text or prospectus content first.");
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      const { brand: extractedBrand, detected } = extractBrandFromText(pastedText);
      const score = Math.min(100, Math.round((detected.length / 15) * 100));

      const result: DocumentAnalysisResult = {
        success: true,
        fileName: "Pasted_Document_Text.txt",
        fileType: "text",
        detectedFieldsCount: detected.length,
        confidenceScore: Math.max(score, 60),
        extractedBrand,
        detectedItems: detected,
        extractedImages: [],
        rawTextPreview: pastedText.slice(0, 1500),
        summary: `Analyzed raw document text. Detected ${detected.length} institutional fields & system settings with ${score}% confidence.`,
        categoryBreakdown: {
          identity: detected.filter((i) => i.category === "identity").length,
          academics: detected.filter((i) => i.category === "academics").length,
          finance: detected.filter((i) => i.category === "finance").length,
          operations: detected.filter((i) => i.category === "operations").length,
          leadership: detected.filter((i) => i.category === "leadership").length,
          branding: detected.filter((i) => i.category === "branding").length,
        }
      };

      setAnalysisResult(result);
      setForm(extractedBrand);
      setAnalyzing(false);
      toast.success(`Analyzed pasted text. Detected ${detected.length} institutional fields.`);
    }, 300);
  };

  // Download official starter template
  const handleDownloadTemplate = (format: "json" | "markdown") => {
    const { filename, content } = generateStarterDocumentTemplate(format);
    const mime = format === "json" ? "application/json" : "text/markdown";
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded starter template: ${filename}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.name.endsWith(".zip") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".json") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      ) {
        handleFileAnalysis(file);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Badge image must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setBadgePreview(result);
        setForm((prev) => ({
          ...prev,
          badgeUrl: result,
          badgeInitials: prev.name.slice(0, 2).toUpperCase() || "SC",
        }));
        toast.success("School badge crest loaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateBrand(form);
    toast.success(`Applied ${form.name} customization across Front Site, System Settings & Identification Features!`);
    onClose();
  };

  const handleApplyPreset = (key: "demo" | "st_pauls" | "greenhill" | "kitende") => {
    loadPreset(key as any);
    const p = PRESET_SCHOOLS[key] || DEFAULT_SCHOOL_BRAND;
    const merged = { ...DEFAULT_SCHOOL_BRAND, ...p };
    setForm(merged);
    setBadgePreview(merged.badgeUrl || "/logo.png");
    toast.success(`Loaded institutional preset: ${merged.name}`);
  };

  const handleReset = () => {
    resetToDefault();
    setForm(DEFAULT_SCHOOL_BRAND);
    setBadgePreview(DEFAULT_SCHOOL_BRAND.badgeUrl);
    setAnalysisResult(null);
    toast.info("Reset system to standard zero-data demo configuration");
  };

  // Add/remove class tag
  const handleAddClass = () => {
    if (!newClassInput.trim()) return;
    if (!form.classesOffered.includes(newClassInput.trim())) {
      setForm((prev) => ({
        ...prev,
        classesOffered: [...prev.classesOffered, newClassInput.trim()]
      }));
    }
    setNewClassInput("");
  };

  const handleRemoveClass = (cls: string) => {
    setForm((prev) => ({
      ...prev,
      classesOffered: prev.classesOffered.filter((c) => c !== cls)
    }));
  };

  // Add/remove subject tag
  const handleAddSubject = () => {
    if (!newSubjectInput.trim()) return;
    if (!form.subjectOfferings.includes(newSubjectInput.trim())) {
      setForm((prev) => ({
        ...prev,
        subjectOfferings: [...prev.subjectOfferings, newSubjectInput.trim()]
      }));
    }
    setNewSubjectInput("");
  };

  const handleRemoveSubject = (sub: string) => {
    setForm((prev) => ({
      ...prev,
      subjectOfferings: prev.subjectOfferings.filter((s) => s !== sub)
    }));
  };

  // Add/remove dorm tag
  const handleAddDorm = () => {
    if (!newDormInput.trim()) return;
    if (!form.boardingHouses.includes(newDormInput.trim())) {
      setForm((prev) => ({
        ...prev,
        boardingHouses: [...prev.boardingHouses, newDormInput.trim()]
      }));
    }
    setNewDormInput("");
  };

  const handleRemoveDorm = (dorm: string) => {
    setForm((prev) => ({
      ...prev,
      boardingHouses: prev.boardingHouses.filter((d) => d !== dorm)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-5xl max-h-[94vh] flex flex-col rounded-none border border-slate-300 shadow-2xl overflow-hidden animate-scale-in">
        {/* Top Header */}
        <div className="h-14 px-5 bg-[#0b2256] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 bg-[#f26522] grid place-items-center text-white font-bold text-xs rounded-none">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">SYSTEM SETUP & AUTOMATION WIZARD</div>
              <div className="text-[10px] text-slate-300">
                Institutional Document & ZIP Ingestion • Complete System Settings • Front Site & ID Features
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2.5 text-xs text-white border-white/20 bg-white/10 hover:bg-white/20 rounded-none gap-1 font-mono"
            >
              <RefreshCw className="size-3" />
              <span>Reset</span>
            </Button>
            <button
              onClick={onClose}
              className="size-8 grid place-items-center rounded-none text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Wizard Step Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-3 overflow-x-auto shrink-0 scrollbar-none text-xs">
          {[
            { id: "doc_ingest", label: "Document & ZIP Ingestion", icon: FileArchive, badge: "Automated" },
            { id: "identity", label: "School Identity & Legal", icon: Building2 },
            { id: "academics", label: "Academics & Grading", icon: BookOpen },
            { id: "finance", label: "Finance & POS Settings", icon: Wallet },
            { id: "operations", label: "Operations & Welfare", icon: Clock },
            { id: "badge", label: "Badge & Brand Colors", icon: Award },
            { id: "identification", label: "Live ID Previews", icon: QrCode },
            { id: "presets", label: "Institutional Presets", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WizardTab)}
                className={`flex items-center gap-1.5 px-3.5 py-3 border-b-2 font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "border-[#f26522] text-[#0b2256] bg-white shadow-xs font-bold"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`size-3.5 ${active ? "text-[#f26522]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#f26522]/15 text-[#f26522] font-bold rounded-xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Wizard Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* TAB 1: DOCUMENT & ARCHIVE INGESTION */}
          {activeTab === "doc_ingest" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Hero Banner */}
              <div className="p-4 bg-gradient-to-r from-[#0b2256] to-slate-900 text-white rounded-none border border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider rounded-xs mb-1">
                    <Sparkles className="size-3" /> Universal Document & ZIP Ingestion
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Automate Full School Setup from an Official Document or Archive
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                    Upload your school prospectus, strategic plan, fee schedule, staff handbook, or a ZIP file with your badge logo. EDUREXA automatically extracts all institutional identities, UNEB/MoES numbers, grading scales, fee structures, bank accounts, and daily schedules automatically.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate("markdown")}
                    className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1 font-mono"
                  >
                    <Download className="size-3 text-amber-300" />
                    <span>Template (.md)</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate("json")}
                    className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-none gap-1 font-mono"
                  >
                    <Download className="size-3 text-amber-300" />
                    <span>Template (.json)</span>
                  </Button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="wizard-file-input"
                    className={`border-2 border-dashed rounded-none p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      analyzing
                        ? "border-[#f26522] bg-orange-50/50"
                        : "border-slate-300 hover:border-[#0b2256] hover:bg-white bg-slate-50"
                    }`}
                  >
                    <input
                      id="wizard-file-input"
                      type="file"
                      accept=".zip,.json,.txt,.md,.csv,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={analyzing}
                    />
                    {analyzing ? (
                      <div className="flex flex-col items-center gap-2 py-3">
                        <Loader2 className="size-8 text-[#f26522] animate-spin" />
                        <div className="text-sm font-bold text-slate-800">Analyzing Document & Ingesting Preferences...</div>
                        <div className="text-xs text-slate-500">Extracting institutional identity, grading rules, fee schedules & crest</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-12 rounded-none bg-[#0b2256]/10 text-[#0b2256] grid place-items-center">
                          <Upload className="size-6 text-[#0b2256]" />
                        </div>
                        <div className="text-sm font-bold text-slate-800">
                          Drop School Document or ZIP Archive Here
                        </div>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Supports <strong>.zip</strong> (with badge logo & documents), <strong>.json</strong>, <strong>.txt</strong>, <strong>.md</strong>, or <strong>.csv</strong>
                        </p>
                        <span className="text-[11px] font-semibold text-[#f26522] bg-[#f26522]/10 px-3 py-1 rounded-none border border-[#f26522]/20">
                          Browse Local Files
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Built-in Sample Loaders */}
                <div className="bg-white border border-slate-200 p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="size-3.5 text-[#0b2256]" />
                      <span>Instant 1-Click Real Samples</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Test the setup engine instantly with real Ugandan educational institution profiles:
                    </p>
                    <div className="space-y-1.5">
                      {SAMPLE_DOCUMENTS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleLoadSample(s.id)}
                          className="w-full text-left p-2 rounded-none border border-slate-200 hover:border-[#f26522] hover:bg-orange-50/40 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between group"
                        >
                          <span className="truncate pr-2 font-mono text-[11px]">{s.filename}</span>
                          <ArrowRight className="size-3 text-slate-400 group-hover:text-[#f26522] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPasteBox(!showPasteBox)}
                    className="mt-3 text-[11px] text-[#0b2256] font-bold hover:underline flex items-center gap-1"
                  >
                    {showPasteBox ? "Hide Paste Raw Text" : "Or Paste Prospectus Text Manually →"}
                  </button>
                </div>
              </div>

              {/* Paste Text Collapsible Box */}
              {showPasteBox && (
                <div className="p-4 bg-white border border-slate-200 rounded-none space-y-3">
                  <div className="text-xs font-bold text-slate-800">Paste School Prospectus or Profile Content</div>
                  <Textarea
                    rows={4}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste text containing School Name, UNEB Center, Motto, Day/Boarding Fees, Bank Accounts, Class streams..."
                    className="font-mono text-xs rounded-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAnalyzePastedText}
                      disabled={analyzing || !pastedText.trim()}
                      className="h-8 bg-[#0b2256] hover:bg-slate-900 text-white rounded-none text-xs gap-1"
                    >
                      <Sparkles className="size-3 text-[#f26522]" />
                      <span>Analyze Pasted Text</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Analysis Results Dashboard */}
              {analysisResult && (
                <div className="bg-white border border-emerald-300 rounded-none p-5 shadow-xs space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-none bg-emerald-100 text-emerald-700 grid place-items-center">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {analysisResult.summary}
                        </div>
                        <div className="text-xs text-slate-500">
                          Source: <span className="font-mono">{analysisResult.fileName}</span> ({analysisResult.fileType.toUpperCase()}) • Overall Confidence: <span className="font-bold text-emerald-600">{analysisResult.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setActiveTab("identity")}
                      className="bg-[#0b2256] hover:bg-slate-900 text-white text-xs h-8 rounded-none gap-1"
                    >
                      <span>Review Extracted Settings</span>
                      <ArrowRight className="size-3 text-[#f26522]" />
                    </Button>
                  </div>

                  {/* Category Breakdown Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {[
                      { label: "Identity & Legal", count: analysisResult.categoryBreakdown.identity, icon: Building2 },
                      { label: "Leadership", count: analysisResult.categoryBreakdown.leadership, icon: Users },
                      { label: "Academics", count: analysisResult.categoryBreakdown.academics, icon: BookOpen },
                      { label: "Finance & Fees", count: analysisResult.categoryBreakdown.finance, icon: Wallet },
                      { label: "Operations", count: analysisResult.categoryBreakdown.operations, icon: Clock },
                      { label: "Branding", count: analysisResult.categoryBreakdown.branding, icon: Award },
                    ].map((c) => {
                      const Icon = c.icon;
                      return (
                        <div key={c.label} className="p-2.5 bg-slate-50 border border-slate-200 rounded-none">
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <Icon className="size-3.5 text-[#0b2256]" />
                            <span className="text-xs font-bold text-slate-800">{c.count}</span>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-600 truncate">{c.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Extracted Images from ZIP */}
                  {analysisResult.extractedImages.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-bold text-slate-800 mb-2">
                        Extracted Crest / Badge Candidates from ZIP:
                      </div>
                      <div className="flex items-center gap-3 overflow-x-auto pb-1">
                        {analysisResult.extractedImages.map((img) => (
                          <button
                            key={img.name}
                            type="button"
                            onClick={() => {
                              setBadgePreview(img.dataUrl);
                              setForm((prev) => ({ ...prev, badgeUrl: img.dataUrl }));
                              toast.success(`Selected ${img.name} as school crest`);
                            }}
                            className={`p-2 border rounded-none flex items-center gap-2 text-xs transition-all ${
                              badgePreview === img.dataUrl
                                ? "border-[#f26522] bg-orange-50 font-bold"
                                : "border-slate-200 hover:border-slate-400 bg-white"
                            }`}
                          >
                            <img src={img.dataUrl} alt={img.name} className="size-8 object-contain" />
                            <div className="text-left">
                              <div className="text-[11px] font-mono truncate max-w-[120px]">{img.name}</div>
                              {img.isBadgeCandidate && (
                                <span className="text-[9px] text-[#f26522] font-semibold">Recommended Crest</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detected Items Grid Preview */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-800 mb-2">Detailed Field Detections:</div>
                    <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-none divide-y divide-slate-100 text-xs font-mono">
                      {analysisResult.detectedItems.map((item, idx) => (
                        <div key={idx} className="p-2 flex items-center justify-between bg-white hover:bg-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-bold uppercase rounded-xs">
                              {item.category}
                            </span>
                            <span className="font-semibold text-slate-800">{item.label}:</span>
                            <span className="text-slate-600 truncate max-w-md">{item.value}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs ${
                            item.confidence === "high"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {item.confidence.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCHOOL IDENTITY & LEGAL */}
          {activeTab === "identity" && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Institutional Identity & Legal Accreditation</h3>
                <p className="text-xs text-slate-500">Official registered institution information displayed across front-site and documentation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold">School Official Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-none mt-1"
                    placeholder="e.g. Wellstar Bright Secondary School"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Short Code / Acronym</Label>
                  <Input
                    value={form.shortCode}
                    onChange={(e) => setForm({ ...form, shortCode: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. WBSS-2026"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-xs font-bold">School Motto / Tagline</Label>
                  <Input
                    value={form.motto}
                    onChange={(e) => setForm({ ...form, motto: e.target.value })}
                    className="rounded-none mt-1"
                    placeholder="e.g. A holistic school built for character & intellect."
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">UNEB Center Examination Number</Label>
                  <Input
                    value={form.unebCenterNumber}
                    onChange={(e) => setForm({ ...form, unebCenterNumber: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. U0482"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Ministry of Education (MoES) Reg #</Label>
                  <Input
                    value={form.moesRegNumber}
                    onChange={(e) => setForm({ ...form, moesRegNumber: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. MoES/PSS/892/2018"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Year Established</Label>
                  <Input
                    value={form.establishedYear}
                    onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 2018"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">School Category & Level</Label>
                  <Input
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="rounded-none mt-1"
                    placeholder="e.g. Mixed Day & Boarding Secondary School (S.1 — S.6)"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-xs font-bold">Mission Statement</Label>
                  <Textarea
                    rows={2}
                    value={form.mission}
                    onChange={(e) => setForm({ ...form, mission: e.target.value })}
                    className="rounded-none mt-1 text-xs"
                    placeholder="School Mission Statement..."
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-xs font-bold">Vision Statement</Label>
                  <Textarea
                    rows={2}
                    value={form.vision}
                    onChange={(e) => setForm({ ...form, vision: e.target.value })}
                    className="rounded-none mt-1 text-xs"
                    placeholder="School Vision Statement..."
                  />
                </div>
              </div>

              {/* Leadership Hierarchy */}
              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Executive Leadership & Administration
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs font-bold">Head of School / Director</Label>
                    <Input
                      value={form.directorName}
                      onChange={(e) => setForm({ ...form, directorName: e.target.value })}
                      className="rounded-none mt-1"
                      placeholder="e.g. Nshuti Medan"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Leadership Title</Label>
                    <Input
                      value={form.directorTitle}
                      onChange={(e) => setForm({ ...form, directorTitle: e.target.value })}
                      className="rounded-none mt-1"
                      placeholder="e.g. Head of School / Director"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Bursar / Financial Controller</Label>
                    <Input
                      value={form.bursarName || ""}
                      onChange={(e) => setForm({ ...form, bursarName: e.target.value })}
                      className="rounded-none mt-1"
                      placeholder="e.g. Mr. Kasule Brian"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Deputy Head (Academics)</Label>
                    <Input
                      value={form.deputyAcademics || ""}
                      onChange={(e) => setForm({ ...form, deputyAcademics: e.target.value })}
                      className="rounded-none mt-1"
                      placeholder="e.g. Mr. Kigozi Emmanuel"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Deputy Head (Administration)</Label>
                    <Input
                      value={form.deputyAdmin || ""}
                      onChange={(e) => setForm({ ...form, deputyAdmin: e.target.value })}
                      className="rounded-none mt-1"
                      placeholder="e.g. Ms. Namubiru Sarah"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label className="text-xs font-bold">Director Welcome Bio</Label>
                    <Textarea
                      rows={2}
                      value={form.directorBio}
                      onChange={(e) => setForm({ ...form, directorBio: e.target.value })}
                      className="rounded-none mt-1 text-xs"
                      placeholder="Welcome message from the director..."
                    />
                  </div>
                </div>
              </div>

              {/* Campus Location & Contacts */}
              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Campus Location & Public Contacts
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-xs font-bold">Physical Campus Address</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="rounded-none mt-1"
                      placeholder="e.g. off Kayunga Road, Kabembe, Mukono District, Uganda"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Telephone Hotline</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="rounded-none mt-1 font-mono"
                      placeholder="e.g. +256 701 116 781"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">WhatsApp Inquiries Hotline</Label>
                    <Input
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="rounded-none mt-1 font-mono"
                      placeholder="e.g. +256 701 116 781"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Official Email</Label>
                    <Input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="rounded-none mt-1 font-mono"
                      placeholder="e.g. info@wellstarbright.sc.ug"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold">Institutional Portal / Website</Label>
                    <Input
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="rounded-none mt-1 font-mono"
                      placeholder="e.g. https://wellstarbright.sc.ug"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMICS & GRADING */}
          {activeTab === "academics" && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Academic System & Grading Configuration</h3>
                <p className="text-xs text-slate-500">Configure academic sessions, active terms, CBC/UNEB grading scales, and subject matrices.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold">Current Academic Year</Label>
                  <Input
                    value={form.academicYear}
                    onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 2026/2027"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Active Academic Term</Label>
                  <select
                    value={form.currentTerm}
                    onChange={(e) => setForm({ ...form, currentTerm: e.target.value })}
                    className="w-full h-9 border border-slate-300 bg-white px-3 text-xs font-semibold rounded-none mt-1"
                  >
                    <option value="Term 1">Term 1 (Opening / Easter Term)</option>
                    <option value="Term 2">Term 2 (Trinity / Mid Term)</option>
                    <option value="Term 3">Term 3 (Promotional / UNEB Term)</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold">Grading Framework</Label>
                  <select
                    value={form.gradingScale}
                    onChange={(e) => setForm({ ...form, gradingScale: e.target.value as any })}
                    className="w-full h-9 border border-slate-300 bg-white px-3 text-xs font-semibold rounded-none mt-1"
                  >
                    <option value="CBC">Competence-Based Curriculum (CBC 1.0 — 3.0)</option>
                    <option value="UNEB">UNEB Standard (Divisions 1 - 4 & D1 - F9)</option>
                    <option value="CAMBRIDGE">Cambridge IGCSE / GCE Standard (A* — G)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <Label className="text-xs font-bold">Term Session Dates</Label>
                  <Input
                    value={form.termDates}
                    onChange={(e) => setForm({ ...form, termDates: e.target.value })}
                    className="rounded-none mt-1"
                    placeholder="e.g. 02 Feb 2026 — 08 May 2026"
                  />
                </div>
              </div>

              {/* Class Streams Manager */}
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Classes & Streams Offered ({form.classesOffered.length})
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {form.classesOffered.map((cls) => (
                    <span
                      key={cls}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0b2256]/10 text-[#0b2256] text-xs font-bold rounded-none border border-[#0b2256]/20 font-mono"
                    >
                      {cls}
                      <button
                        type="button"
                        onClick={() => handleRemoveClass(cls)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <Input
                    size={20}
                    value={newClassInput}
                    onChange={(e) => setNewClassInput(e.target.value)}
                    placeholder="Add stream (e.g. S.3 Science)..."
                    className="h-8 rounded-none text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddClass();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddClass}
                    className="h-8 bg-[#0b2256] hover:bg-slate-900 text-white rounded-none text-xs gap-1"
                  >
                    <Plus className="size-3" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>

              {/* Subject Offerings Manager */}
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Curriculum Subject Offerings ({form.subjectOfferings.length})
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {form.subjectOfferings.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-none border border-slate-300"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <Input
                    value={newSubjectInput}
                    onChange={(e) => setNewSubjectInput(e.target.value)}
                    placeholder="Add subject (e.g. Technical Drawing)..."
                    className="h-8 rounded-none text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSubject}
                    className="h-8 bg-[#0b2256] hover:bg-slate-900 text-white rounded-none text-xs gap-1"
                  >
                    <Plus className="size-3" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE & POS SETTINGS */}
          {activeTab === "finance" && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Finance Command, Fee Structures & Anti-Leakage POS</h3>
                <p className="text-xs text-slate-500">Configure institutional fee collections, bank clearing accounts, mobile money merchant codes, and thermal receipt headers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold">Billing Currency</Label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full h-9 border border-slate-300 bg-white px-3 text-xs font-semibold rounded-none mt-1 font-mono"
                  >
                    <option value="UGX">UGX — Ugandan Shillings</option>
                    <option value="USD">USD — US Dollars</option>
                    <option value="KES">KES — Kenyan Shillings</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold">Day Scholar Tuition Fee / Term</Label>
                  <Input
                    value={form.termFeesDay}
                    onChange={(e) => setForm({ ...form, termFeesDay: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 850,000"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Boarding Student Tuition Fee / Term</Label>
                  <Input
                    value={form.termFeesBoarding}
                    onChange={(e) => setForm({ ...form, termFeesBoarding: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 1,450,000"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Official School Bank Name</Label>
                  <Input
                    value={form.paymentBankName}
                    onChange={(e) => setForm({ ...form, paymentBankName: e.target.value })}
                    className="rounded-none mt-1"
                    placeholder="e.g. Stanbic Bank Uganda"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Bank Account Number</Label>
                  <Input
                    value={form.paymentAccountNumber}
                    onChange={(e) => setForm({ ...form, paymentAccountNumber: e.target.value })}
                    className="rounded-none mt-1 font-mono font-bold text-[#0b2256]"
                    placeholder="e.g. 9030018829401"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">MTN MoMo Pay Merchant Code</Label>
                  <Input
                    value={form.momoMerchantCode}
                    onChange={(e) => setForm({ ...form, momoMerchantCode: e.target.value })}
                    className="rounded-none mt-1 font-mono font-bold text-amber-600"
                    placeholder="e.g. 612450"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Airtel Money Merchant Code</Label>
                  <Input
                    value={form.airtelMerchantCode}
                    onChange={(e) => setForm({ ...form, airtelMerchantCode: e.target.value })}
                    className="rounded-none mt-1 font-mono font-bold text-red-600"
                    placeholder="e.g. 189420"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-xs font-bold">POS Thermal Receipt Header Title</Label>
                  <Input
                    value={form.posReceiptHeader}
                    onChange={(e) => setForm({ ...form, posReceiptHeader: e.target.value })}
                    className="rounded-none mt-1 font-mono text-xs uppercase"
                    placeholder="e.g. WELLSTAR BRIGHT SS — BURSARY & POS COMMAND"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label className="text-xs font-bold">POS Thermal Receipt Footer Note</Label>
                  <Input
                    value={form.posReceiptFooter || ""}
                    onChange={(e) => setForm({ ...form, posReceiptFooter: e.target.value })}
                    className="rounded-none mt-1 text-xs"
                    placeholder="e.g. Fees once paid are non-refundable. Verified by EDUREXA Ledger."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OPERATIONS & WELFARE */}
          {activeTab === "operations" && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Campus Operations, Schedules & Student Welfare</h3>
                <p className="text-xs text-slate-500">Configure daily timetable periods, attendance tracking modes, meal service tiers, and boarding dormitories.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-bold">Daily School Reporting Time</Label>
                  <Input
                    value={form.dailyStartTime}
                    onChange={(e) => setForm({ ...form, dailyStartTime: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 07:30 AM"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Daily Dismissal Time</Label>
                  <Input
                    value={form.dailyEndTime}
                    onChange={(e) => setForm({ ...form, dailyEndTime: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 04:30 PM"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Period Duration (Minutes)</Label>
                  <Input
                    type="number"
                    value={form.periodDurationMinutes}
                    onChange={(e) => setForm({ ...form, periodDurationMinutes: parseInt(e.target.value, 10) || 40 })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="40"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Attendance Tracking Mode</Label>
                  <select
                    value={form.attendanceMode}
                    onChange={(e) => setForm({ ...form, attendanceMode: e.target.value as any })}
                    className="w-full h-9 border border-slate-300 bg-white px-3 text-xs font-semibold rounded-none mt-1"
                  >
                    <option value="Biometric">Biometric (Smart RFID Card / Turnstile)</option>
                    <option value="Daily">Daily Morning Rollcall</option>
                    <option value="Period">Period-by-Period Subject Attendance</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-bold">Admissions Application Form Fee</Label>
                  <Input
                    value={form.applicationFee}
                    onChange={(e) => setForm({ ...form, applicationFee: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 50,000"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold">Total Student Capacity</Label>
                  <Input
                    value={form.studentCapacity}
                    onChange={(e) => setForm({ ...form, studentCapacity: e.target.value })}
                    className="rounded-none mt-1 font-mono"
                    placeholder="e.g. 1,500"
                  />
                </div>
              </div>

              {/* Boarding Houses */}
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Boarding Houses / Dormitories ({form.boardingHouses.length})
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {form.boardingHouses.map((dorm) => (
                    <span
                      key={dorm}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-bold rounded-none border border-amber-300"
                    >
                      {dorm}
                      <button
                        type="button"
                        onClick={() => handleRemoveDorm(dorm)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <Input
                    value={newDormInput}
                    onChange={(e) => setNewDormInput(e.target.value)}
                    placeholder="Add house (e.g. Mandela House)..."
                    className="h-8 rounded-none text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDorm();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddDorm}
                    className="h-8 bg-[#0b2256] hover:bg-slate-900 text-white rounded-none text-xs gap-1"
                  >
                    <Plus className="size-3" />
                    <span>Add</span>
                  </Button>
                </div>
              </div>

              {/* Front-Site Public Statistics */}
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Front-Site Public Showcase Statistics
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-[11px] font-bold">Students Count</Label>
                    <Input
                      value={form.frontSiteStats.students}
                      onChange={(e) => setForm({
                        ...form,
                        frontSiteStats: { ...form.frontSiteStats, students: e.target.value }
                      })}
                      className="rounded-none mt-1 h-8 text-xs font-mono font-bold"
                      placeholder="1,250+"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">UNEB Pass Rate</Label>
                    <Input
                      value={form.frontSiteStats.passRate}
                      onChange={(e) => setForm({
                        ...form,
                        frontSiteStats: { ...form.frontSiteStats, passRate: e.target.value }
                      })}
                      className="rounded-none mt-1 h-8 text-xs font-mono font-bold text-emerald-600"
                      placeholder="98.4%"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Expert Teachers</Label>
                    <Input
                      value={form.frontSiteStats.teachers}
                      onChange={(e) => setForm({
                        ...form,
                        frontSiteStats: { ...form.frontSiteStats, teachers: e.target.value }
                      })}
                      className="rounded-none mt-1 h-8 text-xs font-mono font-bold"
                      placeholder="56"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold">Campuses</Label>
                    <Input
                      value={form.frontSiteStats.campuses}
                      onChange={(e) => setForm({
                        ...form,
                        frontSiteStats: { ...form.frontSiteStats, campuses: e.target.value }
                      })}
                      className="rounded-none mt-1 h-8 text-xs font-mono font-bold"
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BADGE & BRAND COLORS */}
          {activeTab === "badge" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">School Badge Crest & Visual Palette</h3>
                <p className="text-xs text-slate-500">Upload and configure the official school crest, emblem monogram, and primary/accent theme colors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Badge Upload & Preview */}
                <div className="p-5 bg-white border border-slate-200 rounded-none space-y-4">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    School Crest / Official Emblem
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-20 bg-slate-50 border-2 border-dashed border-slate-300 rounded-none grid place-items-center p-2 shrink-0">
                      {badgePreview ? (
                        <img src={badgePreview} alt="Crest Preview" className="size-full object-contain" />
                      ) : (
                        <Award className="size-8 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="badge-upload-btn" className="cursor-pointer">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2256] text-white text-xs font-bold rounded-none hover:bg-slate-900 transition-colors">
                          <Upload className="size-3 text-[#f26522]" />
                          Upload New Crest Image
                        </span>
                        <input
                          id="badge-upload-btn"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </Label>
                      <div className="text-[11px] text-slate-500 mt-1.5">
                        PNG, JPG, or WebP. Transparent backgrounds look best.
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-bold">Crest Monogram Initials</Label>
                    <Input
                      maxLength={4}
                      value={form.badgeInitials}
                      onChange={(e) => setForm({ ...form, badgeInitials: e.target.value.toUpperCase() })}
                      className="rounded-none mt-1 font-mono text-center font-bold text-lg w-24"
                      placeholder="WB"
                    />
                    <span className="text-[10px] text-slate-500">Used as fallback watermark when crest is loading</span>
                  </div>
                </div>

                {/* Color Schemes */}
                <div className="p-5 bg-white border border-slate-200 rounded-none space-y-4">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Visual Brand Colors
                  </div>

                  <div>
                    <Label className="text-xs font-bold">Primary Institutional Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                        className="size-9 rounded-none border border-slate-300 cursor-pointer p-0.5"
                      />
                      <Input
                        value={form.primaryColor}
                        onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                        className="rounded-none font-mono text-xs uppercase w-32"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-bold">Accent Highlight Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={form.accentColor}
                        onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                        className="size-9 rounded-none border border-slate-300 cursor-pointer p-0.5"
                      />
                      <Input
                        value={form.accentColor}
                        onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                        className="rounded-none font-mono text-xs uppercase w-32"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-bold">School Uniform Colors</Label>
                    <Input
                      value={form.uniformColors || ""}
                      onChange={(e) => setForm({ ...form, uniformColors: e.target.value })}
                      className="rounded-none mt-1 text-xs"
                      placeholder="e.g. Navy Blue Blazers, White Shirts & Khaki Trousers"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: IDENTIFICATION FEATURES LIVE PREVIEWS */}
          {activeTab === "identification" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Identification Features Live Preview</h3>
                  <p className="text-xs text-slate-500">Visual proof of how your school's badge, legal credentials, and colors render on official assets.</p>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto text-xs bg-slate-100 p-1 rounded-none border border-slate-200">
                  {[
                    { id: "id_card", label: "Student ID", icon: QrCode },
                    { id: "meal_pass", label: "Smart Meal Pass", icon: Utensils },
                    { id: "report_card", label: "Terminal Report Card", icon: FileText },
                    { id: "receipt", label: "Thermal POS Receipt", icon: Receipt },
                    { id: "staff_badge", label: "Staff Badge", icon: Briefcase },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePreview(p.id as any)}
                        className={`flex items-center gap-1 px-2.5 py-1 font-semibold rounded-none transition-all ${
                          activePreview === p.id
                            ? "bg-[#0b2256] text-white font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Icon className="size-3" />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PREVIEW 1: STUDENT ID CARD */}
              {activePreview === "id_card" && (
                <div className="flex justify-center py-6">
                  <div className="w-[360px] sm:w-[400px] bg-white rounded-none border-2 border-slate-300 shadow-xl overflow-hidden font-sans">
                    {/* ID Header */}
                    <div style={{ backgroundColor: form.primaryColor }} className="p-3 text-white flex items-center gap-3">
                      <img src={badgePreview} alt="Badge" className="size-11 object-contain bg-white/10 p-1 border border-white/20" />
                      <div className="min-w-0">
                        <div className="text-xs font-black tracking-tight uppercase truncate">{form.name}</div>
                        <div className="text-[10px] text-white/80 font-mono">UNEB CENTER: {form.unebCenterNumber}</div>
                        <div className="text-[9px] text-amber-300 italic truncate font-serif">"{form.motto}"</div>
                      </div>
                    </div>

                    {/* ID Body */}
                    <div className="p-4 grid grid-cols-3 gap-3 items-center bg-slate-50/50">
                      <div className="col-span-1 size-24 bg-slate-200 border border-slate-300 grid place-items-center text-slate-400 font-bold text-xs uppercase font-mono">
                        PHOTO
                      </div>
                      <div className="col-span-2 text-xs space-y-1">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-slate-400">STUDENT NAME</div>
                          <div className="font-extrabold text-slate-900">KASULE BRIAN MEDAN</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px]">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block">CLASS</span>
                            <span className="font-bold text-slate-800">S.4 SCIENCE</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block">REG NUMBER</span>
                            <span className="font-mono font-bold text-slate-800">{form.shortCode}-0482</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Expires: <span className="font-bold text-slate-700">NOV 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* ID Footer Barcode */}
                    <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between font-mono text-[9px] text-slate-500">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Barcode className="size-5" />
                        <span>*{form.shortCode}*0482*</span>
                      </div>
                      <div className="text-right">OFFICIAL STUDENT ID</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW 2: SMART MEAL PASS / NFC CARD */}
              {activePreview === "meal_pass" && (
                <div className="flex justify-center py-6">
                  <div className="w-[360px] sm:w-[400px] bg-gradient-to-br from-slate-900 to-[#0b2256] text-white rounded-none border border-slate-700 shadow-xl p-5 relative overflow-hidden font-sans">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img src={badgePreview} alt="Crest" className="size-10 object-contain p-0.5 bg-white/10" />
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">{form.shortCode}</div>
                          <div className="text-[10px] text-amber-300 font-bold">SMART MEAL PASS & NFC</div>
                        </div>
                      </div>
                      <Utensils className="size-6 text-[#f26522]" />
                    </div>

                    <div className="my-6">
                      <div className="text-[10px] font-mono text-slate-400">NFC CHIP RFID ENCRYPTED</div>
                      <div className="text-lg font-mono font-black tracking-widest text-emerald-400">
                        RFID • 8849-0294-821
                      </div>
                      <div className="text-xs font-bold text-white mt-1">PLAN: FULL BOARDING MEALS (4 TIER)</div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-slate-300">
                      <div>HOLDER: KASULE BRIAN</div>
                      <div className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> VERIFIED ACTIVE
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW 3: TERMINAL REPORT CARD */}
              {activePreview === "report_card" && (
                <div className="flex justify-center py-4">
                  <div className="w-full max-w-2xl bg-white border border-slate-300 shadow-lg p-6 font-serif text-slate-900 text-xs space-y-4">
                    {/* Report Header */}
                    <div className="text-center border-b-2 border-slate-800 pb-3">
                      <div className="flex items-center justify-center gap-3 mb-1">
                        <img src={badgePreview} alt="Crest" className="size-12 object-contain" />
                        <div>
                          <h2 className="text-base font-black tracking-tight uppercase font-sans">{form.name}</h2>
                          <div className="text-[11px] italic">"{form.motto}"</div>
                          <div className="text-[10px] font-sans font-mono text-slate-600">
                            UNEB CENTER NO: {form.unebCenterNumber} • MoES REG: {form.moesRegNumber}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-bold font-sans uppercase bg-slate-100 py-1 tracking-wider mt-2">
                        OFFICIAL TERMINAL ACADEMIC REPORT — {form.currentTerm.toUpperCase()} {form.academicYear}
                      </div>
                    </div>

                    {/* Student Metadata Bar */}
                    <div className="grid grid-cols-3 gap-2 font-sans text-[11px] bg-slate-50 p-2 border border-slate-200">
                      <div><strong>STUDENT:</strong> KASULE BRIAN</div>
                      <div><strong>CLASS:</strong> S.4 SCIENCE</div>
                      <div><strong>GRADING:</strong> {form.gradingScale} STANDARD</div>
                    </div>

                    {/* Sample Marks Table */}
                    <table className="w-full text-left font-sans text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold">
                          <th className="p-2">SUBJECT</th>
                          <th className="p-2 text-center">SCORE</th>
                          <th className="p-2 text-center">GRADE</th>
                          <th className="p-2">REMARKS</th>
                          <th className="p-2">TEACHER</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        <tr>
                          <td className="p-2 font-semibold">Mathematics</td>
                          <td className="p-2 text-center font-mono font-bold">88%</td>
                          <td className="p-2 text-center font-mono font-bold text-emerald-700">D1 / 3.0</td>
                          <td className="p-2">Exceptional grasp of calculus</td>
                          <td className="p-2 font-mono">Mr. Kigozi E.</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">Physics</td>
                          <td className="p-2 text-center font-mono font-bold">84%</td>
                          <td className="p-2 text-center font-mono font-bold text-emerald-700">D1 / 3.0</td>
                          <td className="p-2">Outstanding laboratory work</td>
                          <td className="p-2 font-mono">Mr. Kato P.</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">Chemistry</td>
                          <td className="p-2 text-center font-mono font-bold">78%</td>
                          <td className="p-2 text-center font-mono font-bold text-blue-700">D2 / 2.8</td>
                          <td className="p-2">Very strong organic reactions</td>
                          <td className="p-2 font-mono">Ms. Nalule R.</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Principal Signature Line */}
                    <div className="pt-4 flex justify-between font-sans text-xs border-t border-slate-200">
                      <div>
                        <div className="text-[10px] text-slate-400">HEAD OF SCHOOL</div>
                        <div className="font-bold text-slate-900">{form.directorName}</div>
                        <div className="text-[10px] text-slate-500 italic">Signature & Institutional Stamp</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">NEXT TERM BEGINS</div>
                        <div className="font-bold text-[#f26522]">MAY 25, 2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW 4: THERMAL POS RECEIPT */}
              {activePreview === "receipt" && (
                <div className="flex justify-center py-6">
                  <div className="w-[300px] bg-white border border-slate-300 shadow-md p-4 font-mono text-[11px] text-slate-800 space-y-2">
                    <div className="text-center border-b border-dashed border-slate-300 pb-2">
                      <div className="font-black text-xs uppercase">{form.posReceiptHeader}</div>
                      <div className="text-[10px] text-slate-500">{form.location}</div>
                      <div className="text-[10px] text-slate-500">TEL: {form.phone}</div>
                    </div>

                    <div className="space-y-0.5 text-[10px]">
                      <div>RECEIPT NO: <span className="font-bold">RCP-2026-08912</span></div>
                      <div>DATE: <span className="font-bold">23/11/2026 13:42</span></div>
                      <div>STUDENT: <span className="font-bold">KASULE BRIAN (S.4)</span></div>
                      <div>CASHIER: <span className="font-bold">{form.bursarName || "BURSAR"}</span></div>
                    </div>

                    <div className="border-t border-b border-dashed border-slate-300 py-1.5 space-y-1">
                      <div className="flex justify-between">
                        <span>BOARDING TUITION:</span>
                        <span className="font-bold">UGX {form.termFeesBoarding}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>AMOUNT PAID:</span>
                        <span className="font-bold text-emerald-700">UGX {form.termFeesBoarding}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>BALANCE DUE:</span>
                        <span>UGX 0.00</span>
                      </div>
                    </div>

                    <div className="text-[9px] text-center text-slate-500 pt-1">
                      <div>BANK: {form.paymentBankName} A/C {form.paymentAccountNumber}</div>
                      <div>MTN MoMo: {form.momoMerchantCode} | AIRTEL: {form.airtelMerchantCode}</div>
                      <div className="mt-1 italic">{form.posReceiptFooter}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW 5: STAFF BADGE */}
              {activePreview === "staff_badge" && (
                <div className="flex justify-center py-6">
                  <div className="w-[320px] bg-white rounded-none border border-slate-300 shadow-xl overflow-hidden font-sans">
                    <div style={{ backgroundColor: form.primaryColor }} className="p-3 text-white text-center">
                      <div className="text-xs font-bold uppercase tracking-tight">{form.name}</div>
                      <div className="text-[10px] text-amber-300 font-mono">OFFICIAL FACULTY & STAFF BADGE</div>
                    </div>
                    <div className="p-4 flex flex-col items-center text-center space-y-2">
                      <div className="size-20 rounded-full border-2 border-slate-300 bg-slate-100 grid place-items-center font-bold text-xs text-slate-400">
                        STAFF PHOTO
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">{form.directorName}</div>
                        <div className="text-xs text-[#f26522] font-bold">{form.directorTitle}</div>
                        <div className="text-[11px] font-mono text-slate-500">FACULTY ID: STF-001</div>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-100 border-t border-slate-200 text-center font-mono text-[9px] text-slate-500">
                      *AUTHORIZED ADMINISTRATIVE PERSONNEL*
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: PRESETS */}
          {activeTab === "presets" && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Pre-configured Institutional Presets</h3>
                <p className="text-xs text-slate-500">Load ready-to-use institutional configurations tailored for Ugandan secondary institutions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: "demo",
                    name: "Wellstar Bright Secondary School",
                    code: "WBSS-2026",
                    badge: "/logo.png",
                    desc: "Flagship Mixed Day & Boarding Secondary School in Mukono with CBC competence grading and biometric smart card attendance.",
                    colors: ["#0b2256", "#f26522"]
                  },
                  {
                    key: "st_pauls",
                    name: "St. Paul's College",
                    code: "SPC-2026",
                    badge: "/gallery/stem-lab.png",
                    desc: "Traditional Anglican boarding college with rigorous UNEB standard curriculum and Centenary Bank integration.",
                    colors: ["#065f46", "#d97706"]
                  },
                  {
                    key: "greenhill",
                    name: "Greenhill Secondary",
                    code: "GHS-2026",
                    badge: "/gallery/arts-studio.png",
                    desc: "Modern multi-campus academy in Kibuli with high-tech ICT labs, multi-tier meal programs, and Standard Chartered clearance.",
                    colors: ["#1d4ed8", "#ea580c"]
                  },
                  {
                    key: "kitende",
                    name: "St. Mary's SS Kitende",
                    code: "SMSS-KITENDE",
                    badge: "/logo.png",
                    desc: "Multi-campus sports and academic powerhouse with 3,500 student capacity, Dfcu Treasury, and 100% Division 1-2 pass rate.",
                    colors: ["#800020", "#d4af37"]
                  }
                ].map((item) => (
                  <div key={item.key} className="p-4 bg-white border border-slate-200 rounded-none flex flex-col justify-between hover:border-[#f26522] transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <img src={item.badge} alt={item.name} className="size-8 object-contain" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">{item.code}</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1">
                        {item.colors.map((c) => (
                          <div key={c} style={{ backgroundColor: c }} className="size-4 border border-slate-300" />
                        ))}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleApplyPreset(item.key as any)}
                        className="h-7 text-xs bg-[#0b2256] hover:bg-slate-900 text-white rounded-none"
                      >
                        Load Preset
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="h-16 px-5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Active School:</span>
            <span className="font-bold text-[#0b2256]">{form.name}</span>
            <span className="font-mono text-[11px] text-slate-400">({form.shortCode} • {form.unebCenterNumber})</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 text-xs rounded-none border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="h-9 px-5 bg-gradient-to-r from-amber-500 to-[#f26522] hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-none shadow-md gap-1.5 border-0"
            >
              <Check className="size-3.5" />
              <span>Apply & Save Full Configuration</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
