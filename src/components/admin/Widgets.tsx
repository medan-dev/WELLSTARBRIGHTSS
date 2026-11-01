import { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export function StatTile({
  label, value, delta, accent = "primary", icon, trend
}: {
  label: string; 
  value: string | number; 
  delta?: string;
  accent?: "primary" | "accent" | "success" | "warning" | "indigo" | "purple";
  icon?: React.ReactNode;
  trend?: string;
}) {
  const accentConfig = {
    primary: {
      bg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-200 dark:hover:border-blue-800",
      badge: "text-blue-700 bg-blue-50 dark:bg-blue-950/60",
      glow: "from-blue-500/5 to-transparent"
    },
    accent: {
      bg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-200 dark:hover:border-amber-800",
      badge: "text-amber-700 bg-amber-50 dark:bg-amber-950/60",
      glow: "from-amber-500/5 to-transparent"
    },
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-200 dark:hover:border-emerald-800",
      badge: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60",
      glow: "from-emerald-500/5 to-transparent"
    },
    warning: {
      bg: "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400",
      border: "hover:border-orange-200 dark:hover:border-orange-800",
      badge: "text-orange-700 bg-orange-50 dark:bg-orange-950/60",
      glow: "from-orange-500/5 to-transparent"
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
      border: "hover:border-indigo-200 dark:hover:border-indigo-800",
      badge: "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60",
      glow: "from-indigo-500/5 to-transparent"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
      border: "hover:border-purple-200 dark:hover:border-purple-800",
      badge: "text-purple-700 bg-purple-50 dark:bg-purple-950/60",
      glow: "from-purple-500/5 to-transparent"
    },
  }[accent] || {
    bg: "bg-primary/10 text-primary",
    border: "hover:border-primary/30",
    badge: "text-primary bg-primary/10",
    glow: "from-primary/5 to-transparent"
  };

  return (
    <div className={`relative p-5 rounded-2xl bg-card border border-border/80 shadow-card hover-lift transition-all overflow-hidden group ${accentConfig.border}`}>
      {/* Subtle Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${accentConfig.glow} rounded-full blur-2xl pointer-events-none`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">
            {label}
          </div>
          <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {value}
          </div>
          {delta && (
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground pt-0.5">
              <span>{delta}</span>
            </div>
          )}
        </div>

        {icon && (
          <div className={`size-12 rounded-2xl ${accentConfig.bg} grid place-items-center shrink-0 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="size-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export function ChartBar({ data, height = 200 }: { data: { label: string; value: number }[]; height?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3 pt-4" style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-xl bg-gradient-to-t from-primary/80 to-primary shadow-xs hover:brightness-110 transition-all duration-700"
              style={{
                height: mounted ? `${(d.value / max) * 100}%` : "0%",
                transitionDelay: `${i * 50}ms`,
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground font-semibold truncate max-w-full">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export function PageHeader({ 
  title, 
  subtitle, 
  action, 
  badge 
}: { 
  title: string; 
  subtitle?: string; 
  action?: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="space-y-1">
        {badge && (
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full mb-1">
            {badge}
          </span>
        )}
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground m-0">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  );
}
