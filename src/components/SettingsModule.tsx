import React, { useState } from "react";
import {
  Settings,
  Shield,
  Users,
  Sparkles,
  Save,
  CheckCircle2,
  Lock,
  Building,
  Sliders,
} from "lucide-react";
import { UserRole } from "../types";

interface SettingsModuleProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [semesterTerm, setSemesterTerm] = useState("Spring 2025 (Even Semester)");
  const [minAttendanceThreshold, setMinAttendanceThreshold] = useState(75);
  const [passingGradeThreshold, setPassingGradeThreshold] = useState(40);
  const [institutionName, setInstitutionName] = useState("Faculty Assistant Institute of Technology & Science");
  const [aiModel, setAiModel] = useState("gemini-2.5-flash");
  const [autoAttendanceNotice, setAutoAttendanceNotice] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            System Configuration & Role Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic calendar parameters, RBAC permissions, attendance thresholds, and Gemini AI engine controls.
          </p>
        </div>

        {saveSuccess && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> System settings updated!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: User & Role Switching (Simulate Multi-Role Access) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Role-Based Access Control (RBAC)</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Active Role: {currentRole}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { role: "admin" as UserRole, label: "Dean / System Admin", desc: "Full administrative, faculty, and institutional policy access" },
              { role: "hod" as UserRole, label: "Head of Department (HOD)", desc: "Departmental syllabus approval, workload review, and requisitions" },
              { role: "faculty" as UserRole, label: "Faculty Professor", desc: "Lecture planner, assessment generator, grading, and MoM transcribing" },
              { role: "student" as UserRole, label: "Student View", desc: "Enrolled courses, attendance tracker, and student AI chatbot" },
            ].map((item) => (
              <div
                key={item.role}
                onClick={() => onRoleChange(item.role)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  currentRole === item.role
                    ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.label}</span>
                  {currentRole === item.role && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Academic Calendar & Policies */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Academic Parameters & Regulations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Institution Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Academic Year & Session</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Active Term</label>
              <input
                type="text"
                value={semesterTerm}
                onChange={(e) => setSemesterTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Mandatory Attendance Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={90}
                value={minAttendanceThreshold}
                onChange={(e) => setMinAttendanceThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card 3: AI Engine Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Google Gemini AI Engine Integration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gemini AI Model Alias</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-fast multimodal, recommended for real-time assistant)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep reasoning for complex accreditation matrices)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAttendanceNotice}
                  onChange={(e) => setAutoAttendanceNotice(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Enable automatic low attendance notice drafts to parents</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
