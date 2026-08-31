export type UserRole = "faculty" | "hod" | "admin" | "Faculty" | "Admin" | "HOD";

export interface SystemUserProfile {
  role: "faculty" | "hod" | "admin";
  displayName: string;
  name: string;
  title: string;
  department: string;
  email: string;
  initials: string;
  avatar: string;
  permissions: string[];
}

export const SYSTEM_USERS: Record<"faculty" | "hod" | "admin", SystemUserProfile> = {
  faculty: {
    role: "faculty",
    displayName: "Faculty User",
    name: "Dr. Elena Rostova",
    title: "Associate Professor & Course Lead",
    department: "Computer Science & Engineering",
    email: "elena.rostova@univ.edu",
    initials: "ER",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    permissions: [
      "Create AI Lecture Plans & Syllabi",
      "Generate Question Papers & Assessments",
      "Take Attendance & Log Course Hours",
      "Grade Student Submissions with AI",
      "Submit Procurement & Leave Requests",
    ],
  },
  hod: {
    role: "hod",
    displayName: "HOD (Head of Dept)",
    name: "Dr. Arvind Ramesh",
    title: "Professor & Head of Department",
    department: "Computer Science & Engineering",
    email: "arvind.ramesh@univ.edu",
    initials: "AR",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permissions: [
      "Review & Approve Faculty Course Coverage",
      "Chair Faculty Meetings & Generate MoM",
      "Approve Departmental Leaves & Requests",
      "Manage Faculty Workload Distribution",
      "Access Departmental NBA/NAAC Analytics",
    ],
  },
  admin: {
    role: "admin",
    displayName: "Dean / Admin",
    name: "Dr. Robert Sterling",
    title: "Dean of Academic Affairs & System Admin",
    department: "University Academic Directorate",
    email: "dean.academics@univ.edu",
    initials: "RS",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    permissions: [
      "Manage University-Wide Faculty Roster",
      "Final Approval on Lab Capital Procurements",
      "Institutional Accreditation Reports",
      "Configure Academic Term & AI Parameters",
      "Global Role & System Permission Control",
    ],
  },
};

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  specialization: string[];
  assignedCourses: string[];
  weeklyTeachingHours: number;
  maxTeachingHours: number;
  availabilityStatus: "Available" | "In Class" | "In Meeting" | "On Leave" | "Office Hours";
  officeRoom: string;
  cabinHours: string;
  joinedYear: number;
  researchFocus: string;
}

export interface Student {
  id: string;
  name: string;
  department: string;
  semester: number;
  section: string;
  rollNumber: string;
  email: string;
  avatar: string;
  enrolledCourseCodes: string[];
  attendanceRate: number; // percentage
  cgpa: number;
  status: "Active" | "At Risk" | "Detained" | "Dean's List";
  pendingSubmissionsCount: number;
  parentContact: string;
  academicNotes: string;
}

export interface CourseOutcome {
  code: string;
  description: string;
  bloomsLevel: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  poMappings: Record<string, number>;
}

export interface TeachingMaterial {
  id: string;
  title: string;
  unit: string;
  type: "Slides" | "PDF Notes" | "Code Repository" | "Video Lecture" | "Lab Manual";
  url: string;
  uploadDate: string;
  fileSize: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: number;
  facultyId: string;
  facultyName: string;
  enrolledStudentsCount: number;
  syllabusCoveragePercent: number;
  targetLectures: number;
  completedLectures: number;
  room: string;
  schedule: string;
  description: string;
  coList: CourseOutcome[];
  materials: TeachingMaterial[];
}

export interface StudentSubmission {
  id: string;
  assignmentId?: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: "Submitted" | "Late" | "Graded" | "Pending";
  fileUrl?: string;
  answerText?: string;
  content?: string;
  marksScored?: number;
  marksObtained?: number;
  feedback?: string;
  evaluationBreakdown?: Array<{
    criteria: string;
    awarded: number;
    max: number;
    remarks: string;
  }>;
}

export type AssignmentSubmission = StudentSubmission;

export interface Assignment {
  id: string;
  courseCode: string;
  courseName?: string;
  title: string;
  description: string;
  deadline?: string;
  dueDate?: string;
  totalMarks: number;
  bloomsLevel?: string;
  coTargeted?: string;
  coMapping?: string;
  rubricCriteria?: string;
  totalAssigned?: number;
  totalStudents?: number;
  submittedCount?: number;
  submissionsCount?: number;
  gradedCount: number;
  status?: "Active" | "Grading" | "Completed" | "Overdue";
  submissions?: StudentSubmission[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  courseName?: string;
  lectureNumber?: number;
  topicCovered?: string;
  studentId?: string;
  studentName?: string;
  rollNumber?: string;
  status?: "Present" | "Absent" | "Late" | "Excused";
  totalStudents?: number;
  presentCount?: number;
  absentCount?: number;
  studentStatuses?: Record<string, "Present" | "Absent" | "Late" | "Excused">;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "Academic" | "Examination" | "Urgent Alert" | "Administrative" | "Faculty Notice" | "Exam" | "Event";
  targetAudience: "All Faculty & Students" | "Faculty Only" | "Department Specific" | "Students Only" | "All" | "Faculty" | "Students";
  department?: string;
  authorName?: string;
  authorRole?: string;
  postedBy?: string;
  date?: string;
  timestamp?: string;
  priority: "High" | "Normal" | "Urgent" | "Low";
  pinned?: boolean;
  isPinned?: boolean;
}

export interface AcademicRequest {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  requestType?: "Leave Application" | "Lab Equipment Procurement" | "Duty Leave (Conference)" | "Exam Reschedule" | "Document Verification" | string;
  type?: "Leave" | "Document" | "Equipment" | "Budget" | string;
  subject?: string;
  details: string;
  submittedDate?: string;
  dateSubmitted?: string;
  status: "Pending" | "Approved" | "Rejected";
  urgency: "Normal" | "High" | "Critical" | "Urgent" | "Low";
  adminRemarks?: string;
  approvalNotes?: string;
}

export type FacultyRequest = AcademicRequest;

export interface StudentSlideContent {
  slideNum: number;
  slideType?: "title" | "concept" | "comparison" | "diagram_flow" | "code_algorithm" | "worked_example" | "concept_quiz" | "summary";
  title: string;
  subtitle?: string;
  bulletPoints?: string[];
  bullets?: string[]; // backwards compatibility
  highlightBox?: {
    label: string; // e.g. "Formal Definition", "Core Equation", "Theorem", "Key Insight"
    content: string;
  };
  comparisonData?: {
    leftTitle: string;
    leftPoints: string[];
    rightTitle: string;
    rightPoints: string[];
  };
  diagramFlow?: {
    flowTitle: string;
    steps: Array<{
      stepNumber: number;
      label: string;
      description: string;
      highlight?: boolean;
    }>;
  };
  matrixOrTable?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  codeSnippet?: string | {
    language: string;
    code: string;
    explanation?: string;
  };
  workedExample?: {
    problemStatement: string;
    steps: Array<{ stepNumber: number; title: string; detail: string }>;
    finalResult: string;
  };
  conceptQuiz?: {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  };
  keyTakeaway: string;
  visualOrDiagram?: string;
  speakerNotes?: string;
}

export interface LectureResourcePPT {
  lectureNum: number;
  topic: string;
  courseCode: string;
  courseName: string;
  unit?: string;
  bloomsLevel?: string;
  instructorName?: string;
  totalSlides?: number;
  slides: StudentSlideContent[];
}

export interface LectureResourceENotes {
  lectureNum: number;
  topic: string;
  courseCode: string;
  courseName: string;
  unit: string;
  bloomsLevel: string;
  coTargeted: string;
  summary: string;
  keyTheoremsAndFormulas: string[];
  inDepthExplanation: string;
  workedExamples: Array<{
    title: string;
    problem: string;
    solution: string;
  }>;
  quickReviewQuestions: string[];
  examTips: string;
}

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  timeSlot: string; // e.g. "09:00 AM - 10:00 AM"
  courseCode: string;
  courseName: string;
  roomVenue: string;
  facultyName: string;
  lectureType: "Theory" | "Lab" | "Tutorial" | "Seminar";
  currentTopic: string;
}

export interface TaskDeliverable {
  id?: string;
  taskId?: string;
  submittedBy: string;
  submittedAt: string;
  deliverableTitle?: string;
  fileName?: string;
  fileUrl?: string;
  attachmentName?: string;
  attachmentSize?: string;
  notes?: string;
  submissionNotes?: string;
  deliverableUrl?: string;
  status: "Pending Review" | "Submitted" | "Approved" | "Revisions Requested";
  reviewRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  attachmentName?: string;
  isRead: boolean;
}

export interface AcademicTask {
  id: string;
  title: string;
  description: string;
  category: "Syllabus Coverage" | "Assessment Prep" | "Accreditation" | "Grading" | "Administrative";
  assigneeName: string;
  assignedBy?: string;
  deadline: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  progressPercent: number;
  relatedCourseCode?: string;
  deliverable?: TaskDeliverable;
}

export interface MeetingMoM {
  id: string;
  meetingTitle: string;
  department: string;
  date: string;
  time: string;
  chairperson: string;
  attendees: string[];
  absentees: string[];
  executiveSummary: string;
  agendaItemsDiscussed: Array<{
    itemNumber: number;
    topic: string;
    discussion: string;
    decisions: string;
  }>;
  actionItems: Array<{
    id: string;
    task: string;
    assignee: string;
    deadline: string;
    priority: "High" | "Medium" | "Low";
    status: "Pending" | "In Progress" | "Completed";
  }>;
  resolutionsPassed: string[];
  nextMeetingDate: string;
  fullTranscript?: string;
}

export interface QuestionBankItem {
  id: string;
  courseCode: string;
  courseName: string;
  unitOrTopic: string;
  questionText: string;
  type: "MCQ" | "Short" | "Long" | "Analytical" | "Coding";
  marks: number;
  bloomsLevel: "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
  coMapping: string;
  options?: string[];
  correctOption?: string;
  answerKey: string;
  evaluationCriteria?: Array<{ aspect: string; marks: number; description: string }>;
  tags?: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  category?: string;
  suggestions?: string[];
}

export interface FacultyMessage {
  id: string;
  channelId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachments?: string[];
  reactions?: Record<string, number>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "warning" | "success";
  timestamp?: string;
  time?: string;
  read?: boolean;
  isRead?: boolean;
  linkTab?: string;
}

export type AppNotification = NotificationItem;
