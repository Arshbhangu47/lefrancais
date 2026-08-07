import type { LessonLevel } from "./lesson";

export type Course = {
  id: string;

  slug: string;

  title: string;

  subtitle: string;

  description: string;

  category: string;

  levelMin: LessonLevel;

  levelMax: LessonLevel;

  priceCad: number | null;

  position: number;
};