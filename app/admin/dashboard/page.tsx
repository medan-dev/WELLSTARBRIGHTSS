"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, Bell, ArrowRight, FileText, Globe } from "lucide-react";
import Link from "next/link";
import { PageHeader, StatTile, ChartBar } from "@/components/admin/Widgets";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getDashboardStats, getStudents } from "../../actions";
import { Loader2 } from "lucide-react";

const schedule = [
  { time: "09:00", title: "All-staff briefing", room: "Hall" },
  { time: "11:30", title: "S.4 Parent meetings", room: "Block C" },
  { time: "14:00", title: "Admissions interviews", room: "Office" },
  { time: "16:30", title: "Senior leadership", room: "Boardroom" },
];

const notifications = [
  { id: 1, text: "3 new admission applications received", type: "success" },
  { id: 2, text: "Mira Patel's attendance dropped below 80%", type: "alert" },
  { id: 3, text: "New admissions enquiry received", type: "info" },
];

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-right hidden sm:block">
      <div className="font-display text-2xl font-bold">{time}</div>
      <div className="text-xs text-muted-foreground">{date}</div>
    </div>
  );
}

export default function Overview() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const active = notifications.filter((n) => !dismissed.includes(n.id));

  const [stats, setStats] = useState({ studentCount: 0, teacherCount: 0, classCount: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardStats, allStudents] = await Promise.all([
          getDashboardStats(),
          getStudents()
        ]);
        setStats(dashboardStats);
        setRecent(allStudents.slice(0, 5));
      } catch (e) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back, Nshuti 👋</h1>
          <p className="mt-1 text-muted-foreground">Here's what's happening across the academy today.</p>
        </div>
        <LiveClock />
      </div>

      {/* Notifications */}
      {active.length > 0 && (
        <div className="mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {active.map((n) => (
            <div
              key={n.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm animate-fade-in ${
                n.type === "warning" ? "bg-amber-500/5 border-amber-500/20 text-amber-700" :
                n.type === "alert" ? "bg-red-500/5 border-red-500/20 text-red-700" :
                "bg-primary/5 border-primary/20 text-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="size-4 shrink-0" />
                {n.text}
              </div>
              <button
                onClick={() => { setDismissed((d) => [...d, n.id]); toast("Notification dismissed"); }}
                className="text-xs opacity-60 hover:opacity-100 transition-smooth shrink-0"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stat tiles */}
      {isLoading ? (
        <div className="h-24 rounded-2xl bg-card border shadow-sm flex items-center justify-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Total students" value={stats.studentCount} delta="+4.2% this term" icon={<Users className="size-5" />} />
          <StatTile label="Faculty" value={stats.teacherCount} delta="+2 new hires" accent="accent" icon={<GraduationCap className="size-5" />} />
          <StatTile label="Classes" value={stats.classCount} accent="success" icon={<BookOpen className="size-5" />} />
          <StatTile label="Notifications" value={active.length} delta={`${active.length} unread alerts`} accent="warning" icon={<Bell className="size-5" />} />
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Enrolment trend</h3>
              <p className="text-xs text-muted-foreground">Students per term, last 8 terms</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
              <TrendingUp className="size-4" /> +18.4%
            </div>
          </div>
          <div className="flex-1 mt-auto">
            <ChartBar
              data={[
                { label: "T1 '23", value: 980 },
                { label: "T2 '23", value: 1010 },
                { label: "T3 '23", value: 1050 },
                { label: "T1 '24", value: 1090 },
                { label: "T2 '24", value: 1120 },
                { label: "T3 '24", value: 1170 },
                { label: "T1 '25", value: 1210 },
                { label: "T2 '25", value: Math.max(1240, stats.studentCount) },
              ]}
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="p-6 rounded-2xl bg-card border shadow-sm">
          <h3 className="font-display text-lg font-semibold">Today's schedule</h3>
          <p className="text-xs text-muted-foreground mb-4">Upcoming events</p>
          <ul className="space-y-3">
            {schedule.map((e, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth">
                <Calendar className="size-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.time} · {e.room}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Review apps", href: "/admin/dashboard/applications", icon: FileText },
          { label: "Manage students", href: "/admin/dashboard/students", icon: Users },
          { label: "View attendance", href: "/admin/dashboard/attendance", icon: Calendar },
          { label: "Website Content", href: "/admin/dashboard/cms", icon: Globe },
        ].map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between p-4 rounded-xl bg-card border shadow-sm hover-lift group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                <Icon className="size-5 text-primary" />
              </div>
              <span className="font-medium text-sm">{label}</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent students table */}
      <div className="mt-6 p-6 rounded-2xl bg-card border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Recent enrolments</h3>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/dashboard/students">View all <ArrowRight className="size-3 ml-1" /></Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-3 font-medium px-4">Student</th>
                <th className="py-3 font-medium px-4">Class</th>
                <th className="py-3 font-medium px-4">Status</th>
                <th className="py-3 font-medium px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="size-5 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : recent.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/40 transition-smooth">
                  <td className="py-3 px-4 font-medium flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary grid place-items-center text-primary-foreground text-xs font-bold shrink-0">
                      {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    {s.name}
                  </td>
                  <td className="py-3 px-4">{s.class?.name || "Unassigned"}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-xs font-medium border border-emerald-500/20">Active</span></td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

