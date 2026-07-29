import { notFound } from "next/navigation";
import { lessons } from "../../../data/lessons";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;

  const lesson = lessons.find((l) => l.slug === slug);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">

      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
        {lesson.level}
      </span>

      <h1 className="mt-5 text-5xl font-bold">
        {lesson.title}
      </h1>

      {/* Reading */}

      <div className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          📖 Reading Passage
        </h2>

        <p className="mt-6 whitespace-pre-line text-lg leading-9 text-gray-700">
          {lesson.passage}
        </p>

      </div>

      {/* Vocabulary */}

      <div className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          📚 Vocabulary
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">

          {lesson.vocabulary.map((word) => (

            <div
              key={word.french}
              className="rounded-xl border p-5"
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

      </div>

      {/* Quiz */}

      <div className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold">
          📝 Quiz
        </h2>

        {lesson.quiz.map((question) => (

          <div
            key={question.question}
            className="mt-8"
          >

            <h3 className="mb-5 text-xl font-semibold">
              {question.question}
            </h3>

            <div className="space-y-3">

              {question.options.map((option) => (

                <button
                  key={option}
                  className="block w-full rounded-lg border px-5 py-4 text-left transition hover:bg-blue-50"
                >
                  {option}
                </button>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}