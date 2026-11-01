"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/Widgets";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGalleryItems, addGalleryItem, deleteGalleryItem, uploadFile } from "../../../actions";
import { toast } from "sonner";
import Image from "next/image";

export default function GalleryManagerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newItem, setNewItem] = useState({ src: "", alt: "", caption: "", category: "All" });

  const loadData = async () => {
    const res = await getGalleryItems();
    setItems(res);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const toastId = toast.loading("Uploading image...");
    try {
      const url = await uploadFile(formData);
      setNewItem({ ...newItem, src: url });
      toast.success("Image uploaded!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed.", { id: toastId });
    }
  };

  const handleAdd = async () => {
    if (!newItem.src || !newItem.alt) return toast.error("Image URL and Alt text are required.");
    await addGalleryItem(newItem);
    toast.success("Image added to gallery!");
    setNewItem({ src: "", alt: "", caption: "", category: "All" });
    loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteGalleryItem(id);
    toast.success("Image deleted");
    loadData();
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading Gallery...</div>;

  return (
    <>
      <PageHeader title="Gallery Manager" subtitle="Manage photos displayed in the public gallery" />

      <section className="p-6 rounded-2xl bg-card border shadow-sm mt-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="size-5 text-primary" />
          <h3 className="font-display text-xl font-semibold">Upload & Manage Images</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8 p-4 bg-secondary/30 rounded-xl border">
          <div className="col-span-2">
            <Label>Image URL (or Upload)</Label>
            <div className="flex gap-2">
              <Input value={newItem.src} onChange={e => setNewItem({...newItem, src: e.target.value})} placeholder="Enter URL" />
              <Input type="file" className="w-64 cursor-pointer" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>
          <div><Label>Alt Text</Label><Input value={newItem.alt} onChange={e => setNewItem({...newItem, alt: e.target.value})} /></div>
          <div><Label>Caption</Label><Input value={newItem.caption} onChange={e => setNewItem({...newItem, caption: e.target.value})} /></div>
          <div><Label>Category</Label><Input value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} /></div>
          <div className="md:col-span-2">
            <Button onClick={handleAdd} className="mt-2"><Plus className="size-4 mr-2" /> Add to Gallery</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.id} className="relative group rounded-xl overflow-hidden border bg-background aspect-square">
              <img src={it.src} alt={it.alt} className="size-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="text-white text-xs">
                  <p className="font-bold truncate">{it.alt}</p>
                  <p className="text-white/80 truncate">{it.category}</p>
                </div>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(it.id)}>
                  <Trash2 className="size-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-center p-8 text-muted-foreground border border-dashed rounded-xl">No images in the gallery yet.</div>}
        </div>
      </section>
    </>
  );
}

