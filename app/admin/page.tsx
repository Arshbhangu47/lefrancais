import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { logout } from "./actions";

type AdminPageProps = {
  searchParams: Promise<{
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const { success } = await searchParams;

  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, level, status, estimated_minutes, updated_at"
    )
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-semibold text-blue-700">
            Administration
          </span>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Admin Portal
          </h1>

          <p className="mt-3 text-slate-600">
            Welcome,{" "}
            {profile.full_name || "Administrator"}.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/lessons/new"
            className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            + New Lesson
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {success && (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-800">
          {success}
        </div>
      )}

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Database Lessons
          </h2>

          <p className="mt-2 text-slate-600">
            {lessons?.length ?? 0} lessons stored in Supabase.
          </p>
        </div>

        {error && (
          <p className="mt-8 text-red-700">
            Unable to load lessons.
          </p>
        )}

        {!error && (!lessons || lessons.length === 0) && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <h3 className="text-xl font-bold text-slate-950">
              No database lessons yet
            </h3>

            <p className="mt-3 text-slate-600">
              Create your first lesson using the admin form.
            </p>
          </div>
        )}

        {lessons && lessons.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">
                        {lesson.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        /{lesson.slug}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      {lesson.level}
                    </td>

                    <td className="px-4 py-4">
                      {lesson.estimated_minutes} min
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          lesson.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {lesson.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {new Date(
                        lesson.updated_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}