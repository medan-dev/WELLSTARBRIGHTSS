"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Calendar, FileSpreadsheet,
  LogOut, Menu, Bell, ChevronLeft, Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/student/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/student/dashboard/meal-card", label: "My Meal Pass", icon: Utensils },
  { href: "/student/dashboard/results", label: "My Results", icon: FileSpreadsheet },
  { href: "/student/dashboard/homework", label: "Homework", icon: BookOpen },
  { href: "/student/dashboard/timetable", label: "Timetable", icon: Calendar },
] as const;

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [studentName, setStudentName] = useState("Student");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const id = sessionStorage.getItem("ns_student_id");
      if (!id) {
        router.push("/student");
      } else {
        setStudentName(sessionStorage.getItem("ns_student_name") || "Student");
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
        Verifying student credentials...
      </div>
    );
  }

  const handleLogout = () => {
    sessionStorage.removeItem("ns_student_id");
    sessionStorage.removeItem("ns_student_name");
    sessionStorage.removeItem("ns_student_class");
    router.push("/student");
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
          <Link href="/student/dashboard" className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center w-full")}>
            <div className="bg-blue-100 p-2 rounded-xl shrink-0">
              <Image src={logo} alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl text-gray-900 truncate">
                Student Portal
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
                    ? "bg-blue-50 text-blue-600 font-medium" 
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
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
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
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-gray-500">
              <Bell className="w-5 h-5" />
            </Button>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{studentName}</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 text-white flex items-center justify-center font-bold shadow-inner">
                {studentName.charAt(0)}
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

