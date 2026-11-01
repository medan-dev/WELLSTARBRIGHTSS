"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTeacherClasses, addStudent } from "../../../actions";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export default function RegisterStudent() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    classId: ""
  });

  useEffect(() => {
    const teacherId = sessionStorage.getItem("ns_teacher_id");
    if (!teacherId) return;
    const loadClasses = async () => {
      try {
        // Load only real DB classes assigned to this teacher (avoids stale/invalid IDs)
        const data = await getTeacherClasses(teacherId);
        setClasses(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, classId: data[0].id }));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.classId) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    toast.loading("Registering student...");
    
    try {
      await addStudent(formData.name, formData.email, formData.password, formData.classId);
      toast.success("Student registered successfully!");
      setFormData({ name: "", email: "", password: "", classId: "" });
    } catch (err) {
      toast.error("Failed to register student. Email may already be in use.");
      console.error(err);
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Register Student" 
        subtitle="Add a new student to one of your classes and create their portal login."
      />

      <div className="w-full max-w-none bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Class</label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              >
                <option value="">Select a class...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Grade {c.grade})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Student Portal Access</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input
                  type="email"
                  placeholder="student@school.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                <Input
                  type="text"
                  placeholder="e.g. Student123!"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

