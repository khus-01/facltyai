import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Users,
  Clock,
  MapPin,
  FileText,
  Upload,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  FileCode,
  Download,
  Share2,
} from "lucide-react";
import { Course, CourseOutcome, TeachingMaterial } from "../types";

interface CourseManagementProps {
  courseList: Course[];
  onSelectCourseForPlanner: (course: Course) => void;
  onAddMaterial: (courseId: string, material: TeachingMaterial) => void;
}

export const CourseManagement: React.FC<CourseManagementProps> = ({
  courseList,
  onSelectCourseForPlanner,
  onAddMaterial,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>(courseList[0] || null);
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "copo" | "materials">("overview");

  // Material upload state
  const [isUploading, setIsUploading] = useState(false);
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialType, setNewMaterialType] = useState<TeachingMaterial["type"]>("PDF Notes");
  const [newMaterialUnit, setNewMaterialUnit] = useState("Unit 3");

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !selectedCourse) return;

    const newMat: TeachingMaterial = {
      id: `MAT-${Date.now().toString().slice(-4)}`,
      title: newMaterialTitle,
      unit: newMaterialUnit,
      type: newMaterialType,
      url: "#",
      uploadDate: new Date().toISOString().split("T")[0],
      fileSize: "2.8 MB",
    };

    onAddMaterial(selectedCourse.id, newMat);
    setNewMaterialTitle("");
    setIsUploading(false);
  };

  const poHeaders = ["PO1", "PO2", "PO3", "PO4", "PO5", "PSO1", "PSO2"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Course Curriculum & Materials
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Course structures, syllabus coverage milestones, Outcome-Based CO–PO mapping, and learning resources.
          </p>
        </div>

        <button
          onClick={() => onSelectCourseForPlanner(selectedCourse)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Lecture Planner for {selectedCourse?.code || "Course"}</span>
        </button>
      </div>

      {/* Main Course Selector & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Course Catalog List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Courses ({courseList.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {courseList.map((c) => {
              const isSelected = selectedCourse?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{c.syllabusCoveragePercent}% Covered</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1">{c.name}</h3>
                  <p className="text-[11px] text-slate-500 mb-2">{c.department}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <span>{c.facultyName}</span>
                    <span className="font-semibold text-indigo-600">{c.credits} Credits</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Course Workspace */}
        {selectedCourse && (
          <div className="lg:col-span-2 space-y-5">
            {/* Active Course Card Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-600 text-white">
                      {selectedCourse.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Semester {selectedCourse.semester}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedCourse.name}</h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">{selectedCourse.description}</p>
                </div>

                <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {selectedCourse.completedLectures} of {selectedCourse.targetLectures} Lectures Delivered
                  </span>
                  <span className="text-[11px] text-slate-500">{selectedCourse.enrolledStudentsCount} Students Enrolled</span>
                </div>
              </div>

              {/* Schedule & Room info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCourse.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCourse.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCourse.facultyName}</span>
                </div>
              </div>

              {/* Subtabs selector */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveSubTab("overview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeSubTab === "overview"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Syllabus Breakdown
                </button>
                <button
                  onClick={() => setActiveSubTab("copo")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeSubTab === "copo"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  CO–PO Attainment Matrix
                </button>
                <button
                  onClick={() => setActiveSubTab("materials")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === "materials"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>Materials & Notes</span>
                  <span className="text-[10px] px-1.5 rounded-full bg-slate-200 text-slate-800">
                    {selectedCourse.materials?.length || 0}
                  </span>
                </button>
              </div>
            </div>

            {/* SubTab 1: Syllabus Breakdown */}
            {activeSubTab === "overview" && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Course Outcome (CO) Statements</h3>
                  <span className="text-xs text-indigo-600 font-semibold">Bloom's Mapped</span>
                </div>

                <div className="space-y-3">
                  {selectedCourse.coList && selectedCourse.coList.length > 0 ? (
                    selectedCourse.coList.map((co) => (
                      <div key={co.code} className="p-3 rounded-lg bg-slate-50 border border-slate-150 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-indigo-700 font-mono">{co.code}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Bloom's: {co.bloomsLevel}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{co.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No Course Outcomes configured yet. Use the AI Lecture Planner to automatically generate them.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SubTab 2: Outcome-Based CO-PO Attainment Matrix */}
            {activeSubTab === "copo" && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Outcome Mapping Correlation Matrix</h3>
                    <p className="text-xs text-slate-500">
                      Correlation Scale: 3 = High, 2 = Medium, 1 = Low, - = No direct mapping
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-3 py-2.5 text-left">Course Outcome</th>
                        <th className="px-3 py-2.5">Bloom's Level</th>
                        {poHeaders.map((po) => (
                          <th key={po} className="px-3 py-2.5">{po}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCourse.coList.map((co) => (
                        <tr key={co.code} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-left font-bold text-indigo-700 font-mono">{co.code}</td>
                          <td className="px-3 py-2.5 font-semibold text-purple-700">{co.bloomsLevel}</td>
                          {poHeaders.map((po) => {
                            const val = co.poMappings[po];
                            return (
                              <td key={po} className="px-3 py-2.5">
                                {val ? (
                                  <span
                                    className={`inline-block w-6 h-6 leading-6 rounded-md font-bold text-xs ${
                                      val === 3
                                        ? "bg-indigo-600 text-white"
                                        : val === 2
                                        ? "bg-indigo-200 text-indigo-900"
                                        : "bg-indigo-50 text-indigo-700"
                                    }`}
                                  >
                                    {val}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SubTab 3: Teaching Materials Repository */}
            {activeSubTab === "materials" && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Course Materials & Reference Notes</h3>
                    <p className="text-xs text-slate-500">Digital lecture notes, code repositories, and slide decks</p>
                  </div>
                  <button
                    onClick={() => setIsUploading(!isUploading)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Material</span>
                  </button>
                </div>

                {/* Upload Material Drawer/Form */}
                {isUploading && (
                  <form onSubmit={handleUploadSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-slate-700 block mb-1">Resource Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Unit 4 Graph Search Algorithms Practice Notebook"
                          value={newMaterialTitle}
                          onChange={(e) => setNewMaterialTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Material Type</label>
                        <select
                          value={newMaterialType}
                          onChange={(e) => setNewMaterialType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        >
                          <option>PDF Notes</option>
                          <option>Slides</option>
                          <option>Code Repository</option>
                          <option>Video Lecture</option>
                          <option>Lab Manual</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsUploading(false)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                      >
                        Save Material
                      </button>
                    </div>
                  </form>
                )}

                {/* Materials List */}
                <div className="space-y-2.5">
                  {selectedCourse.materials && selectedCourse.materials.length > 0 ? (
                    selectedCourse.materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{mat.title}</p>
                            <p className="text-[11px] text-slate-500">
                              {mat.unit} • {mat.type} • {mat.fileSize} • Uploaded {mat.uploadDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`Downloading ${mat.title}...`)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No materials uploaded yet. Click "Upload Material" to attach lecture slides or lab guides.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
