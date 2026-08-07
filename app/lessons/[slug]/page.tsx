import Link from "next/link";
import { notFound } from "next/navigation";

import LessonCompleteButton from "../../../components/LessonCompleteButton";
import LessonQuiz from "../../../components/LessonQuiz";
import { getPublishedLessons } from "../../../lib/lessons";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function LessonPage({
  params,
}: Props) {
  const { slug } = await params;

  const lessons =
    await getPublishedLessons();

  const currentIndex =
    lessons.findIndex(
      (lesson) =>
        lesson.slug === slug
    );

  if (currentIndex === -1) {
    notFound();
  }

  const lesson =
    lessons[currentIndex];

  const previousLesson =
    lessons[currentIndex - 1];

  const nextLesson =
    lessons[currentIndex + 1];

  const situational =
    lesson.lessonFormat ===
    "situational";

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href={
          lesson.courseId
            ? "/courses"
            : "/lessons"
        }
        className="font-semibold text-blue-700"
      >
        ← Back
      </Link>

      <div className="mt-8 flex flex-wrap gap-3">
        {lesson.dayNumber && (
          <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Day{" "}
            {lesson.dayNumber}
          </span>
        )}

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
          {lesson.level}
        </span>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          {
            lesson.estimatedMinutes
          }{" "}
          min
        </span>

        {lesson.accessTier ===
        "premium" ? (
          <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
            Premium
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            Free
          </span>
        )}
      </div>

      <h1 className="mt-6 text-4xl font-bold text-slate-950 sm:text-5xl">
        {lesson.title}
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
        {lesson.description}
      </p>

      {lesson.objectives.length >
        0 && (
        <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-7">
          <h2 className="text-2xl font-bold">
            What you'll learn
          </h2>

          <ul className="mt-5 space-y-3">
            {lesson.objectives.map(
              (objective) => (
                <li
                  key={
                    objective
                  }
                  className="flex gap-3"
                >
                  <span className="font-bold text-blue-700">
                    ✓
                  </span>

                  {objective}
                </li>
              )
            )}
          </ul>
        </section>
      )}

      {situational &&
        lesson.scenario && (
          <section className="mt-10 rounded-2xl bg-slate-950 p-8 text-white">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-300">
              Real-life situation
            </span>

            <p className="mt-4 text-lg leading-8 text-slate-200">
              {lesson.scenario}
            </p>
          </section>
        )}

      {situational &&
        lesson.dialogue && (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold">
              Conversation
            </h2>

            <div className="mt-6 whitespace-pre-line text-lg leading-9 text-slate-700">
              {lesson.dialogue}
            </div>
          </section>
        )}

      {lesson.passage && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">
            Lesson
          </h2>

          <div className="mt-6 whitespace-pre-line text-lg leading-9 text-slate-700">
            {lesson.passage}
          </div>
        </section>
      )}

      {(lesson.usefulExpressions
        ?.length ?? 0) > 0 && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold">
            Useful Expressions
          </h2>

          <div className="mt-6 space-y-3">
            {lesson.usefulExpressions?.map(
              (
                expression,
                index
              ) => (
                <div
                  key={index}
                  className="grid gap-2 rounded-xl bg-slate-50 p-5 sm:grid-cols-2"
                >
                  <strong className="text-slate-950">
                    {
                      expression.french
                    }
                  </strong>

                  <span className="text-slate-600">
                    {
                      expression.english
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {lesson.canadaNote && (
        <section className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold">
            🇨🇦 French in
            Canada
          </h2>

          <p className="mt-4 leading-8 text-slate-700">
            {
              lesson.canadaNote
            }
          </p>
        </section>
      )}

      {lesson.commonMistake && (
        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-8">
          <h2 className="text-2xl font-bold">
            Common Mistake
          </h2>

          <p className="mt-4 leading-8 text-slate-700">
            {
              lesson.commonMistake
            }
          </p>
        </section>
      )}

      {lesson.vocabulary.length >
        0 && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-3xl font-bold">
            Vocabulary
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {lesson.vocabulary.map(
              (word) => (
                <div
                  key={`${word.french}-${word.english}`}
                  className="rounded-xl bg-slate-50 p-5"
                >
                  <strong className="text-lg">
                    {
                      word.french
                    }
                  </strong>

                  <p className="mt-2 text-slate-600">
                    {
                      word.english
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {lesson.practicePrompt && (
        <section className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-8">
          <h2 className="text-2xl font-bold">
            Practice
          </h2>

          <p className="mt-4 leading-8">
            {
              lesson.practicePrompt
            }
          </p>
        </section>
      )}

      {lesson.quiz.length > 0 && (
        <LessonQuiz
          questions={
            lesson.quiz
          }
        />
      )}

      {lesson.yourTurnPrompt && (
        <section className="mt-10 rounded-2xl bg-blue-700 p-8 text-white">
          <h2 className="text-2xl font-bold">
            Your Turn
          </h2>

          <p className="mt-4 text-lg leading-8 text-blue-50">
            {
              lesson.yourTurnPrompt
            }
          </p>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-8">
        <h2 className="text-2xl font-bold">
          Finished?
        </h2>

        <div className="mt-5">
          <LessonCompleteButton
            slug={lesson.slug}
          />
        </div>
      </section>

      <div className="mt-12 flex justify-between gap-4">
        <div>
          {previousLesson && (
            <Link
              href={`/lessons/${previousLesson.slug}`}
              className="inline-block rounded-xl border border-slate-300 px-5 py-3 font-semibold"
            >
              ← Previous
            </Link>
          )}
        </div>

        <div>
          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}