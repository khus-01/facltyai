import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Kanban,
  SlidersHorizontal,
  X,
  Paperclip,
  UploadCloud,
  FileCheck,
  RotateCcw,
  MessageSquare,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { AcademicTask, FacultyMember, TaskDeliverable, UserRole } from "../types";

interface TaskManagementProps {
  tasks: AcademicTask[];
  facultyList: FacultyMember[];
  currentRole?: UserRole;
  onAddTask: (newTask: AcademicTask) => void;
  onUpdateTaskStatus: (taskId: string, status: AcademicTask["status"], progressPercent?: number) => void;
  onUpdateTaskDeliverable?: (taskId: string, deliverable: TaskDeliverable, newStatus?: AcademicTask["status"]) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  facultyList,
  currentRole = "faculty",
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskDeliverable,
}) => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assignedToMe" | "assignedByMe">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Deliverable Submission Modal State
  const [submittingTask, setSubmittingTask] = useState<AcademicTask | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFileName, setSubmissionFileName] = useState("Course_File_Audit_Artifacts_V1.pdf");
  const [submissionProgress, setSubmissionProgress] = useState(100);

  // Deliverable Review Modal State
  const [reviewingTask, setReviewingTask] = useState<AcademicTask | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");

  // New task form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Assessment Prep" as AcademicTask["category"],
    assigneeName: facultyList[0]?.name || "Dr. Arvind Ramesh",
    assignedBy: "Dr. Arvind Ramesh (HOD)",
    deadline: "2025-04-15",
    priority: "High" as AcademicTask["priority"],
    relatedCourseCode: "CS301",
  });

  const categories = ["All", "Syllabus Coverage", "Assessment Prep", "Accreditation", "Grading", "Administrative"];

  const currentFacultyName = "Dr. Elena Rostova"; // Current signed-in faculty

  const filteredTasks = tasks.filter((t) => {
    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
    let matchesAssignment = true;
    if (assignmentFilter === "assignedToMe") {
      matchesAssignment = t.assigneeName.includes("Elena") || t.assigneeName.includes("Rostova");
    } else if (assignmentFilter === "assignedByMe") {
      matchesAssignment = (t.assignedBy || "").includes("Arvind") || (t.assignedBy || "").includes("Elena");
    }
    return matchesCat && matchesAssignment;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask: AcademicTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      assigneeName: formData.assigneeName,
      assignedBy: formData.assignedBy || "Dr. Arvind Ramesh (HOD)",
      deadline: formData.deadline,
      priority: formData.priority,
      status: "To Do",
      progressPercent: 0,
      relatedCourseCode: formData.relatedCourseCode,
    };

    onAddTask(newTask);
    setIsAddModalOpen(false);
    setFormData({
      title: "",
      description: "",
      category: "Assessment Prep",
      assigneeName: facultyList[0]?.name || "Dr. Arvind Ramesh",
      assignedBy: "Dr. Arvind Ramesh (HOD)",
      deadline: "2025-04-15",
      priority: "High",
      relatedCourseCode: "CS301",
    });
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;

    const deliverable: TaskDeliverable = {
      submittedAt: new Date().toISOString().split("T")[0] + " 11:30 AM",
      submittedBy: submittingTask.assigneeName,
      fileName: submissionFileName || "Deliverable_Attachment.pdf",
      fileUrl: "#",
      notes: submissionNotes || "Attached complete work output and audit evidence for departmental evaluation.",
      status: "Submitted",
    };

    if (onUpdateTaskDeliverable) {
      onUpdateTaskDeliverable(submittingTask.id, deliverable, "Review");
    } else {
      onUpdateTaskStatus(submittingTask.id, "Review", submissionProgress);
    }

    setSubmittingTask(null);
    setSubmissionNotes("");
  };

  const handleReviewAction = (action: "Approve" | "Request Revisions") => {
    if (!reviewingTask || !reviewingTask.deliverable) return;

    const updatedDeliverable: TaskDeliverable = {
      ...reviewingTask.deliverable,
      status: action === "Approve" ? "Approved" : "Revisions Requested",
      reviewRemarks: reviewRemarks || (action === "Approve" ? "Approved as per departmental accreditation standards." : "Please revise section 3."),
    };

    if (onUpdateTaskDeliverable) {
      onUpdateTaskDeliverable(
        reviewingTask.id,
        updatedDeliverable,
        action === "Approve" ? "Completed" : "In Progress"
      );
    } else {
      onUpdateTaskStatus(
        reviewingTask.id,
        action === "Approve" ? "Completed" : "In Progress",
        action === "Approve" ? 100 : 50
      );
    }

    setReviewingTask(null);
    setReviewRemarks("");
  };

  const columns: AcademicTask["status"][] = ["To Do", "In Progress", "Review", "Completed"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[10px] uppercase tracking-wider">
              Objective 6: Peer & Hierarchical Task Operations
            </span>
            <span className="text-xs text-slate-500 font-semibold">Deliverables & Review Approvals</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-600" />
            Academic Task Delegation & Deliverable Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign duties across faculty, upload verified task deliverables/documents, and perform peer or HOD review workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === "kanban" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title="List View"
            >
              <ListTodo className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Delegate New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Role Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Assignment Scope Filter */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAssignmentFilter("all")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              assignmentFilter === "all" ? "bg-amber-100 text-amber-900 font-extrabold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setAssignmentFilter("assignedToMe")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              assignmentFilter === "assignedToMe" ? "bg-amber-100 text-amber-900 font-extrabold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Assigned to Me
          </button>
          <button
            onClick={() => setAssignmentFilter("assignedByMe")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              assignmentFilter === "assignedByMe" ? "bg-amber-100 text-amber-900 font-extrabold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Delegated by Me
          </button>
        </div>
      </div>

      {/* View Mode: Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col);
            return (
              <div key={col} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        col === "Completed"
                          ? "bg-emerald-500"
                          : col === "In Progress"
                          ? "bg-blue-500"
                          : col === "Review"
                          ? "bg-purple-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {col}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {t.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            t.priority === "Urgent"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : t.priority === "High"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{t.title}</h4>
                      <p className="text-slate-500 text-[11px] line-clamp-2">{t.description}</p>

                      {/* Delegator & Assignee */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-500">
                            <User className="w-3 h-3 text-slate-400" />
                            <strong className="text-slate-700">To:</strong> {t.assigneeName.split(" ")[1] || t.assigneeName}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {t.deadline}
                          </span>
                        </div>
                        {t.assignedBy && (
                          <span className="text-[10px] text-slate-400">
                            From: <span className="font-semibold text-slate-600">{t.assignedBy}</span>
                          </span>
                        )}
                      </div>

                      {/* Deliverable Badge & Actions */}
                      {t.deliverable ? (
                        <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-200 text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-bold text-indigo-900">
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3 text-indigo-600" /> Deliverable Uploaded
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              t.deliverable.status === "Approved" ? "bg-emerald-200 text-emerald-900" :
                              t.deliverable.status === "Revisions Requested" ? "bg-rose-200 text-rose-900" :
                              "bg-purple-200 text-purple-900"
                            }`}>
                              {t.deliverable.status}
                            </span>
                          </div>
                          <p className="text-indigo-800 text-[10px] truncate">{t.deliverable.fileName}</p>

                          <button
                            onClick={() => {
                              setReviewingTask(t);
                              setReviewRemarks(t.deliverable?.reviewRemarks || "");
                            }}
                            className="w-full mt-1 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileCheck className="w-3 h-3" /> Review / Grade Output
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSubmittingTask(t);
                            setSubmissionProgress(t.progressPercent || 100);
                          }}
                          className="w-full py-1.5 rounded-lg border border-dashed border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-amber-600" /> Submit Deliverable
                        </button>
                      )}

                      {/* Progress Bar & Status Mover */}
                      <div className="pt-1">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                          <span>Progress</span>
                          <span>{t.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${t.progressPercent}%` }}
                          />
                        </div>

                        {/* Move Status Buttons */}
                        <div className="flex items-center justify-between gap-1 pt-1">
                          {columns
                            .filter((c) => c !== t.status)
                            .map((c) => (
                              <button
                                key={c}
                                onClick={() =>
                                  onUpdateTaskStatus(
                                    t.id,
                                    c,
                                    c === "Completed" ? 100 : c === "In Progress" ? 50 : t.progressPercent
                                  )
                                }
                                className="text-[10px] text-slate-600 hover:text-amber-700 hover:bg-amber-50 px-1.5 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                              >
                                &rarr; {c.split(" ")[0]}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Task Title & Delegator</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Deliverable</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3">
                    <p className="font-bold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500">From: {t.assignedBy || "HOD"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-700">{t.category}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{t.assigneeName}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{t.deadline}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === "Urgent"
                          ? "bg-rose-50 text-rose-700"
                          : t.priority === "High"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {t.deliverable ? (
                      <button
                        onClick={() => {
                          setReviewingTask(t);
                          setReviewRemarks(t.deliverable?.reviewRemarks || "");
                        }}
                        className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200 hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" /> View Deliverable
                      </button>
                    ) : (
                      <button
                        onClick={() => setSubmittingTask(t)}
                        className="px-2 py-1 rounded bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200 hover:bg-amber-100 cursor-pointer flex items-center gap-1"
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> Submit
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {t.status} ({t.progressPercent}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deliverable Submission Modal */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Submit Task Deliverable</h2>
                <p className="text-xs text-slate-500">{submittingTask.title}</p>
              </div>
              <button
                onClick={() => setSubmittingTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Attached Document / File Name *</label>
                <input
                  type="text"
                  required
                  value={submissionFileName}
                  onChange={(e) => setSubmissionFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Submission Notes / Summary of Work</label>
                <textarea
                  rows={4}
                  required
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Describe the completed work, key findings, or upload notes for review..."
                  className="w-full p-3 rounded-lg border border-slate-200 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Submitting this deliverable will notify the task assigner ({submittingTask.assignedBy || "HOD"}) and update task status to Review.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Deliverable</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliverable Review Modal */}
      {reviewingTask && reviewingTask.deliverable && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Review Submitted Deliverable</h2>
                <p className="text-xs text-slate-500">{reviewingTask.title}</p>
              </div>
              <button
                onClick={() => setReviewingTask(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                    {reviewingTask.deliverable.fileName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{reviewingTask.deliverable.submittedAt}</span>
                </div>
                <p className="text-slate-600 whitespace-pre-line">{reviewingTask.deliverable.notes}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reviewer Remarks / Feedback</label>
                <textarea
                  rows={3}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Provide approval confirmation or detail mandatory revisions required..."
                  className="w-full p-3 rounded-lg border border-slate-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleReviewAction("Request Revisions")}
                  className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Request Revisions
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction("Approve")}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Complete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Delegate New Academic Task</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Moderate Midterm Algorithm Question Paper"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Syllabus Coverage</option>
                    <option>Assessment Prep</option>
                    <option>Accreditation</option>
                    <option>Grading</option>
                    <option>Administrative</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assignee Faculty</label>
                  <select
                    value={formData.assigneeName}
                    onChange={(e) => setFormData({ ...formData, assigneeName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    {facultyList.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name} ({f.department.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Deliverable Specs</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details of the expected submission or approval process..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 resize-none"
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
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
