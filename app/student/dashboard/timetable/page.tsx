"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { getStudentTimetable } from "../../../actions";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, BookOpen, User } from "lucide-react";

export default function StudentTimetable() {
  const [timetableSlots, setTimetableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const classId = sessionStorage.getItem("ns_student_class");
    
    // Get current day of the week
    const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
    setCurrentDay(weekday);

    if (classId) {
      getStudentTimetable(classId)
        .then(data => {
          setTimetableSlots(data);
        })
        .catch(err => {
          console.error(err);
          toast.error("Failed to load your timetable");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Group slots by Day
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const groupedSlots: Record<string, any[]> = {};
  daysOfWeek.forEach(d => {
    groupedSlots[d] = [];
  });

  timetableSlots.forEach(s => {
    if (groupedSlots[s.day]) {
      groupedSlots[s.day].push(s);
    }
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p>Loading your timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="School Timetable" 
        subtitle="Check your weekly classes, timings, and teachers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        {daysOfWeek.map((day) => {
          const slots = groupedSlots[day] || [];
          const isToday = day.toLowerCase() === currentDay.toLowerCase();

          return (
            <div 
              key={day} 
              className={`rounded-2xl border bg-white shadow-sm flex flex-col overflow-hidden transition-all ${isToday ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-100'}`}
            >
              {/* Day Header */}
              <div className={`p-4 text-center font-bold border-b text-sm ${isToday ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-900 border-gray-100'}`}>
                {day}
                {isToday && <span className="block text-[10px] uppercase font-semibold text-blue-100 mt-0.5">Today</span>}
              </div>

              {/* Day Slots */}
              <div className="flex-1 p-3 space-y-3 bg-gray-50/30">
                {slots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-100 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold mb-2">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      <span>{slot.time}</span>
                    </div>

                    <div className="flex items-start gap-1.5 mb-1.5">
                      <BookOpen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">
                        {slot.subject.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{slot.teacher.name}</span>
                    </div>
                  </div>
                ))}

                {slots.length === 0 && (
                  <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center p-4 text-gray-400 text-xs italic bg-white rounded-xl border border-dashed border-gray-200">
                    <Calendar className="w-8 h-8 text-gray-300 mb-2" />
                    No classes scheduled.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
