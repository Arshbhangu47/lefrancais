import Link from "next/link";
import {
  getPublishedCourses,
} from "../../lib/courses";

export const dynamic =
  "force-dynamic";

export default async function CoursesPage() {
  const courses =
    await getPublishedCourses();

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="max-w-3xl">
        <span className="font-semibold text-blue-700">
          Practical French
        </span>

        <h1 className="mt-3 text-5xl font-bold text-slate-950">
          Learn French for real life in Canada
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Structured courses built around situations
          you will actually encounter at work and in
          everyday life.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                {course.levelMin}–
                {course.levelMax}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                30 Days
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-950">
              {course.title}
            </h2>

            <p className="mt-3 font-medium text-blue-700">
              {course.subtitle}
            </p>

            <p className="mt-5 leading-7 text-slate-600">
              {course.description}
            </p>

            <Link
              href={`/courses/${course.slug}`}
              className="mt-8 inline-block rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              View Course →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}