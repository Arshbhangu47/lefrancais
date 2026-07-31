import Link from "next/link";
import { notFound } from "next/navigation";
import LessonCompleteButton from "../../../components/LessonCompleteButton";
import LessonQuiz from "../../../components/LessonQuiz";
import { getPublishedLessons } from "../../../lib/lessons";

type LessonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const { slug } = await params;

  const lessons = await getPublishedLessons();

  const currentIndex = lessons.findIndex(
    (lesson) => lesson.slug === slug
  );

  if (currentIndex === -1) {
    notFound();
  }

  const lesson = lessons[currentIndex];
  const previousLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/lessons"
        className="font-semibold text-blue-700 hover:text-blue-900"
      >
        ← Back to lessons
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
          {lesson.level}
        </span>

        <span className="text-sm text-slate-500">
          {lesson.estimatedMinutes} minute lesson
        </span>
      </div>

      <h1 className="mt-5 text-5xl font-bold text-slate-950">
        {lesson.title}
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
        {lesson.description}
      </p>

      {lesson.objectives.length > 0 && (
        <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Learning objectives
          </h2>

          <ul className="mt-5 space-y-3">
            {lesson.objectives.map((objective) => (
              <li
                key={objective}
                className="flex gap-3 text-slate-700"
              >
                <span className="font-bold text-blue-700">
                  ✓
                </span>

                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-950">
          Reading passage
        </h2>

        <div className="mt-6 whitespace-pre-line text-lg leading-9 text-slate-700">
          {lesson.passage}
        </div>
      </section>

      {lesson.vocabulary.length > 0 ? (
        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-950">
            Vocabulary
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {lesson.vocabulary.map((word) => (
              <div
                key={`${word.french}-${word.english}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {word.french}
                </h3>

                <p className="mt-2 text-slate-600">
                  {word.english}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Vocabulary
          </h2>

          <p className="mt-3 text-slate-600">
            Vocabulary items have not been added to this
            lesson yet.
          </p>
        </section>
      )}

      {lesson.quiz.length > 0 ? (
        <LessonQuiz questions={lesson.quiz} />
      ) : (
        <section className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Quiz
          </h2>

          <p className="mt-3 text-slate-600">
            Quiz questions have not been added to this
            lesson yet.
          </p>
        </section>
      )}

      <section className="mt-12 rounded-2xl border border-green-200 bg-green-50 p-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Finished this lesson?
        </h2>

        <p className="mt-3 text-slate-700">
          Mark it complete to update your progress.
        </p>

        <div className="mt-6">
          <LessonCompleteButton slug={lesson.slug} />
        </div>
      </section>

      <div className="mt-12 flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          {previousLesson && (
            <Link
              href={`/lessons/${previousLesson.slug}`}
              className="inline-block rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-800 hover:bg-slate-50"
            >
              ← {previousLesson.title}
            </Link>
          )}
        </div>

        <div>
          {nextLesson ? (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="inline-block rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"
            >
              {nextLesson.title} →
            </Link>
          ) : (
            <Link
              href="/lessons"
              className="inline-block rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"
            >
              View all lessons
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}