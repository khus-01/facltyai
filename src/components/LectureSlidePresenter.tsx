import React, { useState, useEffect } from "react";
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Copy,
  Check,
  Code,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  Printer,
  Eye,
  SlidersHorizontal,
  Table,
  Workflow,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { LectureResourcePPT, StudentSlideContent } from "../types";

interface LectureSlidePresenterProps {
  ppt: LectureResourcePPT;
  onClose: () => void;
}

type SlideTheme = "dark" | "light" | "cobalt" | "emerald";

export const LectureSlidePresenter: React.FC<LectureSlidePresenterProps> = ({
  ppt,
  onClose,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"student" | "presenter">("student");
  const [theme, setTheme] = useState<SlideTheme>("dark");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showQuizExplanation, setShowQuizExplanation] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDeck, setCopiedDeck] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const slides = ppt.slides || [];
  const currentSlide: StudentSlideContent | undefined = slides[currentSlideIndex];

  // Stopwatch timer for presenter mode
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex((prev) => prev + 1);
          setSelectedQuizOption(null);
          setShowQuizExplanation(false);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex((prev) => prev - 1);
          setSelectedQuizOption(null);
          setShowQuizExplanation(false);
        }
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key.toLowerCase() === "f") {
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, slides.length, isFullscreen, onClose]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyDeck = () => {
    navigator.clipboard.writeText(JSON.stringify(ppt, null, 2));
    setCopiedDeck(true);
    setTimeout(() => setCopiedDeck(false), 2000);
  };

  const handlePrintHandouts = () => {
    window.print();
  };

  // Theme styling configurations
  const themeClasses = {
    dark: {
      bg: "bg-slate-950",
      slideBg: "bg-slate-900 text-slate-100 border-slate-800",
      accent: "text-indigo-400",
      accentBg: "bg-indigo-950/80 border-indigo-700/50 text-indigo-200",
      badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      subtext: "text-slate-400",
      cardBg: "bg-slate-800/80 border-slate-700/70 text-slate-200",
      highlightCard: "bg-amber-950/40 border-amber-600/40 text-amber-200",
      codeBg: "bg-black/60 border-slate-700 text-emerald-400",
      tableHeader: "bg-slate-800 text-indigo-300 border-slate-700",
      tableRow: "hover:bg-slate-800/50 border-slate-800",
    },
    light: {
      bg: "bg-slate-100",
      slideBg: "bg-white text-slate-900 border-slate-200 shadow-sm",
      accent: "text-indigo-600",
      accentBg: "bg-indigo-50 border-indigo-200 text-indigo-900",
      badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200",
      subtext: "text-slate-500",
      cardBg: "bg-slate-50 border-slate-200 text-slate-800",
      highlightCard: "bg-amber-50 border-amber-200 text-amber-950",
      codeBg: "bg-slate-900 border-slate-800 text-emerald-400",
      tableHeader: "bg-slate-100 text-slate-800 border-slate-200 font-bold",
      tableRow: "hover:bg-slate-50 border-slate-200",
    },
    cobalt: {
      bg: "bg-slate-950",
      slideBg: "bg-[#0b192e] text-slate-100 border-sky-900/50",
      accent: "text-sky-400",
      accentBg: "bg-sky-950/80 border-sky-700/50 text-sky-200",
      badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      subtext: "text-sky-300/70",
      cardBg: "bg-[#112240] border-sky-800/40 text-slate-200",
      highlightCard: "bg-amber-950/40 border-amber-600/40 text-amber-200",
      codeBg: "bg-[#07111e] border-sky-900 text-teal-300",
      tableHeader: "bg-[#1a365d] text-sky-300 border-sky-800",
      tableRow: "hover:bg-[#112240] border-sky-900/40",
    },
    emerald: {
      bg: "bg-slate-950",
      slideBg: "bg-[#061e16] text-slate-100 border-emerald-900/50",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-950/80 border-emerald-700/50 text-emerald-200",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      subtext: "text-emerald-300/70",
      cardBg: "bg-[#0b2d22] border-emerald-800/40 text-slate-200",
      highlightCard: "bg-amber-950/40 border-amber-600/40 text-amber-200",
      codeBg: "bg-[#03130d] border-emerald-900 text-emerald-300",
      tableHeader: "bg-[#0e3b2c] text-emerald-300 border-emerald-800",
      tableRow: "hover:bg-[#0b2d22] border-emerald-900/40",
    },
  }[theme];

  if (!currentSlide) return null;

  // Extract bullets
  const bullets = currentSlide.bulletPoints || currentSlide.bullets || [];

  // Code snippet parsing
  const codeObject =
    typeof currentSlide.codeSnippet === "string"
      ? { language: "pseudocode", code: currentSlide.codeSnippet, explanation: "" }
      : currentSlide.codeSnippet;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${
        isFullscreen ? "p-0" : "p-2 sm:p-4"
      } bg-slate-950/90 backdrop-blur-md transition-all duration-200`}
    >
      <div
        className={`w-full flex-1 flex flex-col rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 transition-all ${
          isFullscreen ? "h-full rounded-none border-none" : "max-w-7xl mx-auto max-h-[96vh]"
        }`}
      >
        {/* Top Control Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Presentation className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-white font-mono">{ppt.courseCode}</span>
                <span className="text-slate-400 hidden sm:inline ml-2">
                  L{ppt.lectureNum}: {ppt.topic}
                </span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
              Slide {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Student View vs Presenter View */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode("student")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "student"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Student Classroom View (What students see on projector)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Student View</span>
              </button>
              <button
                onClick={() => setViewMode("presenter")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "presenter"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Faculty Presenter View with Speaker Notes & Timer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Presenter Notes</span>
              </button>
            </div>

            {/* Theme Selector */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {(["dark", "light", "cobalt", "emerald"] as SlideTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-5 h-5 rounded-md text-[10px] font-black uppercase transition-all cursor-pointer ${
                    theme === t
                      ? "ring-2 ring-indigo-400 scale-110"
                      : "opacity-60 hover:opacity-100"
                  } ${
                    t === "dark"
                      ? "bg-slate-900 text-slate-200 border border-slate-700"
                      : t === "light"
                      ? "bg-white text-slate-900 border border-slate-300"
                      : t === "cobalt"
                      ? "bg-sky-900 text-sky-200 border border-sky-700"
                      : "bg-emerald-900 text-emerald-200 border border-emerald-700"
                  }`}
                  title={`Switch to ${t} theme`}
                />
              ))}
            </div>

            {/* Copy & Print */}
            <button
              onClick={handleCopyDeck}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title="Copy Slide Deck JSON"
            >
              {copiedDeck ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrintHandouts}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer hidden sm:flex"
              title="Print Student Slide Handout"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Projector Fullscreen Mode (F)"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer ml-1"
              title="Close Presenter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body Area: Slide Screen + Optional Presenter Notes Panel */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Slide Canvas (16:9 Aspect Ratio Focus) */}
          <div className="flex-1 bg-slate-950 p-3 sm:p-6 flex items-center justify-center overflow-y-auto">
            <div
              className={`w-full max-w-5xl rounded-2xl border p-6 sm:p-10 transition-all duration-200 flex flex-col justify-between min-h-[500px] shadow-2xl relative ${themeClasses.slideBg}`}
            >
              {/* Slide Header */}
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit/20">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${themeClasses.badgeBg}`}>
                      {currentSlide.slideType === "title"
                        ? "Lecture Intro"
                        : currentSlide.slideType === "concept_quiz"
                        ? "Classroom Checkpoint"
                        : currentSlide.slideType === "worked_example"
                        ? "Worked Trace"
                        : currentSlide.slideType === "code_algorithm"
                        ? "Algorithm & Code"
                        : currentSlide.slideType === "comparison"
                        ? "Comparison Matrix"
                        : currentSlide.slideType === "diagram_flow"
                        ? "State Architecture"
                        : `Slide ${currentSlide.slideNum || currentSlideIndex + 1}`}
                    </span>
                    {ppt.unit && (
                      <span className={`text-xs font-semibold ${themeClasses.subtext}`}>
                        {ppt.unit}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-xs font-bold ${themeClasses.accent}`}>
                      {ppt.courseCode}
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {currentSlide.title}
                </h1>
                {currentSlide.subtitle && (
                  <p className={`text-sm sm:text-base font-medium mt-1 ${themeClasses.subtext}`}>
                    {currentSlide.subtitle}
                  </p>
                )}

                {/* Visual Body Variants according to Slide Type */}

                {/* 1. Standard Bullets */}
                {bullets.length > 0 && currentSlide.slideType !== "comparison" && (
                  <ul className="mt-5 space-y-2.5">
                    {bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base font-medium">
                        <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${theme === "light" ? "bg-indigo-600" : "bg-indigo-400"}`} />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 2. Side-by-Side Comparison Layout */}
                {currentSlide.comparisonData && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className={`p-4 rounded-xl border ${themeClasses.cardBg}`}>
                      <h4 className="font-bold text-sm text-rose-400 mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        {currentSlide.comparisonData.leftTitle}
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm">
                        {currentSlide.comparisonData.leftPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-inherit opacity-90">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Column */}
                    <div className={`p-4 rounded-xl border ${themeClasses.cardBg}`}>
                      <h4 className="font-bold text-sm text-emerald-400 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {currentSlide.comparisonData.rightTitle}
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm">
                        {currentSlide.comparisonData.rightPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-inherit opacity-90">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3. Diagram Flow / Step-by-Step Architecture Pipeline */}
                {currentSlide.diagramFlow && (
                  <div className="mt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2.5">
                      {currentSlide.diagramFlow.flowTitle}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {currentSlide.diagramFlow.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className={`p-3 rounded-xl border transition-all ${
                            st.highlight
                              ? "bg-indigo-900/40 border-indigo-500 ring-1 ring-indigo-500/50"
                              : themeClasses.cardBg
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center">
                              {st.stepNumber}
                            </span>
                            {st.highlight && (
                              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-800">
                                Key Step
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xs text-inherit mb-1">{st.label}</div>
                          <p className="text-[11px] opacity-80 leading-snug">{st.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Code & Algorithm Block */}
                {codeObject && codeObject.code && (
                  <div className="mt-5 space-y-2">
                    <div className={`rounded-xl border p-4 font-mono text-xs overflow-x-auto relative ${themeClasses.codeBg}`}>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] opacity-70">
                        <span className="uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-indigo-400" />
                          {codeObject.language || "Code Walkthrough"}
                        </span>
                        <button
                          onClick={() => handleCopyCode(codeObject.code)}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedCode ? "Copied" : "Copy Code"}
                        </button>
                      </div>
                      <pre className="text-inherit leading-relaxed whitespace-pre font-mono">
                        <code>{codeObject.code}</code>
                      </pre>
                    </div>
                    {codeObject.explanation && (
                      <p className={`text-xs italic ${themeClasses.subtext}`}>
                        {codeObject.explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* 5. Matrix / Table */}
                {currentSlide.matrixOrTable && (
                  <div className="mt-5 space-y-2">
                    {currentSlide.matrixOrTable.caption && (
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                        <Table className="w-3.5 h-3.5" />
                        {currentSlide.matrixOrTable.caption}
                      </span>
                    )}
                    <div className="overflow-x-auto rounded-xl border border-inherit/30">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className={themeClasses.tableHeader}>
                            {currentSlide.matrixOrTable.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 font-bold border-b border-inherit/20">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentSlide.matrixOrTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className={`border-b border-inherit/10 ${themeClasses.tableRow}`}>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`p-2.5 font-mono ${
                                    cIdx === 0 ? "font-bold text-inherit" : "opacity-90"
                                  } ${cell.includes("Opt") ? "text-amber-400 font-bold bg-amber-500/10" : ""}`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. Step-by-Step Worked Example */}
                {currentSlide.workedExample && (
                  <div className={`mt-5 p-4 rounded-xl border ${themeClasses.cardBg} space-y-3`}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                        Problem Statement:
                      </span>
                      <span className="text-xs font-medium text-inherit">
                        {currentSlide.workedExample.problemStatement}
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/50">
                      {currentSlide.workedExample.steps.map((st) => (
                        <div key={st.stepNumber} className="text-xs">
                          <span className="font-bold text-amber-300 mr-1.5">
                            Step {st.stepNumber} ({st.title}):
                          </span>
                          <span className="opacity-90">{st.detail}</span>
                        </div>
                      ))}
                    </div>

                    {currentSlide.workedExample.finalResult && (
                      <div className="pt-2 border-t border-inherit/20 flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Result: {currentSlide.workedExample.finalResult}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. Interactive Concept Quiz / Active Learning Checkpoint */}
                {currentSlide.conceptQuiz && (
                  <div className={`mt-5 p-5 rounded-2xl border ${themeClasses.cardBg} space-y-4`}>
                    <div className="flex items-start gap-2.5">
                      <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        <HelpCircle className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 block">
                          Classroom Checkpoint Question
                        </span>
                        <p className="text-sm font-bold text-inherit mt-1">
                          {currentSlide.conceptQuiz.question}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentSlide.conceptQuiz.options.map((opt, oIdx) => {
                        const isSelected = selectedQuizOption === oIdx;
                        const isCorrect = oIdx === currentSlide.conceptQuiz?.correctOptionIndex;
                        const showResult = showQuizExplanation || selectedQuizOption !== null;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setSelectedQuizOption(oIdx);
                              setShowQuizExplanation(true);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-start gap-2 ${
                              showResult && isCorrect
                                ? "bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500"
                                : showResult && isSelected && !isCorrect
                                ? "bg-rose-950/60 border-rose-500 text-rose-200"
                                : "bg-slate-900/40 hover:bg-slate-800/80 border-slate-700/60 text-inherit"
                            }`}
                          >
                            <span className="font-bold font-mono shrink-0">
                              {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : `${String.fromCharCode(65 + oIdx)})`}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showQuizExplanation && currentSlide.conceptQuiz.explanation && (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5">Faculty Explanation:</span>
                          <p>{currentSlide.conceptQuiz.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Highlight Callout Box */}
                {currentSlide.highlightBox && (
                  <div className={`mt-5 p-4 rounded-xl border ${themeClasses.highlightCard}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-500">
                        {currentSlide.highlightBox.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                      {currentSlide.highlightBox.content}
                    </p>
                  </div>
                )}
              </div>

              {/* Slide Footer / Key Takeaway */}
              <div className="mt-8 pt-4 border-t border-inherit/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                    Key Takeaway:
                  </span>
                  <span className="font-semibold text-inherit opacity-90">
                    {currentSlide.keyTakeaway}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 opacity-60 font-mono text-[11px]">
                  <span>Lecture {ppt.lectureNum}</span>
                  <span>•</span>
                  <span>{currentSlideIndex + 1} of {slides.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Faculty Presenter Sidebar (Speaker Notes, Timing, & Class Pacing) */}
          {viewMode === "presenter" && (
            <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between text-xs space-y-4 shrink-0 overflow-y-auto max-h-80 lg:max-h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Presenter Dashboard
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {formatTimer(timerSeconds)}
                    </span>
                    <button
                      onClick={() => setIsTimerRunning((prev) => !prev)}
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      {isTimerRunning ? "Pause" : "Start"}
                    </button>
                  </div>
                </div>

                {/* Speaker Notes */}
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 space-y-1.5">
                  <span className="font-bold text-xs text-purple-300 block">
                    Professor Talking Points & Pedagogy:
                  </span>
                  <p className="leading-relaxed text-[11px] text-purple-200/90">
                    {currentSlide.speakerNotes ||
                      "Emphasize the mathematical formulation and engage students by asking why alternative heuristics fail."}
                  </p>
                </div>

                {/* Target Bloom's Cognitive Level */}
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 space-y-1">
                  <span className="font-bold text-[11px] text-slate-400 block">
                    Target Cognitive Outcome:
                  </span>
                  <span className="font-bold text-xs text-indigo-400">
                    {ppt.bloomsLevel || "Apply (L3) — Mathematical State Optimization"}
                  </span>
                </div>

                {/* Next Slide Thumbnail Preview */}
                {slides[currentSlideIndex + 1] && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Up Next: Slide {currentSlideIndex + 2}
                    </span>
                    <div className="font-bold text-xs text-slate-200">
                      {slides[currentSlideIndex + 1].title}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {slides[currentSlideIndex + 1].keyTakeaway}
                    </p>
                  </div>
                )}
              </div>

              {/* Presenter Footer Controls */}
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Use keyboard arrows ◄ ► or Space to advance slides.</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Slide Strip & Navigation Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            disabled={currentSlideIndex === 0}
            onClick={() => {
              setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
              setSelectedQuizOption(null);
              setShowQuizExplanation(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 disabled:opacity-30 cursor-pointer flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Slide Thumbnails / Indicator Pills */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setSelectedQuizOption(null);
                  setShowQuizExplanation(false);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? "w-8 bg-indigo-500 shadow-xs"
                    : "w-2.5 bg-slate-700 hover:bg-slate-600"
                }`}
                title={`Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">
              {currentSlideIndex + 1} / {slides.length}
            </span>

            <button
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => {
                setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
                setSelectedQuizOption(null);
                setShowQuizExplanation(false);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white disabled:opacity-30 cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
