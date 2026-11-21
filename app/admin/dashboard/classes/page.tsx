"use client";

import { useState, useEffect } from "react";
import { Plus, Users, MapPin, X, Check, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/admin/Widgets";
import { getClasses } from "../../../actions";
import { toast } from "sonner";

type ClassRow = { id: string; name: string; teacher?: string; room?: string; students?: number };

export default function ClassesPage() {
  const [list, setList] = useState<ClassRow[]>([]);
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", teacher: "", room: "" });

  useEffect(() => {
    getClasses()
      .then((data) => {
        if (Array.isArray(data)) {
          setList(
            data.map((c: any) => ({
              id: c.id,
              name: c.name,
              teacher: "Assigned Faculty",
              room: "Academic Wing",
              students: c._count?.students || 0,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filtered = list.filter((c) =>
    `${c.name} ${c.teacher} ${c.room}`.toLowerCase().includes(q.toLowerCase())
  );

  const remove = (id: string) => {
    setList((l) => l.filter((c) => c.id !== id));
    toast.success("Class removed");
  };

  const add = () => {
    if (!newClass.name.trim() || !newClass.teacher.trim() || !newClass.room.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const id = `C-${Date.now()}`;
    setList((l) => [...l, { id, ...newClass, students: 0 }]);
    setNewClass({ name: "", teacher: "", room: "" });
    setShowAdd(false);
    toast.success("Class added successfully");
  };

  return (
    <>
      <PageHeader
        title="Classes"
        subtitle={`${list.length} active classes`}
        action={
          <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground border-0 shadow-sm">
            <Plus className="size-4" /> Add class
          </Button>
        }
      />

      {/* Add class modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-none border shadow-xl p-8 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Add class</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-none hover:bg-secondary"><X className="size-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cname">Class name *</Label>
                <Input id="cname" value={newClass.name} onChange={(e) => setNewClass((p) => ({ ...p, name: e.target.value }))} className="mt-1.5 rounded-none" placeholder="e.g. 8B — Science" />
              </div>
              <div>
                <Label htmlFor="cteacher">Teacher *</Label>
                <Input id="cteacher" value={newClass.teacher} onChange={(e) => setNewClass((p) => ({ ...p, teacher: e.target.value }))} className="mt-1.5 rounded-none" placeholder="Teacher name" />
              </div>
              <div>
                <Label htmlFor="croom">Room *</Label>
                <Input id="croom" value={newClass.room} onChange={(e) => setNewClass((p) => ({ ...p, room: e.target.value }))} className="mt-1.5 rounded-none" placeholder="e.g. Block A · 103" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={add} className="flex-1 bg-primary text-primary-foreground border-0 rounded-none">
                  <Check className="size-4" /> Add class
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1 rounded-none">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search classes…" className="pl-9 rounded-none" />
        </div>
      </div>

      <div className="rounded-none border bg-card overflow-hidden shadow-sm animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Class ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Teacher</th>
                <th className="px-6 py-4 font-medium">Students</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/20 transition-smooth group">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.teacher}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground" />
                      {c.students}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {c.room}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => remove(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 transition-smooth inline-flex items-center gap-1.5 font-medium text-xs"
                      title="Remove class"
                    >
                      <X className="size-3.5 shrink-0" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    No classes match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

