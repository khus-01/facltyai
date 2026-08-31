import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  CheckCircle2,
  RefreshCw,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  BookmarkPlus,
  Save,
  Search,
  Filter,
  Eye,
  EyeOff,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  Sliders,
  FileCheck,
} from "lucide-react";
import { generateAIAssessment } from "../services/geminiService";
import { QuestionBankItem, Course } from "../types";
import { initialCourses } from "../data/mockData";

interface AIAssessmentGeneratorProps {
  questionBank: QuestionBankItem[];
  onSaveToQuestionBank: (item: QuestionBankItem) => void;
  onAddAssignment?: (assignment: any) => void;
}

export const AIAssessmentGenerator: React.FC<AIAssessmentGeneratorProps> = ({
  questionBank = [],
  onSaveToQuestionBank,
  onAddAssignment,
}) => {
  const [activeTab, setActiveTab] = useState<"generator" | "question_bank" | "rubric_analytics">("generator");

  // Generator Configuration State
  const [assessmentType, setAssessmentType] = useState<string>("question_paper");
  const [selectedCourseCode, setSelectedCourseCode] = useState("CS301");
  const [courseCode, setCourseCode] = useState("CS301");
  const [courseName, setCourseName] = useState("Design & Analysis of Algorithms");
  const [topic, setTopic] = useState("Divide & Conquer, Dynamic Programming, and Graph Traversals");
  const [difficulty, setDifficulty] = useState("Medium");
  const [totalMarks, setTotalMarks] = useState(50);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [numQuestions, setNumQuestions] = useState(8);

  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([
    "Understand",
    "Apply",
    "Analyze",
  ]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([
    "Short Answer",
    "Analytical Problems",
  ]);

  // Loading & Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAssessment, setGeneratedAssessment] = useState<any>(null);
  const [showAnswerKeys, setShowAnswerKeys] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Inline Question Editing State
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editedQuestionText, setEditedQuestionText] = useState("");
  const [editedAnswerKey, setEditedAnswerKey] = useState("");
  const [editedMarks, setEditedMarks] = useState(5);

  // Question Bank Filter State
  const [bankSearch, setBankSearch] = useState("");
  const [bankFilterCourse, setBankFilterCourse] = useState("all");
  const [bankFilterBloom, setBankFilterBloom] = useState("all");
  const [bankFilterType, setBankFilterType] = useState("all");

  const bloomsOptions = [
    { level: "Remember", color: "bg-slate-100 text-slate-700 border-slate-300", badge: "L1" },
    { level: "Understand", color: "bg-blue-50 text-blue-700 border-blue-200", badge: "L2" },
    { level: "Apply", color: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "L3" },
    { level: "Analyze", color: "bg-amber-50 text-amber-700 border-amber-200", badge: "L4" },
    { level: "Evaluate", color: "bg-purple-50 text-purple-700 border-purple-200", badge: "L5" },
    { level: "Create", color: "bg-rose-50 text-rose-700 border-rose-200", badge: "L6" },
  ];

  const questionTypeOptions = [
    "MCQs",
    "Short Answer",
    "Analytical Problems",
    "Code / Proof Formulation",
    "Case Study / Scenario",
  ];

  // Course preset sync
  const handleCourseChange = (code: string) => {
    setSelectedCourseCode(code);
    const found = initialCourses.find((c) => c.code === code);
    if (found) {
      setCourseCode(found.code);
      setCourseName(found.name);
      if (code === "CS301") {
        setTopic("Divide & Conquer, Dynamic Programming, and Graph Traversals (Dijkstra, Bellman-Ford)");
      } else if (code === "AI501") {
        setTopic("Deep Learning architectures, Transformers, Self-Attention mechanisms, and Backpropagation");
      } else if (code === "CS201") {
        setTopic("Linear Data Structures, AVL Trees, B-Trees, and Hashing Collision Resolutions");
      } else if (code === "MA101") {
        setTopic("Discrete Mathematics, Graph Theory, Relations, and Recurrence Relations");
      }
    }
  };

  const toggleBloom = (bloom: string) => {
    if (selectedBlooms.includes(bloom)) {
      if (selectedBlooms.length > 1) {
        setSelectedBlooms(selectedBlooms.filter((b) => b !== bloom));
      }
    } else {
      setSelectedBlooms([...selectedBlooms, bloom]);
    }
  };

  const toggleType = (qtype: string) => {
    if (selectedQuestionTypes.includes(qtype)) {
      if (selectedQuestionTypes.length > 1) {
        setSelectedQuestionTypes(selectedQuestionTypes.filter((t) => t !== qtype));
      }
    } else {
      setSelectedQuestionTypes([...selectedQuestionTypes, qtype]);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateAIAssessment({
        type: assessmentType,
        courseCode,
        courseName,
        topic,
        difficulty,
        totalMarks,
        bloomsLevels: selectedBlooms,
        questionTypes: selectedQuestionTypes,
        numQuestions,
      });

      if (res.assessment) {
        const assessmentWithDuration = {
          ...res.assessment,
          durationMinutes: durationMinutes || 90,
        };
        setGeneratedAssessment(assessmentWithDuration);
      }
    } catch (err: any) {
      console.error("Assessment Gen error:", err);
      alert(err.message || "Failed to generate assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedAssessment) return;
    navigator.clipboard.writeText(JSON.stringify(generatedAssessment, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveQuestionToBank = (q: any, secName?: string) => {
    const newItem: QuestionBankItem = {
      id: `QB-${Date.now().toString().slice(-4)}`,
      courseCode: generatedAssessment?.courseCode || courseCode,
      courseName: generatedAssessment?.courseName || courseName,
      unitOrTopic: topic.slice(0, 40) + "...",
      questionText: q.questionText,
      type: q.options ? "MCQ" : q.marks > 6 ? "Long" : "Short",
      marks: q.marks || 5,
      bloomsLevel: q.bloomsLevel || "Apply",
      coMapping: q.coMapping || "CO1",
      options: q.options || undefined,
      correctOption: q.correctOption || undefined,
      answerKey: q.answerKey || "Detailed step-by-step derivation.",
      evaluationCriteria: q.evaluationCriteria || [],
      difficulty: (difficulty.startsWith("Easy") ? "Easy" : difficulty.startsWith("Hard") ? "Hard" : "Medium") as any,
      tags: [courseCode, q.bloomsLevel || "Bloom"],
    };

    onSaveToQuestionBank(newItem);
    setSavedSuccess(`Saved Q${q.questionNumber || ""} to Question Bank!`);
    setTimeout(() => setSavedSuccess(null), 2500);
  };

  const startEditQuestion = (q: any, idx: number) => {
    setEditingQuestionId(idx);
    setEditedQuestionText(q.questionText);
    setEditedAnswerKey(q.answerKey || "");
    setEditedMarks(q.marks);
  };

  const saveEditQuestion = (sIdx: number, qIdx: number) => {
    if (!generatedAssessment) return;
    const updated = { ...generatedAssessment };
    if (updated.sections && updated.sections[sIdx] && updated.sections[sIdx].questions[qIdx]) {
      updated.sections[sIdx].questions[qIdx].questionText = editedQuestionText;
      updated.sections[sIdx].questions[qIdx].answerKey = editedAnswerKey;
      updated.sections[sIdx].questions[qIdx].marks = editedMarks;
      setGeneratedAssessment(updated);
    }
    setEditingQuestionId(null);
  };

  const deleteQuestion = (sIdx: number, qIdx: number) => {
    if (!generatedAssessment) return;
    const updated = { ...generatedAssessment };
    if (updated.sections && updated.sections[sIdx]) {
      updated.sections[sIdx].questions.splice(qIdx, 1);
      // Recalculate section marks
      updated.sections[sIdx].totalSectionMarks = updated.sections[sIdx].questions.reduce(
        (acc: number, curr: any) => acc + (curr.marks || 0),
        0
      );
      setGeneratedAssessment(updated);
    }
  };

  // Filtered Question Bank
  const filteredBank = questionBank.filter((item) => {
    const matchesSearch =
      item.questionText.toLowerCase().includes(bankSearch.toLowerCase()) ||
      item.courseCode.toLowerCase().includes(bankSearch.toLowerCase()) ||
      item.unitOrTopic.toLowerCase().includes(bankSearch.toLowerCase());
    const matchesCourse = bankFilterCourse === "all" || item.courseCode === bankFilterCourse;
    const matchesBloom = bankFilterBloom === "all" || item.bloomsLevel === bankFilterBloom;
    const matchesType = bankFilterType === "all" || item.type.toLowerCase() === bankFilterType.toLowerCase();
    return matchesSearch && matchesCourse && matchesBloom && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast alert */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Header & Sub-navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-bold text-[10px] uppercase tracking-wider">
              AI Module 1
            </span>
            <span className="text-xs text-slate-500 font-semibold">Outcome-Based Academic Suite</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Automated Assessment & Question Bank Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synthesize balanced midterm papers, class quizzes, question banks, and answer keys with Bloom's mapping & rubrics.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "generator"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Assessment Generator
          </button>
          <button
            onClick={() => setActiveTab("question_bank")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "question_bank"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Question Bank</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
              {questionBank.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "generator" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Config Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  Assessment Specifications
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">NBA / ABET Compliant</span>
              </div>

              {/* Assessment Type Radio Tabs */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Assessment Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "question_paper", label: "Formal Exam Paper", desc: "Midterms / Finals" },
                    { id: "quiz", label: "Class Quiz (MCQ/Short)", desc: "Quick Diagnostic" },
                    { id: "assignment", label: "Take-Home Assignment", desc: "Applied Problems" },
                    { id: "question_bank", label: "Question Bank & Key", desc: "Multi-level Item Pool" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAssessmentType(t.id)}
                      className={`p-2.5 rounded-xl font-semibold text-left transition-all border cursor-pointer ${
                        assessmentType === t.id
                          ? "bg-purple-50 border-purple-300 text-purple-800 ring-2 ring-purple-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-xs font-bold">{t.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Course Selector */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Course</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-slate-50 text-slate-800"
                >
                  {initialCourses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Code & Marks */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Module / Syllabus Topics Focus
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Specify units, chapters, algorithms, or concepts to test..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-sans resize-none"
                />
              </div>

              {/* Targeted Bloom's Taxonomy Cognitive Levels */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">Targeted Bloom's Cognitive Levels</label>
                  <span className="text-[10px] text-purple-600 font-bold">Select 1 or more</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {bloomsOptions.map((b) => {
                    const isSelected = selectedBlooms.includes(b.level);
                    return (
                      <button
                        key={b.level}
                        type="button"
                        onClick={() => toggleBloom(b.level)}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{b.level}</span>
                        <span className={`text-[9px] px-1 rounded ${isSelected ? "bg-purple-700 text-purple-100" : "bg-slate-200 text-slate-600"}`}>
                          {b.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Question Formats</label>
                <div className="flex flex-wrap gap-1.5">
                  {questionTypeOptions.map((q) => {
                    const isSelected = selectedQuestionTypes.includes(q);
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => toggleType(q)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option>Easy (Conceptual)</option>
                    <option>Medium (Balanced)</option>
                    <option>Hard (Analytical/Problem Solving)</option>
                    <option>Mixed (Full Distribution)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Number of Questions</label>
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <button
                id="btn-generate-assessment"
                disabled={isLoading}
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Synthesizing Question Paper & Answer Keys...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Assessment & Answer Key</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Output Paper Layout (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {generatedAssessment ? (
              <div className="space-y-4">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                        showAnswerKeys
                          ? "bg-purple-50 border-purple-300 text-purple-800"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {showAnswerKeys ? <Eye className="w-3.5 h-3.5 text-purple-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{showAnswerKeys ? "Teacher Copy (Key Active)" : "Student Copy (Key Hidden)"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copySuccess ? "Copied" : "Copy JSON"}</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Paper</span>
                    </button>
                  </div>
                </div>

                {/* Formal Academic Examination Paper Container */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
                  {/* Formal Academic Institutional Header */}
                  <div className="text-center pb-5 border-b-2 border-slate-900 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      {generatedAssessment.institution || "Faculty Assistant System • Department of Academic Affairs"}
                    </p>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                      {generatedAssessment.title || `${courseName} Examination Assessment`}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-700 pt-1">
                      <span>
                        Course: <strong className="font-mono text-purple-700">{generatedAssessment.courseCode}</strong> - {generatedAssessment.courseName}
                      </span>
                      <span>•</span>
                      <span>
                        Duration: <strong>{generatedAssessment.durationMinutes || durationMinutes} Mins</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Max Marks: <strong>{generatedAssessment.totalMarks || totalMarks}</strong>
                      </span>
                    </div>

                    {/* Student Roll Number Strip for Student Copy */}
                    {!showAnswerKeys && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-300 grid grid-cols-2 text-left text-xs font-semibold text-slate-700">
                        <div>Student Name: _______________________</div>
                        <div>Roll Number: ________________________</div>
                      </div>
                    )}
                  </div>

                  {/* General Instructions */}
                  {generatedAssessment.instructions && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">General Examination Instructions:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                        {generatedAssessment.instructions.map((inst: string, idx: number) => (
                          <li key={idx}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sections & Questions */}
                  <div className="space-y-6">
                    {generatedAssessment.sections?.map((sec: any, sIdx: number) => (
                      <div key={sIdx} className="space-y-3">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                          <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black flex items-center justify-center">
                              {String.fromCharCode(65 + sIdx)}
                            </span>
                            <span>{sec.sectionName || `Section ${String.fromCharCode(65 + sIdx)}`}</span>
                          </h3>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                            Total: {sec.totalSectionMarks} Marks
                          </span>
                        </div>

                        {sec.instructions && (
                          <p className="text-[11px] italic text-slate-500">{sec.instructions}</p>
                        )}

                        <div className="space-y-4">
                          {sec.questions?.map((q: any, qIdx: number) => {
                            const isEditing = editingQuestionId === qIdx;
                            return (
                              <div
                                key={qIdx}
                                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3 text-xs"
                              >
                                {isEditing ? (
                                  <div className="space-y-3 bg-white p-3 rounded-lg border border-purple-300">
                                    <div className="font-bold text-purple-900 text-xs flex items-center justify-between">
                                      <span>Editing Question {q.questionNumber || qIdx + 1}</span>
                                      <div className="flex items-center gap-2">
                                        <label className="text-[11px] text-slate-600">Marks:</label>
                                        <input
                                          type="number"
                                          value={editedMarks}
                                          onChange={(e) => setEditedMarks(Number(e.target.value))}
                                          className="w-16 px-2 py-1 border rounded text-xs"
                                        />
                                      </div>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={editedQuestionText}
                                      onChange={(e) => setEditedQuestionText(e.target.value)}
                                      className="w-full p-2 border rounded text-xs font-sans"
                                    />
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                                        Answer Key / Model Solution:
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={editedAnswerKey}
                                        onChange={(e) => setEditedAnswerKey(e.target.value)}
                                        className="w-full p-2 border rounded text-xs font-mono"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-1">
                                      <button
                                        onClick={() => setEditingQuestionId(null)}
                                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded text-xs cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => saveEditQuestion(sIdx, qIdx)}
                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold cursor-pointer"
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {/* Question header row */}
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-2.5">
                                        <span className="font-black text-slate-900 font-mono text-sm">
                                          Q{q.questionNumber || qIdx + 1}.
                                        </span>
                                        <p className="font-semibold text-slate-900 leading-relaxed text-xs">
                                          {q.questionText}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0 print:hidden">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                          {q.bloomsLevel || "Apply"}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                          {q.coMapping || "CO1"}
                                        </span>
                                        <span className="font-bold text-slate-900 text-xs px-2.5 py-0.5 rounded-lg bg-slate-200">
                                          [{q.marks}M]
                                        </span>
                                        <button
                                          onClick={() => startEditQuestion(q, qIdx)}
                                          title="Edit question text"
                                          className="p-1 rounded text-slate-400 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleSaveQuestionToBank(q, sec.sectionName)}
                                          title="Save to Question Bank"
                                          className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                                        >
                                          <BookmarkPlus className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => deleteQuestion(sIdx, qIdx)}
                                          title="Remove from paper"
                                          className="p-1 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Options if MCQ */}
                                    {q.options && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6 pt-1">
                                        {q.options.map((opt: string, optIdx: number) => (
                                          <div
                                            key={optIdx}
                                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                                          >
                                            {opt}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Answer Key & Scoring Rubric (Toggleable) */}
                                    {showAnswerKeys && (
                                      <div className="mt-2 pt-2 border-t border-slate-200 space-y-1.5 bg-purple-50/60 p-3 rounded-xl print:hidden">
                                        <div className="flex items-center justify-between text-purple-900 font-bold text-[11px]">
                                          <div className="flex items-center gap-1.5">
                                            <Award className="w-3.5 h-3.5 text-purple-600" />
                                            <span>Answer Key & Model Solution:</span>
                                          </div>
                                          {q.correctOption && (
                                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                              Correct: {q.correctOption}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-slate-700 leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-purple-200">
                                          {q.answerKey}
                                        </p>

                                        {q.evaluationCriteria && q.evaluationCriteria.length > 0 && (
                                          <div className="space-y-1 pt-1">
                                            <span className="text-[10px] font-bold uppercase text-purple-800 tracking-wider">
                                              Step-wise Mark Allocation Scheme:
                                            </span>
                                            {q.evaluationCriteria.map((c: any, cIdx: number) => (
                                              <div
                                                key={cIdx}
                                                className="flex items-center justify-between text-[11px] text-slate-600 pl-2 bg-white/70 py-1 px-2 rounded border border-purple-100"
                                              >
                                                <span>
                                                  <strong>• {c.aspect}</strong>: {c.description}
                                                </span>
                                                <span className="font-bold text-purple-900 shrink-0">
                                                  [{c.marks} Marks]
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rubric Summary Scale */}
                  {generatedAssessment.rubricSummary && showAnswerKeys && (
                    <div className="pt-5 border-t-2 border-slate-200 text-xs print:hidden space-y-2">
                      <h4 className="font-black text-slate-900 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        Comprehensive Qualitative Grading Rubric Scale
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                          <strong className="block text-emerald-800">Excellent (90-100%):</strong>
                          {generatedAssessment.rubricSummary.excellent}
                        </div>
                        <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                          <strong className="block text-blue-800">Proficient (75-89%):</strong>
                          {generatedAssessment.rubricSummary.proficient}
                        </div>
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                          <strong className="block text-amber-800">Developing (50-74%):</strong>
                          {generatedAssessment.rubricSummary.developing}
                        </div>
                        <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
                          <strong className="block text-rose-800">Unsatisfactory (&lt;50%):</strong>
                          {generatedAssessment.rubricSummary.unsatisfactory}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">No Assessment Paper Generated Yet</h3>
                <p className="text-xs max-w-sm text-slate-500">
                  Select your course specifications, target Bloom's cognitive taxonomy distribution, and question formats on the left, then click <strong>"Generate Assessment & Answer Key"</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Question Bank Explorer Tab */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search question bank by keyword, topic, or course..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden text-xs text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bankFilterCourse}
                onChange={(e) => setBankFilterCourse(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">All Courses</option>
                {initialCourses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>

              <select
                value={bankFilterBloom}
                onChange={(e) => setBankFilterBloom(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">All Bloom's Levels</option>
                {bloomsOptions.map((b) => (
                  <option key={b.level} value={b.level}>
                    {b.level} ({b.badge})
                  </option>
                ))}
              </select>

              <select
                value={bankFilterType}
                onChange={(e) => setBankFilterType(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 bg-slate-50"
              >
                <option value="all">All Types</option>
                <option value="mcq">MCQs</option>
                <option value="short">Short Answer</option>
                <option value="long">Long / Analytical</option>
                <option value="analytical">Problem Formulation</option>
              </select>
            </div>
          </div>

          {/* Question Bank Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBank.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        {item.courseCode}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{item.unitOrTopic}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {item.bloomsLevel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.coMapping}
                      </span>
                      <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.marks}M
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-900 leading-relaxed">
                    {item.questionText}
                  </p>

                  {item.options && (
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {item.options.map((opt, oIdx) => (
                        <div key={oIdx} className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-700">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-purple-800">Model Answer / Key:</span>
                    <p className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
                      {item.answerKey}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>ID: {item.id}</span>
                  <div className="flex items-center gap-1.5">
                    {item.tags?.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBank.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold">No questions match your filter criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
