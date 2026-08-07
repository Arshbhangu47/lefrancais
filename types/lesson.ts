export type LessonLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

export type LessonAccess =
  | "free"
  | "premium";

export type LessonFormat =
  | "general"
  | "situational";

export type UsefulExpression = {
  french: string;
  english: string;
};

export type VocabularyItem = {
  french: string;
  english: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export type Lesson = {
  id?: string;

  slug: string;

  level: LessonLevel;

  title: string;

  description: string;

  estimatedMinutes: number;

  objectives: string[];

  passage: string;

  vocabulary: VocabularyItem[];

  quiz: QuizQuestion[];

  courseId?: string | null;

  dayNumber?: number | null;

  lessonFormat?: LessonFormat;

  accessTier?: LessonAccess;

  scenario?: string | null;

  dialogue?: string | null;

  canadaNote?: string | null;

  commonMistake?: string | null;

  usefulExpressions?: UsefulExpression[];

  practicePrompt?: string | null;

  yourTurnPrompt?: string | null;
};