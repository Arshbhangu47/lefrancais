import Link from "next/link";
import { notFound } from "next/navigation";
import LessonQuiz from "../../../components/LessonQuiz";
import { lessons } from "../../../data/lessons";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;

  const lesson = lessons.find((item) => item.slug === slug);

  if (!lesson) {
    notFound();
  }

  const currentIndex = lessons.findIndex(
    (item) => item.slug === lesson.slug
  );

  const nextLesson = lessons[currentIndex + 1];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/lessons"
        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        ← Back to lessons
      </Link>

      <div className="mt-8 flex items-center gap-3">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {lesson.level}
        </span>

        <span className="text-sm text-gray-500">
          Reading lesson
        </span>
      </div>

      <h1 className="mt-5 text-5xl font-bold">
        {lesson.title}
      </h1>

      <section className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold">
          Reading Passage
        </h2>

        <p className="mt-6 whitespace-pre-line text-lg leading-9 text-gray-700">
          {lesson.passage}
        </p>
      </section>

      <section className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold">
          Vocabulary
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {lesson.vocabulary.map((word) => (
            <div
              key={word.french}
              className="rounded-xl border bg-gray-50 p-5"
            >
              <h3 className="text-xl font-bold">
                {word.french}
              </h3>

              <p className="mt-2 text-gray-600">
                {word.english}
              </p>
            </div>
          ))}
        </div>
      </section>

      <LessonQuiz questions={lesson.quiz} />

      <div className="mt-12 flex justify-end">
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700"
          >
            Next Lesson: {nextLesson.title} →
          </Link>
        ) : (
          <Link
            href="/lessons"
            className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700"
          >
            View All Lessons
          </Link>
        )}
      </div>
    </main>
  );
}