"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { getStudentHomework, getClasses } from "../../../actions";
import { toast } from "sonner";
import { 
  Loader2, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Paperclip, 
  Filter, 
  GraduationCap, 
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeworkDocumentBadge } from "@/components/homework/HomeworkDocumentBadge";

export default function StudentHomework() {
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("MY_CLASS");
  const [studentClassId, setStudentClassId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>("Student");
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const classId = sessionStorage.getItem("ns_student_class");
    const name = sessionStorage.getItem("ns_student_name");
    if (classId) setStudentClassId(classId);
    if (name) setStudentName(name);

    // Load local storage completions
    try {
      const saved = localStorage.getItem("ns_homework_completed");
      if (saved) setCompletedMap(JSON.parse(saved));
    } catch(e) {}

    const init = async () => {
      try {
        const [clsList, allHw] = await Promise.all([
          getClasses(),
          getStudentHomework(classId || "ALL")
        ]);
        setClasses(clsList || []);
        
        // If student has a class and it has homework, show it; otherwise show all real homework
        if (classId && allHw && allHw.length > 0) {
          setHomeworkList(allHw);
          setSelectedFilter(classId);
        } else {
          // If the student's class has no homework yet, load all school homework so they see real tasks
          const fullList = await getStudentHomework("ALL");
          setHomeworkList(fullList || []);
          setSelectedFilter("ALL");
        }
      } catch (err) {
        console.error("Error loading student homework:", err);
        toast.error("Failed to load homework assignments");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleFilterChange = async (newClassId: string) => {
    setSelectedFilter(newClassId);
    setRefreshing(true);
    try {
      const data = await getStudentHomework(newClassId === "ALL" ? "ALL" : newClassId);
      setHomeworkList(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh assignments");
    } finally {
      setRefreshing(false);
    }
  };

  const toggleComplete = (id: string) => {
    const updated = { ...completedMap, [id]: !completedMap[id] };
    setCompletedMap(updated);
    try {
      localStorage.setItem("ns_homework_completed", JSON.stringify(updated));
    } catch(e) {}
    if (updated[id]) {
      toast.success("Assignment marked as completed!");
    }
  };

  // Group pending vs completed
  const activeHomework = homeworkList.filter(h => !completedMap[h.id]);
  const completedHomework = homeworkList.filter(h => completedMap[h.id]);

  const activeClassName = classes.find(c => c.id === selectedFilter)?.name;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p>Loading homework assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="My Homework & Assignments" 
          subtitle={`Welcome back, ${studentName}. Review real class tasks and download worksheets assigned by your teachers.`}
        />

        {/* Class Filter Bar */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xs w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 hidden md:inline">
            Class Filter:
          </span>
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            disabled={refreshing}
            className="bg-transparent text-xs font-medium text-gray-800 dark:text-gray-200 border-none outline-none focus:ring-0 cursor-pointer pr-4"
          >
            <option value="ALL">All School Classes (Overview)</option>
            {studentClassId && (
              <option value={studentClassId}>
                My Assigned Class ({classes.find(c => c.id === studentClassId)?.name || "Current"})
              </option>
            )}
            {classes
              .filter(c => c.id !== studentClassId)
              .map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          {refreshing && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 mr-2" />}
        </div>
      </div>

      {/* Information Banner if showing All classes */}
      {selectedFilter === "ALL" && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Displaying <strong>all active assignments</strong> from teachers across classes. You can filter by a specific class using the dropdown above.
            </span>
          </div>
          {studentClassId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleFilterChange(studentClassId)}
              className="text-xs h-7 border-blue-300 text-blue-700 hover:bg-blue-100/60 shrink-0"
            >
              Filter to My Class
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
              Pending Tasks
              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-semibold">
                {activeHomework.length} Active
              </span>
            </h3>
            {activeClassName && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Class: {activeClassName}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {activeHomework.map((h) => {
              const today = new Date();
              today.setHours(0,0,0,0);
              const due = new Date(h.dueDate);
              due.setHours(0,0,0,0);
              
              const isOverdue = due < today;
              const isDueToday = due.getTime() === today.getTime();

              return (
                <div 
                  key={h.id} 
                  className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden ${
                    isOverdue 
                      ? 'border-red-200 dark:border-red-900 bg-red-50/10' 
                      : 'border-gray-100 dark:border-slate-800'
                  }`}
                >
                  {isOverdue && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg shadow-xs">
                      OVERDUE
                    </div>
                  )}
                  {isDueToday && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg shadow-xs">
                      DUE TODAY
                    </div>
                  )}
                  
                  <div>
                    {/* Meta badges */}
                    <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                        {h.subject?.name || "Subject"}
                      </span>
                      {h.class?.name && (
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">
                          {h.class.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Assigned by {h.teacher?.name || "Teacher"}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base mb-2">
                      {h.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-3">
                      {h.desc}
                    </p>

                    {/* Attached Document Worksheet */}
                    {h.attachmentUrl && (
                      <div className="my-3">
                        <HomeworkDocumentBadge
                          url={h.attachmentUrl}
                          name={h.attachmentName}
                          size={h.attachmentSize}
                          type={h.attachmentType}
                          accent="blue"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800 mt-2 flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Due Date: </span>
                      <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        {h.dueDate}
                      </span>
                    </div>

                    <Button 
                      onClick={() => toggleComplete(h.id)}
                      variant="outline" 
                      size="sm" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold"
                    >
                      Mark Completed
                    </Button>
                  </div>
                </div>
              );
            })}

            {activeHomework.length === 0 && (
              <div className="p-12 text-center text-gray-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  All Caught Up!
                </h3>
                <p className="text-xs max-w-sm mx-auto text-gray-500">
                  No pending assignments found for the selected filter. Try selecting &ldquo;All School Classes&rdquo; from the dropdown to view tasks assigned to other classes.
                </p>
                {selectedFilter !== "ALL" && (
                  <Button
                    onClick={() => handleFilterChange("ALL")}
                    variant="outline"
                    size="sm"
                    className="mt-4 text-xs"
                  >
                    View All School Assignments
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Completed list */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
              Completed Tasks
              <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                {completedHomework.length} Done
              </span>
            </h3>
          </div>

          <div className="space-y-3">
            {completedHomework.map((h) => (
              <div 
                key={h.id} 
                className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-start gap-3 opacity-80 hover:opacity-100 transition-opacity"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                      {h.subject?.name || "Subject"}
                    </span>
                    <span className="text-[10px] text-gray-400">Due {h.dueDate}</span>
                    {h.attachmentUrl && (
                      <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Paperclip className="w-2.5 h-2.5" />
                        File
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                    {h.title}
                  </h4>
                  
                  {h.attachmentUrl && (
                    <div className="mt-2">
                      <HomeworkDocumentBadge
                        url={h.attachmentUrl}
                        name={h.attachmentName}
                        size={h.attachmentSize}
                        type={h.attachmentType}
                        accent="blue"
                        compact
                      />
                    </div>
                  )}

                  <button 
                    onClick={() => toggleComplete(h.id)}
                    className="text-[11px] text-blue-600 hover:underline mt-2 inline-block font-medium cursor-pointer"
                  >
                    Move back to active
                  </button>
                </div>
              </div>
            ))}
            {completedHomework.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs italic bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-100 dark:border-slate-800">
                Completed assignments will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
