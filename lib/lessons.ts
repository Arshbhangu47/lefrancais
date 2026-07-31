import { lessons as starterLessons } from "../data/lessons";
import type {
  Lesson,
  LessonLevel,
} from "../types/lesson";
import { createClient } from "./supabase/server";

type VocabularyRow = {
  french: string;
  english: string;
  position: number;
};

type QuizOptionRow = {
  option_text: string;
  position: number;
};

type QuizQuestionRow = {
  question: string;
  correct_answer: string;
  explanation: string | null;
  position: number;
  quiz_options: QuizOptionRow[] | null;
};

type LessonRow = {
  slug: string;
  level: string;
  title: string;
  description: string;
  estimated_minutes: number;
  objectives: string[] | null;
  passage: string;
  position: number;
  created_at: string;
  vocabulary: VocabularyRow[] | null;
  quiz_questions: QuizQuestionRow[] | null;
};

const LESSON_SELECT = `
  slug,
  level,
  title,
  description,
  estimated_minutes,
  objectives,
  passage,
  position,
  created_at,
  vocabulary (
    french,
    english,
    position
  ),
  quiz_questions (
    question,
    correct_answer,
    explanation,
    position,
    quiz_options (
      option_text,
      position
    )
  )
`;

const validLevels: LessonLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

function isLessonLevel(
  level: string
): level is LessonLevel {
  return validLevels.includes(level as LessonLevel);
}

function convertLesson(row: LessonRow): Lesson {
  const vocabulary = [...(row.vocabulary ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((word) => ({
      french: word.french,
      english: word.english,
    }));

  const quiz = [...(row.quiz_questions ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((question) => ({
      question: question.question,

      options: [...(question.quiz_options ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((option) => option.option_text),

      answer: question.correct_answer,

      explanation:
        question.explanation ?? undefined,
    }));

  return {
    slug: row.slug,

    level: isLessonLevel(row.level)
      ? row.level
      : "A1",

    title: row.title,

    description: row.description,

    estimatedMinutes:
      row.estimated_minutes > 0
        ? row.estimated_minutes
        : 10,

    objectives: Array.isArray(row.objectives)
      ? row.objectives
      : [],

    passage: row.passage,

    vocabulary,

    quiz,
  };
}

function addStarterLessons(
  databaseLessons: Lesson[]
): Lesson[] {
  const databaseSlugs = new Set(
    databaseLessons.map((lesson) => lesson.slug)
  );

  const remainingStarterLessons = (
    starterLessons as Lesson[]
  ).filter(
    (lesson) => !databaseSlugs.has(lesson.slug)
  );

  return [
    ...databaseLessons,
    ...remainingStarterLessons,
  ];
}

export async function getPublishedLessons(): Promise<
  Lesson[]
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("lessons")
      .select(LESSON_SELECT)
      .eq("status", "published")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Unable to load published lessons:",
        error.message
      );

      return starterLessons as Lesson[];
    }

    const databaseLessons = (
      (data ?? []) as unknown as LessonRow[]
    ).map(convertLesson);

    return addStarterLessons(databaseLessons);
  } catch (error) {
    console.error(
      "Unexpected lesson loading error:",
      error
    );

    return starterLessons as Lesson[];
  }
}