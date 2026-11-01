"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, ClipboardCheck, FileSpreadsheet, UserPlus,
  LogOut, Menu, Search, Moon, Sun, ChevronLeft, ChevronRight, Bell
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/teacher/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/teacher/dashboard/classes", label: "My Classes", icon: BookOpen },
  { href: "/teacher/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/teacher/dashboard/results", label: "Marks / Results", icon: FileSpreadsheet },
  { href: "/teacher/dashboard/homework", label: "Homework", icon: BookOpen },
  { href: "/teacher/dashboard/register", label: "Register Student", icon: UserPlus },
] as const;

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [teacherName, setTeacherName] = useState("Teacher");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const id = sessionStorage.getItem("ns_teacher_id");
      if (!id) {
        router.push("/teacher");
      } else {
        setTeacherName(sessionStorage.getItem("ns_teacher_name") || "Teacher");
        setAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Verifying teacher credentials...
      </div>
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("ns_teacher_id");
    sessionStorage.removeItem("ns_teacher_name");
    router.push("/teacher");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50",
          isSidebarOpen ? "w-64" : "w-20",
          isMobile && !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <Link href="/teacher/dashboard" className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center w-full")}>
            <div className="bg-orange-100 p-2 rounded-xl shrink-0">
              <Image src={logo} alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl text-gray-900 truncate">
                Teacher Portal
              </span>
            )}
          </Link>
          {isMobile && isSidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className={cn("mb-4 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider", !isSidebarOpen && "text-center px-0")}>
            {isSidebarOpen ? "Menu" : "•"}
          </div>
          {nav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isSidebarOpen ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-orange-50 text-orange-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  !isSidebarOpen && "justify-center px-0"
                )}
              >
                <Icon className={cn(
                  "shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isSidebarOpen ? "w-5 h-5" : "w-6 h-6"
                )} />
                {isSidebarOpen && <span>{item.label}</span>}
                
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? "Log out" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-red-600 hover:bg-red-50 transition-colors group",
              !isSidebarOpen && "justify-center px-0"
            )}
          >
            <LogOut className={cn(
              "shrink-0 transition-transform duration-200 group-hover:scale-110",
              isSidebarOpen ? "w-5 h-5" : "w-6 h-6"
            )} />
            {isSidebarOpen && <span className="font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="hidden md:flex relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search students, classes..." 
                className="pl-10 bg-gray-50/50 border-gray-200 w-[300px] focus-visible:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-gray-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
            </Button>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{teacherName}</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center font-bold shadow-inner">
                {teacherName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

