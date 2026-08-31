import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  Filter,
  CheckCircle2,
  X,
  Edit3,
} from "lucide-react";
import { FacultyMember } from "../types";

interface FacultyManagementProps {
  facultyList: FacultyMember[];
  onAddFaculty: (newFaculty: FacultyMember) => void;
  onUpdateFaculty: (updated: FacultyMember) => void;
}

export const FacultyManagement: React.FC<FacultyManagementProps> = ({
  facultyList,
  onAddFaculty,
  onUpdateFaculty,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);

  // New faculty form state
  const [formData, setFormData] = useState({
    name: "",
    title: "Assistant Professor",
    department: "Computer Science & Engineering",
    email: "",
    phone: "",
    officeRoom: "",
    cabinHours: "Mon/Wed 2:00 PM - 4:00 PM",
    specialization: "Machine Learning, Algorithms",
    assignedCourses: "CS301, CS402",
    weeklyTeachingHours: 14,
    maxTeachingHours: 18,
    availabilityStatus: "Available" as const,
    researchFocus: "Scalable Systems",
  });

  const departments = ["All", "Computer Science & Engineering", "Artificial Intelligence & Data Science", "Electronics & Communication", "Mathematics & Computing"];

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.specialization.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === "All" || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingFaculty) {
      onUpdateFaculty({
        ...editingFaculty,
        name: formData.name,
        title: formData.title,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        officeRoom: formData.officeRoom,
        cabinHours: formData.cabinHours,
        specialization: formData.specialization.split(",").map((s) => s.trim()),
        assignedCourses: formData.assignedCourses.split(",").map((s) => s.trim()),
        weeklyTeachingHours: Number(formData.weeklyTeachingHours),
        maxTeachingHours: Number(formData.maxTeachingHours),
        availabilityStatus: formData.availabilityStatus as any,
        researchFocus: formData.researchFocus,
      });
      setEditingFaculty(null);
    } else {
      const newFaculty: FacultyMember = {
        id: `FAC-${100 + facultyList.length + 1}`,
        name: formData.name,
        title: formData.title,
        department: formData.department,
        email: formData.email,
        phone: formData.phone || "+1 (555) 010-0000",
        avatar: `https://images.unsplash.com/photo-${1534528741775 + facultyList.length}?w=150&auto=format&fit=crop&q=80`,
        specialization: formData.specialization.split(",").map((s) => s.trim()),
        assignedCourses: formData.assignedCourses.split(",").map((s) => s.trim()),
        weeklyTeachingHours: Number(formData.weeklyTeachingHours),
        maxTeachingHours: Number(formData.maxTeachingHours),
        availabilityStatus: formData.availabilityStatus as any,
        officeRoom: formData.officeRoom || "Academic Block 3, Rm 101",
        cabinHours: formData.cabinHours,
        joinedYear: 2024,
        researchFocus: formData.researchFocus,
      };
      onAddFaculty(newFaculty);
    }
    setIsAddModalOpen(false);
  };

  const openEditModal = (faculty: FacultyMember) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      title: faculty.title,
      department: faculty.department,
      email: faculty.email,
      phone: faculty.phone,
      officeRoom: faculty.officeRoom,
      cabinHours: faculty.cabinHours,
      specialization: faculty.specialization.join(", "),
      assignedCourses: faculty.assignedCourses.join(", "),
      weeklyTeachingHours: faculty.weeklyTeachingHours,
      maxTeachingHours: faculty.maxTeachingHours,
      availabilityStatus: faculty.availabilityStatus as any,
      researchFocus: faculty.researchFocus,
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Faculty Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Profiles, departments, assigned teaching workload, office schedules, and availability status.
          </p>
        </div>

        <button
          id="btn-add-faculty"
          onClick={() => {
            setEditingFaculty(null);
            setFormData({
              name: "",
              title: "Assistant Professor",
              department: "Computer Science & Engineering",
              email: "",
              phone: "",
              officeRoom: "Academic Block 3, Rm 204",
              cabinHours: "Mon/Wed 2:00 PM - 4:00 PM",
              specialization: "Algorithms, Distributed Systems",
              assignedCourses: "CS301",
              weeklyTeachingHours: 14,
              maxTeachingHours: 18,
              availabilityStatus: "Available",
              researchFocus: "Computer Science Education",
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Faculty</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-search-faculty"
            type="text"
            placeholder="Search faculty by name, email, or skill..."
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

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map((f) => {
          const workloadPercent = Math.round((f.weeklyTeachingHours / f.maxTeachingHours) * 100);

          return (
            <div
              key={f.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Avatar & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{f.name}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{f.title}</p>
                      <p className="text-[11px] text-slate-500">{f.department}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      f.availabilityStatus === "Available"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : f.availabilityStatus === "In Class"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : f.availabilityStatus === "Office Hours"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {f.availabilityStatus}
                  </span>
                </div>

                {/* Contact details */}
                <div className="space-y-1.5 text-xs text-slate-600 py-2 border-y border-slate-100 my-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{f.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{f.officeRoom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 text-[11px]">Office Hours: {f.cabinHours}</span>
                  </div>
                </div>

                {/* Specialization Tags */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Specializations & Subjects
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {f.specialization.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Courses */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Assigned Courses
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {f.assignedCourses.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Workload Bar & Actions */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Weekly Workload</span>
                  <span className="font-bold text-slate-900">
                    {f.weeklyTeachingHours} / {f.maxTeachingHours} hrs ({workloadPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      workloadPercent > 90
                        ? "bg-rose-500"
                        : workloadPercent > 70
                        ? "bg-indigo-600"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(workloadPercent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(f)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingFaculty ? "Edit Faculty Profile" : "Register New Faculty Member"}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaculty} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jane Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Academic Title</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option>Assistant Professor</option>
                    <option>Associate Professor</option>
                    <option>Professor</option>
                    <option>Professor & Head of Department</option>
                    <option>Dean of Academics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Artificial Intelligence & Data Science</option>
                    <option>Electronics & Communication</option>
                    <option>Mathematics & Computing</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane.smith@univ.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Office Room</label>
                  <input
                    type="text"
                    placeholder="Block 3, Room 304"
                    value={formData.officeRoom}
                    onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Availability Status</label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Available">Available</option>
                    <option value="In Class">In Class</option>
                    <option value="Office Hours">Office Hours</option>
                    <option value="In Meeting">In Meeting</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Deep Learning, Distributed Systems, Algorithms"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Course Codes</label>
                  <input
                    type="text"
                    placeholder="CS301, CS402"
                    value={formData.assignedCourses}
                    onChange={(e) => setFormData({ ...formData, assignedCourses: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Weekly Teaching Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.weeklyTeachingHours}
                    onChange={(e) => setFormData({ ...formData, weeklyTeachingHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
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
                  {editingFaculty ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
