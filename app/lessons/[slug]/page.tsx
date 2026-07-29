type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
        Lesson
      </span>

      <h1 className="mt-6 text-5xl font-bold capitalize">
        {slug.replace(/-/g, " ")}
      </h1>

      <p className="mt-8 text-xl text-gray-600">
        This is where the reading passage will appear.
      </p>

      <div className="mt-12 rounded-2xl border p-8">
        <h2 className="text-2xl font-bold">Reading Passage</h2>

        <p className="mt-6 leading-8">
          Bonjour ! Je m'appelle Pierre. J'habite à Montréal.
          J'aime le café et les croissants.
        </p>
      </div>
    </div>
  );
}