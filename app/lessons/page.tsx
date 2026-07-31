import LessonBrowser from "../../components/LessonBrowser";
import { getPublishedLessons } from "../../lib/lessons";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const lessons = await getPublishedLessons();

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-3xl">
        <span className="font-semibold text-blue-700">
          Reading practice
        </span>

        <h1 className="mt-3 text-5xl font-bold text-slate-950">
          French Lessons
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Build your French reading skills with
          structured lessons, vocabulary and interactive
          comprehension questions.
        </p>
      </div>

      <LessonBrowser lessons={lessons} />
    </main>
  );
}