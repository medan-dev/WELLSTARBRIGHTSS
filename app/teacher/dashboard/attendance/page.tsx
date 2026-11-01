"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { getTeacherClasses, getSubjects, getStudentsByClass, getAttendanceForRange, recordAttendance } from "../../../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Status = "P" | "A" | "L";

const statuses: Status[] = ["P", "A", "L"];
const statusColors: Record<Status, string> = {
  P: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  A: "bg-red-500/15 text-red-700 border-red-500/30",
  L: "bg-amber-500/15 text-amber-700 border-amber-500/30",
};

function Badge({ value, onClick }: { value: string; onClick?: () => void }) {
  if (!value) value = "-";
  const color = (statusColors as any)[value] || "bg-secondary/30 text-muted-foreground border-border";
  return (
    <button
      onClick={onClick}
      title={onClick ? "Click to cycle status" : undefined}
      className={`size-8 flex items-center justify-center rounded-md text-xs font-bold border transition-smooth ${color} ${onClick ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
    >
      {value}
    </button>
  );
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  
  const [dateRange, setDateRange] = useState<number>(5);
  
  const [students, setStudents] = useState<any[]>([]);
  // map: studentId -> date -> status
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Record<string, string>>>({});
  
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      try {
        const teacherId = sessionStorage.getItem("ns_teacher_id");
        if (!teacherId) return;

        const [cData, sData] = await Promise.all([getTeacherClasses(teacherId), getSubjects()]);
        setClasses(cData);
        setSubjects(sData);
        if (cData.length > 0) setSelectedClassId(cData[0].id);
        if (sData.length > 0) setSelectedSubjectId(sData[0].id);
      } catch (e) {
        toast.error("Failed to load initial data.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Computed Dates
  const dates = useMemo(() => {
    const list: string[] = [];
    const today = new Date();
    let daysAdded = 0;
    let i = 0;
    while (daysAdded < dateRange) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (d.getDay() !== 0 && d.getDay() !== 6) { // skip weekends
        list.push(d.toISOString().split('T')[0]);
        daysAdded++;
      }
      i++;
      if (i > 1000) break;
    }
    return list.reverse();
  }, [dateRange]);

  // Load students and attendance when class/subject/dates change
  useEffect(() => {
    if (!selectedClassId || !selectedSubjectId || dates.length === 0) return;
    
    const loadClassData = async () => {
      setIsLoading(true);
      try {
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];
        
        const [studs, atts] = await Promise.all([
          getStudentsByClass(selectedClassId),
          getAttendanceForRange(selectedClassId, selectedSubjectId, startDate, endDate)
        ]);
        
        setStudents(studs);
        
        // Transform attendance list into map
        const map: Record<string, Record<string, string>> = {};
        for (const att of atts) {
          if (!map[att.studentId]) map[att.studentId] = {};
          map[att.studentId][att.date] = att.status;
        }
        setAttendanceRecords(map);
        
      } catch (e) {
        console.error(e);
        toast.error("Failed to load attendance records.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClassData();
  }, [selectedClassId, selectedSubjectId, dates]);

  // cycle status
  const cycleLesson = async (studentId: string, dateStr: string) => {
    if (!selectedSubjectId) return;
    
    // Optimistic UI Update
    const currentStatus = attendanceRecords[studentId]?.[dateStr] || "P";
    const nextStatus = statuses[(statuses.indexOf(currentStatus as Status) + 1) % statuses.length];
    
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [dateStr]: nextStatus
      }
    }));
    
    // Save to DB instantly
    try {
      await recordAttendance(studentId, selectedSubjectId, dateStr, nextStatus);
    } catch (e) {
      toast.error("Failed to save attendance");
      // Rollback
      setAttendanceRecords(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [dateStr]: currentStatus
        }
      }));
    }
  };

  const getRate = (studentId: string) => {
    const studentRecords = attendanceRecords[studentId] || {};
    let present = 0;
    let total = 0;
    for (const d of dates) {
      const stat = studentRecords[d];
      if (stat) {
        total++;
        if (stat === "P") present++;
      }
    }
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  };

  return (
    <>
      <PageHeader
        title="Attendance Tracker"
        subtitle="Teacher-centric, database-driven attendance."
      />

      <div className="mb-6 grid sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-sm">
          <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Class:</label>
          <select 
            className="w-full border rounded-md px-3 py-1.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="" disabled>-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-sm border-primary/20 bg-primary/5">
          <label className="text-sm font-medium text-primary whitespace-nowrap">Subject/Lesson:</label>
          <select 
            className="w-full border border-primary/20 rounded-md px-3 py-1.5 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="" disabled>-- Select Subject --</option>
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>{subj.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-3 bg-card p-4 rounded-xl border shadow-sm">
          <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range:</label>
          <select 
            className="w-full border rounded-md px-3 py-1.5 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
          >
            <option value={5}>Current Week (5 days)</option>
            <option value={10}>Past 2 Weeks (10 days)</option>
            <option value={22}>Past Month (~22 days)</option>
            <option value={60}>Past Term (~60 days)</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-card border shadow-sm overflow-hidden flex flex-col max-h-[70vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary mb-4" />
            <p>Loading records from database...</p>
          </div>
        ) : (
          <div className="overflow-auto relative flex-1">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-20 bg-secondary/90 backdrop-blur-sm shadow-sm">
                <tr className="text-left text-muted-foreground">
                  <th className="sticky left-0 z-30 bg-secondary/90 px-4 py-3 font-medium min-w-[200px] border-r">Student</th>
                  
                  {dates.map((d) => (
                    <th key={d} className="px-3 py-3 font-medium text-center whitespace-nowrap text-xs border-r border-border/50">
                      {new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </th>
                  ))}
                  
                  <th className="sticky right-0 z-30 bg-secondary/90 px-4 py-3 font-medium text-right border-l shadow-[inset_1px_0_4px_rgba(0,0,0,0.05)]">Rate %</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const rate = getRate(s.id);
                  return (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/40 transition-smooth group">
                      <td className="sticky left-0 z-10 bg-card group-hover:bg-secondary/40 px-4 py-3 font-medium border-r">{s.name}</td>
                      
                      {dates.map((d) => (
                        <td key={d} className="px-3 py-2 text-center border-r border-border/20">
                          <div className="flex justify-center">
                            <Badge value={attendanceRecords[s.id]?.[d]} onClick={() => cycleLesson(s.id, d)} />
                          </div>
                        </td>
                      ))}
                      
                      <td className="sticky right-0 z-10 bg-card group-hover:bg-secondary/40 px-4 py-3 text-right border-l shadow-[inset_1px_0_4px_rgba(0,0,0,0.05)]">
                        <span className={`font-semibold ${rate >= 90 ? "text-emerald-600" : rate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={dates.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                      No students found in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-border flex flex-wrap gap-4 text-xs text-muted-foreground items-center justify-between shrink-0">
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5"><Badge value="P" /> Present</span>
            <span className="inline-flex items-center gap-1.5"><Badge value="A" /> Absent</span>
            <span className="inline-flex items-center gap-1.5"><Badge value="L" /> Late</span>
            <span className="inline-flex items-center gap-1.5 ml-4 text-primary">Click badge to save to PostgreSQL</span>
          </div>
        </div>
      </div>
    </>
  );
}

