import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-3xl">

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              🇫🇷 AI Powered French Learning
            </span>

            <h1 className="mt-8 text-6xl font-extrabold leading-tight text-gray-900">
              Learn French Through Reading.
            </h1>

            <p className="mt-8 text-xl leading-8 text-gray-600">
              Improve your French with interactive reading lessons,
              vocabulary, quizzes and AI explanations designed for
              A1, A2 and B1 learners.
            </p>

            <div className="mt-10 flex gap-4">

              <Link
                href="/lessons"
                className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white hover:bg-blue-700"
              >
                Start Learning
              </Link>

              <button className="rounded-xl border border-gray-300 px-8 py-4 font-semibold hover:bg-gray-100">
                View Roadmap
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* Levels */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <h2 className="text-center text-4xl font-bold">
          Choose Your Level
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">

          <div className="rounded-2xl border p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

            <div className="text-5xl">🟢</div>

            <h3 className="mt-6 text-2xl font-bold">
              A1 Beginner
            </h3>

            <p className="mt-4 text-gray-600">
              Greetings, numbers, family,
              food, shopping and daily life.
            </p>

          </div>

          <div className="rounded-2xl border p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

            <div className="text-5xl">🟡</div>

            <h3 className="mt-6 text-2xl font-bold">
              A2 Elementary
            </h3>

            <p className="mt-4 text-gray-600">
              Daily conversations,
              work, travel and practical reading.
            </p>

          </div>

          <div className="rounded-2xl border p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

            <div className="text-5xl">🔵</div>

            <h3 className="mt-6 text-2xl font-bold">
              B1 Intermediate
            </h3>

            <p className="mt-4 text-gray-600">
              Longer passages,
              opinions, articles and real-world reading.
            </p>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="bg-gray-50 py-20">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-center text-4xl font-bold">
            Everything You Need
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-4">

            <div className="rounded-xl bg-white p-6 shadow">
              📖
              <h3 className="mt-4 text-xl font-bold">
                Reading Lessons
              </h3>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              📝
              <h3 className="mt-4 text-xl font-bold">
                Practice Quizzes
              </h3>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              🤖
              <h3 className="mt-4 text-xl font-bold">
                AI Explanations
              </h3>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              📈
              <h3 className="mt-4 text-xl font-bold">
                Progress Tracking
              </h3>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}