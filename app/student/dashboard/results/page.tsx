"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { getStudentMarks } from "../../../actions";
import { toast } from "sonner";
import { Loader2, FileSpreadsheet, Award, BookOpen, Star } from "lucide-react";

export default function StudentResults() {
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = sessionStorage.getItem("ns_student_id");
    if (studentId) {
      getStudentMarks(studentId)
        .then(data => {
          setMarks(data);
        })
        .catch(err => {
          console.error(err);
          toast.error("Failed to load your results");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Compute metrics
  const totalAssessments = marks.length;
  const averageScore = totalAssessments > 0 
    ? Math.round(marks.reduce((acc, curr) => acc + curr.score, 0) / totalAssessments)
    : 0;

  // Find top performing subject
  const subjectScores: Record<string, { total: number; count: number }> = {};
  marks.forEach(m => {
    const subName = m.subject.name;
    if (!subjectScores[subName]) subjectScores[subName] = { total: 0, count: 0 };
    subjectScores[subName].total += m.score;
    subjectScores[subName].count += 1;
  });

  let topSubjectName = "N/A";
  let topSubjectAvg = 0;
  Object.entries(subjectScores).forEach(([name, data]) => {
    const avg = data.total / data.count;
    if (avg > topSubjectAvg) {
      topSubjectAvg = avg;
      topSubjectName = name;
    }
  });

  // Group marks by Exam
  const examsMap: Record<string, { examTitle: string; examDate: string; marks: any[] }> = {};
  marks.forEach(m => {
    const examId = m.examId;
    if (!examsMap[examId]) {
      examsMap[examId] = {
        examTitle: m.exam.title,
        examDate: m.exam.date,
        marks: []
      };
    }
    examsMap[examId].marks.push(m);
  });

  const groupedExams = Object.values(examsMap);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p>Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Results" 
        subtitle="Track your performance across examinations and tests."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-gray-400">Average Score</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{averageScore}%</div>
            <div className="mt-1 text-xs text-gray-500">Across all terms</div>
          </div>
          <div className="size-11 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-gray-400">Top Subject</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 truncate max-w-[150px]">{topSubjectName}</div>
            <div className="mt-1 text-xs text-emerald-600 font-medium">Avg: {Math.round(topSubjectAvg)}%</div>
          </div>
          <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-gray-400">Assessments Taken</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{totalAssessments}</div>
            <div className="mt-1 text-xs text-gray-500">Graded tasks</div>
          </div>
          <div className="size-11 rounded-xl bg-amber-50 text-amber-600 grid place-items-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grids / Results tables */}
      <div className="space-y-6 mt-8">
        {groupedExams.map((group, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">{group.examTitle}</h3>
                <p className="text-xs text-gray-500">Date: {group.examDate}</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {group.marks.length} Graded subjects
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-white border-b border-gray-100 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Teacher</th>
                    <th className="p-4 text-center w-36">Score</th>
                    <th className="p-4 text-center w-36">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {group.marks.map((mark) => {
                    const score = mark.score;
                    const grade = score >= 90 ? "D1" :
                                  score >= 80 ? "D2" :
                                  score >= 70 ? "C3" :
                                  score >= 60 ? "C4" :
                                  score >= 50 ? "C5" :
                                  score >= 45 ? "P7" : "F9";
                    const gradeColor = score >= 70 ? "text-emerald-600 bg-emerald-50" :
                                       score >= 50 ? "text-amber-600 bg-amber-50" :
                                       "text-red-600 bg-red-50";

                    return (
                      <tr key={mark.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-semibold text-gray-900">{mark.subject.name}</td>
                        <td className="p-4 text-gray-500 text-xs">{mark.teacher.name}</td>
                        <td className="p-4 text-center font-bold text-gray-900">{score}%</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${gradeColor}`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {groupedExams.length === 0 && (
          <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">No Results Found</h3>
            <p className="text-xs max-w-sm mx-auto">No marks or exam grades have been recorded for your account yet. Please contact your subject teacher.</p>
          </div>
        )}
      </div>
    </div>
  );
}
