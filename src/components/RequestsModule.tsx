import React, { useState } from "react";
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Filter,
  X,
  AlertCircle,
} from "lucide-react";
import { FacultyRequest, FacultyMember } from "../types";

interface RequestsModuleProps {
  requests: FacultyRequest[];
  facultyList: FacultyMember[];
  onAddRequest: (req: FacultyRequest) => void;
  onUpdateStatus: (id: string, status: FacultyRequest["status"], notes?: string) => void;
}

export const RequestsModule: React.FC<RequestsModuleProps> = ({
  requests,
  facultyList,
  onAddRequest,
  onUpdateStatus,
}) => {
  const [filterType, setFilterType] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New request state
  const [type, setType] = useState<FacultyRequest["type"]>("Leave");
  const [facultyName, setFacultyName] = useState(facultyList[0]?.name || "Dr. Arvind Ramesh");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState<FacultyRequest["urgency"]>("Normal");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newReq: FacultyRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      type,
      facultyId: "FAC-101",
      facultyName,
      department: "Computer Science & Engineering",
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "Pending",
      subject,
      details,
      urgency,
    };

    onAddRequest(newReq);
    setIsAddModalOpen(false);
    setSubject("");
    setDetails("");
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType === "All") return true;
    return r.type === filterType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Faculty Approvals & Requisitions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Leave applications, hardware & lab requisitions, conference travel grant requests, and HOD approvals.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Requisition</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(["All", "Leave", "Document", "Equipment", "Budget"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterType === t
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t === "All" ? "All Requests" : `${t} Requests`}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="space-y-3">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs text-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-400">{req.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {req.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      req.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : req.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">{req.subject}</h3>
              </div>

              {/* Action Buttons for HOD / Admin */}
              {req.status === "Pending" && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateStatus(req.id, "Approved", "Approved by HOD.")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onUpdateStatus(req.id, "Rejected", "Declined due to scheduling conflicts.")}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold flex items-center gap-1 border border-rose-200 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150">
              {req.details}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>
                Submitted by: <strong className="text-slate-700">{req.facultyName}</strong> ({req.department})
              </span>
              <span>Submitted: {req.dateSubmitted}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Requisition Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Submit Faculty Requisition</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Request Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option value="Leave">Casual / On-Duty Leave</option>
                    <option value="Equipment">Hardware & Lab Requisition</option>
                    <option value="Document">Course File & Certificate Request</option>
                    <option value="Budget">Conference & Grant Budget</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. On-Duty Leave for IEEE Conference Keynote"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Request Details & Justification</label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide dates, proxy class arrangements, or itemized requisition details..."
                  className="w-full p-2.5 rounded-lg border border-slate-200"
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
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
