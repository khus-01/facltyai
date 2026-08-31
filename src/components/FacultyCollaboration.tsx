import React, { useState } from "react";
import {
  Users2,
  MessageSquare,
  Share2,
  Calendar,
  FolderSync,
  Upload,
  Plus,
  Send,
  Download,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { FacultyMember } from "../types";

interface FacultyCollaborationProps {
  facultyList: FacultyMember[];
}

export const FacultyCollaboration: React.FC<FacultyCollaborationProps> = ({ facultyList }) => {
  const [activeTab, setActiveTab] = useState<"forums" | "resources" | "coteaching">("forums");
  const [selectedChannel, setSelectedChannel] = useState("Curriculum Modernization");

  // Chat/Forum messages
  const [forumMessages, setForumMessages] = useState<
    { id: string; channel: string; author: string; role: string; text: string; time: string; tags?: string[] }[]
  >([
    {
      id: "fm-1",
      channel: "Curriculum Modernization",
      author: "Dr. Arvind Ramesh",
      role: "HOD - Computer Science",
      text: "Please review the proposed 2025 Autonomous Syllabus draft for CS301 (Algorithms). We are incorporating 2 weeks of GPU-accelerated parallel computing and dynamic programming benchmarks.",
      time: "Today at 9:15 AM",
      tags: ["CS301", "Syllabus Review"],
    },
    {
      id: "fm-2",
      channel: "Curriculum Modernization",
      author: "Prof. Marcus Vance",
      role: "Associate Professor",
      text: "I reviewed the draft. I recommend aligning Unit 3 with the new AI Question Bank generator so students get hands-on experience with automated test cases.",
      time: "Today at 10:04 AM",
      tags: ["Assessment", "Feedback"],
    },
    {
      id: "fm-3",
      channel: "ABET & NBA Accreditation Audit",
      author: "Dr. Elena Rostova",
      role: "Associate Professor",
      text: "All faculty must verify their CO-PO Direct Attainment matrices in the course file by Friday. Please ensure Bloom's level distribution matches the revised criteria.",
      time: "Yesterday at 4:30 PM",
      tags: ["NBA Audit", "Compliance"],
    },
    {
      id: "fm-4",
      channel: "Research Publications & Grants",
      author: "Dr. Priya Sundaram",
      role: "Assistant Professor",
      text: "The NSF Collaborative Research Grant deadline is approaching. If any faculty member wants to co-author on Foundation Models in Embedded Systems, let me know.",
      time: "Oct 12 at 2:00 PM",
      tags: ["Grant", "NSF"],
    },
  ]);

  const [newMsgText, setNewMsgText] = useState("");

  // Shared teaching resources
  const [resources, setResources] = useState([
    {
      id: "res-1",
      title: "Advanced Algorithms LaTeX Slides & Beamer Deck",
      course: "CS301",
      contributor: "Dr. Arvind Ramesh",
      type: "Presentation Slides",
      size: "14.2 MB",
      date: "2025-03-01",
    },
    {
      id: "res-2",
      title: "PyTorch Deep Learning Lab Experiments Manual (Jupyter)",
      course: "AI402",
      contributor: "Prof. Marcus Vance",
      type: "Lab Codebook",
      size: "6.8 MB",
      date: "2025-03-10",
    },
    {
      id: "res-3",
      title: "NBA Tier-1 Course File Documentation Template & Rubrics",
      course: "General",
      contributor: "Dr. Elena Rostova",
      type: "Compliance PDF",
      size: "2.1 MB",
      date: "2025-03-14",
    },
  ]);

  // Co-teaching schedule
  const [coTeachingEvents, setCoTeachingEvents] = useState([
    {
      id: "ct-1",
      course: "CS301 - Design & Analysis of Algorithms",
      topic: "Quantum & Parallel Graph Algorithms",
      primaryFaculty: "Dr. Arvind Ramesh",
      guestFaculty: "Dr. Priya Sundaram",
      date: "2025-04-14",
      time: "10:30 AM - 12:30 PM",
      room: "Hall 304",
      status: "Confirmed",
    },
    {
      id: "ct-2",
      course: "AI402 - Machine Learning Foundations",
      topic: "Hardware Accelerators for Deep Neural Networks",
      primaryFaculty: "Prof. Marcus Vance",
      guestFaculty: "Dr. Arvind Ramesh",
      date: "2025-04-20",
      time: "2:00 PM - 4:00 PM",
      room: "Seminar Complex A",
      status: "Scheduled",
    },
  ]);

  const channels = [
    "Curriculum Modernization",
    "ABET & NBA Accreditation Audit",
    "Research Publications & Grants",
    "Final Year Capstone Mentorship",
    "Exam Moderation Committee",
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const newMsg = {
      id: `fm-${Date.now()}`,
      channel: selectedChannel,
      author: "Dr. Elena Rostova",
      role: "Faculty Member",
      text: newMsgText,
      time: "Just now",
      tags: [selectedChannel.split(" ")[0]],
    };

    setForumMessages((prev) => [...prev, newMsg]);
    setNewMsgText("");
  };

  const filteredMessages = forumMessages.filter((m) => m.channel === selectedChannel);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[10px] uppercase tracking-wider">
              Objective 5
            </span>
            <span className="text-xs text-slate-500 font-semibold">Faculty Collaboration Network</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="w-5 h-5 text-teal-600" />
            Faculty-to-Faculty Collaboration & Co-Teaching
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-departmental academic forums, shared teaching material repositories, and cross-course co-teaching schedules.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("forums")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "forums" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussion Channels</span>
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "resources" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderSync className="w-3.5 h-3.5" />
            <span>Shared Vault</span>
          </button>
          <button
            onClick={() => setActiveTab("coteaching")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "coteaching" ? "bg-white text-purple-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Co-Teaching Schedule</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Discussion Forums */}
      {activeTab === "forums" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Channels List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
              Department Collaboration Channels
            </span>

            <div className="space-y-1.5">
              {channels.map((ch) => {
                const count = forumMessages.filter((m) => m.channel === ch).length;
                return (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedChannel === ch
                        ? "bg-teal-50 border-teal-300 text-teal-900 font-bold ring-2 ring-teal-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span># {ch}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Thread (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs h-[540px]">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs"># {selectedChannel}</h3>
                <p className="text-[11px] text-slate-500">Collaborative faculty deliberations and peer reviews</p>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Departmental Channel
              </span>
            </div>

            {/* Messages stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{m.author}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-200/70 px-1.5 py-0.2 rounded font-medium">
                          {m.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{m.time}</span>
                    </div>

                    <p className="text-slate-800 leading-relaxed">{m.text}</p>

                    {m.tags && (
                      <div className="flex gap-1 pt-1">
                        {m.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No messages in this channel yet. Post the first update or agenda item below!
                </div>
              )}
            </div>

            {/* Post Input */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder={`Post message to #${selectedChannel}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20"
                />
                <button
                  type="submit"
                  disabled={!newMsgText.trim()}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Shared Resources Vault */}
      {activeTab === "resources" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Faculty Shared Academic Vault</h3>
              <p className="text-slate-500 text-xs">Cross-course lecture decks, lab manuals, LaTeX problem banks, and templates</p>
            </div>
            <button
              onClick={() => alert("Upload resource dialog...")}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Contribute Resource</span>
            </button>
          </div>

          <div className="space-y-3">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                    <p className="text-slate-500 text-[11px]">
                      Course: <strong className="text-slate-700">{res.course}</strong> • Contributed by{" "}
                      <strong className="text-indigo-600">{res.contributor}</strong> • {res.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {res.type}
                  </span>
                  <button
                    onClick={() => alert(`Downloading ${res.title}...`)}
                    className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer"
                    title="Download Resource"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Co-Teaching Schedule */}
      {activeTab === "coteaching" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Inter-Departmental Co-Teaching & Guest Lectures</h3>
              <p className="text-slate-500 text-xs">Specialized guest faculty sessions across parallel divisions</p>
            </div>
            <button
              onClick={() => alert("Schedule co-teaching slot modal...")}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coTeachingEvents.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl border border-purple-150 bg-purple-50/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900">{evt.course}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {evt.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{evt.topic}</h4>

                <div className="space-y-1 text-[11px] text-slate-600">
                  <p>
                    Primary Faculty: <strong>{evt.primaryFaculty}</strong>
                  </p>
                  <p>
                    Guest Specialist: <strong className="text-purple-700">{evt.guestFaculty}</strong>
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date} • {evt.time} • Room {evt.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
