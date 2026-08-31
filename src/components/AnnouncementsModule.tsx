import React, { useState } from "react";
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  User,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  X,
  Send,
} from "lucide-react";
import { Announcement } from "../types";

interface AnnouncementsModuleProps {
  announcements: Announcement[];
  onAddAnnouncement: (newAnn: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AnnouncementsModule: React.FC<AnnouncementsModuleProps> = ({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Notice form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState<Announcement["targetAudience"]>("All");
  const [category, setCategory] = useState<Announcement["category"]>("Academic");
  const [priority, setPriority] = useState<Announcement["priority"]>("High");
  const [isPinned, setIsPinned] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAnn: Announcement = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title,
      content,
      postedBy: "Dr. Arvind Ramesh (HOD)",
      date: new Date().toISOString().split("T")[0],
      targetAudience,
      category,
      priority,
      isPinned,
    };

    onAddAnnouncement(newAnn);
    setIsAddModalOpen(false);
    setTitle("");
    setContent("");
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (selectedTarget === "All") return true;
    return a.targetAudience === selectedTarget || a.targetAudience === "All";
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Institutional Announcements & Circulars
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official notices, exam schedules, faculty circulars, and departmental memos.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Target Audience Filters */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(["All", "Faculty", "Students"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTarget(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedTarget === t
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t === "All" ? "All Audiences" : `${t} Notices`}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border transition-all text-xs space-y-3 ${
              ann.isPinned
                ? "bg-amber-50/40 border-amber-200 ring-1 ring-amber-400/30"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {ann.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    <Pin className="w-3 h-3 fill-amber-700" /> Pinned Notice
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {ann.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Audience: {ann.targetAudience}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ann.priority === "Urgent"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : ann.priority === "High"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {ann.priority} Priority
                </span>
              </div>

              <button
                onClick={() => onDeleteAnnouncement(ann.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Archive / Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-sm text-slate-900 leading-tight">{ann.title}</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{ann.content}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Posted by: <strong className="text-slate-700">{ann.postedBy}</strong></span>
              <span>Published on: {ann.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Publish Institutional Notice</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Heading *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Mid-Term Laboratory Examinations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option value="All">All Faculty & Students</option>
                    <option value="Faculty">Faculty Only</option>
                    <option value="Students">Students Only</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Academic</option>
                    <option>Exam</option>
                    <option>Administrative</option>
                    <option>Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Pin to top of noticeboard</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Circular Body / Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter full notice text, guidelines, or venue details..."
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
