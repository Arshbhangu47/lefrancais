"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";

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

type UsefulExpression = {
  french: string;
  english: string;
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

function errorUrl(
  lessonId: string,
  message: string
) {
  return `/admin/lessons/${lessonId}/edit?error=${encodeURIComponent(
    message
  )}`;
}

function parseArray<T>(
  value: FormDataEntryValue | null
): T[] {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed as T[];
    }

    return [];
  } catch {
    return [];
  }
}

function parseUsefulExpressions(
  value: string
): UsefulExpression[] {
  return value
    .split("\n")
    .map((line) => {
      const [french, ...englishParts] =
        line.split("|");

      return {
        french: french?.trim() ?? "",
        english: englishParts
          .join("|")
          .trim(),
      };
    })
    .filter(
      (item) =>
        item.french &&
        item.english
    );
}

async function requireAdmin() {
  const supabase =
    await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

  if (
    !profile ||
    profile.role !== "admin"
  ) {
    redirect("/");
  }

  return {
    supabase,
    userId,
  };
}

export async function updateLesson(
  lessonId: string,
  formData: FormData
) {
  const { supabase } =
    await requireAdmin();

  // -----------------------------
  // BASIC LESSON INFORMATION
  // -----------------------------

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

  const estimatedMinutes = Number(
    formData.get("estimatedMinutes")
  );

  const position = Number(
    formData.get("position") ?? 0
  );

  const status =
    formData.get("status") ===
    "published"
      ? "published"
      : "draft";

  const objectives = String(
    formData.get("objectives") ?? ""
  )
    .split("\n")
    .map((objective) =>
      objective.trim()
    )
    .filter(Boolean);

  // -----------------------------
  // COURSE INFORMATION
  // -----------------------------

  const courseId =
    String(
      formData.get("courseId") ?? ""
    ).trim() || null;

  const dayValue = String(
    formData.get("dayNumber") ?? ""
  ).trim();

  const dayNumber =
    dayValue.length > 0
      ? Number(dayValue)
      : null;

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

  // -----------------------------
  // PRACTICAL LESSON CONTENT
  // -----------------------------

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
    formData.get("practicePrompt") ??
      ""
  ).trim();

  const yourTurnPrompt = String(
    formData.get("yourTurnPrompt") ??
      ""
  ).trim();

  const usefulExpressions =
    parseUsefulExpressions(
      String(
        formData.get(
          "usefulExpressions"
        ) ?? ""
      )
    );

  // -----------------------------
  // VOCABULARY
  // -----------------------------

  const rawVocabulary =
    parseArray<VocabularyInput>(
      formData.get("vocabularyJson")
    );

  const vocabulary =
    rawVocabulary
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
          word.french ||
          word.english
      );

  // -----------------------------
  // QUIZ
  // -----------------------------

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
          (
            Array.isArray(
              item.options
            )
              ? item.options
              : []
          )
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

  // -----------------------------
  // VALIDATION
  // -----------------------------

  if (
    !title ||
    !slug ||
    !description ||
    !passage
  ) {
    redirect(
      errorUrl(
        lessonId,
        "Complete all required lesson fields."
      )
    );
  }

  if (
    !validLevels.includes(level)
  ) {
    redirect(
      errorUrl(
        lessonId,
        "Select a valid level."
      )
    );
  }

  if (
    !Number.isInteger(
      estimatedMinutes
    ) ||
    estimatedMinutes < 1
  ) {
    redirect(
      errorUrl(
        lessonId,
        "Enter a valid lesson duration."
      )
    );
  }

  if (
    dayNumber !== null &&
    (
      !Number.isInteger(
        dayNumber
      ) ||
      dayNumber < 1
    )
  ) {
    redirect(
      errorUrl(
        lessonId,
        "Day number must be a positive whole number."
      )
    );
  }

  for (const word of vocabulary) {
    if (
      !word.french ||
      !word.english
    ) {
      redirect(
        errorUrl(
          lessonId,
          "Every vocabulary item needs both French and English."
        )
      );
    }
  }

  for (const question of quiz) {
    if (
      !question.question ||
      !question.correctAnswer ||
      question.options.length < 2
    ) {
      redirect(
        errorUrl(
          lessonId,
          "Every quiz question needs a question, correct answer and at least two options."
        )
      );
    }

    if (
      !question.options.includes(
        question.correctAnswer
      )
    ) {
      redirect(
        errorUrl(
          lessonId,
          "Each correct answer must exactly match one quiz option."
        )
      );
    }
  }

  // -----------------------------
  // UPDATE MAIN LESSON
  // -----------------------------

  const {
    error: lessonError,
  } = await supabase
    .from("lessons")
    .update({
      title,
      slug,
      level,
      description,

      estimated_minutes:
        estimatedMinutes,

      objectives,
      passage,
      status,

      position:
        Number.isInteger(position)
          ? position
          : dayNumber ?? 0,

      course_id: courseId,

      day_number:
        dayNumber,

      lesson_format:
        lessonFormat,

      access_tier:
        accessTier,

      scenario:
        scenario || null,

      dialogue:
        dialogue || null,

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
    .eq("id", lessonId);

  if (lessonError) {
    redirect(
      errorUrl(
        lessonId,
        lessonError.message
      )
    );
  }

  // -----------------------------
  // REPLACE VOCABULARY
  // -----------------------------

  const {
    error:
      vocabularyDeleteError,
  } = await supabase
    .from("vocabulary")
    .delete()
    .eq(
      "lesson_id",
      lessonId
    );

  if (
    vocabularyDeleteError
  ) {
    redirect(
      errorUrl(
        lessonId,
        vocabularyDeleteError.message
      )
    );
  }

  if (
    vocabulary.length > 0
  ) {
    const { error } =
      await supabase
        .from("vocabulary")
        .insert(
          vocabulary.map(
            (word, index) => ({
              lesson_id:
                lessonId,

              french:
                word.french,

              english:
                word.english,

              position:
                index,
            })
          )
        );

    if (error) {
      redirect(
        errorUrl(
          lessonId,
          error.message
        )
      );
    }
  }

  // -----------------------------
  // REPLACE QUIZ
  // -----------------------------

  const {
    error: quizDeleteError,
  } = await supabase
    .from("quiz_questions")
    .delete()
    .eq(
      "lesson_id",
      lessonId
    );

  if (quizDeleteError) {
    redirect(
      errorUrl(
        lessonId,
        quizDeleteError.message
      )
    );
  }

  for (
    let questionIndex = 0;
    questionIndex <
    quiz.length;
    questionIndex += 1
  ) {
    const question =
      quiz[questionIndex];

    const {
      data: savedQuestion,
      error: questionError,
    } = await supabase
      .from("quiz_questions")
      .insert({
        lesson_id:
          lessonId,

        question:
          question.question,

        correct_answer:
          question.correctAnswer,

        explanation:
          question.explanation ||
          null,

        position:
          questionIndex,
      })
      .select("id")
      .single();

    if (
      questionError ||
      !savedQuestion
    ) {
      redirect(
        errorUrl(
          lessonId,
          questionError?.message ??
            "Unable to save quiz question."
        )
      );
    }

    const {
      error: optionsError,
    } = await supabase
      .from("quiz_options")
      .insert(
        question.options.map(
          (
            option,
            optionIndex
          ) => ({
            question_id:
              savedQuestion.id,

            option_text:
              option,

            position:
              optionIndex,
          })
        )
      );

    if (optionsError) {
      redirect(
        errorUrl(
          lessonId,
          optionsError.message
        )
      );
    }
  }

  // -----------------------------
  // REFRESH PAGES
  // -----------------------------

  revalidatePath(
    "/admin"
  );

  revalidatePath(
    "/courses"
  );

  revalidatePath(
    "/lessons"
  );

  revalidatePath(
    `/lessons/${slug}`
  );

  redirect(
    `/admin/lessons/${lessonId}/edit?success=${encodeURIComponent(
      "Lesson saved successfully."
    )}`
  );
}

export async function deleteLesson(
  lessonId: string
) {
  const { supabase } =
    await requireAdmin();

  const { error } =
    await supabase
      .from("lessons")
      .delete()
      .eq(
        "id",
        lessonId
      );

  if (error) {
    redirect(
      errorUrl(
        lessonId,
        error.message
      )
    );
  }

  revalidatePath(
    "/admin"
  );

  revalidatePath(
    "/courses"
  );

  revalidatePath(
    "/lessons"
  );

  redirect(
    "/admin?success=Lesson+deleted+successfully."
  );
}