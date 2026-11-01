"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { Plus, Trash2, Music, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMediaContent, addMediaItem, deleteMediaItem, addEvent, deleteEvent, uploadFile } from "../../../actions";
import { toast } from "sonner";

export default function MediaManagerPage() {
  const [data, setData] = useState<{ songs: any[], videos: any[], events: any[] } | null>(null);
  
  // Forms
  const [newSong, setNewSong] = useState({ title: "", artist: "", duration: "", size: "", quality: "", cover: "", category: "choir", format: "song" });
  const [newVideo, setNewVideo] = useState({ title: "", duration: "", cover: "", category: "Campus", format: "video" });
  const [newEvent, setNewEvent] = useState({ title: "", date: "", cover: "", desc: "" });

  const loadData = async () => {
    const res = await getMediaContent();
    setData(res);
  };

  useEffect(() => { loadData(); }, []);

  if (!data) return <div className="p-8 text-center text-muted-foreground">Loading Media...</div>;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, setter: any, state: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const toastId = toast.loading("Uploading file...");
    try {
      const url = await uploadFile(formData);
      setter({ ...state, [field]: url });
      toast.success("File uploaded!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed.", { id: toastId });
    }
  };

  const handleAddSong = async () => {
    if (!newSong.title || !newSong.cover) return toast.error("Title and cover URL are required.");
    await addMediaItem(newSong);
    toast.success("Song added!");
    setNewSong({ title: "", artist: "", duration: "", size: "", quality: "", cover: "", category: "choir", format: "song" });
    loadData();
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.cover) return toast.error("Title and cover URL are required.");
    await addMediaItem(newVideo);
    toast.success("Video added!");
    setNewVideo({ title: "", duration: "", cover: "", category: "Campus", format: "video" });
    loadData();
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return toast.error("Title and date are required.");
    await addEvent(newEvent);
    toast.success("Event added!");
    setNewEvent({ title: "", date: "", cover: "", desc: "" });
    loadData();
  };

  const handleDeleteMedia = async (id: string) => {
    await deleteMediaItem(id);
    toast.success("Item deleted");
    loadData();
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id);
    toast.success("Event deleted");
    loadData();
  };

  return (
    <>
      <PageHeader title="Media & Events Manager" subtitle="Manage songs, videos, and events dynamically" />

      <div className="grid gap-8 mt-6">
        {/* SONGS */}
        <section className="p-6 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Music className="size-5 text-primary" />
            <h3 className="font-display text-xl font-semibold">Songs</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-secondary/30 rounded-xl border">
            <div><Label>Title</Label><Input value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} /></div>
            <div><Label>Artist</Label><Input value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} /></div>
            <div className="col-span-2">
              <Label>Cover Image URL (or Upload)</Label>
              <div className="flex gap-2">
                <Input value={newSong.cover} onChange={e => setNewSong({...newSong, cover: e.target.value})} placeholder="Enter URL" />
                <Input type="file" className="w-64 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "cover", setNewSong, newSong)} />
              </div>
            </div>
            <div><Label>Duration (e.g. 3:24)</Label><Input value={newSong.duration} onChange={e => setNewSong({...newSong, duration: e.target.value})} /></div>
            <div className="md:col-span-2">
              <Button onClick={handleAddSong} className="mt-2"><Plus className="size-4 mr-2" /> Add Song</Button>
            </div>
          </div>

          <div className="space-y-3">
            {data.songs.map((song) => (
              <div key={song.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-secondary/20">
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-muted-foreground">{song.artist} • {song.duration}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteMedia(song.id)}><Trash2 className="size-4" /></Button>
              </div>
            ))}
          </div>
        </section>

        {/* VIDEOS */}
        <section className="p-6 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Video className="size-5 text-primary" />
            <h3 className="font-display text-xl font-semibold">Videos</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-secondary/30 rounded-xl border">
            <div><Label>Title</Label><Input value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} /></div>
            <div><Label>Category</Label><Input value={newVideo.category} onChange={e => setNewVideo({...newVideo, category: e.target.value})} /></div>
            <div className="col-span-2">
              <Label>Cover Image URL (or Upload)</Label>
              <div className="flex gap-2">
                <Input value={newVideo.cover} onChange={e => setNewVideo({...newVideo, cover: e.target.value})} placeholder="Enter URL" />
                <Input type="file" className="w-64 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "cover", setNewVideo, newVideo)} />
              </div>
            </div>
            <div><Label>Duration (e.g. 45:00)</Label><Input value={newVideo.duration} onChange={e => setNewVideo({...newVideo, duration: e.target.value})} /></div>
            <div className="md:col-span-2">
              <Button onClick={handleAddVideo} className="mt-2"><Plus className="size-4 mr-2" /> Add Video</Button>
            </div>
          </div>

          <div className="space-y-3">
            {data.videos.map((vid) => (
              <div key={vid.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-secondary/20">
                <div>
                  <p className="font-medium">{vid.title}</p>
                  <p className="text-sm text-muted-foreground">{vid.category} • {vid.duration}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteMedia(vid.id)}><Trash2 className="size-4" /></Button>
              </div>
            ))}
          </div>
        </section>

        {/* EVENTS */}
        <section className="p-6 rounded-2xl bg-card border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="size-5 text-primary" />
            <h3 className="font-display text-xl font-semibold">Events</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-secondary/30 rounded-xl border">
            <div><Label>Event Title</Label><Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} /></div>
            <div><Label>Date String (e.g. SEP 15)</Label><Input value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} /></div>
            <div className="col-span-2">
              <Label>Cover Image URL (or Upload)</Label>
              <div className="flex gap-2">
                <Input value={newEvent.cover} onChange={e => setNewEvent({...newEvent, cover: e.target.value})} placeholder="Enter URL" />
                <Input type="file" className="w-64 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, "cover", setNewEvent, newEvent)} />
              </div>
            </div>
            <div><Label>Description</Label><Input value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} /></div>
            <div className="md:col-span-2">
              <Button onClick={handleAddEvent} className="mt-2"><Plus className="size-4 mr-2" /> Add Event</Button>
            </div>
          </div>

          <div className="space-y-3">
            {data.events.map((ev) => (
              <div key={ev.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-secondary/20">
                <div>
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-sm text-muted-foreground">{ev.date} • {ev.desc}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteEvent(ev.id)}><Trash2 className="size-4" /></Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

