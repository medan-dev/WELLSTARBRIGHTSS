import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsCalloutProps {
  type: "tip" | "info" | "warning" | "success";
  title?: string;
  message: string;
}

export function DocsCallout({ type, title, message }: DocsCalloutProps) {
  const configs = {
    tip: {
      icon: Lightbulb,
      bg: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
      iconColor: "text-emerald-600",
      defaultTitle: "Pro Tip",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50/80 border-blue-200 text-blue-900",
      iconColor: "text-blue-600",
      defaultTitle: "Important Note",
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-50/80 border-amber-200 text-amber-900",
      iconColor: "text-amber-600",
      defaultTitle: "Caution",
    },
    success: {
      icon: CheckCircle2,
      bg: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
      iconColor: "text-emerald-600",
      defaultTitle: "Best Practice",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={cn("my-4 p-4 rounded-none border border-l-4 flex gap-3.5", config.bg)}>
      <div className="shrink-0 mt-0.5">
        <Icon className={cn("size-5", config.iconColor)} />
      </div>
      <div className="space-y-1">
        <div className="font-bold text-xs">{title || config.defaultTitle}</div>
        <div className="text-xs leading-relaxed text-slate-700">{message}</div>
      </div>
    </div>
  );
}
