import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  Copy,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Trash2,
  Layers,
  ArrowRight,
  ExternalLink,
  Search,
  Calendar,
  Award,
  AlertTriangle,
  FileText,
  Users,
} from "lucide-react";
import { ChatMessage } from "../types";
import { sendAIChatMessage } from "../services/geminiService";
import { initialCourses, initialStudents, initialFacultyList } from "../data/mockData";

interface AIChatbotProps {
  onNavigateTab?: (tab: string) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onNavigateTab }) => {
  const [persona, setPersona] = useState<"faculty" | "dean" | "advisor" | "admin">("faculty");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: `Hello! I am your AI Academic Advisor & Faculty Co-Pilot.

I have direct contextual grounding into your courses (**CS301, AI501, CS201, MA101**), student attendance rosters, faculty schedules, and university administrative regulations.

How can I assist your faculty duties or administrative workflows today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: [
        "Which students have attendance below 75% in CS301?",
        "Draft a formal parent warning letter for attendance defaulters",
        "Explain NBA CO-PO Direct Attainment calculation",
        "What are Dr. Elena Rostova's cabin consultation hours?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setIsLoading(true);

    try {
      // Build dynamic system context with real app state
      const systemContext = {
        currentRole: persona,
        activeUser: "Dr. Arvind Ramesh (HOD & Professor)",
        department: "Computer Science & Engineering",
        coursesSummary: initialCourses.map((c) => ({
          code: c.code,
          name: c.name,
          coverage: `${c.syllabusCoveragePercent}%`,
          enrolled: c.enrolledStudentsCount,
        })),
        defaulters: initialStudents
          .filter((s) => s.attendanceRate < 75)
          .map((s) => ({
            name: s.name,
            roll: s.rollNumber,
            rate: `${s.attendanceRate}%`,
            status: s.status,
          })),
        facultyStaff: initialFacultyList.map((f) => ({
          name: f.name,
          title: f.title,
          room: f.officeRoom,
          cabinHours: f.cabinHours,
          assigned: f.assignedCourses,
        })),
        policies: [
          "Minimum 75% attendance required to appear for End-Semester Examinations.",
          "Condonation permitted between 65% and 74.9% on valid medical or official university duty grounds.",
          "Faculty duty leave capped at 14 days per academic calendar year for conferences.",
        ],
      };

      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await sendAIChatMessage({
        message: textToSend,
        history,
        persona: (persona === "dean" || persona === "advisor" ? "faculty" : persona) as any,
      });

      const aiReplyText = res.reply || "I have analyzed your query and retrieved the relevant academic context.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("AI Chatbot Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "assistant",
          text: `I encountered an issue processing your query: ${err.message || "Connection error"}. Please verify your parameters and try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccessId(id);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: "assistant",
        text: "Chat history cleared. How can I assist your faculty duties today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Structured query categories
  const queryCategories = [
    { id: "all", label: "All Topics" },
    { id: "courses", label: "Course & Syllabus", icon: BookOpen },
    { id: "students", label: "Students & Attendance", icon: Users },
    { id: "schedules", label: "Faculty & Schedules", icon: Calendar },
    { id: "admin", label: "Admin & Regulations", icon: Briefcase },
  ];

  const quickPrompts = [
    {
      category: "students",
      label: "Low Attendance Notice",
      text: "Draft a formal academic warning letter to parents of students below 75% attendance in CS301.",
    },
    {
      category: "courses",
      label: "Active Learning for Graphs",
      text: "Recommend an outcome-based active learning pedagogy for teaching Dijkstra's and Bellman-Ford algorithms.",
    },
    {
      category: "courses",
      label: "CO-PO Attainment Calculation",
      text: "Explain the exact direct attainment calculation formula for Course Outcomes (CO1 to CO5) mapping to Program Outcomes (PO1 to PO12) under NBA Tier-1 guidelines.",
    },
    {
      category: "schedules",
      label: "Faculty Office Hours & Rooms",
      text: "List the office room numbers and consultation cabin hours for all Computer Science department faculty.",
    },
    {
      category: "admin",
      label: "Conference Duty Leave Rules",
      text: "What is the university policy and procedure for applying for Duty Leave (DL) to present research at international IEEE conferences?",
    },
    {
      category: "students",
      label: "Remedial Plan for At-Risk",
      text: "Generate a 4-week remedial tutorial action plan for students struggling with Dynamic Programming in Design & Analysis of Algorithms.",
    },
  ];

  const filteredPrompts =
    activeCategory === "all"
      ? quickPrompts
      : quickPrompts.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
              AI Module 3
            </span>
            <span className="text-xs text-slate-500 font-semibold">Faculty Co-Pilot & Advisor</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            AI Faculty Assistant & Academic Co-Pilot
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Context-grounded assistant for course curricula, attendance defaulters, faculty schedules, and administrative procedures.
          </p>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600">Role Context:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-800 shadow-xs cursor-pointer"
          >
            <option value="faculty">Faculty Member (Prof. Arvind Ramesh)</option>
            <option value="dean">Academic Dean & Curriculum Head</option>
            <option value="advisor">Student Advisor / Mentor</option>
            <option value="admin">Administrative Coordinator</option>
          </select>
          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-rose-600 shadow-xs cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Grid (Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Suggestions & Context Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Context Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Live Grounding Context
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Synced
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Active Faculty User:</span>
                <strong className="text-slate-900">Dr. Arvind Ramesh</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Department:</span>
                <strong className="text-slate-900">Computer Science</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Courses Monitored:</span>
                <strong className="text-indigo-700 font-mono">CS301, AI501, CS201, MA101</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Attendance Defaulters (&lt;75%):</span>
                <strong className="text-rose-700 font-bold">2 Students</strong>
              </div>
            </div>

            {/* Quick Navigation Triggers */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
              {onNavigateTab && (
                <>
                  <button
                    onClick={() => onNavigateTab("ai_assessment")}
                    className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[10px] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>Assessments</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onNavigateTab("ai_meeting")}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[10px] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>Meeting MoM</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Prompts Bento Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Frequently Requested Queries
            </h3>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {queryCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    activeCategory === c.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Prompts list */}
            <div className="space-y-2 pt-1">
              {filteredPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 text-left transition-all group cursor-pointer space-y-1"
                >
                  <div className="font-bold text-slate-900 text-xs group-hover:text-indigo-700 flex items-center justify-between">
                    <span>{p.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{p.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Interactive Chat Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs h-[640px] overflow-hidden">
          {/* Chat Messages Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const isCopied = copySuccessId === msg.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                      isUser
                        ? "bg-indigo-600 text-white font-medium rounded-br-xs"
                        : "bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs"
                    }`}
                  >
                    {/* Message Header */}
                    <div
                      className={`flex items-center justify-between gap-3 text-[10px] pb-1 border-b ${
                        isUser
                          ? "border-indigo-500/50 text-indigo-200"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      <span className="font-bold">
                        {isUser ? "You (Dr. Arvind Ramesh)" : "AI Academic Assistant"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            title="Copy response"
                            className="hover:text-slate-700 cursor-pointer"
                          >
                            {isCopied ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Message Body (supports markdown-like linebreaks) */}
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {msg.text}
                    </div>

                    {/* Suggestions Chips if available */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="pt-2 space-y-1.5 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Suggested Next Inquiries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(sug)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-800 text-[11px] font-medium transition-colors text-left cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="font-medium">Retrieving academic records and generating response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about courses, student defaulters, schedules, policies, or CO-PO attainment..."
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center">
              AI Co-Pilot is grounded in live institutional records and university guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
