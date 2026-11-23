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
  ChevronDown,
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
} from "@/lib/school-document-analyzer";

interface SchoolAutomationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchoolAutomationWizard({ isOpen, onClose }: SchoolAutomationWizardProps) {
  const { brand, updateBrand, loadPreset, resetToDefault } = useSchoolBrand();

  const [form, setForm] = useState<SchoolBrandConfig>({ ...brand });
  const [activeTab, setActiveTab] = useState<"doc_ingest" | "profile" | "badge" | "identification" | "presets">("doc_ingest");
  const [activePreview, setActivePreview] = useState<"id_card" | "meal_pass" | "report_card" | "receipt">("id_card");
  const [badgePreview, setBadgePreview] = useState<string>(brand.badgeUrl);

  // Document & ZIP Analyzer States
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [showPasteBox, setShowPasteBox] = useState(false);

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
      toast.success(`Successfully analyzed ${file.name}! Detected ${result.detectedFieldsCount} institutional preferences.`);
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
      const score = Math.min(100, Math.round((detected.length / 10) * 100));

      const result: DocumentAnalysisResult = {
        success: true,
        fileName: sample.filename,
        fileType: sample.type.includes("JSON") ? "json" : "document",
        detectedFieldsCount: detected.length,
        confidenceScore: Math.max(score, 75),
        extractedBrand,
        detectedItems: detected,
        extractedImages: [],
        rawTextPreview: sample.content.slice(0, 1500),
        summary: `Parsed sample ${sample.title}. Extracted ${detected.length} preferences with ${score}% structural confidence.`,
      };

      setAnalysisResult(result);
      setForm(extractedBrand);
      setBadgePreview(extractedBrand.badgeUrl);
      setAnalyzing(false);
      toast.success(`Loaded sample: ${sample.title}`);
    }, 400);
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
      const score = Math.min(100, Math.round((detected.length / 10) * 100));

      const result: DocumentAnalysisResult = {
        success: true,
        fileName: "Pasted_Document_Text.txt",
        fileType: "text",
        detectedFieldsCount: detected.length,
        confidenceScore: Math.max(score, 50),
        extractedBrand,
        detectedItems: detected,
        extractedImages: [],
        rawTextPreview: pastedText.slice(0, 1500),
        summary: `Analyzed raw document text. Detected ${detected.length} preferences with ${score}% confidence.`,
      };

      setAnalysisResult(result);
      setForm(extractedBrand);
      setAnalyzing(false);
      toast.success(`Analyzed pasted text. Detected ${detected.length} institutional fields.`);
    }, 300);
  };

  // Download boilerplate starter template
  const handleDownloadTemplate = () => {
    const templateContent = `OFFICIAL SCHOOL PROFILE & ONBOARDING TEMPLATE
==============================================
Fill in your institution details below and upload this file (or as a ZIP with your badge logo) into the System Setup Wizard.

Institution: St. Jude Secondary School
Short Name / Code: SJSS-2026
Motto: "Knowledge, Discipline and Integrity"
UNEB Examination Center Number: U0912
Curriculum Standards: Uganda National Examinations Board (UCE & UACE) & CBC Standard
School Category: Mixed Day & Boarding Secondary School (S.1 - S.6)

Campus Location: Plot 18 Mission Road, Mukono District, Uganda
Telephone Hotline: +256 701 445 522
WhatsApp Helpdesk: +256 701 445 522
Official Email: info@stjudess.ac.ug
Institutional Portal: https://stjudess.ac.ug

Administration & Leadership:
Head of School: Dr. George William Mukasa
Director Title: Headmaster / Principal Director
Headmaster Bio: Committed to academic distinction and holistic student character development.

Identity Colors: Deep Navy (#0b2256) and Gold Accent (#f26522).`;

    const blob = new Blob([templateContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "School_Profile_Template.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded School_Profile_Template.txt");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".zip") || file.name.endsWith(".txt") || file.name.endsWith(".json") || file.name.endsWith(".csv") || file.name.endsWith(".md") || file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
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
    toast.success(`Applied ${form.name} customization across Front Site & Identification Features!`);
    onClose();
  };

  const handleApplyPreset = (key: "demo" | "st_pauls" | "greenhill") => {
    loadPreset(key);
    const p = PRESET_SCHOOLS[key] || DEFAULT_SCHOOL_BRAND;
    const merged = { ...DEFAULT_SCHOOL_BRAND, ...p };
    setForm(merged);
    setBadgePreview(merged.badgeUrl);
    toast.success(`Loaded preset: ${merged.name}`);
  };

  const handleReset = () => {
    resetToDefault();
    setForm(DEFAULT_SCHOOL_BRAND);
    setBadgePreview(DEFAULT_SCHOOL_BRAND.badgeUrl);
    setAnalysisResult(null);
    toast.info("Reset system to standard zero-data demo configuration");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-sans animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-none border border-slate-300 shadow-2xl overflow-hidden animate-scale-in">
        {/* Top Header */}
        <div className="h-14 px-5 bg-[#0b2256] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 bg-[#f26522] grid place-items-center text-white font-bold text-xs rounded-none">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">SYSTEM SETUP & AUTOMATION WIZARD</div>
              <div className="text-[10px] text-slate-300">
                Document / ZIP AI Ingestion • Front Site Setup • Identification Features
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 rounded-none text-xs border-white/20 bg-white/10 hover:bg-white/20 text-white"
            >
              <RefreshCw className="size-3 mr-1" />
              <span>Reset Clean</span>
            </Button>
            <button
              onClick={onClose}
              className="size-8 grid place-items-center text-white/80 hover:text-white hover:bg-white/10 rounded-none transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Wizard Step Tabs */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("doc_ingest")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none flex items-center gap-1.5 ${
              activeTab === "doc_ingest"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <FileArchive className="size-3.5 text-[#f26522]" />
            <span>1. Document & ZIP Setup</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "profile"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            2. School Profile
          </button>
          <button
            onClick={() => setActiveTab("badge")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "badge"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            3. Badge / Crest
          </button>
          <button
            onClick={() => setActiveTab("identification")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "identification"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            4. ID & Features Preview
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "presets"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            5. Presets
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: DOCUMENT & ZIP INGESTION (AI EXTRACTION) */}
          {activeTab === "doc_ingest" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="size-4 text-[#f26522]" />
                    <span>Intelligent Document & ZIP Ingestion</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload your school prospectus, profile document, or ZIP archive. The system automatically analyzes it and configures your Front Site and badge.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="h-8 rounded-none text-xs gap-1.5 border-slate-300 hover:bg-slate-50 text-slate-700 shrink-0"
                >
                  <Download className="size-3 text-[#0b2256]" />
                  <span>Download Template (.txt)</span>
                </Button>
              </div>

              {/* Upload Dropzone */}
              <div
                className={`relative border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
                  analyzing
                    ? "border-[#f26522] bg-[#f26522]/5"
                    : "border-slate-300 hover:border-[#0b2256] bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                {analyzing ? (
                  <div className="space-y-3 py-4">
                    <Loader2 className="size-10 text-[#f26522] animate-spin mx-auto" />
                    <div className="font-bold text-sm text-slate-900">
                      Analyzing Document Structure...
                    </div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Extracting institutional identity, UNEB registration, contacts, leadership bio, and logo crests...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="size-12 rounded-none bg-[#0b2256]/10 text-[#0b2256] grid place-items-center mx-auto">
                      <FileArchive className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900">
                        Upload School Profile Document or ZIP Archive
                      </div>
                      <p className="text-xs text-slate-500 max-w-lg mx-auto">
                        Drag and drop your file here, or click to browse. Supports <strong>.zip</strong> (containing text & badge images), <strong>.txt</strong>, <strong>.json</strong>, <strong>.csv</strong>, <strong>.md</strong>, <strong>.doc</strong>, <strong>.docx</strong>.
                      </p>
                    </div>

                    <div className="pt-2">
                      <input
                        type="file"
                        id="document-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileAnalysis(file);
                        }}
                        accept=".zip,.txt,.json,.csv,.md,.doc,.docx,.pdf"
                        className="hidden"
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-flex items-center gap-2 h-9 px-4 bg-[#0b2256] hover:bg-[#081a42] text-white text-xs font-semibold rounded-none cursor-pointer transition-colors shadow-sm"
                      >
                        <Upload className="size-3.5" />
                        <span>Select Document or ZIP File</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Click Instant Test with Sample Documents */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-none space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-[#0b2256]" />
                    <span>Test Instantly with Real-World Institutional Profiles:</span>
                  </div>
                  <span className="text-[10px] text-slate-500">1-click test</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_DOCUMENTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample.id)}
                      className="p-3 border border-slate-300 hover:border-[#0b2256] bg-white text-left text-xs transition-colors rounded-none group space-y-1"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-[#0b2256] truncate">
                        {sample.title.split(" - ")[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {sample.type}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {sample.filename}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible Raw Text Pasting Option */}
              <div className="border border-slate-200 p-3 bg-white">
                <button
                  type="button"
                  onClick={() => setShowPasteBox(!showPasteBox)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="size-3.5 text-[#0b2256]" />
                    <span>Have plain text from an email or flyer? Paste document text directly</span>
                  </span>
                  <ChevronDown className={`size-3.5 transition-transform ${showPasteBox ? "rotate-180" : ""}`} />
                </button>

                {showPasteBox && (
                  <div className="pt-3 space-y-2 animate-fade-in">
                    <Textarea
                      rows={5}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your school brochure, prospectus, or letterhead text here..."
                      className="text-xs border-slate-300 font-mono rounded-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAnalyzePastedText}
                        className="h-8 rounded-none text-xs bg-[#0b2256] hover:bg-[#081a42] text-white"
                      >
                        Analyze Pasted Text
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis Result Card */}
              {analysisResult && (
                <div className="border border-emerald-300 bg-emerald-50/40 p-4 sm:p-5 rounded-none space-y-4 animate-scale-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span className="font-bold text-sm text-slate-900">
                          Institutional Analysis Complete
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold">
                          {analysisResult.confidenceScore}% Confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {analysisResult.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSave}
                        className="h-8 rounded-none text-xs bg-[#0b2256] hover:bg-[#081a42] text-white font-semibold gap-1.5 shadow-sm"
                      >
                        <Check className="size-3.5" />
                        <span>Apply & View Front Site</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("profile")}
                        className="h-8 rounded-none text-xs border-slate-300 hover:bg-white text-slate-800"
                      >
                        <span>Edit Details →</span>
                      </Button>
                    </div>
                  </div>

                  {/* Extracted Fields Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">School Name</span>
                      <span className="font-bold text-slate-900 text-xs truncate block">{form.name}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">UNEB Center #</span>
                      <span className="font-mono font-bold text-slate-900 text-xs block">{form.unebCenterNumber}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Short Code</span>
                      <span className="font-mono font-bold text-slate-900 text-xs block">{form.shortCode}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Motto</span>
                      <span className="font-medium text-slate-800 text-xs truncate block">"{form.motto}"</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Admissions Phone</span>
                      <span className="font-medium text-slate-800 text-xs block">{form.phone}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Campus Location</span>
                      <span className="font-medium text-slate-800 text-xs truncate block">{form.location}</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Admissions Email</span>
                      <span className="font-medium text-slate-800 text-xs truncate block">{form.email}</span>
                    </div>
                  </div>

                  {/* Extracted Badge Notification */}
                  {badgePreview && (
                    <div className="p-3 bg-white border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 border border-slate-300 bg-slate-50 grid place-items-center overflow-hidden shrink-0">
                          <img src={badgePreview} alt="Extracted Badge" className="size-full object-contain" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Extracted School Badge / Crest</div>
                          <div className="text-[11px] text-slate-500">
                            Loaded and mapped to Front Site header, Student ID Card, and Terminal Reports.
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1">
                        ✓ Ready
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCHOOL PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  School Profile & Institutional Registration
                </h3>
                <p className="text-xs text-slate-500">
                  This information dynamically populates the school front site, headers, invoices, and certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Official School Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. St. Paul's Secondary School"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Short Code / Roster Tag *</Label>
                  <Input
                    value={form.shortCode}
                    onChange={(e) => setForm({ ...form, shortCode: e.target.value })}
                    placeholder="e.g. SPC-2026"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">School Motto / Slogan</Label>
                  <Input
                    value={form.motto}
                    onChange={(e) => setForm({ ...form, motto: e.target.value })}
                    placeholder="e.g. Excellence & Moral Character"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">UNEB National Examination Center #</Label>
                  <Input
                    value={form.unebCenterNumber}
                    onChange={(e) => setForm({ ...form, unebCenterNumber: e.target.value })}
                    placeholder="e.g. U0482"
                    className="h-9 rounded-none text-xs border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Campus Location / District</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Plot 14 Lumumba Avenue, Mukono"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Institutional Level & Category</Label>
                  <Input
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    placeholder="e.g. Mixed Day & Boarding Secondary School (S.1 — S.6)"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Official Admissions Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +256 758 611 414"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Admissions WhatsApp Hotline</Label>
                  <Input
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="e.g. +256 758 611 414"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Admissions & Inquiries Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. admissions@yourschool.com"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Curriculum Standards</Label>
                  <Input
                    value={form.curriculum}
                    onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                    placeholder="e.g. Competence-Based Curriculum (CBC) & UNEB"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Head of School / Director Name</Label>
                  <Input
                    value={form.directorName}
                    onChange={(e) => setForm({ ...form, directorName: e.target.value })}
                    placeholder="e.g. Nshuti Medan"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Director Title</Label>
                  <Input
                    value={form.directorTitle}
                    onChange={(e) => setForm({ ...form, directorTitle: e.target.value })}
                    placeholder="e.g. Head of School / Principal Director"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Director / Head of School Bio (Front Site Address)</Label>
                <Textarea
                  rows={3}
                  value={form.directorBio}
                  onChange={(e) => setForm({ ...form, directorBio: e.target.value })}
                  placeholder="A short leadership message introducing the institution's values..."
                  className="text-xs border-slate-300 rounded-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: BADGE / CREST */}
          {activeTab === "badge" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Request / Upload School Badge or Crest
                </h3>
                <p className="text-xs text-slate-500">
                  Upload the official school emblem or crest image. It will be fitted onto ID cards, meal passes, reports, and headers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 p-6 text-center hover:border-[#0b2256] transition-colors rounded-none bg-slate-50/50">
                    <input
                      type="file"
                      id="badge-upload"
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <label htmlFor="badge-upload" className="cursor-pointer space-y-2 block">
                      <div className="size-12 rounded-none bg-[#0b2256]/10 text-[#0b2256] grid place-items-center mx-auto">
                        <Upload className="size-5" />
                      </div>
                      <div className="text-xs font-semibold text-slate-900">
                        Click to upload School Badge / Crest
                      </div>
                      <div className="text-[11px] text-slate-500">
                        PNG, JPG, SVG or WEBP up to 2MB (transparent PNG recommended)
                      </div>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Badge Fallback Initials (2 Letters)</Label>
                    <Input
                      maxLength={3}
                      value={form.badgeInitials}
                      onChange={(e) => setForm({ ...form, badgeInitials: e.target.value.toUpperCase() })}
                      placeholder="e.g. WB"
                      className="h-9 w-24 rounded-none text-xs border-slate-300 font-bold uppercase tracking-wider"
                    />
                  </div>
                </div>

                <div className="p-4 border border-slate-200 bg-white space-y-3">
                  <div className="text-xs font-semibold text-slate-700">Current Badge Preview:</div>
                  <div className="size-28 border border-slate-300 bg-slate-50 grid place-items-center overflow-hidden mx-auto shadow-sm">
                    {badgePreview ? (
                      <img
                        src={badgePreview}
                        alt="School Badge"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="size-16 bg-[#0b2256] text-white font-black text-2xl grid place-items-center">
                        {form.badgeInitials || "WB"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 text-center">
                    <div className="font-bold text-xs text-slate-900">{form.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">UNEB Center #{form.unebCenterNumber}</div>
                  </div>

                  <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 px-2 font-medium text-center">
                    ✓ Verified for PVC ID Cards & Report Cards
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IDENTIFICATION FEATURES PREVIEW */}
          {activeTab === "identification" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Identification Features Preview
                </h3>
                <p className="text-xs text-slate-500">
                  See how the configured school information and badge are fitted into the system identification features.
                </p>
              </div>

              {/* Sub-tabs for Identification Features */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActivePreview("id_card")}
                  className={`px-3 py-1.5 border font-semibold rounded-none ${
                    activePreview === "id_card"
                      ? "bg-[#0b2256] text-white border-[#0b2256]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="size-3.5 inline mr-1.5" />
                  Student PVC ID Card
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview("meal_pass")}
                  className={`px-3 py-1.5 border font-semibold rounded-none ${
                    activePreview === "meal_pass"
                      ? "bg-[#0b2256] text-white border-[#0b2256]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Utensils className="size-3.5 inline mr-1.5" />
                  Digital Meal / Dining Pass
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview("report_card")}
                  className={`px-3 py-1.5 border font-semibold rounded-none ${
                    activePreview === "report_card"
                      ? "bg-[#0b2256] text-white border-[#0b2256]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="size-3.5 inline mr-1.5" />
                  Terminal UNEB Report Card
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview("receipt")}
                  className={`px-3 py-1.5 border font-semibold rounded-none ${
                    activePreview === "receipt"
                      ? "bg-[#0b2256] text-white border-[#0b2256]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <ShieldCheck className="size-3.5 inline mr-1.5" />
                  Official Fee Receipt Voucher
                </button>
              </div>

              {/* 1. STUDENT PVC ID CARD PREVIEW */}
              {activePreview === "id_card" && (
                <div className="max-w-md mx-auto p-4 border-2 border-slate-300 bg-white shadow-md rounded-none space-y-4">
                  <div className="bg-[#0b2256] text-white p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-9 bg-white/20 grid place-items-center font-bold text-xs overflow-hidden">
                        {badgePreview ? (
                          <img src={badgePreview} alt="Crest" className="size-full object-contain" />
                        ) : (
                          form.badgeInitials
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs tracking-tight uppercase">{form.name}</div>
                        <div className="text-[9px] text-[#f26522] font-semibold">{form.motto || "Excellence & Character"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-slate-300">UNEB #{form.unebCenterNumber}</div>
                      <div className="text-[9px] text-emerald-400 font-bold uppercase">STUDENT ID</div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="size-20 bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 font-bold text-xs">
                      PHOTO
                    </div>
                    <div className="space-y-1 text-xs">
                      <div><span className="text-slate-500 font-semibold">NAME:</span> <span className="font-bold text-slate-900">MUKASA BRIAN</span></div>
                      <div><span className="text-slate-500 font-semibold">CLASS:</span> <span className="font-bold text-slate-900">SENIOR FOUR (S.4B)</span></div>
                      <div><span className="text-slate-500 font-semibold">LIN:</span> <span className="font-mono text-slate-900">LIN-2026-0842</span></div>
                      <div><span className="text-slate-500 font-semibold">CAMPUS:</span> <span className="text-slate-900">{form.location}</span></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Emergency: {form.phone}</span>
                    <span className="font-mono">VALID: 2026/2027</span>
                  </div>
                </div>
              )}

              {/* 2. MEAL PASS PREVIEW */}
              {activePreview === "meal_pass" && (
                <div className="max-w-md mx-auto p-4 border border-emerald-300 bg-white shadow-md rounded-none space-y-4">
                  <div className="bg-emerald-800 text-white p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-8 bg-white/20 grid place-items-center font-bold text-xs overflow-hidden">
                        {badgePreview ? (
                          <img src={badgePreview} alt="Crest" className="size-full object-contain" />
                        ) : (
                          form.badgeInitials
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs uppercase">{form.name}</div>
                        <div className="text-[9px] text-emerald-200">OFFICIAL DINING PASS • BOARDING SECTION</div>
                      </div>
                    </div>
                    <Utensils className="size-4 text-emerald-300" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-950">Active Meal Roster: LUNCH & SUPPER</div>
                      <div className="text-[10px] text-emerald-700">Student: NAMUGGA SARAH (S.3 EAST)</div>
                    </div>
                    <div className="font-mono font-black text-xs text-emerald-800">
                      PASS #MP-4821
                    </div>
                  </div>

                  <div className="text-center font-mono text-[10px] text-slate-400">
                    Scan QR at kitchen turnstile • Non-transferable
                  </div>
                </div>
              )}

              {/* 3. TERMINAL REPORT CARD PREVIEW */}
              {activePreview === "report_card" && (
                <div className="max-w-md mx-auto p-4 border border-slate-300 bg-white shadow-md rounded-none space-y-3">
                  <div className="text-center space-y-1 border-b border-slate-200 pb-3">
                    <div className="size-10 mx-auto grid place-items-center overflow-hidden">
                      {badgePreview ? (
                        <img src={badgePreview} alt="Crest" className="size-full object-contain" />
                      ) : (
                        <div className="size-8 bg-[#0b2256] text-white font-bold text-xs grid place-items-center">
                          {form.badgeInitials}
                        </div>
                      )}
                    </div>
                    <div className="font-black text-xs uppercase tracking-tight text-slate-900">{form.name}</div>
                    <div className="text-[9px] text-slate-600 italic">"{form.motto}"</div>
                    <div className="text-[9px] font-mono text-slate-500">
                      UNEB Center No: {form.unebCenterNumber} • {form.location}
                    </div>
                    <div className="text-[10px] font-extrabold text-[#0b2256] uppercase tracking-wider pt-1">
                      TERMINAL ACADEMIC PROGRESS REPORT • TERM I 2026
                    </div>
                  </div>

                  <div className="text-[10px] space-y-1">
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span className="font-bold">Student: KATO IVAN</span>
                      <span className="font-mono">LIN: LIN-2026-0311</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span>Class: Senior 2 Alpha</span>
                      <span className="font-bold text-emerald-700">Division 1 (Aggregate: 14)</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-400 text-center italic pt-1">
                    Head of School: {form.directorName} • {form.directorTitle}
                  </div>
                </div>
              )}

              {/* 4. OFFICIAL FEE RECEIPT PREVIEW */}
              {activePreview === "receipt" && (
                <div className="max-w-md mx-auto p-4 border border-slate-300 bg-white shadow-md rounded-none space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-7 bg-slate-100 grid place-items-center font-bold text-[10px] overflow-hidden">
                        {badgePreview ? (
                          <img src={badgePreview} alt="Crest" className="size-full object-contain" />
                        ) : (
                          form.badgeInitials
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs uppercase">{form.name}</div>
                        <div className="text-[8px] text-slate-500">BURSAR'S OFFICE • OFFICIAL RECEIPT</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono text-slate-400">REC-2026-9021</div>
                      <div className="text-[9px] font-bold text-emerald-600">PAID IN FULL</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Student:</span>
                      <span className="font-semibold">SSEKITTO JOSHUA (S.1)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Payment:</span>
                      <span className="font-bold text-slate-900">UGX 1,250,000</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Purpose:</span>
                      <span>Term 1 Tuition & Boarding Pass</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-400 text-center">
                    Authorized Cashier • {form.phone} • {form.email}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRESETS */}
          {activeTab === "presets" && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select a Pre-configured School Benchmark
                </h3>
                <p className="text-xs text-slate-500">
                  Switch instantly between demo institution benchmarks to demonstrate system flexibility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleApplyPreset("demo")}
                  className="p-4 border text-left bg-white hover:border-[#0b2256] transition-colors rounded-none space-y-2 group"
                >
                  <div className="size-8 bg-[#0b2256] text-white font-black text-xs grid place-items-center">
                    WB
                  </div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-[#0b2256]">
                    Wellstar Bright Secondary
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Authentic standalone secondary school benchmark with Mukono campus.
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">UNEB Center #U0482</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset("st_pauls")}
                  className="p-4 border text-left bg-white hover:border-[#0b2256] transition-colors rounded-none space-y-2 group"
                >
                  <div className="size-8 bg-emerald-800 text-white font-black text-xs grid place-items-center">
                    SP
                  </div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                    St. Paul's College
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Traditional boarding academy benchmark with O & A Level pathways.
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">UNEB Center #U0115</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset("greenhill")}
                  className="p-4 border text-left bg-white hover:border-[#0b2256] transition-colors rounded-none space-y-2 group"
                >
                  <div className="size-8 bg-blue-700 text-white font-black text-xs grid place-items-center">
                    GH
                  </div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                    Greenhill Secondary
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Competence-based curriculum day & boarding secondary school.
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">UNEB Center #U0840</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="h-16 px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 truncate max-w-sm">
            Current Active School: <span className="font-bold text-slate-900">{form.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 rounded-none text-xs border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="h-9 rounded-none text-xs font-semibold bg-[#0b2256] hover:bg-[#081a42] text-white shadow-none gap-1.5"
            >
              <Check className="size-3.5" />
              <span>Apply & Save to Front Site</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
