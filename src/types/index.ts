// 用户类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  role: "hr" | "tech_interviewer" | "vp" | "candidate";
  avatar?: string;
  department?: string;
}

// 岗位描述
export interface JobDescription {
  id: string;
  title: string;
  department: string;
  level: "junior" | "mid" | "senior" | "lead";
  requirements: string[];
  responsibilities: string[];
  skills: {
    technical: string[];
    soft: string[];
  };
  salaryRange: {
    min: number;
    max: number;
  };
  location: string;
  type: "full-time" | "part-time" | "contract";
}

// 面试候选人
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume: Resume;
  appliedPosition: string;
  status: "applied" | "screening" | "interviewing" | "completed" | "rejected";
  createdAt: string;
  interviewRounds: InterviewRound[];
}

// 简历信息
export interface Resume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  education: {
    degree: string;
    school: string;
    major: string;
    graduationYear: number;
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
    responsibilities: string[];
    achievements: string[];
  }[];
  skills: {
    technical: string[];
    languages: string[];
    certifications: string[];
  };
  projects: {
    name: string;
    description: string;
    technologies: string[];
    achievements: string[];
  }[];
}

// 面试轮次
export interface InterviewRound {
  id: string;
  type: "hr" | "tech_1" | "tech_2" | "vp";
  candidateId: string;
  interviewerId: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  questions: InterviewQuestion[];
  evaluation: InterviewEvaluation;
  notes: string;
  feedback: string;
  recommendation: "pass" | "fail" | "conditional";
}

// 面试问题
export interface InterviewQuestion {
  id: string;
  question: string;
  category: "technical" | "behavioral" | "situational" | "management";
  difficulty: "easy" | "medium" | "hard";
  expectedAnswer?: string;
  keyPoints: string[];
  followUpQuestions?: string[];
  timeLimit?: number; // 分钟
}

// 面试评估
export interface InterviewEvaluation {
  technicalSkills?: {
    score: number; // 1-10
    notes: string;
    strengths: string[];
    weaknesses: string[];
  };
  softSkills?: {
    communication: number; // 1-10
    teamwork: number;
    problemSolving: number;
    leadership?: number;
    adaptability: number;
    notes: string;
  };
  culturalFit: {
    score: number; // 1-10
    notes: string;
  };
  overallScore: number; // 1-10
  overallNotes: string;
  recommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
}

// 面试报告
export interface InterviewReport {
  id: string;
  candidateId: string;
  interviewRoundId: string;
  generatedAt: string;
  summary: {
    overallPerformance: string;
    keyStrengths: string[];
    areasOfConcern: string[];
    recommendation: string;
  };
  detailedAnalysis: {
    technicalAssessment?: {
      codeQuality: string;
      problemSolving: string;
      systemDesign?: string;
      bestPractices: string;
    };
    behavioralAssessment?: {
      communicationStyle: string;
      teamCollaboration: string;
      conflictResolution: string;
      leadership?: string;
    };
  };
  recommendedActions: string[];
}

// 最终面试总报告
export interface FinalInterviewReport {
  id: string;
  candidateId: string;
  generatedAt: string;
  allRounds: InterviewRound[];
  overallAssessment: {
    technicalCompetency: number; // 1-10
    softSkills: number;
    culturalFit: number;
    leadershipPotential?: number;
    overallScore: number;
  };
  summary: {
    strengths: string[];
    concerns: string[];
    growthPotential: string;
    fitForRole: string;
  };
  finalRecommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
  salaryRecommendation?: {
    min: number;
    max: number;
    reasoning: string;
  };
  onboardingNotes?: string[];
}

// 面试官改进建议
export interface InterviewerFeedback {
  id: string;
  interviewerId: string;
  interviewRoundId: string;
  generatedAt: string;
  strengths: string[];
  improvementAreas: string[];
  suggestedActions: string[];
  questionQuality: {
    score: number; // 1-10
    feedback: string;
  };
  interviewFlow: {
    score: number; // 1-10
    feedback: string;
  };
  candidateExperience: {
    score: number; // 1-10
    feedback: string;
  };
}

// AI 生成的面试问题模板
export interface AIQuestionTemplate {
  id: string;
  jobLevel: string;
  category: "technical" | "behavioral" | "situational" | "management";
  questions: {
    question: string;
    followUps: string[];
    evaluationCriteria: string[];
    idealAnswer: string;
  }[];
}

// 面试设置
export interface InterviewSettings {
  roundSettings: {
    type: "hr" | "tech_1" | "tech_2" | "vp";
    duration: number; // 分钟
    questionCount: number;
    focusAreas: string[];
    aiAssistance: boolean;
  }[];
  evaluationCriteria: {
    weights: {
      technical: number;
      soft: number;
      cultural: number;
      leadership?: number;
    };
    passingScore: number;
  };
}
