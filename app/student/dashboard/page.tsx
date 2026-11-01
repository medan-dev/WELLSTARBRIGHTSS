"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, Calendar, FileSpreadsheet, Bell, Megaphone, Loader2, 
  Trophy, MapPin, Video, ExternalLink, Award, Pin, Sparkles
} from "lucide-react";
import { PageHeader, StatTile } from "@/components/admin/Widgets";
import { getStudentDashboardStats, getStudentNotices } from "../../actions";
import { toast } from "sonner";
import Link from "next/link";

export default function StudentOverview() {
  const [studentName, setStudentName] = useState("Student");
  const [stats, setStats] = useState({ marksCount: 0, homeworkCount: 0, timetableCount: 0, noticesCount: 0 });
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = sessionStorage.getItem("ns_student_id");
    const classId = sessionStorage.getItem("ns_student_class");
    setStudentName(sessionStorage.getItem("ns_student_name") || "Student");

    if (studentId && classId) {
      const loadData = async () => {
        try {
          const [statsData, noticesData] = await Promise.all([
            getStudentDashboardStats(studentId, classId),
            getStudentNotices(classId)
          ]);
          setStats(statsData);
          setNotices(noticesData);
        } catch (e) {
          console.error(e);
          toast.error("Failed to load student statistics");
        } finally {
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p>Loading academic overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Welcome, ${studentName}`} 
        subtitle="Here is your academic overview, performance recognition, and school announcements."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/student/dashboard/results" className="block">
          <StatTile label="My Results" value={stats.marksCount} icon={<FileSpreadsheet className="w-5 h-5" />} delta="Recorded scores" accent="success" />
        </Link>
        <Link href="/student/dashboard/homework" className="block">
          <StatTile label="Pending Homework" value={stats.homeworkCount} icon={<BookOpen className="w-5 h-5" />} delta="Due soon" accent="warning" />
        </Link>
        <Link href="/student/dashboard/timetable" className="block">
          <StatTile label="Classes Today" value={stats.timetableCount} icon={<Calendar className="w-5 h-5" />} delta="On your timetable" accent="primary" />
        </Link>
        <div className="block">
          <StatTile label="Total Notices" value={stats.noticesCount} icon={<Bell className="w-5 h-5" />} delta="Official school updates" accent="accent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Rich Multi-Format Notice Board */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">School Notice Board</h3>
                <p className="text-xs text-gray-500">Official administration announcements, academic honor rolls, and events</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              {notices.length} Active
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
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
                  {/* Pinned & Category Header */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      {notice.pinned && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                          <Pin className="w-3 h-3" /> PINNED
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                        {notice.category || notice.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{notice.date}</span>
                  </div>

                  {/* Notice Title */}
                  <h4 className="font-bold text-gray-900 text-base mb-2">
                    {notice.title}
                  </h4>

                  {/* Banner Image */}
                  {notice.mediaUrl && notice.mediaType !== "video" && (
                    <div className="mb-3 rounded-lg overflow-hidden h-44 bg-gray-100">
                      <img 
                        src={notice.mediaUrl} 
                        alt={notice.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}

                  {/* Event Details */}
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

                  {/* Video Spotlight Embed */}
                  {notice.type === "MEDIA" && notice.mediaUrl && (
                    <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-lg text-xs text-blue-950 flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <Video className="w-4 h-4 text-blue-600" /> Video Presentation Available
                      </div>
                      <a 
                        href={notice.mediaUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        Watch Video <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Content / Message */}
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>

                  {/* Performance Showcase Honors */}
                  {notice.type === "PERFORMANCE" && studentHonorList.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        Academic Merit Roll & Outperforming Students
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {studentHonorList.map((stu: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm flex items-center gap-3"
                          >
                            <img 
                              src={stu.avatar} 
                              alt={stu.name} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-amber-300 shadow-xs"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-gray-900 truncate flex items-center justify-between gap-1">
                                <span>{stu.name}</span>
                                <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded">
                                  {stu.class}
                                </span>
                              </div>
                              <div className="text-[11px] font-semibold text-amber-800 mt-0.5">
                                {stu.badge}
                              </div>
                              <div className="text-[10px] text-gray-500 font-medium">
                                Score: <strong className="text-gray-900">{stu.score}</strong>
                              </div>
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
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-medium text-sm text-gray-600">No active announcements at the moment</p>
                <p className="text-xs text-gray-400 mt-1">Check back later for school updates and event dates.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links & Portal Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-4">Quick Navigation</h3>
              <div className="space-y-3">
                <Link href="/student/dashboard/results" className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-blue-50/40 hover:border-blue-100 transition-all group">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">Check Results</div>
                    <div className="text-[10px] text-gray-500">View midterm & final grades</div>
                  </div>
                </Link>

                <Link href="/student/dashboard/homework" className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-blue-50/40 hover:border-blue-100 transition-all group">
                  <BookOpen className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">My Homework</div>
                    <div className="text-[10px] text-gray-500">Track tasks & due dates</div>
                  </div>
                </Link>

                <Link href="/student/dashboard/timetable" className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 hover:bg-blue-50/40 hover:border-blue-100 transition-all group">
                  <Calendar className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">School Timetable</div>
                    <div className="text-[10px] text-gray-500">Review weekly class periods</div>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-50 text-center text-xs text-gray-400">
              Wellstar Bright Academy • Kabembe, Mukono
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
