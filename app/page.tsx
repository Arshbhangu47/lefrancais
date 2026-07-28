export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      <section className="flex flex-col items-center justify-center text-center py-24 px-6">

        <h1 className="text-5xl font-bold text-gray-900">
          Learn French Through Reading
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-2xl">
          Improve your French step by step with beginner-friendly
          reading lessons, vocabulary, and exercises.
        </p>

        <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
          Start Learning
        </button>

      </section>


      <section className="grid md:grid-cols-3 gap-6 px-10 pb-20">

        <div className="border rounded-xl p-6">
          <h2 className="text-2xl font-semibold">
            A1 Beginner
          </h2>
          <p className="mt-2 text-gray-600">
            Learn basic French words and simple sentences.
          </p>
        </div>


        <div className="border rounded-xl p-6">
          <h2 className="text-2xl font-semibold">
            A2 Elementary
          </h2>
          <p className="mt-2 text-gray-600">
            Build confidence with everyday French reading.
          </p>
        </div>


        <div className="border rounded-xl p-6">
          <h2 className="text-2xl font-semibold">
            B1 Intermediate
          </h2>
          <p className="mt-2 text-gray-600">
            Prepare for more advanced French comprehension.
          </p>
        </div>

      </section>

    </main>
  );
}