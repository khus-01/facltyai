import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  Users,
  BookOpen,
  CalendarCheck,
  Award,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { FacultyMember, Student, Course } from "../types";

interface ReportsModuleProps {
  facultyList: FacultyMember[];
  studentList: Student[];
  courseList: Course[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  facultyList,
  studentList,
  courseList,
}) => {
  const [reportType, setReportType] = useState<"attendance" | "workload" | "syllabus" | "academic">("attendance");

  const avgAttendance = Math.round(
    studentList.reduce((acc, s) => acc + s.attendanceRate, 0) / (studentList.length || 1)
  );

  const lowAttendanceCount = studentList.filter((s) => s.attendanceRate < 75).length;
  const avgSyllabus = Math.round(
    courseList.reduce((acc, c) => acc + c.syllabusCoveragePercent, 0) / (courseList.length || 1)
  );

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === "attendance") {
      csvContent += "Student Name,Roll Number,Department,Semester,Attendance Rate %,CGPA\n";
      studentList.forEach((s) => {
        csvContent += `"${s.name}","${s.rollNumber}","${s.department}",${s.semester},${s.attendanceRate},${s.cgpa}\n`;
      });
    } else if (reportType === "workload") {
      csvContent += "Faculty Name,Title,Department,Weekly Teaching Hours,Max Hours,Assigned Courses\n";
      facultyList.forEach((f) => {
        csvContent += `"${f.name}","${f.title}","${f.department}",${f.weeklyTeachingHours},${f.maxTeachingHours},"${f.assignedCourses.join(";")}"\n`;
      });
    } else {
      csvContent += "Course Code,Course Name,Department,Faculty,Syllabus %,Lectures Completed,Target Lectures\n";
      courseList.forEach((c) => {
        csvContent += `"${c.code}","${c.name}","${c.department}","${c.facultyName}",${c.syllabusCoveragePercent},${c.completedLectures},${c.targetLectures}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `academic_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Institutional Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical dashboards, accreditation metrics, faculty workload equity, and student performance indices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Avg Attendance</span>
          <span className="text-2xl font-bold text-slate-900">{avgAttendance}%</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Institutional Target: 75%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Low Attendance</span>
          <span className="text-2xl font-bold text-rose-600">{lowAttendanceCount}</span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-1">Action notices required</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Syllabus Covered</span>
          <span className="text-2xl font-bold text-indigo-600">{avgSyllabus}%</span>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-1">Midterm benchmark: 70%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Active Faculty</span>
          <span className="text-2xl font-bold text-slate-900">{facultyList.length}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">Across 4 Departments</span>
        </div>
      </div>

      {/* Sub-report selector tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        {[
          { id: "attendance", label: "Attendance Compliance", icon: CalendarCheck },
          { id: "workload", label: "Faculty Teaching Workload", icon: Users },
          { id: "syllabus", label: "Syllabus & Lecture Delivery", icon: BookOpen },
          { id: "academic", label: "Academic CGPA Distribution", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                reportType === tab.id
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report 1: Attendance Compliance Breakdown */}
      {reportType === "attendance" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Student Attendance Roster & Defaulters Index</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Attendance %</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2.5 font-bold text-slate-900">{s.name}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">{s.rollNumber}</td>
                    <td className="px-4 py-2.5 text-slate-600">{s.department}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          s.attendanceRate >= 75 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {s.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-slate-700">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2: Faculty Workload */}
      {reportType === "workload" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Faculty Weekly Teaching Hour Allocation</h3>
          <div className="space-y-3">
            {facultyList.map((f) => {
              const pct = Math.round((f.weeklyTeachingHours / f.maxTeachingHours) * 100);
              return (
                <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                      <span className="text-slate-500 text-xs ml-2">({f.title}, {f.department.split(" ")[0]})</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {f.weeklyTeachingHours} / {f.maxTeachingHours} Hours ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 90 ? "bg-rose-500" : pct > 70 ? "bg-indigo-600" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Assigned: {f.assignedCourses.join(", ")}</span>
                    <span>Status: {f.availabilityStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Report 3: Syllabus Coverage */}
      {reportType === "syllabus" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Course Syllabus Coverage & Lecture Milestones</h3>
          <div className="space-y-3">
            {courseList.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold font-mono text-indigo-700 mr-2">{c.code}</span>
                    <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                  </div>
                  <span className="font-bold text-indigo-700">{c.syllabusCoveragePercent}% Completed</span>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${c.syllabusCoveragePercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Instructor: {c.facultyName}</span>
                  <span>{c.completedLectures} of {c.targetLectures} Lectures Delivered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report 4: Academic CGPA */}
      {reportType === "academic" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Student Academic Performance & CGPA Brackets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
              <span className="text-[10px] font-bold uppercase text-amber-800 block">Dean's List (&gt;= 3.80)</span>
              <span className="text-xl font-bold text-amber-900">
                {studentList.filter((s) => s.cgpa >= 3.8).length} Students
              </span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Good Standing (3.00 - 3.79)</span>
              <span className="text-xl font-bold text-emerald-900">
                {studentList.filter((s) => s.cgpa >= 3.0 && s.cgpa < 3.8).length} Students
              </span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-center">
              <span className="text-[10px] font-bold uppercase text-rose-800 block">Academic Probation (&lt; 3.00)</span>
              <span className="text-xl font-bold text-rose-900">
                {studentList.filter((s) => s.cgpa < 3.0).length} Students
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
