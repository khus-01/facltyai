/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { DashboardOverview } from "./components/DashboardOverview";
import { FacultyManagement } from "./components/FacultyManagement";
import { StudentManagement } from "./components/StudentManagement";
import { CourseManagement } from "./components/CourseManagement";
import { AILecturePlanner } from "./components/AILecturePlanner";
import { AIAssessmentGenerator } from "./components/AIAssessmentGenerator";
import { AIChatbot } from "./components/AIChatbot";
import { AIMeetingAssistant } from "./components/AIMeetingAssistant";
import { FacultyCollaboration } from "./components/FacultyCollaboration";
import { TaskManagement } from "./components/TaskManagement";
import { AttendanceModule } from "./components/AttendanceModule";
import { AssignmentsModule } from "./components/AssignmentsModule";
import { AnnouncementsModule } from "./components/AnnouncementsModule";
import { RequestsModule } from "./components/RequestsModule";
import { ReportsModule } from "./components/ReportsModule";
import { SettingsModule } from "./components/SettingsModule";

import {
  initialFacultyList,
  initialStudentList,
  initialCourseList,
  initialAttendanceRecords,
  initialAssignments,
  initialAnnouncements,
  initialRequests,
  initialTasks,
  initialMeetings,
  initialNotifications,
  initialQuestionBank,
} from "./data/mockData";

import {
  FacultyMember,
  Student,
  Course,
  AttendanceRecord,
  Assignment,
  Announcement,
  FacultyRequest,
  AcademicTask,
  TaskDeliverable,
  MeetingMoM,
  AppNotification,
  QuestionBankItem,
  UserRole,
} from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [currentRole, setCurrentRole] = useState<UserRole>("faculty");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Application Dynamic State
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(initialFacultyList);
  const [studentList, setStudentList] = useState<Student[]>(initialStudentList);
  const [courseList, setCourseList] = useState<Course[]>(initialCourseList);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [requests, setRequests] = useState<FacultyRequest[]>(initialRequests);
  const [tasks, setTasks] = useState<AcademicTask[]>(initialTasks);
  const [meetings, setMeetings] = useState<MeetingMoM[]>(initialMeetings);
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(initialQuestionBank);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const handleSaveToQuestionBank = (newItem: QuestionBankItem) => {
    setQuestionBank((prev) => [newItem, ...prev]);
  };

  // Helper Handlers
  const handleAddFaculty = (newFaculty: FacultyMember) => {
    setFacultyList((prev) => [newFaculty, ...prev]);
  };

  const handleUpdateFaculty = (updated: FacultyMember) => {
    setFacultyList((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudentList((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudentList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSendWarningNotice = (student: Student) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Low Attendance Parent Notice Dispatched`,
      message: `Formal academic condonation warning sent for ${student.name} (${student.rollNumber}) with ${student.attendanceRate}% attendance to parent contact ${student.parentContact}.`,
      time: "Just now",
      type: "warning",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    alert(`Low attendance warning notice successfully dispatched for ${student.name} (${student.rollNumber}).`);
  };

  const handleAddMaterial = (courseId: string, material: any) => {
    setCourseList((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, materials: [material, ...c.materials] } : c))
    );
  };

  const handleSaveMoM = (mom: MeetingMoM) => {
    setMeetings((prev) => {
      const exists = prev.some((m) => m.id === mom.id);
      if (exists) {
        return prev.map((m) => (m.id === mom.id ? mom : m));
      }
      return [mom, ...prev];
    });
  };

  const handleTakeAttendance = (records: Partial<AttendanceRecord>[]) => {
    const fullRecords: AttendanceRecord[] = records.map((r, idx) => ({
      id: `ATT-${Date.now()}-${idx}`,
      courseCode: r.courseCode || "CS301",
      date: r.date || new Date().toISOString().split("T")[0],
      studentId: r.studentId || "STU-1",
      studentName: r.studentName || "Student",
      rollNumber: r.rollNumber || "21BCSE000",
      status: r.status || "Present",
    }));

    setAttendanceRecords((prev) => [...fullRecords, ...prev]);
  };

  const handleAddAssignment = (newAss: Assignment) => {
    setAssignments((prev) => [newAss, ...prev]);
  };

  const handleGradeSubmission = (
    assignmentId: string,
    submissionId: string,
    grade: number,
    feedback: string
  ) => {
    setAssignments((prev) =>
      prev.map((ass) => {
        if (ass.id === assignmentId) {
          const updatedSubmissions = ass.submissions.map((sub) => {
            if (sub.id === submissionId) {
              return {
                ...sub,
                marksObtained: grade,
                feedback,
                status: "Graded" as const,
              };
            }
            return sub;
          });
          const gradedCount = updatedSubmissions.filter((s) => s.status === "Graded").length;
          return {
            ...ass,
            submissions: updatedSubmissions,
            gradedCount,
          };
        }
        return ass;
      })
    );
  };

  const handleAddTask = (newTask: AcademicTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    status: AcademicTask["status"],
    progressPercent?: number
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            progressPercent: progressPercent !== undefined ? progressPercent : t.progressPercent,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTaskDeliverable = (
    taskId: string,
    deliverable: TaskDeliverable,
    newStatus?: AcademicTask["status"]
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const status =
            newStatus ||
            (deliverable.status === "Approved"
              ? "Completed"
              : deliverable.status === "Submitted"
              ? "Review"
              : "In Progress");
          const progressPercent =
            deliverable.status === "Approved" ? 100 : deliverable.status === "Submitted" ? 90 : 50;
          return {
            ...t,
            deliverable,
            status,
            progressPercent,
          };
        }
        return t;
      })
    );
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddRequest = (req: FacultyRequest) => {
    setRequests((prev) => [req, ...prev]);
  };

  const handleUpdateRequestStatus = (id: string, status: FacultyRequest["status"], notes?: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, approvalNotes: notes } : r))
    );
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F9FAFB] font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        pendingTasksCount={tasks.filter((t) => t.status !== "Completed").length}
        pendingRequestsCount={requests.filter((r) => r.status === "Pending").length}
        lowAttendanceCount={studentList.filter((s) => s.attendanceRate < 75).length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onNavigate={(tab) => setCurrentTab(tab)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Overview */}
            {currentTab === "dashboard" && (
              <DashboardOverview
                facultyList={facultyList}
                studentList={studentList}
                courseList={courseList}
                assignments={assignments}
                tasks={tasks}
                announcements={announcements}
                requests={requests}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {/* Core Modules */}
            {currentTab === "faculty" && (
              <FacultyManagement
                facultyList={facultyList}
                onAddFaculty={handleAddFaculty}
                onUpdateFaculty={handleUpdateFaculty}
              />
            )}

            {currentTab === "students" && (
              <StudentManagement
                studentList={studentList}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onSendWarningNotice={handleSendWarningNotice}
              />
            )}

            {currentTab === "courses" && (
              <CourseManagement
                courseList={courseList}
                onSelectCourseForPlanner={(course) => setCurrentTab("ai_planner")}
                onAddMaterial={handleAddMaterial}
              />
            )}

            {/* Flagship AI Objectives */}
            {currentTab === "ai_planner" && <AILecturePlanner />}
            {currentTab === "ai_assessment" && (
              <AIAssessmentGenerator
                questionBank={questionBank}
                onSaveToQuestionBank={handleSaveToQuestionBank}
                onAddAssignment={handleAddAssignment}
              />
            )}
            {currentTab === "ai_chat" && (
              <AIChatbot onNavigateTab={(tab) => setCurrentTab(tab)} />
            )}
            {currentTab === "ai_meeting" && (
              <AIMeetingAssistant
                meetingList={meetings}
                onSaveMoM={handleSaveMoM}
                onAddTask={handleAddTask}
              />
            )}

            {/* Collaboration & Task Monitoring */}
            {currentTab === "collaboration" && (
              <FacultyCollaboration facultyList={facultyList} />
            )}

            {currentTab === "tasks" && (
              <TaskManagement
                tasks={tasks}
                facultyList={facultyList}
                currentRole={currentRole}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateTaskDeliverable={handleUpdateTaskDeliverable}
              />
            )}

            {/* Academic Operations */}
            {currentTab === "attendance" && (
              <AttendanceModule
                attendanceRecords={attendanceRecords}
                studentList={studentList}
                courseList={courseList}
                onTakeAttendance={handleTakeAttendance}
                onSendWarning={handleSendWarningNotice}
              />
            )}

            {currentTab === "assignments" && (
              <AssignmentsModule
                assignments={assignments}
                courses={courseList}
                onAddAssignment={handleAddAssignment}
                onGradeSubmission={handleGradeSubmission}
              />
            )}

            {currentTab === "announcements" && (
              <AnnouncementsModule
                announcements={announcements}
                onAddAnnouncement={handleAddAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {currentTab === "requests" && (
              <RequestsModule
                requests={requests}
                facultyList={facultyList}
                onAddRequest={handleAddRequest}
                onUpdateStatus={handleUpdateRequestStatus}
              />
            )}

            {currentTab === "reports" && (
              <ReportsModule
                facultyList={facultyList}
                studentList={studentList}
                courseList={courseList}
              />
            )}

            {currentTab === "settings" && (
              <SettingsModule currentRole={currentRole} onRoleChange={setCurrentRole} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
