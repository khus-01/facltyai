import React, { useState } from "react";
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  AlertTriangle,
  Award,
  Phone,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Send,
} from "lucide-react";
import { Student } from "../types";

interface StudentManagementProps {
  studentList: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updated: Student) => void;
  onSendWarningNotice: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  studentList,
  onAddStudent,
  onUpdateStudent,
  onSendWarningNotice,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [filterRiskOnly, setFilterRiskOnly] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Student Form State
  const [formData, setFormData] = useState({
    name: "",
    department: "Computer Science & Engineering",
    semester: 6,
    section: "A",
    rollNumber: "",
    email: "",
    enrolledCourses: "CS301, CS402, MA201",
    attendanceRate: 88,
    cgpa: 3.5,
    status: "Active" as const,
    parentContact: "+1 (555) 901-0000",
    academicNotes: "Standard enrollment.",
  });

  const departments = ["All", "Computer Science & Engineering", "Artificial Intelligence & Data Science", "Electronics & Communication"];

  const filteredStudents = studentList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || s.department === selectedDept;
    const matchesRisk = filterRiskOnly ? s.attendanceRate < 75 || s.status === "At Risk" : true;
    return matchesSearch && matchesDept && matchesRisk;
  });

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber) return;

    const newStudent: Student = {
      id: `STU-2024-${String(studentList.length + 1).padStart(3, "0")}`,
      name: formData.name,
      department: formData.department,
      semester: Number(formData.semester),
      section: formData.section,
      rollNumber: formData.rollNumber,
      email: formData.email || `${formData.name.toLowerCase().replace(" ", ".")}@univ.edu`,
      avatar: `https://images.unsplash.com/photo-${1539571696357 + studentList.length}?w=150&auto=format&fit=crop&q=80`,
      enrolledCourseCodes: formData.enrolledCourses.split(",").map((c) => c.trim()),
      attendanceRate: Number(formData.attendanceRate),
      cgpa: Number(formData.cgpa),
      status: Number(formData.attendanceRate) < 75 ? "At Risk" : Number(formData.cgpa) >= 3.8 ? "Dean's List" : "Active",
      pendingSubmissionsCount: 0,
      parentContact: formData.parentContact,
      academicNotes: formData.academicNotes,
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Student Academic Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enrollment, attendance monitoring, academic standing, and low-attendance parent notices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setFilterRiskOnly(!filterRiskOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              filterRiskOnly
                ? "bg-rose-50 border-rose-300 text-rose-700 shadow-xs"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${filterRiskOnly ? "text-rose-600" : "text-slate-400"}`} />
            <span>Low Attendance (&lt;75%)</span>
          </button>

          <button
            id="btn-add-student"
            onClick={() => {
              setFormData({
                name: "",
                department: "Computer Science & Engineering",
                semester: 6,
                section: "A",
                rollNumber: `21BCSE${String(studentList.length + 45).padStart(3, "0")}`,
                email: "",
                enrolledCourses: "CS301, CS402, MA201",
                attendanceRate: 85,
                cgpa: 3.4,
                status: "Active",
                parentContact: "+1 (555) 901-2288",
                academicNotes: "Enrolled in standard 6th semester curriculum.",
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, roll no, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedDept === dept
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dept === "All" ? "All Departments" : dept.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Student Profile</th>
                <th className="px-4 py-3.5">Roll No & Dept</th>
                <th className="px-4 py-3.5">Semester</th>
                <th className="px-4 py-3.5">Attendance Rate</th>
                <th className="px-4 py-3.5">CGPA</th>
                <th className="px-4 py-3.5">Academic Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isLowAttendance = s.attendanceRate < 75;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                          <p className="text-[11px] text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-800 font-mono">{s.rollNumber}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{s.department}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-700">Sem {s.semester} (Sec {s.section})</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            s.attendanceRate >= 85
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : s.attendanceRate >= 75
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                          }`}
                        >
                          {s.attendanceRate}%
                        </span>
                        {isLowAttendance && (
                          <span className="text-[10px] font-bold text-rose-600">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900">{s.cgpa.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.status === "Dean's List"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : s.status === "At Risk"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isLowAttendance && (
                          <button
                            onClick={() => onSendWarningNotice(s)}
                            className="text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Dispatch Low-Attendance Parent Notice"
                          >
                            <Send className="w-3 h-3" /> Notice
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Academic Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-indigo-600 font-semibold font-mono">{selectedStudent.rollNumber}</p>
                  <p className="text-[11px] text-slate-500">{selectedStudent.department} • Semester {selectedStudent.semester}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Attendance Rate</span>
                  <span
                    className={`font-bold text-sm ${
                      selectedStudent.attendanceRate < 75 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {selectedStudent.attendanceRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Cumulative GPA</span>
                  <span className="font-bold text-sm text-slate-900">{selectedStudent.cgpa} / 4.00</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Enrolled Courses</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.enrolledCourseCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-semibold text-[11px] border border-indigo-200"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Parent & Guardian Contact</span>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedStudent.parentContact}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Faculty Academic Notes</span>
                <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 text-slate-600 italic">
                  "{selectedStudent.academicNotes}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              {selectedStudent.attendanceRate < 75 && (
                <button
                  onClick={() => {
                    onSendWarningNotice(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Warning Notice
                </button>
              )}
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Enroll New Student</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="21BCSE088"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Electronics & Communication</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Semester & Section</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      className="w-1/2 px-3 py-2 rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
                      className="w-1/2 px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Attendance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.attendanceRate}
                    onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CGPA (0.00 - 4.00)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={4}
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Parent Contact Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 901-2244"
                  value={formData.parentContact}
                  onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
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
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
