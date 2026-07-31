import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import LessonContentEditor from "../../../../../components/admin/LessonContentEditor";
import { createClient } from "../../../../../lib/supabase/server";
import {
  deleteLesson,
  updateLesson,
} from "./actions";

type EditLessonPageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

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
  id: string;
  title: string;
  slug: string;
  level: string;
  description: string;
  estimated_minutes: number;
  objectives: string[] | null;
  passage: string;
  status: string;
  position: number;
  vocabulary: VocabularyRow[] | null;
  quiz_questions: QuizQuestionRow[] | null;
};

export const dynamic = "force-dynamic";

export default async function EditLessonPage({
  params,
  searchParams,
}: EditLessonPageProps) {
  const { id } = await params;
  const { error, success } = await searchParams;

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

  const { data, error: lessonError } =
    await supabase
      .from("lessons")
      .select(`
        id,
        title,
        slug,
        level,
        description,
        estimated_minutes,
        objectives,
        passage,
        status,
        position,
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
      `)
      .eq("id", id)
      .single();

  if (lessonError || !data) {
    notFound();
  }

  const lesson = data as unknown as LessonRow;

  const initialVocabulary = [
    ...(lesson.vocabulary ?? []),
  ]
    .sort((a, b) => a.position - b.position)
    .map((word) => ({
      french: word.french,
      english: word.english,
    }));

  const initialQuiz = [
    ...(lesson.quiz_questions ?? []),
  ]
    .sort((a, b) => a.position - b.position)
    .map((question) => ({
      question: question.question,
      correctAnswer: question.correct_answer,
      explanation: question.explanation ?? "",

      options: [
        ...(question.quiz_options ?? []),
      ]
        .sort((a, b) => a.position - b.position)
        .map((option) => option.option_text),
    }));

  const updateAction = updateLesson.bind(
    null,
    lesson.id
  );

  const deleteAction = deleteLesson.bind(
    null,
    lesson.id
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/admin"
        className="font-semibold text-blue-700 hover:text-blue-900"
      >
        ← Back to admin portal
      </Link>

      <div className="mt-8">
        <span className="font-semibold text-blue-700">
          Lesson management
        </span>

        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          Edit Lesson
        </h1>

        <p className="mt-3 text-slate-600">
          Manage lesson content, vocabulary, questions and
          publishing status.
        </p>
      </div>

      {success && (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-800">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
          {error}
        </div>
      )}

      <form action={updateAction} className="mt-10 space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Lesson Information
          </h2>

          <div className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block font-semibold text-slate-800"
              >
                Title *
              </label>

              <input
                id="title"
                name="title"
                required
                defaultValue={lesson.title}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block font-semibold text-slate-800"
              >
                URL slug *
              </label>

              <input
                id="slug"
                name="slug"
                required
                defaultValue={lesson.slug}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-4">
              <div>
                <label
                  htmlFor="level"
                  className="block font-semibold text-slate-800"
                >
                  Level
                </label>

                <select
                  id="level"
                  name="level"
                  defaultValue={lesson.level}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="estimatedMinutes"
                  className="block font-semibold text-slate-800"
                >
                  Minutes
                </label>

                <input
                  id="estimatedMinutes"
                  name="estimatedMinutes"
                  type="number"
                  min="1"
                  required
                  defaultValue={lesson.estimated_minutes}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="block font-semibold text-slate-800"
                >
                  Position
                </label>

                <input
                  id="position"
                  name="position"
                  type="number"
                  min="0"
                  defaultValue={lesson.position}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block font-semibold text-slate-800"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  defaultValue={lesson.status}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
                >
                  <option value="draft">Draft</option>
                  <option value="published">
                    Published
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block font-semibold text-slate-800"
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={4}
                defaultValue={lesson.description}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
              />
            </div>

            <div>
              <label
                htmlFor="objectives"
                className="block font-semibold text-slate-800"
              >
                Learning objectives
              </label>

              <textarea
                id="objectives"
                name="objectives"
                rows={5}
                defaultValue={(lesson.objectives ?? []).join(
                  "\n"
                )}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
              />

              <p className="mt-2 text-sm text-slate-500">
                Enter one objective per line.
              </p>
            </div>

            <div>
              <label
                htmlFor="passage"
                className="block font-semibold text-slate-800"
              >
                Reading passage *
              </label>

              <textarea
                id="passage"
                name="passage"
                required
                rows={18}
                defaultValue={lesson.passage}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-slate-950"
              />
            </div>
          </div>
        </section>

        <LessonContentEditor
          initialVocabulary={initialVocabulary}
          initialQuiz={initialQuiz}
        />

        <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:justify-end">
          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Save Lesson
          </button>
        </div>
      </form>

      <section className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-bold text-red-900">
          Delete Lesson
        </h2>

        <p className="mt-2 text-red-800">
          This permanently deletes the lesson, vocabulary
          and quiz questions.
        </p>

        <form action={deleteAction} className="mt-5">
          <button
            type="submit"
            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            Permanently Delete Lesson
          </button>
        </form>
      </section>
    </main>
  );
}