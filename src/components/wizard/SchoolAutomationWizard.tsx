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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSchoolBrand, SchoolBrandConfig, PRESET_SCHOOLS, DEFAULT_SCHOOL_BRAND } from "@/context/SchoolBrandContext";

interface SchoolAutomationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchoolAutomationWizard({ isOpen, onClose }: SchoolAutomationWizardProps) {
  const { brand, updateBrand, loadPreset, resetToDefault } = useSchoolBrand();

  const [form, setForm] = useState<SchoolBrandConfig>({ ...brand });
  const [activeTab, setActiveTab] = useState<"profile" | "badge" | "identification" | "presets">("profile");
  const [activePreview, setActivePreview] = useState<"id_card" | "meal_pass" | "report_card" | "receipt">("id_card");
  const [badgePreview, setBadgePreview] = useState<string>(brand.badgeUrl);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
                Configure School Brand, Badge & Fit into Identification Features
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
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "profile"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            1. School Information
          </button>
          <button
            onClick={() => setActiveTab("badge")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "badge"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            2. Request Badge / Crest
          </button>
          <button
            onClick={() => setActiveTab("identification")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "identification"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            3. Identification Features Preview
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-1.5 font-semibold transition-colors rounded-none ${
              activeTab === "presets"
                ? "bg-[#0b2256] text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            4. Quick Presets
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: SCHOOL INFORMATION */}
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
                    placeholder="+256 758 611 414"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Official Admissions Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admissions@school.ac.ug"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Head of School / Director Name</Label>
                  <Input
                    value={form.directorName}
                    onChange={(e) => setForm({ ...form, directorName: e.target.value })}
                    placeholder="e.g. Dr. Ronald Mukasa"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Director Title</Label>
                  <Input
                    value={form.directorTitle}
                    onChange={(e) => setForm({ ...form, directorTitle: e.target.value })}
                    placeholder="e.g. Headteacher / Director"
                    className="h-9 rounded-none text-xs border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUEST BADGE / CREST */}
          {activeTab === "badge" && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Request & Upload Official School Badge / Crest
                </h3>
                <p className="text-xs text-slate-500">
                  Upload the high-resolution crest or emblem. The system automatically sizes and stamps it into student identity cards, dining passes, and report cards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Upload Field */}
                <div className="sm:col-span-7 space-y-4">
                  <div className="border-2 border-dashed border-slate-300 p-6 text-center rounded-none bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <Upload className="size-8 text-[#0b2256] mx-auto mb-2" />
                    <div className="text-xs font-semibold text-slate-800">
                      Upload School Crest / Badge File
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      PNG, JPG, or SVG with transparent background recommended (Max 2MB)
                    </div>
                    <input
                      type="file"
                      id="badgeUpload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="badgeUpload"
                      className="inline-block mt-3 px-4 py-1.5 bg-[#0b2256] text-white text-xs font-semibold cursor-pointer hover:bg-[#081a42] rounded-none transition-colors"
                    >
                      Browse Device
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Badge Initials / Watermark</Label>
                    <Input
                      value={form.badgeInitials}
                      onChange={(e) => setForm({ ...form, badgeInitials: e.target.value.toUpperCase() })}
                      maxLength={4}
                      placeholder="e.g. DA"
                      className="h-9 rounded-none text-xs border-slate-300 font-bold tracking-widest uppercase w-32"
                    />
                  </div>
                </div>

                {/* Live Badge Preview Card */}
                <div className="sm:col-span-5 border border-slate-200 p-5 bg-white text-center rounded-none space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current Crest Preview
                  </div>

                  <div className="size-28 mx-auto border border-slate-200 bg-slate-50 grid place-items-center relative overflow-hidden rounded-none shadow-sm">
                    {badgePreview ? (
                      <img
                        src={badgePreview}
                        alt="School Badge"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="size-16 bg-[#0b2256] text-white font-black text-2xl grid place-items-center">
                        {form.badgeInitials || "DA"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">{form.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">UNEB Center #{form.unebCenterNumber}</div>
                  </div>

                  <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 px-2 font-medium">
                    ✓ Verified for PVC ID Cards & Report Cards
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IDENTIFICATION FEATURES PREVIEW */}
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
                  {/* ID Card Top Header */}
                  <div className="bg-[#0b2256] text-white p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-9 bg-white/20 grid place-items-center font-bold text-xs overflow-hidden">
                        {badgePreview ? (
                          <img src={badgePreview} alt="Crest" className="size-full object-cover" />
                        ) : (
                          form.badgeInitials
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs tracking-tight uppercase">{form.name}</div>
                        <div className="text-[9px] text-slate-300 font-mono">UNEB #{form.unebCenterNumber}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-[#f26522] px-1.5 py-0.5 uppercase">STUDENT ID</span>
                  </div>

                  {/* ID Card Content */}
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <div className="w-full aspect-3/4 bg-slate-100 border border-slate-300 overflow-hidden relative">
                        <img
                          src="/gallery/about-students.jpg"
                          alt="Student Portrait"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="col-span-8 space-y-1 text-xs">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Student Name</div>
                      <div className="font-bold text-slate-900 text-sm">MUKASA BRIAN JOSHUA</div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400">Class:</span> <span className="font-semibold">S.4 Science</span>
                        </div>
                        <div>
                          <span className="text-slate-400">LIN:</span> <span className="font-mono font-semibold">904128</span>
                        </div>
                        <div>
                          <span className="text-slate-400">House:</span> <span className="font-semibold">Lumumba</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Expires:</span> <span className="font-semibold">12/2026</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ID Card Barcode Footer */}
                  <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <div className="font-mono tracking-widest font-bold">||||| ||| ||||||| |||| ||</div>
                    <div>Emergency: {form.phone}</div>
                  </div>
                </div>
              )}

              {/* 2. DIGITAL MEAL PASS PREVIEW */}
              {activePreview === "meal_pass" && (
                <div className="max-w-md mx-auto p-5 bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white rounded-none shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                        {form.name}
                      </div>
                      <div className="text-xs font-black tracking-tight">DINING HALL MEAL PASS</div>
                    </div>
                    <div className="size-8 bg-white/20 grid place-items-center font-bold text-xs">
                      {form.badgeInitials || "DA"}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] text-amber-100">Student Cardholder</div>
                    <div className="font-bold text-base">MUKASA BRIAN JOSHUA</div>
                    <div className="text-xs text-amber-200">S.4 Science • Boarding Scholar</div>
                  </div>

                  <div className="p-2.5 bg-black/20 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-amber-200">Daily Meal Quota</div>
                      <div className="font-extrabold text-sm">3 Meals / Day</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-amber-200">Dietary Status</div>
                      <div className="font-semibold text-emerald-300">Standard Boarding</div>
                    </div>
                  </div>

                  <div className="text-center pt-1 text-[10px] text-amber-100">
                    Authorized for hatch scan • {form.location}
                  </div>
                </div>
              )}

              {/* 3. TERMINAL UNEB REPORT CARD PREVIEW */}
              {activePreview === "report_card" && (
                <div className="p-5 border-2 border-slate-300 bg-white rounded-none space-y-3 text-xs">
                  <div className="text-center border-b border-slate-200 pb-3 space-y-1">
                    <div className="size-10 mx-auto bg-[#0b2256] text-white font-bold grid place-items-center">
                      {form.badgeInitials || "DA"}
                    </div>
                    <div className="font-black text-sm text-[#0b2256] uppercase tracking-tight">{form.name}</div>
                    <div className="text-[10px] text-slate-600 italic">“{form.motto}”</div>
                    <div className="text-[10px] font-mono font-semibold text-slate-800">
                      UNEB NATIONAL CENTER #{form.unebCenterNumber} • TERM REPORT CARD
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 border border-slate-200">
                    <div>Student: <span className="font-bold">Mukasa Brian</span></div>
                    <div>Class: <span className="font-bold">Senior 4 Science</span></div>
                    <div>Overall Division: <span className="font-bold text-emerald-700">DIVISION 1 (Aggregate 12)</span></div>
                    <div>Position: <span className="font-bold">2nd out of 84</span></div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-2 flex items-center justify-between">
                    <div>Director: <span className="font-semibold text-slate-800">{form.directorName}</span></div>
                    <div className="border-b border-slate-400 w-24 text-center font-serif italic text-slate-700">Official Stamp</div>
                  </div>
                </div>
              )}

              {/* 4. OFFICIAL FEE RECEIPT PREVIEW */}
              {activePreview === "receipt" && (
                <div className="p-5 border-2 border-slate-300 bg-white rounded-none space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <div className="font-black text-xs text-[#0b2256] uppercase">{form.name}</div>
                      <div className="text-[10px] text-slate-500">{form.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400">REC-2026-00481</div>
                      <div className="text-xs font-bold text-emerald-700">OFFICIAL RECEIPT</div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500">Received from</div>
                      <div className="font-bold">Mukasa Brian (S.4 Science)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">Amount Paid</div>
                      <div className="font-black text-sm text-slate-900">UGX 1,450,000</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Payment for: Term II Tuition & Boarding Fees</span>
                    <span>Stamped by Cashier Desk</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRESET PROFILES */}
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
                    DA
                  </div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-[#0b2256]">
                    Demo International Academy
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Clean, standard secondary school demo template.
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
          <div className="text-xs text-slate-500">
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
              <span>Apply & Save Customization</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
