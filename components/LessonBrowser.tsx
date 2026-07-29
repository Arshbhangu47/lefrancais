"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lesson } from "../data/lessons";
import LessonCard from "./LessonCard";

type LessonBrowserProps = {
  lessons: Lesson[];
};

type LevelFilter = "ALL" | Lesson["level"];

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

export default function LessonBrowser({
  lessons,
}: LessonBrowserProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<LevelFilter>("ALL");
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    function updateProgress() {
      setCompletedSlugs(readCompletedLessons());
    }

    updateProgress();

    window.addEventListener("storage", updateProgress);
    window.addEventListener(
      "lesson-progress-updated",
      updateProgress
    );

    return () => {
      window.removeEventListener("storage", updateProgress);
      window.removeEventListener(
        "lesson-progress-updated",
        updateProgress
      );
    };
  }, []);

  const filteredLessons = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesLevel =
        level === "ALL" || lesson.level === level;

      const matchesSearch =
        lesson.title.toLowerCase().includes(searchText) ||
        lesson.description.toLowerCase().includes(searchText);

      return matchesLevel && matchesSearch;
    });
  }, [lessons, level, search]);

  const completedCount = lessons.filter((lesson) =>
    completedSlugs.includes(lesson.slug)
  ).length;

  const progressPercentage =
    lessons.length === 0
      ? 0
      : Math.round((completedCount / lessons.length) * 100);

  const levels: LevelFilter[] = ["ALL", "A1", "A2", "B1"];

  return (
    <>
      <section className="mt-12 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              Your progress
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              {completedCount} of {lessons.length} lessons completed
            </p>
          </div>

          <span className="text-2xl font-bold text-blue-600">
            {progressPercentage}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-gray-50 p-6">
        <label
          htmlFor="lesson-search"
          className="text-sm font-semibold text-gray-700"
        >
          Search lessons
        </label>

        <input
          id="lesson-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search greetings, travel, family..."
          className="mt-2 w-full rounded-xl border bg-white px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          {levels.map((filterLevel) => (
            <button
              key={filterLevel}
              type="button"
              onClick={() => setLevel(filterLevel)}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                level === filterLevel
                  ? "bg-blue-600 text-white"
                  : "border bg-white text-gray-700 hover:border-blue-500"
              }`}
            >
              {filterLevel === "ALL"
                ? "All Levels"
                : filterLevel}
            </button>
          ))}
        </div>
      </section>

      {filteredLessons.length > 0 ? (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.slug}
              title={lesson.title}
              level={lesson.level}
              description={lesson.description}
              slug={lesson.slug}
              estimatedMinutes={lesson.estimatedMinutes}
              completed={completedSlugs.includes(lesson.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed p-12 text-center">
          <h2 className="text-2xl font-bold">
            No lessons found
          </h2>

          <p className="mt-3 text-gray-600">
            Try another search or select a different level.
          </p>
        </div>
      )}
    </>
  );
}