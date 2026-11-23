"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SchoolBrandConfig,
  DEFAULT_SCHOOL_BRAND,
  PRESET_SCHOOLS,
} from "@/lib/school-brand-types";

export type { SchoolBrandConfig };
export { DEFAULT_SCHOOL_BRAND, PRESET_SCHOOLS };

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
      console.error("Failed to save preset to localStorage", e);
    }
  };

  const resetToDefault = () => {
    setBrand(DEFAULT_SCHOOL_BRAND);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to reset localStorage", e);
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
