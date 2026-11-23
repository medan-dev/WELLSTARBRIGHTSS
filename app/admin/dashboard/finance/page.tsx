"use client";

import { useEffect } from "react";

export default function AdminFinancePage() {
  useEffect(() => {
    document.title = "Wellstar Bright — Bursar Financial Workstation";
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden bg-[#090d16] z-50">
      <iframe
        src="/finance-app/index.html"
        className="w-full h-full border-0 block"
        title="Wellstar Bright — Financial Workstation & POS"
        allow="clipboard-read; clipboard-write; print"
      />
    </div>
  );
}
