"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/admin/Widgets";
import { getStudents, getClasses, updateStudent, deleteStudent, addStudent } from "../../../actions";
import { toast } from "sonner";

export default function StudentsPage() {
  const [list, setList] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", classId: "" });
  
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", password: "", classId: "" });
  const perPage = 8;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sData, cData] = await Promise.all([getStudents(), getClasses()]);
      setList(sData);
      setClasses(cData);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditStudent = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Name and Email are required");
      return;
    }
    toast.loading("Updating student...");
    try {
      await updateStudent(editingStudent.id, editForm.name, editForm.email, editForm.password || undefined, editForm.classId || undefined);
      await loadData();
      setEditingStudent(null);
      toast.dismiss();
      toast.success("Student updated!");
    } catch (e) {
      toast.dismiss();
      toast.error("Failed to update student");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if(!confirm("Are you sure you want to delete this student?")) return;
    toast.loading("Deleting student...");
    try {
      await deleteStudent(id);
      await loadData();
      toast.dismiss();
      toast.success("Student deleted!");
    } catch (e) {
      toast.dismiss();
      toast.error("Failed to delete student");
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name.trim() || !newStudent.email.trim() || !newStudent.password.trim() || !newStudent.classId) {
      toast.error("Please fill in all required fields (including class)");
      return;
    }
    toast.loading("Adding student...");
    try {
      await addStudent(newStudent.name, newStudent.email, newStudent.password, newStudent.classId);
      await loadData();
      setNewStudent({ name: "", email: "", password: "", classId: "" });
      setShowAdd(false);
      toast.dismiss();
      toast.success("Student added successfully!");
    } catch (e: any) {
      toast.dismiss();
      toast.error(e.message || "Failed to add student.");
    }
  };

  const filtered = useMemo(
    () => list.filter((s) => `${s.name} ${s.email} ${s.class?.grade || ''} ${s.class?.name || ''}`.toLowerCase().includes(q.toLowerCase())),
    [list, q]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} of ${list.length} students`}
        action={
          <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground border-0 shadow-sm">
            <Plus className="size-4 mr-2" /> Add student
          </Button>
        }
      />

      <div className="rounded-2xl bg-card border shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="p-4 border-b border-border flex gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by name, email, grade…" className="pl-9" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary mb-4" />
            <p>Loading students...</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary/90 backdrop-blur-sm z-10 shadow-sm">
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Grade & Class</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {view.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/40 transition-smooth">
                    <td className="px-4 py-3 font-medium flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary grid place-items-center text-primary-foreground text-xs font-bold shrink-0">
                        {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.email || "N/A"}</td>
                    <td className="px-4 py-3">{s.class?.grade || "N/A"} - {s.class?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1 justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setEditingStudent(s);
                            setEditForm({
                              name: s.name,
                              email: s.email || "",
                              password: "",
                              classId: s.classId || ""
                            });
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(s.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {view.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No students match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border flex items-center justify-between text-sm shrink-0">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add student modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border shadow-xl p-8 w-full max-w-md animate-scale-in max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Add Student</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="size-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sname">Full name *</Label>
                <Input id="sname" value={newStudent.name} onChange={(e) => setNewStudent(p => ({ ...p, name: e.target.value }))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="semail">Email *</Label>
                <Input id="semail" type="email" value={newStudent.email} onChange={(e) => setNewStudent(p => ({ ...p, email: e.target.value }))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="spass">Temporary Password *</Label>
                <Input id="spass" type="text" value={newStudent.password} onChange={(e) => setNewStudent(p => ({ ...p, password: e.target.value }))} className="mt-1.5" placeholder="student123" />
              </div>
              <div>
                <Label htmlFor="sclass">Assigned Class *</Label>
                <select 
                  id="sclass"
                  className="w-full mt-1.5 border rounded-md px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
                  value={newStudent.classId}
                  onChange={(e) => setNewStudent(p => ({ ...p, classId: e.target.value }))}
                >
                  <option value="">-- Select a Class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.grade} - {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddStudent} className="flex-1 bg-primary text-primary-foreground border-0">
                  <Check className="size-4 mr-2" /> Add Student
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit student modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border shadow-xl p-8 w-full max-w-md animate-scale-in max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Edit Student</h2>
              <button onClick={() => setEditingStudent(null)} className="p-2 rounded-lg hover:bg-secondary"><X className="size-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ename">Full name</Label>
                <Input id="ename" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="eemail">Email</Label>
                <Input id="eemail" type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="epass">New Password (leave blank to keep current)</Label>
                <Input id="epass" type="text" value={editForm.password} onChange={(e) => setEditForm(p => ({ ...p, password: e.target.value }))} className="mt-1.5" placeholder="********" />
              </div>
              <div>
                <Label htmlFor="eclass">Assigned Class</Label>
                <select 
                  id="eclass"
                  className="w-full mt-1.5 border rounded-md px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
                  value={editForm.classId}
                  onChange={(e) => setEditForm(p => ({ ...p, classId: e.target.value }))}
                >
                  <option value="">-- No Class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.grade} - {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleEditStudent} className="flex-1 bg-primary text-primary-foreground border-0">
                  <Check className="size-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingStudent(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

