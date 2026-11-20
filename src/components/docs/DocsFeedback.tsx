"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, MessageSquare } from "lucide-react";

export function DocsFeedback() {
  const [feedbackGiven, setFeedbackGiven] = useState<"yes" | "no" | null>(null);

  return (
    <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-700">Was this page helpful?</span>
        {feedbackGiven ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold animate-in fade-in">
            <Check className="size-3.5" />
            <span>Thank you for your feedback!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFeedbackGiven("yes")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors font-mono"
            >
              <ThumbsUp className="size-3 text-slate-500" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => setFeedbackGiven("no")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors font-mono"
            >
              <ThumbsDown className="size-3 text-slate-500" />
              <span>No</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/256758611414"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0b2256] transition-colors"
        >
          <MessageSquare className="size-3" />
          <span>Questions or corrections? Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
