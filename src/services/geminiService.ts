export interface AIChatMessage {
  role: "user" | "model" | "assistant";
  parts?: { text: string }[];
  text?: string;
  content?: string;
}

export async function sendAIChatMessage(params: {
  message: string;
  history?: any[];
  persona?: "faculty" | "student" | "admin";
}) {
  const formattedMessages = [
    ...(params.history || []).map((h) => ({
      role: h.role,
      content: h.parts?.[0]?.text || h.text || h.content || "",
    })),
    {
      role: "user",
      content: params.message,
    },
  ];

  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: formattedMessages,
      context: { persona: params.persona || "faculty" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to communicate with AI Assistant");
  }

  const data = await response.json();
  return { reply: data.reply || data.text || data.response || "No reply from AI." };
}

export async function askAIChatbot(messages: AIChatMessage[], context?: any) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to communicate with AI Assistant");
  }

  return response.json();
}

export async function generateAILecturePlan(params: {
  courseName: string;
  courseCode: string;
  department: string;
  syllabusText: string;
  totalWeeks?: number;
  lecturesPerWeek?: number;
}) {
  const response = await fetch("/api/ai/lecture-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate AI Lecture Plan");
  }

  return response.json();
}

export async function generateAIAssessment(params: {
  type: string;
  courseName: string;
  courseCode: string;
  topic: string;
  difficulty: string;
  totalMarks: number;
  bloomsLevels: string[];
  questionTypes: string[];
  numQuestions: number;
}) {
  const response = await fetch("/api/ai/generate-assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate AI Assessment");
  }

  return response.json();
}

export async function generateAIMeetingMoM(params: {
  meetingTitle: string;
  meetingType: string;
  department: string;
  date: string;
  transcript?: string;
  audioBase64?: string;
  audioMimeType?: string;
}) {
  const response = await fetch("/api/ai/meeting-mom", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate Minutes of Meeting");
  }

  return response.json();
}

export async function gradeSubmissionWithAI(params: {
  assignmentTitle: string;
  rubricCriteria: string;
  totalMarks: number;
  studentContent: string;
  studentName?: string;
}) {
  const response = await fetch("/api/ai/grade-submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: params.assignmentTitle,
      studentAnswer: params.studentContent,
      rubricCriteria: params.rubricCriteria,
      maxMarks: params.totalMarks,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to evaluate submission");
  }

  return response.json();
}

export async function evaluateStudentSubmissionAI(params: {
  question: string;
  studentAnswer: string;
  rubricCriteria: string;
  maxMarks: number;
}) {
  return gradeSubmissionWithAI({
    assignmentTitle: params.question,
    studentContent: params.studentAnswer,
    rubricCriteria: params.rubricCriteria,
    totalMarks: params.maxMarks,
  });
}

export async function generateLecturePPT(params: {
  courseCode: string;
  courseName: string;
  lectureNum: number;
  topic: string;
  unit?: string;
  bloomsLevel?: string;
}) {
  const response = await fetch("/api/ai/generate-ppt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate PPT presentation");
  }

  return response.json();
}

export async function generateLectureENotes(params: {
  courseCode: string;
  courseName: string;
  lectureNum: number;
  topic: string;
  unit?: string;
  bloomsLevel?: string;
}) {
  const response = await fetch("/api/ai/generate-enotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate E-Notes");
  }

  return response.json();
}
