import Link from "next/link";

type LessonCardProps = {
  title: string;
  level: string;
  description: string;
  slug: string;
  estimatedMinutes: number;
};

export default function LessonCard({
  title,
  level,
  description,
  slug,
  estimatedMinutes,
}: LessonCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {level}
        </span>

        <span className="text-sm text-gray-500">
          {estimatedMinutes} minutes
        </span>
      </div>

      <h2 className="mt-5 text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-4 flex-1 leading-7 text-gray-600">
        {description}
      </p>

      <Link
        href={`/lessons/${slug}`}
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
      >
        Start Lesson
      </Link>
    </article>
  );
}