"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import edurexaHorizontal from "@/assets/edurexa-horizontal.png";

type LoaderContextType = {
  triggerTransition: (callback?: () => void) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useLoader must be used within a LoaderProvider");
  return context;
};

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false); // Default to false for instantaneous rendering
  const [showContent, setShowContent] = useState(true);
  const [fadeStatus, setFadeStatus] = useState<"in" | "out">("out");

  const triggerLoader = (isStartup: boolean, callback?: () => void) => {
    setProgress(0);
    setFadeStatus("in");
    setShouldRender(true);
    setLoading(true);
    setShowContent(false);

    const duration = 400; // Snappy 400ms
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        
        setShowContent(true);
        if (callback) {
          callback();
        }
        
        setFadeStatus("out");
        setTimeout(() => {
          setLoading(false);
          setShouldRender(false);
          if (isStartup) {
            sessionStorage.setItem("ns_first_load_done", "true");
            setIsFirstLoad(false);
          }
        }, 300);
      }
      setProgress(Math.floor(currentProgress));
    }, intervalTime);
  };

  const triggerTransition = (callback?: () => void) => {
    triggerLoader(false, callback);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = sessionStorage.getItem("ns_first_load_done");
      if (done) {
        setIsFirstLoad(false);
        setShouldRender(false);
        setLoading(false);
        setShowContent(true);
      } else {
        setIsFirstLoad(true);
        triggerLoader(true);
      }
    }
  }, []);

  return (
    <LoaderContext.Provider value={{ triggerTransition }}>
      {showContent && children}
      {shouldRender && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white select-none transition-all duration-300 ease-out ${
            fadeStatus === "in" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center max-w-sm px-6 text-center space-y-4">
            <Image
              src={edurexaHorizontal}
              alt="EDUREXA Logo"
              className="h-10 w-auto object-contain"
              priority
            />

            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#f26522] rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-[11px] font-mono text-slate-400 font-medium">
              Loading EDUREXA...
            </div>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};
