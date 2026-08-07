import {
  lessons as starterLessons,
} from "../data/lessons";

import type {
  Lesson,
  LessonLevel,
  UsefulExpression,
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

  quiz_options:
    | QuizOptionRow[]
    | null;
};

type LessonRow = {
  id: string;

  slug: string;

  level: string;

  title: string;

  description: string;

  estimated_minutes: number;

  objectives: string[] | null;

  passage: string;

  position: number;

  created_at: string;

  course_id: string | null;

  day_number: number | null;

  lesson_format: string;

  access_tier: string;

  scenario: string | null;

  dialogue: string | null;

  canada_note: string | null;

  common_mistake: string | null;

  useful_expressions: unknown;

  practice_prompt: string | null;

  your_turn_prompt: string | null;

  vocabulary:
    | VocabularyRow[]
    | null;

  quiz_questions:
    | QuizQuestionRow[]
    | null;
};

const LESSON_SELECT = `
  id,
  slug,
  level,
  title,
  description,
  estimated_minutes,
  objectives,
  passage,
  position,
  created_at,
  course_id,
  day_number,
  lesson_format,
  access_tier,
  scenario,
  dialogue,
  canada_note,
  common_mistake,
  useful_expressions,
  practice_prompt,
  your_turn_prompt,

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
  value: string
): value is LessonLevel {
  return validLevels.includes(
    value as LessonLevel
  );
}

function parseExpressions(
  value: unknown
): UsefulExpression[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is {
        french: string;
        english: string;
      } =>
        typeof item === "object" &&
        item !== null &&
        "french" in item &&
        "english" in item &&
        typeof item.french ===
          "string" &&
        typeof item.english ===
          "string"
    )
    .map((item) => ({
      french: item.french,
      english: item.english,
    }));
}

function convertLesson(
  row: LessonRow
): Lesson {
  const vocabulary = [
    ...(row.vocabulary ?? []),
  ]
    .sort(
      (a, b) =>
        a.position -
        b.position
    )
    .map((item) => ({
      french: item.french,
      english: item.english,
    }));

  const quiz = [
    ...(row.quiz_questions ?? []),
  ]
    .sort(
      (a, b) =>
        a.position -
        b.position
    )
    .map((question) => ({
      question:
        question.question,

      options: [
        ...(question.quiz_options ??
          []),
      ]
        .sort(
          (a, b) =>
            a.position -
            b.position
        )
        .map(
          (option) =>
            option.option_text
        ),

      answer:
        question.correct_answer,

      explanation:
        question.explanation ??
        undefined,
    }));

  return {
    id: row.id,

    slug: row.slug,

    level: isLessonLevel(
      row.level
    )
      ? row.level
      : "A1",

    title: row.title,

    description:
      row.description,

    estimatedMinutes:
      row.estimated_minutes,

    objectives:
      row.objectives ?? [],

    passage: row.passage,

    vocabulary,

    quiz,

    courseId:
      row.course_id,

    dayNumber:
      row.day_number,

    lessonFormat:
      row.lesson_format ===
      "situational"
        ? "situational"
        : "general",

    accessTier:
      row.access_tier ===
      "premium"
        ? "premium"
        : "free",

    scenario:
      row.scenario,

    dialogue:
      row.dialogue,

    canadaNote:
      row.canada_note,

    commonMistake:
      row.common_mistake,

    usefulExpressions:
      parseExpressions(
        row.useful_expressions
      ),

    practicePrompt:
      row.practice_prompt,

    yourTurnPrompt:
      row.your_turn_prompt,
  };
}

function addStarterLessons(
  databaseLessons: Lesson[]
): Lesson[] {
  const databaseSlugs =
    new Set(
      databaseLessons.map(
        (lesson) =>
          lesson.slug
      )
    );

  const starter = (
    starterLessons as Lesson[]
  ).filter(
    (lesson) =>
      !databaseSlugs.has(
        lesson.slug
      )
  );

  return [
    ...databaseLessons,
    ...starter,
  ];
}

export async function getPublishedLessons(): Promise<
  Lesson[]
> {
  try {
    const supabase =
      await createClient();

    const { data, error } =
      await supabase
        .from("lessons")
        .select(
          LESSON_SELECT
        )
        .eq(
          "status",
          "published"
        )
        .order(
          "position",
          {
            ascending: true,
          }
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {
      console.error(
        error.message
      );

      return starterLessons as Lesson[];
    }

    const databaseLessons = (
      (data ??
        []) as unknown as LessonRow[]
    ).map(convertLesson);

    return addStarterLessons(
      databaseLessons
    );
  } catch (error) {
    console.error(error);

    return starterLessons as Lesson[];
  }
}