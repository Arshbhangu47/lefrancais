import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import { createLesson } from "./actions";

type NewLessonPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function NewLessonPage({
  searchParams,
}: NewLessonPageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/admin"
        className="font-semibold text-blue-700 hover:text-blue-900"
      >
        ← Back to admin portal
      </Link>

      <div className="mt-8">
        <span className="font-semibold text-blue-700">
          Lesson management
        </span>

        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          Create a Lesson
        </h1>

        <p className="mt-3 text-slate-600">
          Create a draft or publish it immediately.
        </p>
      </div>

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <form
        action={createLesson}
        className="mt-10 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div>
          <label
            htmlFor="title"
            className="block font-semibold text-slate-800"
          >
            Lesson title *
          </label>

          <input
            id="title"
            name="title"
            required
            placeholder="Greetings and Introductions"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block font-semibold text-slate-800"
          >
            URL slug
          </label>

          <input
            id="slug"
            name="slug"
            placeholder="greetings-and-introductions"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-sm text-slate-500">
            Leave blank to generate it from the title.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label
              htmlFor="level"
              className="block font-semibold text-slate-800"
            >
              Level *
            </label>

            <select
              id="level"
              name="level"
              defaultValue="A1"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="estimatedMinutes"
              className="block font-semibold text-slate-800"
            >
              Minutes *
            </label>

            <input
              id="estimatedMinutes"
              name="estimatedMinutes"
              type="number"
              min="1"
              defaultValue="10"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block font-semibold text-slate-800"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue="draft"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-semibold text-slate-800"
          >
            Description *
          </label>

          <textarea
            id="description"
            name="description"
            required
            rows={3}
            placeholder="Explain what the learner will practise."
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="objectives"
            className="block font-semibold text-slate-800"
          >
            Learning objectives
          </label>

          <textarea
            id="objectives"
            name="objectives"
            rows={5}
            placeholder={`Introduce yourself in French
Ask someone's name
Use common greetings`}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-sm text-slate-500">
            Enter one objective per line.
          </p>
        </div>

        <div>
          <label
            htmlFor="passage"
            className="block font-semibold text-slate-800"
          >
            Reading passage *
          </label>

          <textarea
            id="passage"
            name="passage"
            required
            rows={16}
            placeholder="Enter the complete French reading passage..."
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Create Lesson
          </button>
        </div>
      </form>
    </main>
  );
}