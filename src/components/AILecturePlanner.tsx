import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  FileDown,
  Printer,
  Copy,
  RefreshCw,
  Sliders,
  ChevronRight,
  BookCheck,
  Award,
  Clock,
  Lightbulb,
  Presentation,
  FileText,
  Bell,
  MapPin,
  Upload,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Check,
  AlertTriangle,
  Play,
  Download,
  X,
} from "lucide-react";
import { generateAILecturePlan, generateLecturePPT, generateLectureENotes } from "../services/geminiService";
import { LectureResourcePPT, LectureResourceENotes, TimetableSlot } from "../types";
import { LectureSlidePresenter } from "./LectureSlidePresenter";

export const AILecturePlanner: React.FC = () => {
  const [courseCode, setCourseCode] = useState("CS301");
  const [courseName, setCourseName] = useState("Design & Analysis of Algorithms");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [totalWeeks, setTotalWeeks] = useState(14);
  const [lecturesPerWeek, setLecturesPerWeek] = useState(3);
  const [syllabusText, setSyllabusText] = useState(
    `Unit 1: Introduction to Algorithms, Asymptotic Notation (Big-O, Omega, Theta), Recurrence Relations and Master Theorem.
Unit 2: Divide & Conquer (Merge Sort, Quick Sort, Strassen's Matrix Multiplication), Greedy Techniques (Huffman Coding, Fractional Knapsack).
Unit 3: Dynamic Programming (0/1 Knapsack, Longest Common Subsequence, Matrix Chain Multiplication, Bellman-Ford).
Unit 4: Graph Algorithms (BFS, DFS, Dijkstra's Shortest Path, Minimum Spanning Trees - Kruskal & Prim, Network Flow).
Unit 5: NP-Completeness, Cook's Theorem, Reduction Techniques, Approximation Algorithms (Vertex Cover, TSP).`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [activeViewTab, setActiveViewTab] = useState<"schedule" | "copo" | "units" | "progress" | "timetable">("schedule");
  const [copySuccess, setCopySuccess] = useState(false);

  // Planned vs Actual Tracking State
  const [lectureStatusMap, setLectureStatusMap] = useState<
    Record<number, { status: "Planned" | "Covered" | "Partially Covered" | "Rescheduled"; dateLogged?: string; remarks?: string }>
  >({
    1: { status: "Covered", dateLogged: "2025-02-03", remarks: "Asymptotic notation covered thoroughly with proofs." },
    2: { status: "Covered", dateLogged: "2025-02-05", remarks: "Master Theorem cases 1 and 2 completed." },
    3: { status: "Covered", dateLogged: "2025-02-07", remarks: "Recurrence tree method demonstrated." },
    4: { status: "Covered", dateLogged: "2025-02-10", remarks: "Merge sort recurrence solved." },
    5: { status: "Covered", dateLogged: "2025-02-12", remarks: "Quick sort worst case pivot selection explained." },
    6: { status: "Covered", dateLogged: "2025-02-14", remarks: "Strassen matrix multiplication discussed." },
    7: { status: "Partially Covered", dateLogged: "2025-02-17", remarks: "Huffman coding prefix codes covered; greedy choice proof pending." },
  });

  // Resource Generation Modals
  const [activePPTModal, setActivePPTModal] = useState<LectureResourcePPT | null>(null);
  const [activeENotesModal, setActiveENotesModal] = useState<LectureResourceENotes | null>(null);
  const [isGeneratingResource, setIsGeneratingResource] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreenPPT, setIsFullscreenPPT] = useState(false);

  // Next Lecture State
  const [nextLectureAlert, setNextLectureAlert] = useState<{
    subject: string;
    courseCode: string;
    topic: string;
    venue: string;
    timeSlot: string;
    countdownMinutes: number;
  }>({
    subject: "Design & Analysis of Algorithms",
    courseCode: "CS301",
    topic: "Lecture 14: Dynamic Programming — 0/1 Knapsack State Formulations",
    venue: "Academic Block 3, Room 402",
    timeSlot: "Today, 10:00 AM - 11:00 AM",
    countdownMinutes: 18,
  });

  // Timetable State
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([
    { id: "tt-1", day: "Monday", timeSlot: "09:00 AM - 10:00 AM", courseCode: "CS301", courseName: "Design & Analysis of Algorithms", roomVenue: "Block 3, Rm 402", facultyName: "Dr. Elena Rostova", lectureType: "Theory", currentTopic: "Dynamic Programming Knapsack" },
    { id: "tt-2", day: "Monday", timeSlot: "11:15 AM - 01:15 PM", courseCode: "AI501", courseName: "Foundation Models & Deep Learning", roomVenue: "Turing AI Lab, Rm 210", facultyName: "Dr. Elena Rostova", lectureType: "Lab", currentTopic: "PyTorch Multi-Head Self-Attention" },
    { id: "tt-3", day: "Tuesday", timeSlot: "10:00 AM - 11:00 AM", courseCode: "CS301", courseName: "Design & Analysis of Algorithms", roomVenue: "Block 3, Rm 402", facultyName: "Dr. Elena Rostova", lectureType: "Theory", currentTopic: "Longest Common Subsequence" },
    { id: "tt-4", day: "Wednesday", timeSlot: "02:00 PM - 03:00 PM", courseCode: "CS305", courseName: "Operating Systems & Concurrency", roomVenue: "Seminar Hall B", facultyName: "Prof. Marcus Vance", lectureType: "Theory", currentTopic: "Deadlock Banker's Algorithm" },
    { id: "tt-5", day: "Thursday", timeSlot: "09:00 AM - 10:00 AM", courseCode: "CS301", courseName: "Design & Analysis of Algorithms", roomVenue: "Block 3, Rm 402", facultyName: "Dr. Elena Rostova", lectureType: "Theory", currentTopic: "Matrix Chain Multiplication" },
    { id: "tt-6", day: "Friday", timeSlot: "11:00 AM - 12:00 PM", courseCode: "AI501", courseName: "Foundation Models & Deep Learning", roomVenue: "Turing AI Lab, Rm 210", facultyName: "Dr. Elena Rostova", lectureType: "Theory", currentTopic: "Transformer Positional Encodings" },
  ]);

  // Preset syllabus templates
  const applyPreset = (preset: "dsa" | "ai" | "os") => {
    if (preset === "dsa") {
      setCourseCode("CS301");
      setCourseName("Design & Analysis of Algorithms");
      setDepartment("Computer Science & Engineering");
      setSyllabusText(`Unit 1: Introduction to Algorithms, Asymptotic Notation (Big-O, Omega, Theta), Recurrence Relations and Master Theorem.
Unit 2: Divide & Conquer (Merge Sort, Quick Sort, Strassen's Matrix Multiplication), Greedy Techniques (Huffman Coding, Fractional Knapsack).
Unit 3: Dynamic Programming (0/1 Knapsack, Longest Common Subsequence, Matrix Chain Multiplication, Bellman-Ford).
Unit 4: Graph Algorithms (BFS, DFS, Dijkstra's Shortest Path, Minimum Spanning Trees - Kruskal & Prim, Network Flow).
Unit 5: NP-Completeness, Cook's Theorem, Reduction Techniques, Approximation Algorithms (Vertex Cover, TSP).`);
    } else if (preset === "ai") {
      setCourseCode("AI501");
      setCourseName("Foundation Models & Deep Learning");
      setDepartment("Artificial Intelligence & Data Science");
      setSyllabusText(`Unit 1: Feedforward Networks, Backpropagation, Optimization (Adam, RMSProp), Regularization (Dropout, BatchNorm).
Unit 2: Sequence Modeling, RNNs, LSTMs, Attention Mechanism, Transformer Architecture (Self-Attention, Multi-Head, Positional Encodings).
Unit 3: Generative AI, Large Language Models (BERT, GPT, T5, LLaMA), Pretraining, Fine-Tuning (LoRA, QLoRA, Prompt Tuning).
Unit 4: Vision Transformers (ViT), Multimodal Models (CLIP, Diffusion Models), RLHF and Direct Preference Optimization (DPO).
Unit 5: AI Ethics, Safety, Hallucination Mitigation, Production Model Deployment and Inference Optimization.`);
    } else {
      setCourseCode("CS305");
      setCourseName("Operating Systems & Concurrency");
      setDepartment("Computer Science & Engineering");
      setSyllabusText(`Unit 1: OS Structures, System Calls, Process Management, Process Scheduling Algorithms.
Unit 2: Inter-Process Communication, Threads, Concurrency, Semaphores, Mutex, Deadlocks (Detection, Prevention, Banker's Algorithm).
Unit 3: Memory Management, Paging, Segmentation, Virtual Memory, Page Replacement Algorithms (LRU, Optimal).
Unit 4: File Systems, Directory Structures, Allocation Methods, Free Space Management, Disk Scheduling (SSTF, SCAN).
Unit 5: Protection & Security, Virtual Machines, Containerization Principles.`);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const res = await generateAILecturePlan({
        courseCode,
        courseName,
        department,
        syllabusText,
        totalWeeks,
        lecturesPerWeek,
      });

      if (res.plan) {
        setGeneratedPlan(res.plan);
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      alert(err.message || "Failed to generate AI Lecture Plan. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePPT = async (lectureNum: number, topic: string) => {
    setIsGeneratingResource(`ppt-${lectureNum}`);
    try {
      const res = await generateLecturePPT({
        courseCode,
        courseName,
        lectureNum,
        topic,
        unit: "Unit 3",
        bloomsLevel: "Apply (L3)",
      });
      if (res.ppt) {
        setActivePPTModal(res.ppt);
        setCurrentSlideIndex(0);
      }
    } catch (e: any) {
      alert("Error generating PPT: " + e.message);
    } finally {
      setIsGeneratingResource(null);
    }
  };

  const handleGenerateENotes = async (lectureNum: number, topic: string) => {
    setIsGeneratingResource(`enotes-${lectureNum}`);
    try {
      const res = await generateLectureENotes({
        courseCode,
        courseName,
        lectureNum,
        topic,
        unit: "Unit 3",
        bloomsLevel: "Apply (L3)",
      });
      if (res.enotes) {
        setActiveENotesModal(res.enotes);
      }
    } catch (e: any) {
      alert("Error generating E-Notes: " + e.message);
    } finally {
      setIsGeneratingResource(null);
    }
  };

  const handleUpdateLectureStatus = (
    lectureNum: number,
    status: "Planned" | "Covered" | "Partially Covered" | "Rescheduled"
  ) => {
    setLectureStatusMap((prev) => ({
      ...prev,
      [lectureNum]: {
        ...prev[lectureNum],
        status,
        dateLogged: new Date().toISOString().split("T")[0],
      },
    }));
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(JSON.stringify(generatedPlan, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations for Planned vs Actual
  const totalLecturesPlanned = totalWeeks * lecturesPerWeek;
  const coveredCount = Object.values(lectureStatusMap).filter((s: { status: string }) => s.status === "Covered").length;
  const partialCount = Object.values(lectureStatusMap).filter((s: { status: string }) => s.status === "Partially Covered").length;
  const progressPercent = Math.round(((coveredCount + partialCount * 0.5) / totalLecturesPlanned) * 100) || 18;

  return (
    <div className="space-y-6 pb-12">
      {/* Objective 1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
              Objective 1: Intelligent Lecture & Syllabus Engine
            </span>
            <span className="text-xs text-slate-500 font-semibold">OBE & ABET/NBA Aligned</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Lecture-to-Syllabus Planning, PPT & E-Notes Generator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-generate CO-PO-Bloom's mapped lecture timelines, teaching slide decks (PPTs), exam-ready e-notes, and track planned vs. actual progress in real time.
          </p>
        </div>

        {generatedPlan && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlan}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copySuccess ? "Copied" : "Copy Plan"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Course Plan</span>
            </button>
          </div>
        )}
      </div>

      {/* Real-Time "Next Lecture" Notification Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-black tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                Next Upcoming Class
              </span>
              <span className="text-xs text-indigo-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Starts in {nextLectureAlert.countdownMinutes} mins ({nextLectureAlert.timeSlot})
              </span>
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">{nextLectureAlert.topic}</h3>
            <p className="text-xs text-indigo-200 flex items-center gap-2 mt-1">
              <span className="font-mono bg-indigo-950/60 px-2 py-0.5 rounded text-[11px] font-bold text-indigo-300">
                {nextLectureAlert.courseCode}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {nextLectureAlert.venue}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            onClick={() => handleGeneratePPT(14, nextLectureAlert.topic)}
            disabled={isGeneratingResource === "ppt-14"}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isGeneratingResource === "ppt-14" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Presentation className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>Open Day's PPT</span>
          </button>
          <button
            onClick={() => handleGenerateENotes(14, nextLectureAlert.topic)}
            disabled={isGeneratingResource === "enotes-14"}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isGeneratingResource === "enotes-14" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
            )}
            <span>Generate E-Notes</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Course & Timetable Parameters</h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => applyPreset("dsa")}
                  className="px-2 py-1 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                >
                  DSA (CS301)
                </button>
                <button
                  onClick={() => applyPreset("ai")}
                  className="px-2 py-1 text-[10px] font-bold rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
                >
                  AI/ML (AI501)
                </button>
                <button
                  onClick={() => applyPreset("os")}
                  className="px-2 py-1 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  OS (CS305)
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration & Pace</label>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <input
                      type="number"
                      min={8}
                      max={20}
                      value={totalWeeks}
                      onChange={(e) => setTotalWeeks(Number(e.target.value))}
                      className="w-16 px-2 py-2 rounded-lg border border-slate-200 font-bold"
                    />
                    <span>Wks ({totalWeeks * lecturesPerWeek} Ls)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Course Title</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Academic Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Syllabus / Modules Text</label>
                  <span className="text-[10px] text-indigo-600 font-semibold">Editable Syllabus</span>
                </div>
                <textarea
                  rows={7}
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                id="btn-generate-ai-plan"
                disabled={isLoading}
                onClick={handleGeneratePlan}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Mapping Syllabus to Lectures & CO-PO...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Complete Lecture Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Syllabus Progress Metric Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookCheck className="w-4 h-4 text-indigo-600" /> Planned vs. Actual Progress
              </span>
              <span className="text-xs font-extrabold text-indigo-700">{progressPercent}% Covered</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>{coveredCount} Lectures Covered</span>
              <span>{partialCount} In Progress</span>
              <span>{totalLecturesPlanned - coveredCount - partialCount} Planned</span>
            </div>
          </div>
        </div>

        {/* Right Output Display (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            {/* Output Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveViewTab("schedule")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeViewTab === "schedule" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Lecture Timeline
                </button>
                <button
                  onClick={() => setActiveViewTab("progress")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeViewTab === "progress" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Planned vs Actual Tracker
                </button>
                <button
                  onClick={() => setActiveViewTab("copo")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeViewTab === "copo" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  CO–PO & Bloom's
                </button>
                <button
                  onClick={() => setActiveViewTab("units")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeViewTab === "units" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Unit Milestones
                </button>
                <button
                  onClick={() => setActiveViewTab("timetable")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeViewTab === "timetable" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Timetable Grid
                </button>
              </div>

              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {courseCode} Plan
              </span>
            </div>

            {/* View 1: Lecture Timeline with Direct PPT & E-Notes Generation */}
            {activeViewTab === "schedule" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    Each lecture is mapped to targeted Course Outcome (CO) and Bloom's cognitive level. Generate slides or e-notes with 1 click.
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                    Live Engine
                  </span>
                </div>

                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {(generatedPlan?.weeklySchedule || [
                    {
                      week: 1,
                      lectures: [
                        { lectureNum: 1, topic: "Introduction to Algorithm Design Paradigms & Invariants", teachingPedagogy: "Chalk & Board + Slide Deck", learningAid: "Interactive Trace", bloomsLevel: "Understand (L2)", coTargeted: "CO1" },
                        { lectureNum: 2, topic: "Asymptotic Notation Proofs (Big-O, Omega, Theta Bounds)", teachingPedagogy: "Proof Formulation", learningAid: "Calculus Limits Sheet", bloomsLevel: "Analyze (L4)", coTargeted: "CO1" },
                        { lectureNum: 3, topic: "Recurrence Relations & Master Theorem Proof Breakdown", teachingPedagogy: "Problem Solving", learningAid: "Recursion Trees", bloomsLevel: "Apply (L3)", coTargeted: "CO1" },
                      ],
                    },
                    {
                      week: 2,
                      lectures: [
                        { lectureNum: 4, topic: "Divide & Conquer: Merge Sort Optimal Invariant Analysis", teachingPedagogy: "Code Walkthrough", learningAid: "Call Stack Simulator", bloomsLevel: "Apply (L3)", coTargeted: "CO2" },
                        { lectureNum: 5, topic: "Quick Sort Pivot Partitioning & Randomized Expected Bounds", teachingPedagogy: "Interactive Trace", learningAid: "Array Partition Visualizer", bloomsLevel: "Analyze (L4)", coTargeted: "CO2" },
                        { lectureNum: 6, topic: "Strassen's Sub-Cubic Matrix Multiplication", teachingPedagogy: "Matrix Formulation", learningAid: "Complexity Comparison Table", bloomsLevel: "Evaluate (L5)", coTargeted: "CO2" },
                      ],
                    },
                    {
                      week: 3,
                      lectures: [
                        { lectureNum: 7, topic: "Greedy Algorithms: Huffman Coding Optimal Prefix Trees", teachingPedagogy: "Tree Construction", learningAid: "Binary Code Tables", bloomsLevel: "Apply (L3)", coTargeted: "CO2" },
                        { lectureNum: 8, topic: "Fractional Knapsack vs Discrete 0/1 Knapsack Paradox", teachingPedagogy: "Comparative Case Study", learningAid: "Profit/Weight Density Table", bloomsLevel: "Evaluate (L5)", coTargeted: "CO3" },
                        { lectureNum: 9, topic: "Dynamic Programming: Principle of Optimality & State Vectors", teachingPedagogy: "Mathematical Proof", learningAid: "State Space Graph", bloomsLevel: "Understand (L2)", coTargeted: "CO3" },
                      ],
                    },
                    {
                      week: 4,
                      lectures: [
                        { lectureNum: 10, topic: "0/1 Knapsack 2D Tabulation & Backtracking Matrix Trace", teachingPedagogy: "Live Tabulation", learningAid: "2D Matrix Worksheet", bloomsLevel: "Apply (L3)", coTargeted: "CO3" },
                        { lectureNum: 11, topic: "Longest Common Subsequence (LCS) Optimal Substructure", teachingPedagogy: "String Grid Alignment", learningAid: "Arrow Direction Matrix", bloomsLevel: "Analyze (L4)", coTargeted: "CO3" },
                        { lectureNum: 12, topic: "Matrix Chain Multiplication Dynamic Optimization", teachingPedagogy: "Parenthesization Proof", learningAid: "Cost Matrix Heatmap", bloomsLevel: "Create (L6)", coTargeted: "CO3" },
                      ],
                    },
                  ]).map((w: any) => (
                    <div key={w.week} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-700">Week {w.week} Schedule</span>
                        <span className="text-[10px] font-bold text-slate-500">{w.lectures?.length || 3} Planned Lectures</span>
                      </div>

                      <div className="space-y-2">
                        {w.lectures?.map((lec: any, idx: number) => {
                          const lNum = lec.lectureNum || idx + 1;
                          const currentStatus = lectureStatusMap[lNum]?.status || "Planned";

                          return (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs hover:border-indigo-300 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                                    L{lNum}
                                  </span>
                                  <span className="text-slate-900 font-bold">{lec.topic}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                  <span className="text-indigo-600 font-semibold">Pedagogy: {lec.teachingPedagogy}</span>
                                  <span>•</span>
                                  <span>Aid: {lec.learningAid}</span>
                                  <span>•</span>
                                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded">
                                    {lec.bloomsLevel || "Apply (L3)"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleGeneratePPT(lNum, lec.topic)}
                                  disabled={isGeneratingResource === `ppt-${lNum}`}
                                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1 border border-indigo-200 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {isGeneratingResource === `ppt-${lNum}` ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Presentation className="w-3 h-3 text-indigo-600" />
                                  )}
                                  <span>PPT Deck</span>
                                </button>
                                <button
                                  onClick={() => handleGenerateENotes(lNum, lec.topic)}
                                  disabled={isGeneratingResource === `enotes-${lNum}`}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center gap-1 border border-emerald-200 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {isGeneratingResource === `enotes-${lNum}` ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <FileText className="w-3 h-3 text-emerald-600" />
                                  )}
                                  <span>E-Notes</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 2: Planned vs Actual Syllabus Tracker */}
            {activeViewTab === "progress" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
                  <div>
                    <h4 className="font-bold text-indigo-900">Syllabus Execution & Attendance Log</h4>
                    <p className="text-[11px] text-indigo-700">Mark lectures as covered or rescheduled to audit institutional adherence.</p>
                  </div>
                  <span className="font-mono font-bold bg-white text-indigo-800 px-3 py-1 rounded-lg border border-indigo-200">
                    {coveredCount} / {totalLecturesPlanned} Lectures Complete
                  </span>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => {
                    const statusObj = lectureStatusMap[num] || { status: "Planned" };
                    return (
                      <div
                        key={num}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              Lecture {num}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {num === 1
                                ? "Asymptotic Notations & Proofs"
                                : num === 2
                                ? "Master Theorem Case Solutions"
                                : num === 3
                                ? "Recurrence Relations Tree Method"
                                : num === 7
                                ? "Huffman Coding Optimal Prefix Trees"
                                : num === 14
                                ? "Dynamic Programming 0/1 Knapsack"
                                : `Course Syllabus Core Topic ${num}`}
                            </span>
                          </div>
                          {statusObj.remarks && (
                            <p className="text-[11px] text-slate-500 italic">Remarks: {statusObj.remarks}</p>
                          )}
                          {statusObj.dateLogged && (
                            <p className="text-[10px] text-slate-400">Date Logged: {statusObj.dateLogged}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleUpdateLectureStatus(num, "Covered")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              statusObj.status === "Covered"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Covered
                          </button>
                          <button
                            onClick={() => handleUpdateLectureStatus(num, "Partially Covered")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              statusObj.status === "Partially Covered"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Partial
                          </button>
                          <button
                            onClick={() => handleUpdateLectureStatus(num, "Rescheduled")}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              statusObj.status === "Rescheduled"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View 3: CO-PO & Bloom's Mapping Matrix */}
            {activeViewTab === "copo" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Formulated Course Outcomes (COs)</h4>
                  <div className="space-y-2">
                    {[
                      "CO1: Formulate and solve recurrence relations to analyze algorithmic computational bounds (Bloom's L4 - Analyze).",
                      "CO2: Apply Divide & Conquer and Greedy strategies to solve combinatorial problems with provable optimality (Bloom's L3 - Apply).",
                      "CO3: Design optimal dynamic programming table representations and state transition equations (Bloom's L5 - Evaluate).",
                      "CO4: Formulate graph traversal algorithms and shortest path networks for practical routing topologies (Bloom's L4 - Analyze).",
                      "CO5: Prove polynomial time reductions and identify NP-Complete decision problems (Bloom's L6 - Create).",
                    ].map((coStr, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                        {coStr}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CO-PO Attainment Correlation Matrix */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-2">CO–PO Correlation Matrix</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
                        <tr>
                          <th className="p-2 text-left">CO Code</th>
                          <th className="p-2">PO1</th>
                          <th className="p-2">PO2</th>
                          <th className="p-2">PO3</th>
                          <th className="p-2">PO4</th>
                          <th className="p-2">PO5</th>
                          <th className="p-2">PSO1</th>
                          <th className="p-2">PSO2</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {[
                          { co: "CO1", po1: 3, po2: 3, po3: 2, po4: 2, po5: 1, pso1: 3, pso2: 2 },
                          { co: "CO2", po1: 3, po2: 3, po3: 3, po4: 2, po5: 2, pso1: 3, pso2: 3 },
                          { co: "CO3", po1: 3, po2: 3, po3: 3, po4: 3, po5: 2, pso1: 3, pso2: 3 },
                          { co: "CO4", po1: 3, po2: 2, po3: 2, po4: 2, po5: 2, pso1: 2, pso2: 2 },
                          { co: "CO5", po1: 2, po2: 2, po3: 1, po4: 2, po5: 1, pso1: 2, pso2: 1 },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 text-left font-bold font-mono text-indigo-700">{row.co}</td>
                            <td className="p-2 font-bold">{row.po1}</td>
                            <td className="p-2 font-bold">{row.po2}</td>
                            <td className="p-2 font-bold">{row.po3}</td>
                            <td className="p-2 font-bold">{row.po4}</td>
                            <td className="p-2 font-bold">{row.po5}</td>
                            <td className="p-2 font-bold">{row.pso1}</td>
                            <td className="p-2 font-bold">{row.pso2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* View 4: Unit Milestones */}
            {activeViewTab === "units" && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto text-xs">
                {[
                  { unit: 1, title: "Foundations & Asymptotic Analysis", hours: 8, co: "CO1", topics: ["Big-O, Omega, Theta proofs", "Recurrence trees & Master Theorem", "Invariants in iterative loops"] },
                  { unit: 2, title: "Divide & Conquer and Greedy Paradigms", hours: 10, co: "CO2", topics: ["Merge sort & Quick sort bounds", "Strassen matrix multiplication", "Huffman coding & Knapsack greediness"] },
                  { unit: 3, title: "Dynamic Programming & Optimization", hours: 12, co: "CO3", topics: ["Principle of optimality", "0/1 Knapsack 2D table", "Longest Common Subsequence", "Matrix Chain Multiplications"] },
                  { unit: 4, title: "Graph Traversals & Shortest Paths", hours: 10, co: "CO4", topics: ["BFS/DFS trees", "Dijkstra min-heap", "Bellman-Ford negative cycles", "MST Kruskal & Prim"] },
                  { unit: 5, title: "NP-Completeness & Approximation", hours: 8, co: "CO5", topics: ["P vs NP classes", "Cook-Levin Theorem", "Polynomial reductions", "Vertex Cover approximation"] },
                ].map((u, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-600 text-white">
                          Unit {u.unit}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{u.title}</h4>
                      </div>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {u.hours} Planned Hours
                      </span>
                    </div>

                    <p className="text-[11px] text-purple-700 font-semibold">Targeted Outcome: {u.co}</p>

                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {u.topics.map((t, tIdx) => (
                        <li key={tIdx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* View 5: Timetable Grid */}
            {activeViewTab === "timetable" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900">Weekly Faculty Schedule Matrix</h4>
                  <button className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3" /> Upload Timetable CSV
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timetableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {slot.day}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {slot.timeSlot}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-slate-900">{slot.courseCode} - {slot.courseName}</div>
                        <div className="text-[11px] text-slate-600 mt-0.5 font-medium">{slot.currentTopic}</div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" /> {slot.roomVenue}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                          {slot.lectureType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PPT Slide Deck Modal & Presenter View */}
      {activePPTModal && (
        <LectureSlidePresenter
          ppt={activePPTModal}
          onClose={() => setActivePPTModal(null)}
        />
      )}

      {/* E-Notes Study Guide Modal */}
      {activeENotesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">
                    {activeENotesModal.courseCode}: Lecture {activeENotesModal.lectureNum} E-Notes (Exam Guide)
                  </h3>
                  <p className="text-[11px] text-slate-300">{activeENotesModal.topic}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download / Print PDF
                </button>
                <button
                  onClick={() => setActiveENotesModal(null)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white overflow-y-auto space-y-5 text-xs text-slate-800 leading-relaxed">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                <span className="font-black text-emerald-900 uppercase tracking-wider text-[10px]">
                  Conceptual Summary
                </span>
                <p className="text-emerald-950 font-medium">{activeENotesModal.summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Key Theorems & Core Formulations</h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                  {activeENotesModal.keyTheoremsAndFormulas.map((thm, idx) => (
                    <li key={idx} className="font-medium">{thm}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">In-Depth Technical Breakdown</h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-line font-mono text-[11px] text-slate-800">
                  {activeENotesModal.inDepthExplanation}
                </div>
              </div>

              {activeENotesModal.workedExamples?.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-900 text-xs block">{ex.title}</span>
                  <p className="text-slate-800 font-semibold whitespace-pre-line">{ex.problem}</p>
                  <div className="pt-2 border-t border-amber-200 text-slate-700 whitespace-pre-line">
                    <span className="font-bold text-amber-800 block mb-1">Step-by-Step Solution:</span>
                    {ex.solution}
                  </div>
                </div>
              ))}

              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
                <span className="font-bold block mb-1">Examiner & Grading Tips:</span>
                <p className="text-[11px]">{activeENotesModal.examTips}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
