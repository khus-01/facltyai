import React, { useState } from "react";
import {
  FileCheck2,
  Plus,
  Search,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  RefreshCw,
  X,
  FileCode,
  Sliders,
} from "lucide-react";
import { Assignment, AssignmentSubmission, Course } from "../types";
import { gradeSubmissionWithAI } from "../services/geminiService";

interface AssignmentsModuleProps {
  assignments: Assignment[];
  courses: Course[];
  onAddAssignment: (assignment: Assignment) => void;
  onGradeSubmission: (assignmentId: string, submissionId: string, grade: number, feedback: string) => void;
}

export const AssignmentsModule: React.FC<AssignmentsModuleProps> = ({
  assignments,
  courses,
  onAddAssignment,
  onGradeSubmission,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment>(assignments[0] || null);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGradingAi, setIsGradingAi] = useState(false);
  const [aiGradingResult, setAiGradingResult] = useState<any>(null);

  // Manual grading fields
  const [marksAwarded, setMarksAwarded] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>("");

  // New assignment form
  const [newTitle, setNewTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState(courses[0]?.code || "CS301");
  const [newDueDate, setNewDueDate] = useState("2025-04-10");
  const [newTotalMarks, setNewTotalMarks] = useState(25);
  const [newCoMapping, setNewCoMapping] = useState("CO3");
  const [newDescription, setNewDescription] = useState("");
  const [newRubric, setNewRubric] = useState("Correctness (10M), Time Complexity (5M), Code Quality & Comments (5M), Test Cases (5M)");

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAss: Assignment = {
      id: `ASS-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      courseCode: newCourseCode,
      dueDate: newDueDate,
      totalMarks: Number(newTotalMarks),
      coMapping: newCoMapping,
      description: newDescription,
      rubricCriteria: newRubric,
      submissionsCount: 0,
      totalStudents: 45,
      gradedCount: 0,
      submissions: [],
    };

    onAddAssignment(newAss);
    setSelectedAssignment(newAss);
    setIsAddModalOpen(false);
    setNewTitle("");
  };

  const handleOpenSubmission = (sub: AssignmentSubmission) => {
    setSelectedSubmission(sub);
    setMarksAwarded(sub.marksObtained || 0);
    setFeedbackText(sub.feedback || "");
    setAiGradingResult(null);
  };

  const handleAIGrade = async () => {
    if (!selectedAssignment || !selectedSubmission) return;
    setIsGradingAi(true);
    try {
      const res = await gradeSubmissionWithAI({
        assignmentTitle: selectedAssignment.title,
        rubricCriteria: selectedAssignment.rubricCriteria,
        totalMarks: selectedAssignment.totalMarks,
        studentContent: selectedSubmission.submittedContent,
        studentName: selectedSubmission.studentName,
      });

      if (res.evaluation) {
        setAiGradingResult(res.evaluation);
        setMarksAwarded(res.evaluation.marksAwarded);
        setFeedbackText(res.evaluation.feedback);
      }
    } catch (err: any) {
      console.error("AI Grading Error:", err);
      alert(err.message || "Failed to grade with AI");
    } finally {
      setIsGradingAi(false);
    }
  };

  const handleSaveGrade = () => {
    if (!selectedAssignment || !selectedSubmission) return;
    onGradeSubmission(selectedAssignment.id, selectedSubmission.id, marksAwarded, feedbackText);
    setSelectedSubmission({
      ...selectedSubmission,
      marksObtained: marksAwarded,
      feedback: feedbackText,
      status: "Graded",
    });
    alert("Evaluation and feedback submitted successfully.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            Assignments & AI Evaluation Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create outcome-aligned assignments, view student code/document submissions, and utilize AI Rubric Evaluation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assignment Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block px-1">
            Active Course Assignments ({assignments.length})
          </span>

          <div className="space-y-2.5">
            {assignments.map((ass) => {
              const isSelected = selectedAssignment?.id === ass.id;
              const percentGraded = ass.submissionsCount > 0 ? Math.round((ass.gradedCount / ass.submissionsCount) * 100) : 0;

              return (
                <div
                  key={ass.id}
                  onClick={() => {
                    setSelectedAssignment(ass);
                    setSelectedSubmission(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {ass.courseCode}
                    </span>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {ass.coMapping}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1">{ass.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5" /> Due: {ass.dueDate} • {ass.totalMarks} Marks
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      {ass.submissionsCount} Submissions ({ass.gradedCount} Graded)
                    </span>
                    <span className="font-bold text-indigo-600">{percentGraded}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Submissions & AI Grading Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {selectedAssignment && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              {/* Assignment Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-600 text-white">
                      {selectedAssignment.courseCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">Max Score: {selectedAssignment.totalMarks} Marks</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{selectedAssignment.title}</h2>
                  <p className="text-xs text-slate-600 mt-1">{selectedAssignment.description}</p>
                </div>
              </div>

              {/* Rubric Criteria Bar */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Evaluation Rubric Criteria:</span>
                <p className="text-slate-600 italic">{selectedAssignment.rubricCriteria}</p>
              </div>

              {/* Submissions List */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Student Submissions ({selectedAssignment.submissions?.length || 0})
                </h3>

                <div className="space-y-2">
                  {selectedAssignment.submissions && selectedAssignment.submissions.length > 0 ? (
                    selectedAssignment.submissions.map((sub) => {
                      const isGraded = sub.status === "Graded";
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleOpenSubmission(sub)}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer text-xs ${
                            selectedSubmission?.id === sub.id
                              ? "bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-slate-900">{sub.studentName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              {sub.rollNumber} • Submitted on {sub.submissionDate}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {isGraded ? (
                              <div className="text-right">
                                <span className="font-bold text-emerald-700 text-sm block">
                                  {sub.marksObtained} / {selectedAssignment.totalMarks}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600">Graded</span>
                              </div>
                            ) : (
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                Pending Grading
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No submissions uploaded for this assignment yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Active Submission Review & AI Grader */}
              {selectedSubmission && (
                <div className="mt-6 pt-5 border-t border-slate-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Reviewing: {selectedSubmission.studentName} ({selectedSubmission.rollNumber})
                      </h4>
                      <p className="text-xs text-slate-500">Submitted Content Preview</p>
                    </div>

                    <button
                      id="btn-ai-grade"
                      disabled={isGradingAi}
                      onClick={handleAIGrade}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isGradingAi ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                          <span>Evaluating with AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>AI Automatic Grade & Feedback</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Student Code / Content Container */}
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs max-h-56 overflow-y-auto leading-relaxed border border-slate-800">
                    <pre className="whitespace-pre-wrap">{selectedSubmission.submittedContent}</pre>
                  </div>

                  {/* AI Evaluation Insights If Generated */}
                  {aiGradingResult && (
                    <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          AI Rubric Assessment Recommendation
                        </span>
                        <span className="font-bold text-sm text-purple-800">
                          Recommended Score: {aiGradingResult.marksAwarded} / {selectedAssignment.totalMarks}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-white p-2.5 rounded-lg border border-purple-150">
                          <strong className="text-emerald-700 block mb-1">Key Strengths:</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                            {aiGradingResult.strengths?.map((st: string, idx: number) => (
                              <li key={idx}>{st}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-purple-150">
                          <strong className="text-rose-700 block mb-1">Areas for Improvement:</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                            {aiGradingResult.improvements?.map((imp: string, idx: number) => (
                              <li key={idx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grading Form Inputs */}
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Marks Awarded (Max: {selectedAssignment.totalMarks})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={selectedAssignment.totalMarks}
                          value={marksAwarded}
                          onChange={(e) => setMarksAwarded(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Faculty Feedback to Student</label>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Add constructive notes on logic, time complexity, or formatting..."
                        className="w-full p-2.5 rounded-lg border border-slate-200 resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveGrade}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Evaluation & Notify Student</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Create New Course Assignment</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming & Graph Search Implementation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Course</label>
                  <select
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Course Outcome (CO)</label>
                  <select
                    value={newCoMapping}
                    onChange={(e) => setNewCoMapping(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>CO1</option>
                    <option>CO2</option>
                    <option>CO3</option>
                    <option>CO4</option>
                    <option>CO5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assignment Problem Statement</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the tasks, problem specs, and required format..."
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rubric Criteria Breakdown</label>
                <input
                  type="text"
                  value={newRubric}
                  onChange={(e) => setNewRubric(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
