import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | Le Français",
  description:
    "A new French learning experience is coming soon.",
};

export default function ComingSoonPage() {
  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-[#f8f6f1] px-6 py-12 text-slate-950">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-3xl font-bold text-white shadow-lg">
          LF
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-blue-700">
          Le Français
        </p>

        <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-7xl">
          Good things are coming soon.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          We are creating a modern French learning experience
          with structured lessons, interactive practice and
          exam preparation.
        </p>

        <div className="mx-auto mt-10 h-1 w-24 rounded-full bg-blue-700" />

        <p className="mt-10 text-sm text-slate-500">
          © 2026 Le Français
        </p>
      </div>
    </main>
  );
}