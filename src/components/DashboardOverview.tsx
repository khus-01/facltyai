import React from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
  Mic,
  FileText,
  Clock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Bot,
  Zap,
} from "lucide-react";
import {
  FacultyMember,
  Student,
  Course,
  Assignment,
  AcademicTask,
  Announcement,
  FacultyRequest,
} from "../types";

interface DashboardOverviewProps {
  facultyList: FacultyMember[];
  studentList: Student[];
  courseList: Course[];
  assignments?: Assignment[];
  assignmentList?: Assignment[];
  tasks?: AcademicTask[];
  announcements?: Announcement[];
  requests?: FacultyRequest[];
  requestList?: FacultyRequest[];
  onNavigate: (tab: string) => void;
  setActiveTab?: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  facultyList,
  studentList,
  courseList,
  assignments = [],
  assignmentList = [],
  tasks = [],
  announcements = [],
  requests = [],
  requestList = [],
  onNavigate,
  setActiveTab,
}) => {
  const navigate = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (setActiveTab) setActiveTab(tab);
  };

  const actualAssignments = assignments.length > 0 ? assignments : assignmentList;
  const actualRequests = requests.length > 0 ? requests : requestList;

  const atRiskStudents = studentList.filter(
    (s) => s.attendanceRate < 75 || s.status === "At Risk"
  );
  const pendingRequests = actualRequests.filter((r) => r.status === "Pending");
  const pendingGradingCount = actualAssignments.reduce(
    (acc, a) => acc + ((a.submittedCount || a.submissionsCount || 0) - a.gradedCount),
    0
  );

  const avgAttendance = (
    studentList.reduce((acc, s) => acc + s.attendanceRate, 0) / (studentList.length || 1)
  ).toFixed(1);

  const avgSyllabusProgress = Math.round(
    courseList.reduce((acc, c) => acc + (c.syllabusCoveragePercent || 0), 0) /
      (courseList.length || 1)
  );

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Bento KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento KPI 1: Total Faculty */}
        <div
          onClick={() => navigate("faculty")}
          className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Faculty
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              {facultyList.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
              +12 this semester
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>4 Active Departments</span>
            <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Bento KPI 2: Students */}
        <div
          onClick={() => navigate("students")}
          className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Students Enrolled
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              1,280
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
              {avgAttendance}% Avg Attendance
            </div>
          </div>
          <div className="text-[11px] text-rose-600 font-bold pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>{atRiskStudents.length} Flagged below 75%</span>
            <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              Review <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Bento KPI 3: Courses */}
        <div
          onClick={() => navigate("courses")}
          className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Courses
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              {courseList.length}
            </div>
            <div className="text-[11px] text-indigo-600 font-bold mt-0.5">
              {avgSyllabusProgress}% Syllabus Covered
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Outcome Mapped (CO-PO)</span>
            <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              Explore <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Bento KPI 4: High Pending Tasks (Vibrant Dark Indigo Bento) */}
        <div
          onClick={() => navigate("tasks")}
          className="bg-indigo-600 border border-indigo-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-indigo-100 text-white cursor-pointer group hover:bg-indigo-500 transition-all"
        >
          <div className="flex items-center justify-between text-indigo-200">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">
              Pending Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-white uppercase tracking-tight">
              {tasks.length > 0 ? `${tasks.length} Active` : "12 High"}
            </div>
            <div className="text-[11px] text-indigo-100 font-bold mt-0.5">
              {pendingGradingCount} Graded • {pendingRequests.length} Review
            </div>
          </div>
          <div className="text-[11px] text-indigo-100 font-bold pt-2 border-t border-indigo-500/50 flex items-center justify-between">
            <span>Action Required</span>
            <span className="text-white font-black group-hover:translate-x-0.5 transition-transform flex items-center">
              Manage <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Bento Modular Compartments (Asymmetric Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bento Large Block: AI Lecture Planning & Syllabus Coverage (Col Span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight flex items-center gap-2.5">
                <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                AI Lecture Planning & Milestones
              </h3>
              <button
                onClick={() => navigate("ai_planner")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Auto-Optimize <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>

            <div className="space-y-4">
              {courseList.slice(0, 2).map((course) => (
                <div
                  key={course.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-xs font-black text-slate-900">{course.code}: </span>
                      <span className="text-sm font-bold text-slate-700">{course.name}</span>
                    </div>
                    <span className="text-xs font-black text-indigo-600">
                      {course.syllabusCoveragePercent}% Covered
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.syllabusCoveragePercent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Next: Bloom’s Taxonomy Mapping for {course.code} (Unit 4 short-path algorithms)
                  </p>
                </div>
              ))}

              {courseList.length > 2 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-xs font-black text-slate-900">
                        {courseList[2].code}:{" "}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {courseList[2].name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-emerald-600">
                      {courseList[2].syllabusCoveragePercent}% Covered
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${courseList[2].syllabusCoveragePercent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 font-medium">
                    Completed: Teaching materials & rubric criteria for laboratory modules
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              id="btn-bento-create-assessment"
              onClick={() => navigate("ai_assessment")}
              className="py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-indigo-300" />
              Create Assessment Paper
            </button>
            <button
              id="btn-bento-generate-syllabus"
              onClick={() => navigate("ai_planner")}
              className="py-3 px-4 rounded-xl border-2 border-slate-900 text-slate-900 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Generate Syllabus Plan
            </button>
          </div>
        </div>

        {/* Bento Medium Block: AI Meeting Assistant (MoM) (Col Span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-800 text-base uppercase tracking-tight flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-600" />
                AI Meeting Assistant
              </h3>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Rec: On
              </span>
            </div>

            <div className="border-l-2 border-indigo-100 pl-4 space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wide">
                  10:14 AM • CSE DEPT BOARD SYNC
                </p>
                <p className="text-xs leading-relaxed text-slate-600 italic">
                  "The CO-PO attainment mapping for the new AI & Algorithms curriculum requires full alignment with Tier-1 criteria..."
                </p>
              </div>

              <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] font-black text-indigo-800 uppercase tracking-wider">
                    AI Generated Action Item
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-700">
                  Finalize revised CO-PO question paper rubric by Friday. Assigned to <strong>Dr. Arvind Ramesh</strong>.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("ai_meeting")}
            className="mt-4 w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-indigo-200/60 shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Mic className="w-3.5 h-3.5" />
            Generate Minutes of Meeting (MoM)
          </button>
        </div>
      </div>

      {/* Bento Lower Grid: Low Attendance, Requisitions & Faculty Chatbot Assistant */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Bento Low Attendance Card (Col Span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Low Attendance Alerts
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                {atRiskStudents.length} Defaulters
              </span>
            </div>

            <div className="space-y-2">
              {atRiskStudents.slice(0, 3).map((stu) => (
                <div
                  key={stu.id}
                  className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                      {stu.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{stu.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{stu.rollNumber} • Sem {stu.semester}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                    {stu.attendanceRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("attendance")}
            className="mt-4 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 py-2 rounded-xl border border-rose-200 transition-colors text-center cursor-pointer w-full"
          >
            Dispatch Formal Condonation Warnings →
          </button>
        </div>

        {/* Bento Requisitions & Leaves Card (Col Span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" />
                Recent Requests
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {pendingRequests.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {actualRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      req.status === "Pending" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                      {req.type}: {req.title}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {req.facultyName} • {req.urgency} Urgency
                    </p>
                    <div className="flex gap-3 mt-1.5">
                      <span
                        onClick={() => navigate("requests")}
                        className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Approve
                      </span>
                      <span
                        onClick={() => navigate("requests")}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Review
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("requests")}
            className="mt-4 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-xl border border-indigo-200 transition-colors text-center cursor-pointer w-full"
          >
            Manage Approvals Workflow →
          </button>
        </div>

        {/* Bento Chatbot Assistant Callout Banner (Col Span 4) */}
        <div className="lg:col-span-4 bg-indigo-900 border border-slate-900 rounded-2xl shadow-lg p-5 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center border border-indigo-400/20 text-indigo-300">
                <Bot className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                  Faculty Chatbot Assistant
                </p>
                <p className="text-xs font-semibold text-white">Instant Academic Co-Pilot</p>
              </div>
            </div>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              Ask about syllabus regulations, rubrics, lecture ideas, or student advising policies.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-indigo-800/80">
            <button
              onClick={() => navigate("ai_chat")}
              className="flex-1 py-2 bg-indigo-800 hover:bg-indigo-700 rounded-xl border border-indigo-700 text-xs font-bold text-indigo-100 text-center transition-colors cursor-pointer"
            >
              Quick Prompt
            </button>
            <button
              id="btn-bento-launch-advisor"
              onClick={() => navigate("ai_chat")}
              className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-indigo-900 shadow-xl cursor-pointer hover:scale-105 transition-transform"
              title="Launch AI Chat"
            >
              <ArrowRight className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
