"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { 
  getAllNotices, addNotice, deleteNotice, toggleNoticePin, uploadFile 
} from "../../../actions";
import { toast } from "sonner";
import { 
  Bell, Calendar, Trophy, Video, Megaphone, Plus, Trash2, Pin, PinOff, 
  Upload, Sparkles, MapPin, Clock, Award, AlertCircle, CheckCircle2, 
  Users, Eye, ExternalLink, Image as ImageIcon, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type NoticeType = "ANNOUNCEMENT" | "EVENT" | "PERFORMANCE" | "MEDIA";

interface StudentHonorEntry {
  id: string;
  name: string;
  avatar: string;
  class: string;
  score: string;
  badge: string;
  status: "top" | "attention";
  remarks: string;
}

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
];

export default function AdminNoticeBoard() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabFilter, setActiveTabFilter] = useState<string>("ALL");

  // Form state
  const [noticeType, setNoticeType] = useState<NoticeType>("ANNOUNCEMENT");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [target, setTarget] = useState("ALL");
  const [pinned, setPinned] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Student Performance Board state
  const [studentsList, setStudentsList] = useState<StudentHonorEntry[]>([
    {
      id: "1",
      name: "Kato Joseph",
      avatar: DEFAULT_AVATARS[1],
      class: "S.2B",
      score: "98% (Aggregate 8)",
      badge: "Best in Mathematics & Science",
      status: "top",
      remarks: "Demonstrated exceptional analytical thinking and problem-solving."
    },
    {
      id: "2",
      name: "Babirye Sarah",
      avatar: DEFAULT_AVATARS[0],
      class: "S.4 West",
      score: "94% (Aggregate 10)",
      badge: "Distinction in English Literature",
      status: "top",
      remarks: "Top essay score across all senior four streams."
    }
  ]);

  const [newStudent, setNewStudent] = useState<StudentHonorEntry>({
    id: "",
    name: "",
    avatar: DEFAULT_AVATARS[0],
    class: "S.1A",
    score: "",
    badge: "Academic Star",
    status: "top",
    remarks: ""
  });

  const loadNotices = async () => {
    try {
      const data = await getAllNotices();
      setNotices(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadFile(formData);
      setMediaUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      toast.dismiss();
    }
  };

  const handleAddStudentToBoard = () => {
    if (!newStudent.name || !newStudent.score) {
      return toast.error("Please enter student name and score");
    }
    setStudentsList(prev => [
      ...prev,
      { ...newStudent, id: Date.now().toString() }
    ]);
    setNewStudent({
      id: "",
      name: "",
      avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      class: "S.1A",
      score: "",
      badge: "Top Performer",
      status: "top",
      remarks: ""
    });
    toast.success("Student added to performance list");
  };

  const handleRemoveStudent = (id: string) => {
    setStudentsList(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      return toast.error("Please provide a title and description");
    }

    setSubmitting(true);
    toast.loading("Publishing to notice board...");

    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const metadataPayload = noticeType === "PERFORMANCE" ? JSON.stringify({ students: studentsList }) : null;

      await addNotice({
        title,
        content,
        target,
        date: dateStr,
        type: noticeType,
        category,
        mediaUrl: mediaUrl || undefined,
        mediaType: noticeType === "MEDIA" ? "video" : (mediaUrl ? "image" : undefined),
        eventDate: noticeType === "EVENT" ? eventDate : undefined,
        location: noticeType === "EVENT" ? location : undefined,
        metadata: metadataPayload || undefined,
        pinned
      });

      toast.success("Notice published successfully!");
      // Reset form
      setTitle("");
      setContent("");
      setMediaUrl("");
      setEventDate("");
      setLocation("");
      setPinned(false);
      await loadNotices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish notice");
    } finally {
      setSubmitting(false);
      toast.dismiss();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    toast.loading("Deleting notice...");
    try {
      await deleteNotice(id);
      toast.success("Notice deleted successfully");
      await loadNotices();
    } catch (e) {
      toast.error("Failed to delete notice");
    } finally {
      toast.dismiss();
    }
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      await toggleNoticePin(id, !currentPin);
      toast.success(!currentPin ? "Notice pinned to top" : "Notice unpinned");
      await loadNotices();
    } catch (e) {
      toast.error("Failed to update pin status");
    }
  };

  const filteredNotices = notices.filter(n => {
    if (activeTabFilter === "ALL") return true;
    return n.type === activeTabFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Notice & Notes Board Studio"
        subtitle="Create rich announcements, school events, student performance recognition boards, and video spotlights."
      />

      {/* CREATOR STUDIO */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Format Selector Header */}
        <div className="p-6 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
                Admin Notice Studio
              </span>
              <h2 className="text-2xl font-bold mt-2">Create New Board Post</h2>
              <p className="text-sm text-orange-100 mt-1">Select a format below to customize your announcement.</p>
            </div>
            
            {/* Format Tabs */}
            <div className="flex flex-wrap gap-2 bg-black/20 p-1.5 rounded-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setNoticeType("ANNOUNCEMENT")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  noticeType === "ANNOUNCEMENT" ? "bg-white text-orange-600 shadow-sm" : "text-white/80 hover:text-white"
                }`}
              >
                <Megaphone className="w-4 h-4" /> Announcement
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoticeType("EVENT");
                  setTarget("PUBLIC");
                  setCategory("Event");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  noticeType === "EVENT" ? "bg-white text-orange-600 shadow-sm" : "text-white/80 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" /> School Event
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoticeType("PERFORMANCE");
                  setCategory("Academic");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  noticeType === "PERFORMANCE" ? "bg-white text-orange-600 shadow-sm" : "text-white/80 hover:text-white"
                }`}
              >
                <Trophy className="w-4 h-4" /> Student Performance
              </button>
              <button
                type="button"
                onClick={() => {
                  setNoticeType("MEDIA");
                  setMediaType("video");
                  setCategory("Media");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  noticeType === "MEDIA" ? "bg-white text-orange-600 shadow-sm" : "text-white/80 hover:text-white"
                }`}
              >
                <Video className="w-4 h-4" /> Video Spotlight
              </button>
            </div>
          </div>
        </div>

        {/* Creator Form & Live Preview Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <form onSubmit={handleSubmitNotice} className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Notice Title *
                </label>
                <Input
                  required
                  placeholder={
                    noticeType === "EVENT" ? "e.g. Annual Sports Gala 2026" :
                    noticeType === "PERFORMANCE" ? "e.g. Term 1 Top Academic Achievers & Merit Roll" :
                    noticeType === "MEDIA" ? "e.g. School Choir Performance at National Theatre" :
                    "e.g. Mid-Term Break & Fee Payment Guidelines"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="ALL">All (Public Website, Teachers & Students)</option>
                  <option value="PUBLIC">Public Website Only (Parents & Visitors)</option>
                  <option value="STUDENTS">Students Only (Student Dashboard)</option>
                  <option value="TEACHERS">Teachers & Staff Only</option>
                  <option value="S.1A">S.1A Class</option>
                  <option value="S.2B">S.2B Class</option>
                  <option value="S.4 West">S.4 Candidates</option>
                  <option value="S.6 Sci">S.6 Science Stream</option>
                </select>
              </div>
            </div>

            {/* EVENT SPECIFIC FIELDS */}
            {noticeType === "EVENT" && (
              <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-orange-800 font-bold text-sm">
                  <Calendar className="w-4 h-4 text-orange-600" /> Event Details
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Event Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Venue / Location</label>
                    <Input
                      placeholder="e.g. Main Auditorium / Sports Grounds"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO MEDIA SPECIFIC FIELDS */}
            {noticeType === "MEDIA" && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Video className="w-4 h-4 text-blue-600" /> Video Spotlight Details
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Video Stream URL (YouTube, Vimeo, or MP4 link)</label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      setMediaType("video");
                    }}
                  />
                </div>
              </div>
            )}

            {/* STUDENT PERFORMANCE BOARD BUILDER */}
            {noticeType === "PERFORMANCE" && (
              <div className="p-5 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-5">
                <div className="flex items-center justify-between border-b border-amber-200/50 pb-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    Student Academic Recognition & Performance List
                  </div>
                  <span className="text-xs bg-amber-200/60 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                    {studentsList.length} Listed
                  </span>
                </div>

                {/* List of Added Students */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {studentsList.map((stu) => (
                    <div key={stu.id} className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-amber-100 shadow-sm text-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={stu.avatar} 
                          alt={stu.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-amber-300"
                        />
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            {stu.name}
                            <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {stu.class}
                            </span>
                            {stu.status === "top" ? (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Award className="w-3 h-3" /> {stu.badge}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Support Plan
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">Score: <span className="font-semibold text-gray-900">{stu.score}</span> • {stu.remarks}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStudent(stu.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Student Sub-Form */}
                <div className="bg-white/80 p-4 rounded-xl border border-amber-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-amber-600" /> Add Student Record
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <Input
                      placeholder="Student Full Name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Class (e.g. S.2B)"
                      value={newStudent.class}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, class: e.target.value }))}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Score (e.g. 96% / D1)"
                      value={newStudent.score}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, score: e.target.value }))}
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-1">Performance Category</label>
                      <select
                        value={newStudent.status}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="top">🏆 Outperforming / Honor Roll</option>
                        <option value="attention">⚠️ Academic Intervention / Needs Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-600 mb-1">Achievement Distinction / Badge</label>
                      <Input
                        placeholder="e.g. Distinction in Biology / Rank #1"
                        value={newStudent.badge}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, badge: e.target.value }))}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">Profile Photo (Pick sample avatar or paste URL)</label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        {DEFAULT_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewStudent(prev => ({ ...prev, avatar: url }))}
                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                              newStudent.avatar === url ? "border-amber-600 scale-110 shadow" : "border-gray-200 opacity-70"
                            }`}
                          >
                            <img src={url} alt="avatar" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      <Input
                        placeholder="Or custom photo URL"
                        value={newStudent.avatar}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, avatar: e.target.value }))}
                        className="text-xs flex-1"
                      />
                    </div>
                  </div>

                  <Input
                    placeholder="Remarks / Academic Commendation"
                    value={newStudent.remarks}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, remarks: e.target.value }))}
                    className="text-xs"
                  />

                  <Button
                    type="button"
                    onClick={handleAddStudentToBoard}
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
                  >
                    + Add Student to Performance Board
                  </Button>
                </div>
              </div>
            )}

            {/* DESCRIPTION / MESSAGE BODY */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Notice Message / Announcement Content *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write the full announcement or speech / remarks for students, teachers, or parents..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* BANNER / ATTACHED IMAGE (FOR ANNOUNCEMENT & EVENT) */}
            {noticeType !== "MEDIA" && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Attached Banner / Image (Optional)
                </label>
                <div className="flex gap-3 items-center">
                  <Input
                    placeholder="https://images.unsplash.com/... or upload image"
                    value={mediaUrl}
                    onChange={(e) => {
                      setMediaUrl(e.target.value);
                      setMediaType("image");
                    }}
                    className="text-sm"
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium text-xs flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            )}

            {/* CATEGORY & PIN CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Category Badge</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="General">📢 General</option>
                    <option value="Academic">🏆 Academic</option>
                    <option value="Event">📅 Event</option>
                    <option value="Sports">⚽ Sports</option>
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="Celebration">🎉 Celebration</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 mt-4 cursor-pointer text-xs font-bold text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <Pin className="w-3.5 h-3.5 text-orange-600" /> Pin Notice to Top
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 shadow-md hover:shadow-lg transition-all"
              >
                {submitting ? "Publishing..." : "Publish to Board"}
              </Button>
            </div>
          </form>

          {/* LIVE CARD PREVIEW */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-orange-500" /> Live Interactive Preview
            </div>
            
            <div className="flex-1 bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 flex flex-col justify-center">
              {/* Card Container */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative">
                {pinned && (
                  <div className="bg-orange-600 text-white text-[10px] font-bold px-3 py-1 flex items-center justify-between">
                    <span className="flex items-center gap-1"><Pin className="w-3 h-3" /> PINNED NOTICE</span>
                    <span>Target: {target}</span>
                  </div>
                )}

                {/* Banner / Media */}
                {mediaUrl && (
                  <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                    <img 
                      src={mediaUrl} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                      {category || "General"}
                    </span>
                    <span className="text-xs text-gray-400">Today</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg leading-snug">
                    {title || "Notice Title Appears Here"}
                  </h3>

                  {noticeType === "EVENT" && (
                    <div className="p-3 bg-orange-50 rounded-lg text-xs space-y-1.5 text-orange-950 font-medium">
                      {eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-orange-600" />
                          <span>{eventDate}</span>
                        </div>
                      )}
                      {location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {content || "The message description or announcements entered above will display here for teachers, students, and public website visitors."}
                  </p>

                  {/* Performance Showcase in Preview */}
                  {noticeType === "PERFORMANCE" && studentsList.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" /> Top Honor Roll List:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {studentsList.slice(0, 2).map((s) => (
                          <div key={s.id} className="flex items-center gap-2.5 p-2 bg-amber-50/80 rounded-lg border border-amber-200 text-xs">
                            <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 truncate">{s.name} ({s.class})</p>
                              <p className="text-[10px] text-amber-800 font-semibold">{s.badge} • {s.score}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center text-[11px] text-gray-400 mt-3">This preview updates in real time as you edit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE NOTICES LIST & MANAGEMENT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Active Board Notices</h3>
            <p className="text-xs text-gray-500">Currently active school announcements, events, and performance boards.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "ALL", label: "All Formats" },
              { id: "ANNOUNCEMENT", label: "📢 Announcements" },
              { id: "EVENT", label: "📅 Events" },
              { id: "PERFORMANCE", label: "🏆 Performance" },
              { id: "MEDIA", label: "🎥 Video" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveTabFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTabFilter === f.id ? "bg-gray-900 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
            <p className="text-sm">Loading active notices...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            <Bell className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <h4 className="font-bold text-gray-700">No notices in this category</h4>
            <p className="text-xs text-gray-500">Publish a new notice above to make it visible across the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => {
              let parsedStudents: StudentHonorEntry[] = [];
              if (notice.type === "PERFORMANCE" && notice.metadata) {
                try {
                  parsedStudents = JSON.parse(notice.metadata).students || [];
                } catch (e) {}
              }

              return (
                <div 
                  key={notice.id} 
                  className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                    notice.pinned ? "border-orange-300 ring-1 ring-orange-200" : "border-gray-100"
                  }`}
                >
                  {/* Banner / Media */}
                  {notice.mediaUrl && notice.mediaType !== "video" && (
                    <div className="h-40 w-full overflow-hidden bg-gray-100 relative">
                      <img 
                        src={notice.mediaUrl} 
                        alt={notice.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      {notice.pinned && (
                        <div className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          PINNED
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5 flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">
                          {notice.category || notice.type}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          Audience: {notice.target}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{notice.date}</span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-base leading-snug">
                      {notice.title}
                    </h4>

                    {/* EVENT SPECIFIC INFO */}
                    {notice.type === "EVENT" && (notice.eventDate || notice.location) && (
                      <div className="p-2.5 bg-orange-50/70 border border-orange-100 rounded-lg text-xs space-y-1 text-orange-950 font-medium">
                        {notice.eventDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-orange-600" />
                            <span>{notice.eventDate}</span>
                          </div>
                        )}
                        {notice.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-600" />
                            <span>{notice.location}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* MEDIA EMBED OR LINK */}
                    {notice.type === "MEDIA" && notice.mediaUrl && (
                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Video className="w-4 h-4 text-blue-600" /> Video Spotlight
                        </span>
                        <a href={notice.mediaUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline flex items-center gap-1 font-bold">
                          Watch <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {notice.content}
                    </p>

                    {/* PERFORMANCE HONOR CARDS */}
                    {notice.type === "PERFORMANCE" && parsedStudents.length > 0 && (
                      <div className="pt-2 border-t border-gray-100 space-y-1.5">
                        <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-600" /> Top Performer Highlights:
                        </div>
                        <div className="space-y-1">
                          {parsedStudents.slice(0, 3).map((stu) => (
                            <div key={stu.id} className="flex items-center gap-2 p-1.5 bg-amber-50/60 rounded border border-amber-100/80 text-[11px]">
                              <img src={stu.avatar} alt={stu.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="font-bold text-gray-900 truncate">{stu.name}</span>
                              <span className="text-[10px] text-gray-500">({stu.class})</span>
                              <span className="ml-auto font-bold text-amber-900">{stu.score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePin(notice.id, notice.pinned)}
                      className={`text-xs gap-1.5 ${notice.pinned ? "text-orange-600 font-bold" : "text-gray-500"}`}
                    >
                      {notice.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      {notice.pinned ? "Unpin" : "Pin"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notice.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
