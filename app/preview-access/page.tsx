import { unlockPreview } from "./actions";

type PreviewAccessPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function PreviewAccessPage({
  searchParams,
}: PreviewAccessPageProps) {
  const { error } = await searchParams;

  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-xl font-bold text-white">
          LF
        </div>

        <h1 className="mt-7 text-3xl font-bold text-slate-950">
          Private Preview
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Enter your private password to view the website under
          development.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form action={unlockPreview} className="mt-8">
          <label
            htmlFor="password"
            className="block font-semibold text-slate-800"
          >
            Preview password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Open Website
          </button>
        </form>
      </div>
    </main>
  );
}