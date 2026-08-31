import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  BellRing,
  BarChart3,
  Settings,
  Sparkles,
  FileText,
  Mic,
  MessageSquare,
  CheckSquare,
  FileSpreadsheet,
  X,
  Bot,
  Zap,
} from "lucide-react";

export type TabType =
  | "dashboard"
  | "faculty"
  | "students"
  | "courses"
  | "ai_planner"
  | "ai_assessment"
  | "ai_chat"
  | "ai_meeting"
  | "collaboration"
  | "tasks"
  | "attendance"
  | "assignments"
  | "announcements"
  | "requests"
  | "reports"
  | "settings"
  | "lecture-planner"
  | "assessment-gen"
  | "meeting-mom";

interface SidebarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  setActiveTab?: (tab: any) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  pendingTasksCount?: number;
  pendingRequestsCount?: number;
  lowAttendanceCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  setActiveTab,
  isMobileOpen = false,
  onCloseMobile,
  pendingTasksCount = 4,
  pendingRequestsCount = 2,
  lowAttendanceCount = 2,
}) => {
  const handleSelect = (tabId: string) => {
    if (onTabChange) onTabChange(tabId);
    if (setActiveTab) setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const isCurrent = (id: string, altId?: string) => {
    return activeTab === id || (altId && activeTab === altId);
  };

  const coreNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "faculty", label: "Faculty", icon: Users },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "courses", label: "Courses", icon: BookOpen },
    {
      id: "attendance",
      label: "Attendance",
      icon: ClipboardCheck,
      badge: lowAttendanceCount > 0 ? `${lowAttendanceCount} Alert` : undefined,
      badgeColor: "bg-rose-100 text-rose-700 border border-rose-200",
    },
    { id: "assignments", label: "Assignments", icon: FileCheck2 },
    {
      id: "tasks",
      label: "Tasks & Milestones",
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    },
  ];

  const aiIntelligenceItems = [
    { id: "ai_planner", altId: "lecture-planner", label: "AI Lecture Planner", icon: Sparkles, tag: "CO-PO" },
    { id: "ai_assessment", altId: "assessment-gen", label: "AI Assessment Gen", icon: FileText, tag: "Bloom's" },
    { id: "ai_meeting", altId: "meeting-mom", label: "AI Meeting Assistant", icon: Mic, tag: "MoM" },
    { id: "ai_chat", label: "AI Academic Advisor", icon: Bot, tag: "Chat" },
    { id: "collaboration", label: "Faculty Hub", icon: MessageSquare, tag: "Sync" },
  ];

  const adminNavItems = [
    {
      id: "requests",
      altId: "announcements",
      label: "Requisitions & Leaves",
      icon: BellRing,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    },
    { id: "reports", label: "Institutional Reports", icon: BarChart3 },
    { id: "settings", label: "Settings & Config", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-900 border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div
          onClick={() => handleSelect("dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">FaculAI</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                OS
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-400">Bento Academic Suite</p>
          </div>
        </div>

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Core Modules */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          <div className="space-y-1">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.id);
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    active
                      ? "bg-indigo-50 text-indigo-700 rounded-xl font-bold border border-indigo-100 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-indigo-600 font-bold" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Academic Engines (Bento Pill Highlight) */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Bento Engines
            </span>
          </div>
          <div className="space-y-1">
            {aiIntelligenceItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.id, item.altId);
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    active
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-indigo-600 font-bold" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        active
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin & Reports */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Administration
          </div>
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrent(item.id, item.altId);
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    active
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-indigo-600 font-bold" : "text-slate-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bento Bottom System Health Card */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">System Health</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-100">99.98% Up • Gemini 3.7</span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:block h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
