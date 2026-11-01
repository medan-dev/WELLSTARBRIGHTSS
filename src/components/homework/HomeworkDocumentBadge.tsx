"use client";

import React from "react";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  FileSpreadsheet, 
  FileImage, 
  File, 
  Trash2,
  Paperclip
} from "lucide-react";

export interface HomeworkDocumentProps {
  url: string;
  name?: string | null;
  size?: string | null;
  type?: string | null;
  onRemove?: () => void;
  showActions?: boolean;
  accent?: "orange" | "blue" | "neutral";
  compact?: boolean;
}

export function getDocumentMeta(typeOrExt?: string | null, fileName?: string | null) {
  const normalized = (typeOrExt || fileName?.split(".").pop() || "").toLowerCase().replace(".", "");

  if (normalized === "pdf" || normalized.includes("pdf")) {
    return {
      label: "PDF",
      badgeColor: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
      iconColor: "text-red-500",
      bgColor: "bg-red-50/60 dark:bg-red-950/20",
      borderColor: "border-red-100 dark:border-red-900/40",
      icon: FileText
    };
  }

  if (["doc", "docx", "word", "wordprocessingml"].some(e => normalized.includes(e))) {
    return {
      label: "WORD",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50/60 dark:bg-blue-950/20",
      borderColor: "border-blue-100 dark:border-blue-900/40",
      icon: FileText
    };
  }

  if (["xls", "xlsx", "csv", "spreadsheetml"].some(e => normalized.includes(e))) {
    return {
      label: "EXCEL",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50/60 dark:bg-emerald-950/20",
      borderColor: "border-emerald-100 dark:border-emerald-900/40",
      icon: FileSpreadsheet
    };
  }

  if (["ppt", "pptx", "presentationml"].some(e => normalized.includes(e))) {
    return {
      label: "SLIDES",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50/60 dark:bg-amber-950/20",
      borderColor: "border-amber-100 dark:border-amber-900/40",
      icon: FileText
    };
  }

  if (["jpg", "jpeg", "png", "webp", "gif", "image"].some(e => normalized.includes(e))) {
    return {
      label: "IMAGE",
      badgeColor: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50/60 dark:bg-purple-950/20",
      borderColor: "border-purple-100 dark:border-purple-900/40",
      icon: FileImage
    };
  }

  return {
    label: normalized.toUpperCase() || "DOC",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    iconColor: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-900/40",
    borderColor: "border-slate-200 dark:border-slate-800",
    icon: File
  };
}

export function HomeworkDocumentBadge({
  url,
  name,
  size,
  type,
  onRemove,
  showActions = true,
  accent = "orange",
  compact = false
}: HomeworkDocumentProps) {
  const meta = getDocumentMeta(type, name);
  const Icon = meta.icon;
  const displayName = name || url.split("/").pop() || "Homework Attachment";

  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  const btnColor = accent === "orange" 
    ? "bg-orange-500 hover:bg-orange-600 text-white" 
    : accent === "blue" 
    ? "bg-blue-600 hover:bg-blue-700 text-white" 
    : "bg-slate-800 hover:bg-slate-900 text-white";

  return (
    <div 
      className={`rounded-xl border ${meta.borderColor} ${meta.bgColor} p-3 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`p-2.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs border ${meta.borderColor} shrink-0`}>
          <Icon className={`w-5 h-5 ${meta.iconColor}`} />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${meta.badgeColor}`}>
              {meta.label}
            </span>
            {size && (
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                {size}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mt-0.5" title={displayName}>
            {displayName}
          </p>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download={!isExternal ? displayName : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${btnColor}`}
          >
            {isExternal ? (
              <>
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </>
            )}
          </a>

          {!isExternal && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              title="Preview in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Remove document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
