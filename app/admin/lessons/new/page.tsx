import Link from "next/link";
import { redirect } from "next/navigation";

import LessonContentEditor from "../../../../components/admin/LessonContentEditor";
import { createClient } from "../../../../lib/supabase/server";
import { createLesson } from "./actions";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function NewLessonPage({
  searchParams,
}: Props) {
  const { error } =
    await searchParams;

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

  const { data: courses } =
    await supabase
      .from("courses")
      .select(
        "id, title, status"
      )
      .order("position", {
        ascending: true,
      });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/admin"
        className="font-semibold text-blue-700"
      >
        ← Back to Admin
      </Link>

      <div className="mt-8">
        <span className="font-semibold text-blue-700">
          Course Builder
        </span>

        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          Create Lesson
        </h1>

        <p className="mt-3 text-slate-600">
          Build a complete practical
          French lesson.
        </p>
      </div>

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        action={createLesson}
        className="mt-10 space-y-8"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Course & Access
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="font-semibold">
                Course
              </label>

              <select
                name="courseId"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="">
                  No Course
                </option>

                {courses?.map(
                  (course) => (
                    <option
                      key={
                        course.id
                      }
                      value={
                        course.id
                      }
                    >
                      {
                        course.title
                      }
                      {course.status ===
                      "draft"
                        ? " (Draft)"
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="font-semibold">
                Day Number
              </label>

              <input
                name="dayNumber"
                type="number"
                min="1"
                placeholder="1"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Lesson Format
              </label>

              <select
                name="lessonFormat"
                defaultValue="situational"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="situational">
                  Situational
                </option>

                <option value="general">
                  General
                </option>
              </select>
            </div>

            <div>
              <label className="font-semibold">
                Access
              </label>

              <select
                name="accessTier"
                defaultValue="free"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="free">
                  Free
                </option>

                <option value="premium">
                  Premium
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Basic Information
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <label className="font-semibold">
                Title *
              </label>

              <input
                name="title"
                required
                placeholder="Meeting a New Coworker"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                URL Slug
              </label>

              <input
                name="slug"
                placeholder="meeting-a-new-coworker"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="font-semibold">
                  Level
                </label>

                <select
                  name="level"
                  defaultValue="A2"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option>A1</option>
                  <option>A2</option>
                  <option>B1</option>
                  <option>B2</option>
                  <option>C1</option>
                  <option>C2</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">
                  Minutes
                </label>

                <input
                  name="estimatedMinutes"
                  type="number"
                  min="1"
                  defaultValue="10"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Status
                </label>

                <select
                  name="status"
                  defaultValue="draft"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold">
                Description *
              </label>

              <textarea
                name="description"
                rows={3}
                required
                placeholder="Learn how to introduce yourself naturally at work."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Learning Objectives
              </label>

              <textarea
                name="objectives"
                rows={5}
                placeholder={`Introduce yourself naturally
Ask about someone's role
Respond politely`}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              <p className="mt-2 text-sm text-slate-500">
                One objective per line.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold">
            Practical Lesson
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <label className="font-semibold">
                Scenario
              </label>

              <textarea
                name="scenario"
                rows={4}
                placeholder="You have just started a new job and meet a coworker..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Dialogue
              </label>

              <textarea
                name="dialogue"
                rows={12}
                placeholder={`Sophie : Salut !
Daniel : Bonjour !`}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold">
                Main Lesson Text *
              </label>

              <textarea
                name="passage"
                required
                rows={10}
                placeholder="Explain the situation, language and context..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Useful Expressions
              </label>

              <textarea
                name="usefulExpressions"
                rows={7}
                placeholder={`Je viens de commencer | I just started
N'hésitez pas | Feel free / don't hesitate
À plus tard | See you later`}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />

              <p className="mt-2 text-sm text-slate-500">
                One expression per line:
                French | English
              </p>
            </div>

            <div>
              <label className="font-semibold">
                🇨🇦 Canada Note
              </label>

              <textarea
                name="canadaNote"
                rows={5}
                placeholder="Explain useful Canadian French context..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Common Mistake
              </label>

              <textarea
                name="commonMistake"
                rows={4}
                placeholder="Explain something learners commonly say incorrectly..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Practice
              </label>

              <textarea
                name="practicePrompt"
                rows={4}
                placeholder="Create a short practice activity..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="font-semibold">
                Your Turn
              </label>

              <textarea
                name="yourTurnPrompt"
                rows={4}
                placeholder="Give the learner a real-life situation to respond to..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>
        </section>

        <LessonContentEditor
          initialVocabulary={[]}
          initialQuiz={[]}
        />

        <div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white hover:bg-blue-800"
          >
            Create Lesson
          </button>
        </div>
      </form>
    </main>
  );
}