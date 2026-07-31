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

function errorUrl(lessonId: string, message: string) {
  return `/admin/lessons/${lessonId}/edit?error=${encodeURIComponent(
    message
  )}`;
}

function parseArray<T>(value: FormDataEntryValue | null): T[] {
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

export async function updateLesson(
  lessonId: string,
  formData: FormData
) {
  const { supabase } = await requireAdmin();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const slug = createSlug(
    String(formData.get("slug") ?? title)
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
    formData.get("status") === "published"
      ? "published"
      : "draft";

  const objectives = String(
    formData.get("objectives") ?? ""
  )
    .split("\n")
    .map((objective) => objective.trim())
    .filter(Boolean);

  const rawVocabulary = parseArray<VocabularyInput>(
    formData.get("vocabularyJson")
  );

  const vocabulary = rawVocabulary
    .map((word) => ({
      french: String(word.french ?? "").trim(),
      english: String(word.english ?? "").trim(),
    }))
    .filter((word) => word.french || word.english);

  const rawQuiz = parseArray<QuizInput>(
    formData.get("quizJson")
  );

  const quiz = rawQuiz
    .map((item) => ({
      question: String(item.question ?? "").trim(),

      correctAnswer: String(
        item.correctAnswer ?? ""
      ).trim(),

      explanation: String(
        item.explanation ?? ""
      ).trim(),

      options: Array.from(
        new Set(
          (Array.isArray(item.options)
            ? item.options
            : []
          )
            .map((option) => String(option).trim())
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

  if (!title || !slug || !description || !passage) {
    redirect(
      errorUrl(
        lessonId,
        "Complete all required lesson fields."
      )
    );
  }

  if (!validLevels.includes(level)) {
    redirect(
      errorUrl(lessonId, "Select a valid level.")
    );
  }

  if (
    !Number.isInteger(estimatedMinutes) ||
    estimatedMinutes < 1
  ) {
    redirect(
      errorUrl(
        lessonId,
        "Enter a valid lesson duration."
      )
    );
  }

  for (const word of vocabulary) {
    if (!word.french || !word.english) {
      redirect(
        errorUrl(
          lessonId,
          "Every vocabulary item needs French and English."
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

  const { error: lessonError } = await supabase
    .from("lessons")
    .update({
      title,
      slug,
      level,
      description,
      estimated_minutes: estimatedMinutes,
      objectives,
      passage,
      status,
      position: Number.isInteger(position)
        ? position
        : 0,
    })
    .eq("id", lessonId);

  if (lessonError) {
    redirect(errorUrl(lessonId, lessonError.message));
  }

  const { error: vocabularyDeleteError } =
    await supabase
      .from("vocabulary")
      .delete()
      .eq("lesson_id", lessonId);

  if (vocabularyDeleteError) {
    redirect(
      errorUrl(
        lessonId,
        vocabularyDeleteError.message
      )
    );
  }

  const { error: quizDeleteError } = await supabase
    .from("quiz_questions")
    .delete()
    .eq("lesson_id", lessonId);

  if (quizDeleteError) {
    redirect(
      errorUrl(lessonId, quizDeleteError.message)
    );
  }

  if (vocabulary.length > 0) {
    const { error } = await supabase
      .from("vocabulary")
      .insert(
        vocabulary.map((word, index) => ({
          lesson_id: lessonId,
          french: word.french,
          english: word.english,
          position: index,
        }))
      );

    if (error) {
      redirect(errorUrl(lessonId, error.message));
    }
  }

  for (
    let questionIndex = 0;
    questionIndex < quiz.length;
    questionIndex += 1
  ) {
    const question = quiz[questionIndex];

    const { data: savedQuestion, error } =
      await supabase
        .from("quiz_questions")
        .insert({
          lesson_id: lessonId,
          question: question.question,
          correct_answer: question.correctAnswer,
          explanation:
            question.explanation || null,
          position: questionIndex,
        })
        .select("id")
        .single();

    if (error || !savedQuestion) {
      redirect(
        errorUrl(
          lessonId,
          error?.message ??
            "Unable to save quiz question."
        )
      );
    }

    const { error: optionsError } = await supabase
      .from("quiz_options")
      .insert(
        question.options.map((option, index) => ({
          question_id: savedQuestion.id,
          option_text: option,
          position: index,
        }))
      );

    if (optionsError) {
      redirect(
        errorUrl(lessonId, optionsError.message)
      );
    }
  }

  revalidatePath("/admin");
  revalidatePath("/lessons");
  revalidatePath(`/lessons/${slug}`);

  redirect(
    `/admin/lessons/${lessonId}/edit?success=${encodeURIComponent(
      "Lesson saved successfully."
    )}`
  );
}

export async function deleteLesson(
  lessonId: string
) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", lessonId);

  if (error) {
    redirect(
      errorUrl(lessonId, error.message)
    );
  }

  revalidatePath("/admin");
  revalidatePath("/lessons");

  redirect(
    "/admin?success=Lesson+deleted+successfully."
  );
}