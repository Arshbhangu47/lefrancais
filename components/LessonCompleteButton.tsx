"use client";

import { useEffect, useState } from "react";

type LessonCompleteButtonProps = {
  slug: string;
};

const STORAGE_KEY = "lefrancais-completed-lessons";

function readCompletedLessons(): string[] {
  try {
    const savedLessons = window.localStorage.getItem(STORAGE_KEY);

    if (!savedLessons) {
      return [];
    }

    const parsedLessons: unknown = JSON.parse(savedLessons);

    if (
      Array.isArray(parsedLessons) &&
      parsedLessons.every((item) => typeof item === "string")
    ) {
      return parsedLessons;
    }

    return [];
  } catch {
    return [];
  }
}

export default function LessonCompleteButton({
  slug,
}: LessonCompleteButtonProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const completedLessons = readCompletedLessons();
    setCompleted(completedLessons.includes(slug));
  }, [slug]);

  function markComplete() {
    const completedLessons = readCompletedLessons();

    if (!completedLessons.includes(slug)) {
      const updatedLessons = [...completedLessons, slug];

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedLessons)
      );
    }

    setCompleted(true);

    window.dispatchEvent(
      new Event("lesson-progress-updated")
    );
  }

  return (
    <button
      type="button"
      onClick={markComplete}
      disabled={completed}
      className="rounded-xl bg-green-600 px-7 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-default disabled:bg-green-700"
    >
      {completed
        ? "Lesson Completed ✓"
        : "Mark Lesson Complete"}
    </button>
  );
}