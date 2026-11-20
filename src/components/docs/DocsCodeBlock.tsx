"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface DocsCodeBlockProps {
  title?: string;
  language?: string;
  code: string;
}

export function DocsCodeBlock({ title, language, code }: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="size-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="size-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {title && <span className="font-mono text-slate-300 text-[11px] ml-2">{title}</span>}
        </div>

        <div className="flex items-center gap-2">
          {language && (
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {language}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
        <pre>{code}</pre>
      </div>
    </div>
  );
}
