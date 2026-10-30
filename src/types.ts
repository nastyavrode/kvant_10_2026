export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  courseCode?: string;
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
}

export interface NoteBlock {
  id: string;
  type: 'heading' | 'text' | 'formula' | 'image' | 'code' | 'markdown';
  content: string;
}

export interface Note {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  courseId: string;
  topicId: string;
  blocks: NoteBlock[];
  isShared: boolean;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  noteId: string;
  type: 'open' | 'choice';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  noteId: string;
  topicId: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface AISimplification {
  originalText: string;
  simplifiedText: string;
  example?: string;
}

export interface TopicDifficulty {
  topicId: string;
  topicTitle: string;
  totalAttempts: number;
  averageScore: number;
  errorRate: number;
  difficultQuestions: { question: string; errorCount: number }[];
}
