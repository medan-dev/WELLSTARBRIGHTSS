"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SchoolBrandConfig {
  name: string;
  shortCode: string;
  motto: string;
  unebCenterNumber: string;
  curriculum: string;
  badgeUrl: string;
  badgeInitials: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  directorName: string;
  directorTitle: string;
  directorBio: string;
  primaryColor: string;
  accentColor: string;
  level: string;
}

export const DEFAULT_SCHOOL_BRAND: SchoolBrandConfig = {
  name: "Demo International Academy",
  shortCode: "DIA-2026",
  motto: "Excellence, Discipline & Academic Distinction",
  unebCenterNumber: "U0482",
  curriculum: "Competence-Based Curriculum (CBC) & UNEB Standard",
  badgeUrl: "/gallery/graduation-day.png",
  badgeInitials: "DA",
  location: "Plot 14 Lumumba Avenue, Mukono Campus",
  phone: "+256 758 611 414",
  whatsapp: "+256 758 611 414",
  email: "admissions@yourschool.com",
  website: "https://edurexa.com",
  directorName: "Nshuti Medan",
  directorTitle: "Head of School / Director",
  directorBio: "Leading our educational institutions with a holistic whole-child approach to academic and moral excellence.",
  primaryColor: "#0b2256",
  accentColor: "#f26522",
  level: "Mixed Day & Boarding Secondary School (S.1 — S.6)",
};

export const PRESET_SCHOOLS: Record<string, Partial<SchoolBrandConfig>> = {
  demo: {
    ...DEFAULT_SCHOOL_BRAND,
  },
  st_pauls: {
    name: "St. Paul's College",
    shortCode: "SPC-2026",
    motto: "Laborare et Orare • In Pursuit of Wisdom",
    unebCenterNumber: "U0115",
    curriculum: "Uganda National Examination Board (UCE & UACE)",
    badgeUrl: "/gallery/stem-lab.png",
    badgeInitials: "SP",
    location: "Main Hill Road, Wakiso District",
    phone: "+256 701 445 522",
    whatsapp: "+256 701 445 522",
    email: "info@stpaulscollege.ac.ug",
    directorName: "Rev. Dr. Joseph Mukasa",
    directorTitle: "Principal & Academic Director",
    level: "Boarding Secondary School (S.1 — S.6)",
  },
  greenhill: {
    name: "Greenhill Secondary School",
    shortCode: "GSS-2026",
    motto: "Extend Your Horizons",
    unebCenterNumber: "U0840",
    curriculum: "Competence-Based Curriculum (CBC)",
    badgeUrl: "/gallery/computer-lab.png",
    badgeInitials: "GH",
    location: "Kibuli Campus, Kampala",
    phone: "+256 772 889 911",
    whatsapp: "+256 772 889 911",
    email: "admin@greenhill.ac.ug",
    directorName: "Mrs. Joy Veronica",
    directorTitle: "Headteacher",
    level: "Day & Boarding Secondary School",
  },
};

interface SchoolBrandContextType {
  brand: SchoolBrandConfig;
  updateBrand: (newBrand: Partial<SchoolBrandConfig>) => void;
  loadPreset: (presetKey: "demo" | "st_pauls" | "greenhill") => void;
  resetToDefault: () => void;
}

const SchoolBrandContext = createContext<SchoolBrandContextType>({
  brand: DEFAULT_SCHOOL_BRAND,
  updateBrand: () => {},
  loadPreset: () => {},
  resetToDefault: () => {},
});

const STORAGE_KEY = "edurexa_school_brand_config";

export function SchoolBrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<SchoolBrandConfig>(DEFAULT_SCHOOL_BRAND);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setBrand({ ...DEFAULT_SCHOOL_BRAND, ...parsed });
      }
    } catch {
      // Fallback to default
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateBrand = (newBrand: Partial<SchoolBrandConfig>) => {
    setBrand((prev) => {
      const updated = { ...prev, ...newBrand };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save school brand to localStorage", e);
      }
      return updated;
    });
  };

  const loadPreset = (presetKey: "demo" | "st_pauls" | "greenhill") => {
    const preset = PRESET_SCHOOLS[presetKey] || DEFAULT_SCHOOL_BRAND;
    const updated = { ...DEFAULT_SCHOOL_BRAND, ...preset };
    setBrand(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefault = () => {
    setBrand(DEFAULT_SCHOOL_BRAND);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SchoolBrandContext.Provider
      value={{
        brand,
        updateBrand,
        loadPreset,
        resetToDefault,
      }}
    >
      {children}
    </SchoolBrandContext.Provider>
  );
}

export function useSchoolBrand() {
  const context = useContext(SchoolBrandContext);
  if (!context) {
    return {
      brand: DEFAULT_SCHOOL_BRAND,
      updateBrand: () => {},
      loadPreset: () => {},
      resetToDefault: () => {},
    };
  }
  return context;
}
