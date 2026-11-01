"use client";

import { useState, useEffect } from "react";
import { Mail, Plus, Search, Edit, Trash2, X, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/admin/Widgets";
import { getTeachers, getSubjects, getClasses, addTeacher, updateTeacher, deleteTeacher, addSubject } from "../../../actions";
import { toast } from "sonner";

export default function TeachersPage() {
  const [list, setList] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showSubjectAdd, setShowSubjectAdd] = useState(false);
  
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", subjectId: "", password: "", classIds: [] as string[] });
  const [newSubject, setNewSubject] = useState("");

  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", subjectId: "", classIds: [] as string[] });

  const loadData = async () => {
    try {
      const [tData, sData, cData] = await Promise.all([getTeachers(), getSubjects(), getClasses()]);
      setList(tData);
      setSubjects(sData);
      setClasses(cData);
    } catch (e) {
      toast.error("Failed to load data from database.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = list.filter((t) =>
    `${t.name} ${t.email}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    toast.loading("Adding subject...");
    try {
      await addSubject(newSubject);
      await loadData();
      setNewSubject("");
      setShowSubjectAdd(false);
      toast.dismiss();
      toast.success("Subject added dynamically to database!");
    } catch (e) {
      toast.dismiss();
      toast.error("Failed to add subject. It might already exist.");
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.name.trim() || !newTeacher.email.trim() || !newTeacher.password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.loading("Adding teacher...");
    try {
      await addTeacher(newTeacher.name, newTeacher.email, newTeacher.password, newTeacher.subjectId, newTeacher.classIds);
      await loadData();
      setNewTeacher({ name: "", email: "", subjectId: "", password: "", classIds: [] });
      setShowAdd(false);
      toast.dismiss();
      toast.success("Teacher added to database!");
    } catch (e: any) {
      toast.dismiss();
      toast.error(e.message || "Failed to add teacher. Email might already be in use.");
    }
  };

  const openEdit = (t: any) => {
    setEditingTeacher(t);
    setEditForm({
      name: t.name,
      email: t.email || "",
      password: "",
      subjectId: t.subjects?.[0]?.id || "",
      classIds: t.classes?.map((c: any) => c.id) || []
    });
  };

  const handleEditTeacher = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error("Name and Email are required");
      return;
    }
    toast.loading("Updating teacher...");
    try {
      await updateTeacher(
        editingTeacher.id, 
        editForm.name, 
        editForm.email, 
        editForm.password || undefined, 
        editForm.subjectId || undefined, 
        editForm.classIds
      );
      await loadData();
      setEditingTeacher(null);
      toast.dismiss();
      toast.success("Teacher updated!");
    } catch (e) {
      toast.dismiss();
      toast.error("Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if(!confirm("Are you sure you want to delete this teacher?")) return;
    toast.loading("Deleting teacher...");
    try {
      await deleteTeacher(id);
      await loadData();
      toast.dismiss();
      toast.success("Teacher deleted!");
    } catch (e) {
      toast.dismiss();
      toast.error("Failed to delete teacher");
    }
  };

  const toggleClass = (id: string, isEditing: boolean) => {
    if (isEditing) {
      setEditForm(prev => ({
        ...prev,
        classIds: prev.classIds.includes(id) ? prev.classIds.filter(c => c !== id) : [...prev.classIds, id]
      }));
    } else {
      setNewTeacher(prev => ({
        ...prev,
        classIds: prev.classIds.includes(id) ? prev.classIds.filter(c => c !== id) : [...prev.classIds, id]
      }));
    }
  };

  return (
    <>
      <PageHeader
        title="Teachers & Subjects"
        subtitle={`${list.length} faculty members · ${subjects.length} subjects`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSubjectAdd(true)} className="shadow-sm">
              <BookOpen className="size-4 mr-2" /> Add Subject
            </Button>
            <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground border-0 shadow-sm">
              <Plus className="size-4 mr-2" /> Add teacher
            </Button>
          </div>
        }
      />

      {/* Add subject modal */}
      {showSubjectAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border shadow-xl p-8 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Add dynamic subject</h2>
              <button onClick={() => setShowSubjectAdd(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="size-4" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Subjects added here will instantly appear in the Attendance Tracker dropdowns for roll calls.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sname">Subject name *</Label>
                <Input id="sname" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="mt-1.5" placeholder="e.g. Advanced Physics" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleAddSubject} className="flex-1 bg-primary text-primary-foreground border-0">
                  <Check className="size-4 mr-2" /> Add Subject
                </Button>
                <Button variant="outline" onClick={() => setShowSubjectAdd(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add teacher modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border shadow-xl p-8 w-full max-w-md animate-scale-in max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Add teacher</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="size-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tname">Full name *</Label>
                <Input id="tname" value={newTeacher.name} onChange={(e) => setNewTeacher((p) => ({ ...p, name: e.target.value }))} className="mt-1.5" placeholder="Dr. Jane Smith" />
              </div>
              <div>
                <Label htmlFor="temail">Email *</Label>
                <Input id="temail" type="email" value={newTeacher.email} onChange={(e) => setNewTeacher((p) => ({ ...p, email: e.target.value }))} className="mt-1.5" placeholder="j.smith@wellstarbright.sc.ug" />
              </div>
              <div>
                <Label htmlFor="tpass">Temporary Password *</Label>
                <Input id="tpass" type="text" value={newTeacher.password} onChange={(e) => setNewTeacher((p) => ({ ...p, password: e.target.value }))} className="mt-1.5" placeholder="Teacher123!" />
              </div>
              <div>
                <Label htmlFor="tsubject">Primary Subject</Label>
                <select 
                  id="tsubject"
                  className="w-full mt-1.5 border rounded-md px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
                  value={newTeacher.subjectId}
                  onChange={(e) => setNewTeacher((p) => ({ ...p, subjectId: e.target.value }))}
                >
                  <option value="">-- Assign a subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Assigned Classes (for Attendance)</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                  {classes.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={newTeacher.classIds.includes(c.id)}
                        onChange={() => toggleClass(c.id, false)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddTeacher} className="flex-1 bg-primary text-primary-foreground border-0">
                  <Check className="size-4 mr-2" /> Add teacher
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search teachers…" className="pl-9" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="p-5 rounded-2xl bg-card border shadow-sm hover-lift flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-primary grid place-items-center text-primary-foreground font-bold shadow-sm shrink-0">
                  {t.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t.subjects && t.subjects.length > 0 
                      ? t.subjects.map((s: any) => s.name).join(", ") 
                      : "No subjects assigned"}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteTeacher(t.id)} 
                className="text-red-500/50 hover:text-red-600 transition-colors"
                title="Delete teacher"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            
            <div className="text-xs text-muted-foreground line-clamp-1 mb-4">
              <span className="font-medium text-foreground">Classes: </span>
              {t.classes && t.classes.length > 0 ? t.classes.map((c: any) => c.name).join(", ") : "None"}
            </div>

            <div className="mt-auto pt-4 border-t flex items-center justify-between text-xs">
              <span className="text-muted-foreground truncate mr-2">{t.email}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => openEdit(t)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-smooth"
                >
                  <Edit className="size-3" /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">No teachers match your search.</div>
        )}
      </div>

      {/* Edit teacher modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border shadow-xl p-8 w-full max-w-md animate-scale-in max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Edit Teacher</h2>
              <button onClick={() => setEditingTeacher(null)} className="p-2 rounded-lg hover:bg-secondary"><X className="size-4" /></button>
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
                <Label htmlFor="esubject">Primary Subject</Label>
                <select 
                  id="esubject"
                  className="w-full mt-1.5 border rounded-md px-3 py-2 text-sm bg-transparent outline-none focus:ring-2 focus:ring-primary/20"
                  value={editForm.subjectId}
                  onChange={(e) => setEditForm(p => ({ ...p, subjectId: e.target.value }))}
                >
                  <option value="">-- No Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Assigned Classes (for Attendance)</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                  {classes.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={editForm.classIds.includes(c.id)}
                        onChange={() => toggleClass(c.id, true)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleEditTeacher} className="flex-1 bg-primary text-primary-foreground border-0">
                  <Check className="size-4 mr-2" /> Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingTeacher(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

