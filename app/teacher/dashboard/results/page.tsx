"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClasses, getSubjects, getStudentsByClass, getExams, getMarks, recordMark } from "../../../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function MarksEntry() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [clsData, subData, examData] = await Promise.all([
          getClasses(), getSubjects(), getExams()
        ]);
        setClasses(clsData);
        setSubjects(subData);
        setExams(examData);
      } catch(e) {
        toast.error("Failed to load setup data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadGrid = async () => {
    setLoading(true);
    try {
      const studs = await getStudentsByClass(selectedClass);
      setStudents(studs);
      
      const existingMarks = await getMarks(selectedExam, selectedClass, selectedSubject);
      const markMap: Record<string, number> = {};
      existingMarks.forEach((m: any) => {
        markMap[m.studentId] = m.score;
      });
      setMarks(markMap);
    } catch(e) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExam) {
      loadGrid();
    }
  }, [selectedClass, selectedSubject, selectedExam]);

  const handleMarkChange = (studentId: string, val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return;
    setMarks(prev => ({ ...prev, [studentId]: num }));
  };

  const handleSaveAll = async () => {
    const teacherId = sessionStorage.getItem("ns_teacher_id");
    if(!teacherId) return toast.error("Teacher ID not found");
    
    setSaving(true);
    toast.loading("Saving marks...");
    
    try {
      // Ideally we would have a bulk upsert, but we'll do promise.all for demo
      const promises = students.map(s => {
        if(marks[s.id] !== undefined) {
          return recordMark(s.id, selectedSubject, selectedExam, teacherId, marks[s.id]);
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
      toast.success("Marks saved successfully!");
    } catch(e) {
      toast.error("Failed to save marks");
    } finally {
      setSaving(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Enter Marks" 
        subtitle="Record exam and assessment scores for your students."
      />

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">Exam</label>
          <select 
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Select Exam</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">Class</label>
          <select 
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">Subject</label>
          <select 
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" /></div>}

      {!loading && selectedClass && selectedSubject && selectedExam && students.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900">Student Roster</h3>
            <Button onClick={handleSaveAll} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              {saving ? "Saving..." : "Save All Marks"}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white border-b border-gray-100 text-gray-900">
                <tr>
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold w-48">Score (out of 100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{student.name}</td>
                    <td className="p-4">
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        className="w-full text-center font-semibold"
                        value={marks[student.id] ?? ""}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {!loading && selectedClass && selectedSubject && selectedExam && students.length === 0 && (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
          No students found in this class.
        </div>
      )}
    </div>
  );
}
