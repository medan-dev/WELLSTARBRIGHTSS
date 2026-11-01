"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, Users, ClipboardCheck, FileSpreadsheet, Loader2, PlusCircle, 
  Megaphone, Bell, Calendar, MapPin, Trophy, Pin, Video, ExternalLink
} from "lucide-react";
import { PageHeader, StatTile } from "@/components/admin/Widgets";
import { getTeacherDashboardStats, getTeacherNotices } from "../../actions";
import { toast } from "sonner";
import Link from "next/link";

export default function TeacherOverview() {
  const [teacherName, setTeacherName] = useState("Teacher");
  const [stats, setStats] = useState({ classCount: 0, studentCount: 0, attendanceRate: "0%", marksCount: 0 });
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teacherId = sessionStorage.getItem("ns_teacher_id");
    setTeacherName(sessionStorage.getItem("ns_teacher_name") || "Teacher");

    if (teacherId) {
      Promise.all([
        getTeacherDashboardStats(teacherId),
        getTeacherNotices()
      ])
        .then(([statsData, noticesData]) => {
          setStats(statsData);
          setNotices(noticesData);
        })
        .catch(err => {
          console.error(err);
          toast.error("Failed to load teacher dashboard data");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
        <p>Loading teacher overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Welcome back, ${teacherName}`} 
        subtitle="Here is your academic overview, class stats, and staff notices."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="My Classes" value={stats.classCount} icon={<BookOpen className="w-5 h-5" />} delta="Assigned teaching groups" accent="primary" />
        <StatTile label="My Students" value={stats.studentCount} icon={<Users className="w-5 h-5" />} delta="Enrolled in your subjects" accent="accent" />
        <StatTile label="Attendance Today" value={stats.attendanceRate} icon={<ClipboardCheck className="w-5 h-5" />} delta="Class average" accent="success" />
        <StatTile label="Graded Marks" value={stats.marksCount} icon={<FileSpreadsheet className="w-5 h-5" />} delta="Scores entered" accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Staff Notice Board */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Staff & School Notice Board</h3>
                <p className="text-xs text-gray-500">Administrative communications, academic performance briefs, and events</p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
              {notices.length} Active
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {notices.map((notice) => {
              let studentHonorList: any[] = [];
              if (notice.type === "PERFORMANCE" && notice.metadata) {
                try {
                  studentHonorList = JSON.parse(notice.metadata).students || [];
                } catch (e) {}
              }

              return (
                <div 
                  key={notice.id} 
                  className={`rounded-xl border p-5 transition-all ${
                    notice.pinned 
                      ? "bg-amber-50/40 border-amber-200 ring-1 ring-amber-200/60" 
                      : notice.type === "PERFORMANCE"
                      ? "bg-gradient-to-br from-amber-50/30 to-orange-50/20 border-amber-100"
                      : "bg-gray-50/60 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {notice.pinned && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <Pin className="w-3 h-3" /> PINNED
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                        {notice.category || notice.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-base mb-2">
                    {notice.title}
                  </h4>

                  {notice.mediaUrl && notice.mediaType !== "video" && (
                    <div className="mb-3 rounded-lg overflow-hidden h-40 bg-gray-100">
                      <img 
                        src={notice.mediaUrl} 
                        alt={notice.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}

                  {notice.type === "EVENT" && (notice.eventDate || notice.location) && (
                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-xs space-y-1 mb-3 text-orange-950 font-medium">
                      {notice.eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span>Event Date: <strong>{notice.eventDate}</strong></span>
                        </div>
                      )}
                      {notice.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          <span>Venue: <strong>{notice.location}</strong></span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>

                  {notice.type === "PERFORMANCE" && studentHonorList.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                        <Trophy className="w-4 h-4 text-amber-600" /> Student Performance Report
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {studentHonorList.map((stu: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-white rounded-lg border border-amber-100 shadow-xs flex items-center gap-2.5 text-xs">
                            <img src={stu.avatar} alt={stu.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 truncate">{stu.name} ({stu.class})</p>
                              <p className="text-[10px] text-amber-800 font-semibold">{stu.badge} • {stu.score}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {notices.length === 0 && (
              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-medium text-sm text-gray-600">No active staff notices</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Guide */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-4">Quick Tasks</h3>
              <div className="space-y-3">
                <Link href="/teacher/dashboard/attendance" className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-orange-50/40 hover:border-orange-100 transition-all group">
                  <ClipboardCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Track Attendance</div>
                    <div className="text-[10px] text-gray-500">Record today's class roll-call</div>
                  </div>
                </Link>

                <Link href="/teacher/dashboard/results" className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-orange-50/40 hover:border-orange-100 transition-all group">
                  <FileSpreadsheet className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Enter Exam Marks</div>
                    <div className="text-[10px] text-gray-500">Input student test results</div>
                  </div>
                </Link>

                <Link href="/teacher/dashboard/homework" className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-orange-50/40 hover:border-orange-100 transition-all group">
                  <PlusCircle className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Assign Homework</div>
                    <div className="text-[10px] text-gray-500">Create new assignments for classes</div>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 text-center text-xs text-gray-400">
              Teacher Administration Console
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
