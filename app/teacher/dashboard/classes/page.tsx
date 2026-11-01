"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { BookOpen, Loader2 } from "lucide-react";
import { getTeacherClasses } from "../../../actions";

export default function MyClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("ns_teacher_id");
    setTeacherId(id);
    
    const loadData = async () => {
      try {
        if (id) {
          const data = await getTeacherClasses(id);
          setClasses(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
        <p>Loading your classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Classes" 
        subtitle="View the classes and subjects you are assigned to teach."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{cls.name}</h3>
                <p className="text-sm text-gray-500">Grade {cls.grade}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Assigned Subjects:</h4>
              <div className="flex flex-wrap gap-2">
                {cls.subjects?.map((sub: any) => (
                  <span key={sub.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    {sub.name}
                  </span>
                ))}
                {(!cls.subjects || cls.subjects.length === 0) && (
                  <span className="text-xs text-gray-400 italic">No subjects configured</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            You have not been assigned to any classes yet.
          </div>
        )}
      </div>
    </div>
  );
}
