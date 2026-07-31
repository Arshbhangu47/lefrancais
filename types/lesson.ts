export type LessonLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2";

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
  slug: string;
  level: LessonLevel;
  title: string;
  description: string;
  estimatedMinutes: number;
  objectives: string[];
  passage: string;
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
};