import { createClient } from "./supabase/server";
import type { Course } from "../types/course";
import type {
  Lesson,
  LessonLevel,
} from "../types/lesson";

const validLevels: LessonLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

function level(
  value: string
): LessonLevel {
  return validLevels.includes(
    value as LessonLevel
  )
    ? (value as LessonLevel)
    : "A1";
}

export async function getPublishedCourses(): Promise<
  Course[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      slug,
      title,
      subtitle,
      description,
      category,
      level_min,
      level_max,
      price_cad,
      position
    `)
    .eq("status", "published")
    .order("position", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Unable to load courses:",
      error.message
    );

    return [];
  }

  return (data ?? []).map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    levelMin: level(course.level_min),
    levelMax: level(course.level_max),
    priceCad:
      course.price_cad === null
        ? null
        : Number(course.price_cad),
    position: course.position,
  }));
}

export async function getCourseBySlug(
  slug: string
): Promise<Course | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      slug,
      title,
      subtitle,
      description,
      category,
      level_min,
      level_max,
      price_cad,
      position
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    category: data.category,
    levelMin: level(data.level_min),
    levelMax: level(data.level_max),
    priceCad:
      data.price_cad === null
        ? null
        : Number(data.price_cad),
    position: data.position,
  };
}

export async function getCourseLessons(
  courseId: string
): Promise<Lesson[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select(`
      id,
      slug,
      level,
      title,
      description,
      estimated_minutes,
      objectives,
      passage,
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
      your_turn_prompt
    `)
    .eq("course_id", courseId)
    .eq("status", "published")
    .order("day_number", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Unable to load course lessons:",
      error.message
    );

    return [];
  }

  return (data ?? []).map((lesson) => ({
    id: lesson.id,

    slug: lesson.slug,

    level: level(lesson.level),

    title: lesson.title,

    description: lesson.description,

    estimatedMinutes:
      lesson.estimated_minutes,

    objectives:
      lesson.objectives ?? [],

    passage:
      lesson.passage ?? "",

    vocabulary: [],

    quiz: [],

    courseId:
      lesson.course_id,

    dayNumber:
      lesson.day_number,

    lessonFormat:
      lesson.lesson_format ===
      "situational"
        ? "situational"
        : "general",

    accessTier:
      lesson.access_tier === "premium"
        ? "premium"
        : "free",

    scenario:
      lesson.scenario,

    dialogue:
      lesson.dialogue,

    canadaNote:
      lesson.canada_note,

    commonMistake:
      lesson.common_mistake,

    usefulExpressions:
      Array.isArray(
        lesson.useful_expressions
      )
        ? lesson.useful_expressions
        : [],

    practicePrompt:
      lesson.practice_prompt,

    yourTurnPrompt:
      lesson.your_turn_prompt,
  }));
}