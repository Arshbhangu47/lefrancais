import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
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
    .select("id, title, level, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-semibold text-blue-600">
            Administration
          </span>

          <h1 className="mt-2 text-4xl font-bold">
            Admin Portal
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome, {profile.full_name || "Administrator"}.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
          >
            Sign Out
          </button>
        </form>
      </div>

      <section className="mt-12 rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Database Lessons
            </h2>

            <p className="mt-2 text-gray-600">
              {lessons?.length ?? 0} lessons currently stored.
            </p>
          </div>

          <Link
            href="/lessons"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            View website
          </Link>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            Unable to load lessons.
          </p>
        )}

        {!error && (!lessons || lessons.length === 0) && (
          <div className="mt-8 rounded-xl border border-dashed p-10 text-center">
            <h3 className="text-xl font-bold">
              No database lessons yet
            </h3>

            <p className="mt-3 text-gray-600">
              The lesson creation form will be added next.
            </p>
          </div>
        )}

        {lessons && lessons.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b">
                    <td className="px-4 py-4 font-semibold">
                      {lesson.title}
                    </td>

                    <td className="px-4 py-4">
                      {lesson.level}
                    </td>

                    <td className="px-4 py-4 capitalize">
                      {lesson.status}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
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