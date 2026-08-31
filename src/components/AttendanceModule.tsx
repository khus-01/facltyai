import React, { useState } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  Download,
  Users,
  BarChart2,
} from "lucide-react";
import { AttendanceRecord, Student, Course } from "../types";

interface AttendanceModuleProps {
  attendanceRecords: AttendanceRecord[];
  studentList: Student[];
  courseList: Course[];
  onTakeAttendance: (records: Partial<AttendanceRecord>[]) => void;
  onSendWarning: (student: Student) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  attendanceRecords,
  studentList,
  courseList,
  onTakeAttendance,
  onSendWarning,
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState(courseList[0]?.code || "CS301");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceSheet, setAttendanceSheet] = useState<
    { studentId: string; name: string; rollNumber: string; status: "Present" | "Absent" | "Late" | "Excused" }[]
  >(
    studentList.map((s) => ({
      studentId: s.id,
      name: s.name,
      rollNumber: s.rollNumber,
      status: "Present",
    }))
  );

  const [activeTab, setActiveTab] = useState<"daily" | "low_attendance">("daily");

  const lowAttendanceStudents = studentList.filter((s) => s.attendanceRate < 75);

  const toggleStatus = (studentId: string, newStatus: "Present" | "Absent" | "Late" | "Excused") => {
    setAttendanceSheet((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status: newStatus } : item))
    );
  };

  const markAllPresent = () => {
    setAttendanceSheet((prev) => prev.map((item) => ({ ...item, status: "Present" })));
  };

  const handleSaveAttendance = () => {
    const records: Partial<AttendanceRecord>[] = attendanceSheet.map((item) => ({
      courseCode: selectedCourseCode,
      date: selectedDate,
      studentId: item.studentId,
      studentName: item.name,
      rollNumber: item.rollNumber,
      status: item.status,
    }));
    onTakeAttendance(records);
    alert(`Attendance for ${selectedCourseCode} on ${selectedDate} has been saved successfully.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            Attendance Monitoring & Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log class registers, monitor student attendance percentages, and dispatch automated condonation warnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "daily" ? "bg-slate-900 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Mark Daily Register
          </button>
          <button
            onClick={() => setActiveTab("low_attendance")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "low_attendance"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white border border-rose-200 text-rose-700 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Attendance Alerts ({lowAttendanceStudents.length})</span>
          </button>
        </div>
      </div>

      {activeTab === "daily" ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Select Course</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 font-bold text-slate-900 bg-white"
                >
                  {courseList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Session Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-medium bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 sm:pt-0">
              <button
                onClick={markAllPresent}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Mark All Present
              </button>
              <button
                id="btn-save-attendance"
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Submit Register
              </button>
            </div>
          </div>

          {/* Student Register Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Overall %</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceSheet.map((item) => {
                  const student = studentList.find((s) => s.id === item.studentId);
                  const rate = student?.attendanceRate || 85;

                  return (
                    <tr key={item.studentId} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{item.rollNumber}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            rate >= 75 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {(["Present", "Absent", "Late", "Excused"] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => toggleStatus(item.studentId, st)}
                              className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                                item.status === st
                                  ? st === "Present"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : st === "Absent"
                                    ? "bg-rose-600 text-white shadow-xs"
                                    : st === "Late"
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "bg-blue-600 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Low Attendance Defaulters List & Parent Warning */
        <div className="bg-white rounded-xl border border-rose-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Critical Low Attendance Defaulters (&lt; 75%)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students below statutory attendance threshold eligible for condonation warnings or exam debarment.
              </p>
            </div>

            <button
              onClick={() => {
                lowAttendanceStudents.forEach((s) => onSendWarning(s));
                alert(`Official warning notices dispatched to ${lowAttendanceStudents.length} student parent contacts.`);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Warnings to All</span>
            </button>
          </div>

          <div className="space-y-3">
            {lowAttendanceStudents.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-rose-150 bg-rose-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-300" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                    <p className="text-slate-500">
                      Roll No: <strong className="font-mono text-slate-800">{s.rollNumber}</strong> • {s.department}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Parent Contact: {s.parentContact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-sm font-bold text-rose-700 block">{s.attendanceRate}%</span>
                    <span className="text-[10px] uppercase font-bold text-rose-600">Critical Deficit</span>
                  </div>

                  <button
                    onClick={() => {
                      onSendWarning(s);
                      alert(`Notice dispatched to parent of ${s.name} (${s.parentContact}).`);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Send Warning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
