import React, { useState } from "react";
import {
  Bell,
  Sparkles,
  Zap,
  ChevronDown,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Menu,
  Check,
  Radio,
} from "lucide-react";
import { UserRole, AppNotification, NotificationItem } from "../types";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: (NotificationItem | AppNotification)[];
  onMarkAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  notifications,
  onMarkAsRead,
  onClearAllNotifications,
  onToggleMobileMenu,
  onNavigate,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scopeFilter, setScopeFilter] = useState<"Global" | "Department">("Global");

  const roles: { role: UserRole; label: string; tag: string; color: string }[] = [
    { role: "faculty", label: "Faculty User", tag: "Course & Lecture Lead", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { role: "hod", label: "HOD", tag: "Department Head", color: "bg-amber-50 text-amber-800 border-amber-200" },
    { role: "admin", label: "Admin", tag: "Dean / System Admin", color: "bg-purple-50 text-purple-700 border-purple-200" },
  ];

  const currentRoleInfo = roles.find((r) => r.role === currentRole) || roles[1];

  const unreadCount = notifications.filter((n) => {
    const notif = n as any;
    return notif.read === false || notif.isRead === false;
  }).length;

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Left Title & Status Pills */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            FaculAI Faculty Portal
          </h1>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Academic Term: <strong className="text-slate-800 font-semibold">Spring 2025</strong> (Week 10)</span>
        </div>
      </div>

      {/* Right Controls & Role Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Scope Pill Toggle */}
        <div className="hidden sm:flex bg-slate-100 rounded-xl p-1 border border-slate-200/60">
          <button
            onClick={() => setScopeFilter("Global")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              scopeFilter === "Global"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setScopeFilter("Department")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              scopeFilter === "Department"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Department
          </button>
        </div>

        {/* AI Quick Trigger Button */}
        <button
          id="btn-nav-ai-chat"
          onClick={() => onNavigate("ai_chat")}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden md:inline">AI Co-Pilot</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-nav-notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            title="Institutional Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">Faculty & Dept Alerts</span>
                <button
                  onClick={onClearAllNotifications}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const notif = n as any;
                    const isRead = notif.read || notif.isRead;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onMarkAsRead(notif.id);
                          if (notif.linkTab) {
                            onNavigate(notif.linkTab);
                            setNotificationsOpen(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1 ${
                          !isRead ? "bg-indigo-50/40" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.timestamp || notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{notif.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-slate-400">No alerts at this time.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              currentRoleInfo.color
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentRoleInfo.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active User Role
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    onRoleChange(r.role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                    currentRole === r.role ? "font-bold text-indigo-600 bg-indigo-50/50" : "text-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.tag}</div>
                  </div>
                  {currentRole === r.role && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Avatar Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-200 shadow-xs flex items-center justify-center text-indigo-700 font-extrabold text-xs">
            {currentRole === "faculty" ? "ER" : currentRole === "hod" ? "AR" : "AD"}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {currentRole === "faculty" ? "Dr. Elena Rostova" : currentRole === "hod" ? "Dr. Arvind Ramesh" : "Dean Office Admin"}
            </p>
            <p className="text-[10px] font-medium text-slate-400">
              {currentRole === "faculty" ? "Associate Professor (CSE)" : currentRole === "hod" ? "HOD Computer Science" : "Academic Directorate"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
