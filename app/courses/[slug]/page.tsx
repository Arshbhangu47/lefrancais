import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCourseBySlug,
  getCourseLessons,
} from "../../../lib/courses";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export default async function CoursePage({
  params,
}: Props) {
  const { slug } = await params;

  const course =
    await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const lessons =
    await getCourseLessons(course.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/courses"
        className="font-semibold text-blue-700"
      >
        ← All courses
      </Link>

      <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
        <span className="text-sm font-bold uppercase tracking-wider text-blue-300">
          {course.levelMin}–
          {course.levelMax}
        </span>

        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          {course.title}
        </h1>

        <p className="mt-4 text-xl text-blue-200">
          {course.subtitle}
        </p>

        <p className="mt-6 max-w-3xl leading-8 text-slate-300">
          {course.description}
        </p>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Course Lessons
            </h2>

            <p className="mt-2 text-slate-600">
              Work through the lessons in order.
            </p>
          </div>

          <span className="text-sm font-semibold text-slate-500">
            {lessons.length} lessons
          </span>
        </div>

        {lessons.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-bold text-slate-950">
              Lessons coming soon
            </h3>

            <p className="mt-3 text-slate-600">
              We are building this course now.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {lessons.map((lesson) => {
              const premium =
                lesson.accessTier ===
                "premium";

              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug}`}
                  className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md sm:flex-row sm:items-center"
                >
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                      {lesson.dayNumber ??
                        "–"}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-950">
                          {lesson.title}
                        </h3>

                        {premium ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                            Premium
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                            Free
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-slate-600">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 font-semibold text-blue-700">
                    Start →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}