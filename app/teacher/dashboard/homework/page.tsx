"use client";

import { useEffect, useState, useRef } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { 
  getTeacherClasses, 
  getClasses,
  getSubjects,
  getStudentHomework, 
  addHomework, 
  deleteHomework,
  uploadHomeworkAttachment 
} from "../../../actions";
import { toast } from "sonner";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Calendar, 
  ClipboardList, 
  UploadCloud, 
  Paperclip, 
  Link as LinkIcon, 
  FileText, 
  Check, 
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HomeworkDocumentBadge } from "@/components/homework/HomeworkDocumentBadge";

export default function TeacherHomework() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Document attachment state
  const [attachment, setAttachment] = useState<{
    url: string;
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [attachTab, setAttachTab] = useState<"upload" | "link">("upload");
  const [externalUrl, setExternalUrl] = useState("");
  const [externalName, setExternalName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const tid = sessionStorage.getItem("ns_teacher_id");
    setTeacherId(tid);

    const init = async () => {
      try {
        // Load subjects and classes in parallel
        const [allSubjects, allClasses] = await Promise.all([
          getSubjects(),
          getClasses()
        ]);

        setSubjects(allSubjects || []);

        let teacherClasses: any[] = [];
        if (tid) {
          try {
            teacherClasses = await getTeacherClasses(tid);
          } catch (err) {
            console.error("Error fetching teacher classes:", err);
          }
        }

        // Use teacher classes if available, otherwise fallback to all school classes
        const availableClasses = (teacherClasses && teacherClasses.length > 0) 
          ? teacherClasses 
          : (allClasses || []);

        setClasses(availableClasses);

        if (availableClasses.length > 0) {
          setSelectedClassId(availableClasses[0].id);
        }

        if (allSubjects && allSubjects.length > 0) {
          setSelectedSubjectId(allSubjects[0].id);
        }
      } catch (e) {
        console.error("Failed to load classes or subjects:", e);
        toast.error("Failed to load classes and subjects");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load homework when class changes
  useEffect(() => {
    if (selectedClassId) {
      getStudentHomework(selectedClassId)
        .then(data => {
          setHomeworkList(data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [selectedClassId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      return toast.error("File is too large. Maximum size is 50MB.");
    }

    setUploadingDoc(true);
    const toastId = toast.loading(`Uploading "${file.name}"...`);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadHomeworkAttachment(formData);
      setAttachment(res);
      toast.success("Document attached successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload document", { id: toastId });
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAttachLink = () => {
    if (!externalUrl.trim()) {
      return toast.error("Please enter a valid document link");
    }
    const cleanUrl = externalUrl.trim();
    const ext = cleanUrl.split(".").pop()?.toLowerCase() || "link";
    const name = externalName.trim() || "Online Document (" + ext.toUpperCase() + ")";

    setAttachment({
      url: cleanUrl,
      name,
      size: "External Document",
      type: ext,
    });
    setExternalUrl("");
    setExternalName("");
    toast.success("Document link attached!");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const classIdToUse = selectedClassId || (classes.length > 0 ? classes[0].id : "");
    const subjectIdToUse = selectedSubjectId || (subjects.length > 0 ? subjects[0].id : "");
    const activeTeacherId = teacherId || (typeof window !== "undefined" ? sessionStorage.getItem("ns_teacher_id") : null);

    if (!title?.trim()) {
      return toast.error("Please enter an assignment title");
    }
    if (!dueDate) {
      return toast.error("Please select a due date");
    }
    if (!classIdToUse) {
      return toast.error("Please select a class");
    }
    if (!subjectIdToUse) {
      return toast.error("Please select a subject");
    }

    setSubmitting(true);
    const toastId = toast.loading("Creating homework assignment...");

    try {
      await addHomework({
        title: title.trim(),
        desc: desc.trim(),
        dueDate,
        classId: classIdToUse,
        subjectId: subjectIdToUse,
        teacherId: activeTeacherId,
        attachmentUrl: attachment?.url || null,
        attachmentName: attachment?.name || null,
        attachmentSize: attachment?.size || null,
        attachmentType: attachment?.type || null,
      });

      toast.success("Homework assigned successfully!", { id: toastId });
      setTitle("");
      setDesc("");
      setDueDate("");
      setAttachment(null);
      
      // Refresh homework list
      const data = await getStudentHomework(classIdToUse);
      setHomeworkList(data);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create homework", { id: toastId });
      console.error("Create homework error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this homework?")) return;
    
    const toastId = toast.loading("Deleting homework...");
    try {
      await deleteHomework(id);
      toast.success("Homework deleted successfully!", { id: toastId });
      
      // Refresh homework list
      const data = await getStudentHomework(selectedClassId);
      setHomeworkList(data);
    } catch (err) {
      toast.error("Failed to delete homework", { id: toastId });
      console.error(err);
    }
  };

  // Active class name for display
  const activeClass = classes.find(c => c.id === selectedClassId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
        <p>Loading homework settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manage Homework & Assignments" 
        subtitle="Create assignments with document worksheets (PDF, Word DOCX, etc.) for your students."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50">
            <Plus className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-gray-900 text-lg">New Assignment</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                required
              >
                {classes.length === 0 ? (
                  <option value="" disabled>No classes available</option>
                ) : (
                  classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                <span>Select Subject</span>
                <span className="text-[11px] text-gray-400 font-normal">
                  {subjects.length} subjects
                </span>
              </label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                required
              >
                {subjects.length === 0 ? (
                  <option value="" disabled>Loading subjects...</option>
                ) : (
                  subjects.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <Input
                placeholder="e.g. Unit 4: Cell Biology Worksheet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions / Details</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Provide instructions, chapter references, or problems to solve..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Document Attachment Section */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-orange-500" />
                  Attach Homework Document
                  <span className="text-xs font-normal text-gray-400">(Optional)</span>
                </label>
              </div>

              {attachment ? (
                <div className="space-y-2">
                  <HomeworkDocumentBadge
                    url={attachment.url}
                    name={attachment.name}
                    size={attachment.size}
                    type={attachment.type}
                    onRemove={() => setAttachment(null)}
                    accent="orange"
                  />
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Document ready to be assigned with homework
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setAttachTab("upload")}
                      className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                        attachTab === "upload" 
                          ? "bg-white text-gray-900 shadow-xs font-semibold" 
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttachTab("link")}
                      className={`flex-1 py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                        attachTab === "link" 
                          ? "bg-white text-gray-900 shadow-xs font-semibold" 
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Online Doc Link
                    </button>
                  </div>

                  {attachTab === "upload" ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                        className="hidden"
                        id="hw-doc-upload"
                        onChange={handleFileUpload}
                        disabled={uploadingDoc}
                      />
                      <label
                        htmlFor="hw-doc-upload"
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          uploadingDoc
                            ? "bg-gray-50 border-gray-300 pointer-events-none"
                            : "border-orange-200 hover:border-orange-400 bg-orange-50/20 hover:bg-orange-50/40"
                        }`}
                      >
                        {uploadingDoc ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                            <span>Uploading document...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-2">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-semibold text-gray-800">
                              Choose a document or drag & drop
                            </span>
                            <span className="text-[10px] text-gray-500 mt-1 max-w-xs">
                              PDF, Word (.docx, .doc), Excel, PowerPoint, Text & Images (Max 50MB)
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Document Link (e.g. Google Drive, OneDrive, PDF Link)
                        </label>
                        <Input
                          placeholder="https://docs.google.com/... or https://..."
                          value={externalUrl}
                          onChange={(e) => setExternalUrl(e.target.value)}
                          className="text-xs h-8 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Document Title / Description (Optional)
                        </label>
                        <Input
                          placeholder="e.g. Unit 3 Study Guide"
                          value={externalName}
                          onChange={(e) => setExternalName(e.target.value)}
                          className="text-xs h-8 bg-white"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAttachLink}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs h-8 mt-1"
                      >
                        Attach Link
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 shadow-sm"
              disabled={submitting || uploadingDoc}
            >
              {submitting ? "Assigning..." : "Assign Homework"}
            </Button>
          </form>
        </div>

        {/* Homework list for selected class */}
        <div className="lg:col-span-2 space-y-4">
          <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              Assignments List
              {activeClass && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                  {activeClass.name}
                </span>
              )}
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              {homeworkList.length} {homeworkList.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          <div className="space-y-4">
            {homeworkList.map((h) => (
              <div 
                key={h.id} 
                className="p-5 rounded-xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                        {h.subject?.name || "Subject"}
                      </span>
                      <span className="text-xs text-gray-400">Assigned by {h.teacher?.name || "Teacher"}</span>
                    </div>

                    <Button 
                      onClick={() => handleDelete(h.id)}
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 text-base mb-1.5">{h.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{h.desc}</p>

                  {/* Attached Document Display */}
                  {h.attachmentUrl && (
                    <div className="mt-4">
                      <HomeworkDocumentBadge
                        url={h.attachmentUrl}
                        name={h.attachmentName}
                        size={h.attachmentSize}
                        type={h.attachmentType}
                        accent="orange"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Due Date: </span>
                    <span className="font-semibold text-gray-700">{h.dueDate}</span>
                  </div>

                  {h.attachmentUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                      <Paperclip className="w-3 h-3" />
                      Document Attached
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {homeworkList.length === 0 && (
              <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No Homework Found</h3>
                <p className="text-xs max-w-sm mx-auto">No homework assignments have been assigned to this class yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
