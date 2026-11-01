"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Phone number: 0701116781 -> International format +256701116781
  const phoneNumber = "256701116781";
  const defaultMessage = encodeURIComponent(
    "Hello Wellstar Bright Secondary School! I am reaching out from your website and would like to learn more about admissions, academics, and school programmes."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  useEffect(() => {
    // Show welcoming prompt after 2.5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    setHasInteracted(true);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end group">
      {/* Dynamic Pop-up Speech Bubble */}
      {showTooltip && !hasInteracted && (
        <div className="mb-2.5 max-w-[260px] sm:max-w-[280px] p-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xl border border-emerald-100 dark:border-emerald-900/60 animate-in fade-in slide-in-from-bottom-3 duration-300 relative text-xs">
          <button
            onClick={handleDismissTooltip}
            className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Dismiss message"
          >
            <X className="size-3" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Admissions Online
            </span>
          </div>

          <p className="font-medium text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed pr-3">
            Have questions about fees, enrollment, or academics? <strong>Chat with us directly on WhatsApp!</strong>
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
          >
            Start WhatsApp Chat →
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Wellstar Bright on WhatsApp (0701116781)"
        className="relative flex items-center justify-center size-13 sm:size-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:scale-108 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Ambient Pulsing Radar Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none duration-1000" />

        {/* Online Status Badge Dot */}
        <span className="absolute top-0 right-0 size-3.5 bg-emerald-300 border-2 border-white dark:border-slate-900 rounded-full shadow-xs z-10" />

        {/* WhatsApp Official Vector Logo */}
        <svg
          className="size-7 sm:size-7.5 fill-white transition-transform group-hover:scale-110 drop-shadow-xs"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

