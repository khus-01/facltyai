import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  User,
  Users,
  AlertCircle,
  Printer,
  Copy,
  Plus,
  Play,
  Pause,
  RefreshCw,
  Share2,
  Calendar,
  Building2,
  CheckSquare,
  ListOrdered,
  Briefcase,
  Layers,
  ArrowRight,
  BookmarkCheck,
  Radio,
} from "lucide-react";
import { MeetingMoM, AcademicTask } from "../types";
import { generateAIMeetingMoM } from "../services/geminiService";

interface AIMeetingAssistantProps {
  meetingList: MeetingMoM[];
  onSaveMoM: (mom: MeetingMoM) => void;
  onAddTask?: (task: AcademicTask) => void;
}

export const AIMeetingAssistant: React.FC<AIMeetingAssistantProps> = ({
  meetingList = [],
  onSaveMoM,
  onAddTask,
}) => {
  const [meetingTitle, setMeetingTitle] = useState("CSE Department Curriculum & Accreditation Review Board");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [meetingType, setMeetingType] = useState("Curriculum Board");
  const [transcriptText, setTranscriptText] = useState(
    `Meeting commenced at 10:30 AM chaired by Dr. Arvind Ramesh (HOD).
Attendees: Dr. Arvind Ramesh (Chair), Prof. Marcus Vance, Dr. Elena Rostova, Dr. Priya Sundaram, Prof. Kevin Patel.
Absentees: Dr. Sarah Chen (attending IEEE AI Conference in Singapore with prior sanction).

1. Syllabus Progress & Course Coverage Review:
Dr. Arvind presented midterm progress data across 6th-semester courses. Average syllabus covered is 76%. Prof. Marcus reported students needing extra tutorial support in Dynamic Programming and Graph Traversals.
Decision: Schedule 3 mandatory Saturday tutorial remedial sessions starting next weekend.

2. Student Attendance Compliance & Defaulters:
Dr. Elena highlighted 4 students falling below 72% attendance in Algorithms and Deep Learning.
Decision: Faculty Advisor will issue formal parent warning letters via the dashboard by this Friday.

3. AI Assessment & Question Bank Integration:
The board approved the new AI Question Bank and Rubric Generator framework for the upcoming semester finals. All faculty will submit Bloom's Level 3-5 mapped question papers.
Decision: Formally adopt outcome-based question bank for all CSE modules.
Action: Prof. Marcus Vance to compile final questions by Sept 12.

4. Lab Infrastructure Procurement:
Dr. Elena submitted a requisition for 4x NVIDIA GPU nodes for the Turing AI lab research project.
Decision: Forward procurement request to Dean of Academics for budget clearance.
Action: Dr. Elena Rostova to submit technical vendor quotes by Sept 5.

Meeting adjourned at 11:45 AM. Next board meeting scheduled for October 14 at 10:30 AM.`
  );

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [currentMoM, setCurrentMoM] = useState<MeetingMoM | null>(meetingList[0] || null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [taskPushSuccess, setTaskPushSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recorder" | "history">("recorder");

  // Audio recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(",")[1];
          setAudioBase64(base64Data);
        };
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone permission denied or unavailable. You can use the quick sample transcripts or type notes directly.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setAudioBlobUrl(url);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1];
        setAudioBase64(base64Data);
      };
    } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTranscriptText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const loadScenario = (scenarioIndex: number) => {
    if (scenarioIndex === 1) {
      setMeetingTitle("CSE Department Curriculum & Accreditation Review Board");
      setMeetingType("Curriculum Board");
      setDepartment("Computer Science & Engineering");
      setTranscriptText(`Meeting commenced at 10:30 AM chaired by Dr. Arvind Ramesh (HOD).
Attendees: Dr. Arvind Ramesh, Prof. Marcus Vance, Dr. Elena Rostova, Dr. Priya Sundaram.
Absentees: Dr. Sarah Chen (attending IEEE conference in Singapore).

1. Syllabus Progress Review:
Average syllabus covered is 76%. Prof. Marcus reported students needing extra tutorial support in Dynamic Programming.
Decision: Schedule 3 mandatory Saturday tutorial sessions.

2. Student Attendance Compliance:
Dr. Elena highlighted 4 students below 72% attendance.
Decision: Issue formal parent warning letters via dashboard by this Friday.

3. AI Assessment Integration:
The board approved the new AI Question Bank and Rubric Generator framework.
Action: Prof. Marcus Vance to compile final questions by Sept 12.

4. Lab Infrastructure:
Requisition for 4x NVIDIA GPU nodes for Turing AI lab.
Decision: Forward procurement request to Dean for budget clearance.`);
    } else if (scenarioIndex === 2) {
      setMeetingTitle("Faculty Teaching Load & Exam Moderation Committee");
      setMeetingType("Exam Moderation");
      setDepartment("Computer Science & Engineering");
      setTranscriptText(`Meeting called to order at 2:00 PM by Dean of Academics Dr. Robert Sterling.
Attendees: Dr. Robert Sterling (Dean), Dr. Arvind Ramesh (HOD CSE), Dr. Elena Rostova, Prof. Alan Turing.
Absentees: None.

1. Faculty Teaching Load Audit:
All assistant professors capped at 16 teaching hours per week. Dr. Arvind confirmed CS301 has 14 hours allocated.
Decision: Unanimously approved workload distribution for Autumn Term.

2. End-Semester Question Paper Moderation:
Reviewed 3 sets of question papers for CS301 and AI501. Verified 100% Bloom's taxonomy mapping with CO3-CO5 attainment.
Decision: Sealed Sets A and B for final printing under high security.
Action: Dr. Arvind Ramesh to submit signed moderation forms to Exam Cell by Sept 8.`);
    } else if (scenarioIndex === 3) {
      setMeetingTitle("Student Academic Grievance & Attendance Council");
      setMeetingType("Academic Grievance");
      setDepartment("Student Welfare Cell");
      setTranscriptText(`Meeting opened at 3:30 PM by Dean of Student Welfare.
Attendees: Dr. Elena Rostova, Prof. Marcus Vance, Student Council Representative Maya Lin.

1. Medical Condonation Appeals:
Reviewed 5 medical certificates for students between 65% and 74.9% attendance.
Decision: Approved condonation for Maya Lin and Chloe Dubois based on verified hospital records.
Action: Prof. Marcus Vance to update ERP attendance portal before Sept 4.`);
    }
  };

  const handleGenerateMoM = async () => {
    setIsLoading(true);
    try {
      const res = await generateAIMeetingMoM({
        meetingTitle,
        meetingType,
        department,
        date: new Date().toLocaleDateString(),
        transcript: transcriptText,
        audioBase64: audioBase64 || undefined,
        audioMimeType: "audio/webm",
      });

      if (res.mom) {
        const fullMoM: MeetingMoM = {
          id: `MOM-${Date.now().toString().slice(-4)}`,
          meetingTitle: res.mom.meetingTitle || meetingTitle,
          department: res.mom.department || department,
          date: res.mom.date || new Date().toLocaleDateString(),
          time: res.mom.time || "10:30 AM - 11:45 AM",
          chairperson: res.mom.chairperson || "Dr. Arvind Ramesh (HOD)",
          attendees: res.mom.attendees || ["Dr. Arvind Ramesh", "Prof. Marcus Vance", "Dr. Elena Rostova"],
          absentees: res.mom.absentees || ["Dr. Sarah Chen (Sanctioned Leave)"],
          executiveSummary: res.mom.executiveSummary || "Meeting summarized academic progress and allocated key faculty action items.",
          agendaItemsDiscussed: res.mom.agendaItemsDiscussed || [],
          actionItems: res.mom.actionItems || [],
          resolutionsPassed: res.mom.resolutionsPassed || [],
          nextMeetingDate: res.mom.nextMeetingDate || "October 14, 2026",
          fullTranscript: transcriptText,
        };

        setCurrentMoM(fullMoM);
        onSaveMoM(fullMoM);
      }
    } catch (err: any) {
      console.error("Meeting MoM Error:", err);
      alert(err.message || "Failed to generate Minutes of Meeting");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushActionItemsToTasks = () => {
    if (!currentMoM || !currentMoM.actionItems || currentMoM.actionItems.length === 0) return;
    if (onAddTask) {
      currentMoM.actionItems.forEach((item, idx) => {
        const newTask: AcademicTask = {
          id: `TASK-MOM-${Date.now()}-${idx}`,
          title: item.task,
          description: `Action item assigned during ${currentMoM.meetingTitle} (MoM: ${currentMoM.id}). Assignee: ${item.assignee}`,
          category: "Administrative",
          assigneeName: item.assignee || "Faculty Member",
          deadline: item.deadline || "Next Week",
          priority: (item.priority as any) || "High",
          status: "To Do",
          progressPercent: 0,
          relatedCourseCode: "CS301",
        };
        onAddTask(newTask);
      });
      setTaskPushSuccess(`Pushed ${currentMoM.actionItems.length} action items to Academic Task Tracker!`);
      setTimeout(() => setTaskPushSuccess(null), 3000);
    }
  };

  const handleCopy = () => {
    if (!currentMoM) return;
    navigator.clipboard.writeText(JSON.stringify(currentMoM, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast alert */}
      {taskPushSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{taskPushSuccess}</span>
        </div>
      )}

      {/* Header & Sub-navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase tracking-wider">
              AI Module 2
            </span>
            <span className="text-xs text-slate-500 font-semibold">Governance & Administration</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            AI-Powered Meeting Assistant & Structured MoM Synthesizer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record audio, transcribe discussions, extract key decisions, and assign action items with deadlines directly to the task tracker.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("recorder")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "recorder"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Live Assistant
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>MoM History Archive</span>
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
              {meetingList.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "recorder" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Recording & Transcript Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Audio Recording Bento Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4 text-indigo-600" />
                  Live Meeting Audio Recorder
                </h3>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px] animate-pulse">
                    <Radio className="w-3.5 h-3.5" />
                    Recording: {formatTime(recordingTime)}
                  </span>
                )}
              </div>

              {/* Recorder UI Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Stop Recording ({formatTime(recordingTime)})</span>
                    </button>
                  )}

                  <label className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload Audio/Text</span>
                    <input
                      type="file"
                      accept="audio/*,.txt,.md"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Audio Preview Widget */}
                {audioBlobUrl && (
                  <div className="w-full pt-2">
                    <audio src={audioBlobUrl} controls className="w-full h-8" />
                  </div>
                )}
              </div>

              {/* Quick Academic Scenarios */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Load Academic Scenario:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => loadScenario(1)}
                    className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold text-left hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    1. Curriculum & NBA
                  </button>
                  <button
                    type="button"
                    onClick={() => loadScenario(2)}
                    className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-[10px] font-bold text-left hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    2. Exam Moderation
                  </button>
                  <button
                    type="button"
                    onClick={() => loadScenario(3)}
                    className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold text-left hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    3. Attendance Council
                  </button>
                </div>
              </div>

              {/* Meeting Metadata Inputs */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Meeting Title</label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Meeting Category</label>
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    >
                      <option>Curriculum Board</option>
                      <option>Exam Moderation</option>
                      <option>Academic Grievance</option>
                      <option>Accreditation & NAAC</option>
                      <option>Department All-Hands</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Meeting Discussion Transcript / Notes
                  </label>
                  <textarea
                    rows={6}
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="Paste meeting transcript or live dictation notes here..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono resize-none leading-relaxed"
                  />
                </div>

                <button
                  id="btn-generate-mom"
                  disabled={isLoading || (!transcriptText && !audioBase64)}
                  onClick={handleGenerateMoM}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Synthesizing Minutes of Meeting (MoM)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Structured MoM with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right MoM Output Display (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {currentMoM ? (
              <div className="space-y-4">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      Doc ID: {currentMoM.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Approved & Logged
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onAddTask && currentMoM.actionItems && currentMoM.actionItems.length > 0 && (
                      <button
                        onClick={handlePushActionItemsToTasks}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Push {currentMoM.actionItems.length} Action Items to Tasks</span>
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copySuccess ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print MoM</span>
                    </button>
                  </div>
                </div>

                {/* Structured MoM Document Container */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
                  {/* Institutional Header */}
                  <div className="text-center pb-5 border-b-2 border-slate-900 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Faculty Assistant System • Department of Academic Administration
                    </p>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                      MINUTES OF MEETING (MoM)
                    </h2>
                    <p className="text-sm font-bold text-indigo-700">{currentMoM.meetingTitle}</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-600 pt-1">
                      <span>Dept: <strong>{currentMoM.department}</strong></span>
                      <span>•</span>
                      <span>Date: <strong>{currentMoM.date}</strong></span>
                      <span>•</span>
                      <span>Time: <strong>{currentMoM.time}</strong></span>
                    </div>
                  </div>

                  {/* Attendance & Chairperson Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Chairperson:</span>
                      <div className="font-semibold text-indigo-900 bg-white p-2 rounded-lg border border-slate-200">
                        {currentMoM.chairperson}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Attendees Present:</span>
                      <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-0.5 text-[11px] text-slate-700">
                        {currentMoM.attendees?.map((a, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Absentees:</span>
                      <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-0.5 text-[11px] text-slate-700">
                        {currentMoM.absentees && currentMoM.absentees.length > 0 ? (
                          currentMoM.absentees.map((a, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                              <span>{a}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">None (Full attendance)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  {currentMoM.executiveSummary && (
                    <div className="space-y-1.5">
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Executive Summary
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 font-medium">
                        {currentMoM.executiveSummary}
                      </p>
                    </div>
                  )}

                  {/* Agenda Items Discussed & Decisions Made */}
                  {currentMoM.agendaItemsDiscussed && currentMoM.agendaItemsDiscussed.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <ListOrdered className="w-4 h-4 text-indigo-600" />
                        Key Discussion Points & Deliberations
                      </h4>
                      <div className="space-y-3">
                        {currentMoM.agendaItemsDiscussed.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                              <span className="text-indigo-700">
                                Agenda #{item.itemNumber || idx + 1}: {item.topic}
                              </span>
                            </div>
                            <div className="space-y-1 text-slate-600">
                              <p className="leading-relaxed">
                                <strong className="text-slate-800">Deliberation:</strong> {item.discussion}
                              </p>
                              {item.decisions && (
                                <p className="leading-relaxed text-emerald-800 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200 font-medium">
                                  <strong>Consensus / Decision:</strong> {item.decisions}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formal Resolutions Passed */}
                  {currentMoM.resolutionsPassed && currentMoM.resolutionsPassed.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        Formal Resolutions Passed
                      </h4>
                      <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                        {currentMoM.resolutionsPassed.map((res, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 text-xs text-emerald-950">
                            <span className="font-bold text-emerald-700 font-mono">R{rIdx + 1}.</span>
                            <span className="font-medium">{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Items Matrix */}
                  {currentMoM.actionItems && currentMoM.actionItems.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-purple-600" />
                          Action Items & Assigned Responsibilities
                        </h4>
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          {currentMoM.actionItems.length} Tasks Delegated
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                              <th className="py-2.5 px-3">#</th>
                              <th className="py-2.5 px-3">Action Task</th>
                              <th className="py-2.5 px-3">Responsible Assignee</th>
                              <th className="py-2.5 px-3">Deadline</th>
                              <th className="py-2.5 px-3">Priority</th>
                              <th className="py-2.5 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {currentMoM.actionItems.map((act, aIdx) => (
                              <tr key={aIdx} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">
                                  {aIdx + 1}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">
                                  {act.task}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-indigo-700">
                                  {act.assignee}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                                  {act.deadline}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      act.priority === "High"
                                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                                        : act.priority === "Medium"
                                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                    }`}
                                  >
                                    {act.priority}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    {act.status || "Pending"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Sign-off Signature Blocks */}
                  <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 text-center text-xs font-semibold text-slate-700">
                    <div className="space-y-8">
                      <p className="font-bold">Prepared by:</p>
                      <div className="border-t border-slate-400 mx-12 pt-1">
                        <p className="font-bold text-slate-900">Faculty Secretary</p>
                        <p className="text-[10px] text-slate-500">CSE Department</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <p className="font-bold">Approved by:</p>
                      <div className="border-t border-slate-400 mx-12 pt-1">
                        <p className="font-bold text-slate-900">{currentMoM.chairperson}</p>
                        <p className="text-[10px] text-slate-500">Board Chairperson & HOD</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">No MoM Generated Yet</h3>
                <p className="text-xs max-w-sm text-slate-500">
                  Record meeting audio or paste notes on the left, then click <strong>"Generate Structured MoM with AI"</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MoM History Archive Tab */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetingList.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setCurrentMoM(m);
                  setActiveTab("recorder");
                }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {m.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{m.date}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{m.meetingTitle}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{m.executiveSummary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
                  <span>Chair: {m.chairperson}</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    Open MoM <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
