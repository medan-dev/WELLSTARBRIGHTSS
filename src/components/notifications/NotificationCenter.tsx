"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, CheckCheck, Send, Megaphone, Calendar, 
  AlertTriangle, BookOpen, Wallet, ChevronRight,
  ShieldCheck, Sparkles, Volume2
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getPortalNotifications } from "../../../app/actions";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "notice" | "alert" | "event" | "academic" | "finance";
  priority?: "normal" | "urgent" | "high";
  url?: string;
  read?: boolean;
}

interface NotificationCenterProps {
  role: "ADMIN" | "TEACHER" | "STUDENT";
  classId?: string;
  className?: string;
  iconClassName?: string;
}

export function NotificationCenter({
  role,
  classId,
  className = "",
  iconClassName = "size-5"
}: NotificationCenterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Storage key for read state per role
  const storageKey = `wb_read_notifs_${role.toLowerCase()}`;
  const pushPrefKey = `wb_push_pref_${role.toLowerCase()}`;

  // 1. Initialize Service Worker & Push Notification capabilities
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check service worker support
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.log("Service Worker Registration notice:", err));
      }

      // Check push notification support
      if ("Notification" in window) {
        setPushSupported(true);
        const hasPermission = Notification.permission === "granted";
        const userPref = localStorage.getItem(pushPrefKey) === "true";
        setPushEnabled(hasPermission && userPref);
      }

      // Load saved read IDs
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setReadIds(JSON.parse(saved));
      } catch (_) {}
    }
  }, [storageKey, pushPrefKey]);

  // 2. Fetch live notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPortalNotifications(role, classId);
      setNotifications(data || []);
    } catch (e) {
      console.error("Failed to fetch portal notifications:", e);
    } finally {
      setLoading(false);
    }
  }, [role, classId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // 3. Native Push Notification Trigger Helper
  const triggerNativePush = (title: string, body: string, url: string = "/") => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return false;
    }

    try {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "/logo.png",
            badge: "/logo.png",
            vibrate: [100, 50, 100],
            data: { url },
          } as any);
        });
      } else {
        new Notification(title, {
          body,
          icon: "/logo.png",
        });
      }
      return true;
    } catch (err) {
      console.error("Native push error:", err);
      return false;
    }
  };

  // 4. Toggle Push Notifications
  const handleTogglePush = async () => {
    if (!("Notification" in window)) {
      toast.error("Push notifications are not supported in this browser.");
      return;
    }

    if (pushEnabled) {
      setPushEnabled(false);
      localStorage.setItem(pushPrefKey, "false");
      toast.info("Push notifications disabled on this device.");
      return;
    }

    // Request permission
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushEnabled(true);
        localStorage.setItem(pushPrefKey, "true");
        toast.success("Push notifications activated!");

        // Send Welcome Native Push Notification
        triggerNativePush(
          "Wellstar Bright SMS — Notifications Active",
          `Real-time ${role.toLowerCase()} alerts and academic announcements are now enabled.`,
          window.location.pathname
        );
      } else if (permission === "denied") {
        toast.error("Notification permission was blocked in browser settings. Please allow notifications in your browser address bar.");
      }
    } catch (err) {
      toast.error("Could not request notification permission.");
    }
  };

  // 5. Send Test Push Notification
  const handleTestPush = () => {
    if (Notification.permission !== "granted") {
      handleTogglePush();
      return;
    }

    const testItem = notifications[0] || {
      title: "Wellstar Bright — Portal Push Alert",
      message: "This is a real-time system test notification from the school management system.",
      url: window.location.pathname
    };

    const sent = triggerNativePush(
      testItem.title,
      testItem.message,
      testItem.url || window.location.pathname
    );

    if (sent) {
      toast.success("Push notification dispatched to your device!");
    } else {
      toast.info("Notification dispatched. Check your device notification tray.");
    }
  };

  // 6. Read / Unread Management
  const isRead = (id: string) => readIds.includes(id);

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (_) {}
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(storageKey, JSON.stringify(allIds));
    } catch (_) {}
    toast.success("All notifications marked as read");
  };

  const handleItemClick = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.url) {
      setOpen(false);
      router.push(item.url);
    }
  };

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;
  const filteredList = filter === "unread" 
    ? notifications.filter((n) => !isRead(n.id))
    : notifications;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="size-4 text-rose-500 shrink-0" />;
      case "academic":
        return <BookOpen className="size-4 text-blue-500 shrink-0" />;
      case "event":
        return <Calendar className="size-4 text-emerald-500 shrink-0" />;
      case "finance":
        return <Wallet className="size-4 text-amber-500 shrink-0" />;
      default:
        return <Megaphone className="size-4 text-orange-500 shrink-0" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`relative p-2 rounded-full hover:bg-secondary/80 text-foreground/80 hover:text-foreground transition-all active:scale-95 flex items-center justify-center ${className}`}
          aria-label="Open notifications"
        >
          <Bell className={iconClassName} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[420px] p-0 rounded-2xl shadow-2xl border border-border bg-popover text-popover-foreground overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/80 bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Bell className="size-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {role === "ADMIN" ? "Super Admin & Operational Updates" : role === "TEACHER" ? "Faculty & Academic Announcements" : "Student Notices & Homework Tasks"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5" />
                Read all
              </button>
            )}
          </div>

          {/* Web Push Banner Toggle */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-background/80 border border-border/80 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${pushEnabled ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                <Volume2 className="size-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  Web Push Notifications
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {pushEnabled ? "Active on this browser" : "Receive instant desktop alerts"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {pushEnabled && (
                <button
                  onClick={handleTestPush}
                  className="px-2 py-1 rounded-md text-[10px] font-bold bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center gap-1"
                  title="Send test push"
                >
                  <Send className="size-2.5" />
                  Test
                </button>
              )}
              <Switch
                checked={pushEnabled}
                onCheckedChange={handleTogglePush}
                aria-label="Toggle push notifications"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/60">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filter === "all" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted"}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filter === "unread" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted"}`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications Scroll List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/60">
          {loading && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <span className="inline-block animate-spin mr-2">◷</span> Loading notices...
            </div>
          )}

          {!loading && filteredList.length === 0 && (
            <div className="p-10 text-center space-y-2">
              <div className="size-10 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
                <Bell className="size-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold text-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground">
                {filter === "unread" ? "No unread notifications at the moment." : "No school notifications available."}
              </p>
            </div>
          )}

          {!loading && filteredList.map((item) => {
            const read = isRead(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 hover:bg-muted/50 cursor-pointer transition-colors relative flex items-start gap-3 group ${!read ? "bg-primary/5" : ""}`}
              >
                {/* Status Dot */}
                {!read && (
                  <span className="absolute left-1.5 top-5 size-1.5 rounded-full bg-primary" />
                )}

                {/* Type Icon Container */}
                <div className="p-2 rounded-xl bg-background border border-border/80 shadow-2xs mt-0.5">
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-bold truncate ${!read ? "text-foreground" : "text-foreground/80"}`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  {item.priority === "urgent" && (
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Priority Alert
                    </span>
                  )}
                </div>

                <ChevronRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/80 bg-muted/20 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground flex items-center gap-1 font-medium">
            <ShieldCheck className="size-3.5 text-emerald-500" /> Live Sync Active
          </span>
          <button
            onClick={() => {
              setOpen(false);
              router.push(role === "ADMIN" ? "/admin/dashboard/notices" : role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard");
            }}
            className="text-primary hover:underline font-bold"
          >
            Open Full Notice Board →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
