"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";

type VocabularyInput = {
  french: string;
  english: string;
};

type QuizInput = {
  question: string;
  correctAnswer: string;
  explanation?: string;
  options: string[];
};

const validLevels = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseArray<T>(
  value: FormDataEntryValue | null
): T[] {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function parseUsefulExpressions(value: string) {
  return value
    .split("\n")
    .map((line) => {
      const [french, ...englishParts] = line.split("|");

      return {
        french: french?.trim() ?? "",
        english: englishParts.join("|").trim(),
      };
    })
    .filter(
      (item) => item.french && item.english
    );
}

async function requireAdmin() {
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return {
    supabase,
    userId,
  };
}

export async function createLesson(
  formData: FormData
) {
  const { supabase, userId } =
    await requireAdmin();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const suppliedSlug = String(
    formData.get("slug") ?? ""
  ).trim();

  const slug = createSlug(
    suppliedSlug || title
  );

  const level = String(
    formData.get("level") ?? ""
  );

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const passage = String(
    formData.get("passage") ?? ""
  ).trim();

  const courseId =
    String(
      formData.get("courseId") ?? ""
    ).trim() || null;

  const dayValue = String(
    formData.get("dayNumber") ?? ""
  ).trim();

  const dayNumber = dayValue
    ? Number(dayValue)
    : null;

  const estimatedMinutes = Number(
    formData.get("estimatedMinutes")
  );

  const status =
    formData.get("status") === "published"
      ? "published"
      : "draft";

  const lessonFormat =
    formData.get("lessonFormat") ===
    "situational"
      ? "situational"
      : "general";

  const accessTier =
    formData.get("accessTier") ===
    "premium"
      ? "premium"
      : "free";

  const objectives = String(
    formData.get("objectives") ?? ""
  )
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const scenario = String(
    formData.get("scenario") ?? ""
  ).trim();

  const dialogue = String(
    formData.get("dialogue") ?? ""
  ).trim();

  const canadaNote = String(
    formData.get("canadaNote") ?? ""
  ).trim();

  const commonMistake = String(
    formData.get("commonMistake") ?? ""
  ).trim();

  const practicePrompt = String(
    formData.get("practicePrompt") ?? ""
  ).trim();

  const yourTurnPrompt = String(
    formData.get("yourTurnPrompt") ?? ""
  ).trim();

  const usefulExpressions =
    parseUsefulExpressions(
      String(
        formData.get(
          "usefulExpressions"
        ) ?? ""
      )
    );

  const rawVocabulary =
    parseArray<VocabularyInput>(
      formData.get("vocabularyJson")
    );

  const vocabulary = rawVocabulary
    .map((word) => ({
      french: String(
        word.french ?? ""
      ).trim(),

      english: String(
        word.english ?? ""
      ).trim(),
    }))
    .filter(
      (word) =>
        word.french && word.english
    );

  const rawQuiz =
    parseArray<QuizInput>(
      formData.get("quizJson")
    );

  const quiz = rawQuiz
    .map((item) => ({
      question: String(
        item.question ?? ""
      ).trim(),

      correctAnswer: String(
        item.correctAnswer ?? ""
      ).trim(),

      explanation: String(
        item.explanation ?? ""
      ).trim(),

      options: Array.from(
        new Set(
          (item.options ?? [])
            .map((option) =>
              String(option).trim()
            )
            .filter(Boolean)
        )
      ),
    }))
    .filter(
      (item) =>
        item.question ||
        item.correctAnswer ||
        item.options.length > 0
    );

  if (
    !title ||
    !slug ||
    !description ||
    !passage
  ) {
    redirect(
      "/admin/lessons/new?error=Complete+all+required+fields."
    );
  }

  if (!validLevels.includes(level)) {
    redirect(
      "/admin/lessons/new?error=Select+a+valid+level."
    );
  }

  if (
    !Number.isInteger(
      estimatedMinutes
    ) ||
    estimatedMinutes < 1
  ) {
    redirect(
      "/admin/lessons/new?error=Enter+a+valid+duration."
    );
  }

  for (const question of quiz) {
    if (
      !question.question ||
      !question.correctAnswer ||
      question.options.length < 2
    ) {
      redirect(
        "/admin/lessons/new?error=Complete+all+quiz+questions."
      );
    }

    if (
      !question.options.includes(
        question.correctAnswer
      )
    ) {
      redirect(
        "/admin/lessons/new?error=Correct+answer+must+match+one+quiz+option."
      );
    }
  }

  const {
    data: savedLesson,
    error: lessonError,
  } = await supabase
    .from("lessons")
    .insert({
      title,
      slug,
      level,
      description,
      estimated_minutes:
        estimatedMinutes,
      objectives,
      passage,
      status,
      position: dayNumber ?? 0,
      created_by: userId,

      course_id: courseId,
      day_number: dayNumber,
      lesson_format: lessonFormat,
      access_tier: accessTier,

      scenario: scenario || null,
      dialogue: dialogue || null,

      canada_note:
        canadaNote || null,

      common_mistake:
        commonMistake || null,

      useful_expressions:
        usefulExpressions,

      practice_prompt:
        practicePrompt || null,

      your_turn_prompt:
        yourTurnPrompt || null,
    })
    .select("id")
    .single();

  if (
    lessonError ||
    !savedLesson
  ) {
    redirect(
      `/admin/lessons/new?error=${encodeURIComponent(
        lessonError?.message ??
          "Unable to create lesson."
      )}`
    );
  }

  const lessonId = savedLesson.id;

  if (vocabulary.length > 0) {
    const { error } = await supabase
      .from("vocabulary")
      .insert(
        vocabulary.map(
          (word, index) => ({
            lesson_id: lessonId,
            french: word.french,
            english: word.english,
            position: index,
          })
        )
      );

    if (error) {
      await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId);

      redirect(
        `/admin/lessons/new?error=${encodeURIComponent(
          error.message
        )}`
      );
    }
  }

  for (
    let index = 0;
    index < quiz.length;
    index += 1
  ) {
    const question = quiz[index];

    const {
      data: savedQuestion,
      error,
    } = await supabase
      .from("quiz_questions")
      .insert({
        lesson_id: lessonId,
        question:
          question.question,
        correct_answer:
          question.correctAnswer,
        explanation:
          question.explanation ||
          null,
        position: index,
      })
      .select("id")
      .single();

    if (
      error ||
      !savedQuestion
    ) {
      await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId);

      redirect(
        `/admin/lessons/new?error=${encodeURIComponent(
          error?.message ??
            "Unable to save quiz."
        )}`
      );
    }

    const { error: optionError } =
      await supabase
        .from("quiz_options")
        .insert(
          question.options.map(
            (
              option,
              optionIndex
            ) => ({
              question_id:
                savedQuestion.id,

              option_text: option,

              position:
                optionIndex,
            })
          )
        );

    if (optionError) {
      await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId);

      redirect(
        `/admin/lessons/new?error=${encodeURIComponent(
          optionError.message
        )}`
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/courses");
  revalidatePath("/lessons");

  redirect(
    `/admin/lessons/${lessonId}/edit?success=Lesson+created+successfully.`
  );
}