"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";

const validLevels = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createLesson(formData: FormData) {
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

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const suppliedSlug = String(
    formData.get("slug") ?? ""
  ).trim();

  const slug = createSlug(suppliedSlug || title);

  const level = String(
    formData.get("level") ?? ""
  );

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const passage = String(
    formData.get("passage") ?? ""
  ).trim();

  const estimatedMinutes = Number(
    formData.get("estimatedMinutes")
  );

  const status =
    formData.get("status") === "published"
      ? "published"
      : "draft";

  const objectives = String(
    formData.get("objectives") ?? ""
  )
    .split("\n")
    .map((objective) => objective.trim())
    .filter(Boolean);

  if (!title || !slug || !description || !passage) {
    redirect(
      "/admin/lessons/new?error=Complete+all+required+fields."
    );
  }

  if (!validLevels.includes(level)) {
    redirect(
      "/admin/lessons/new?error=Select+a+valid+level."
    );
  }

  if (
    !Number.isInteger(estimatedMinutes) ||
    estimatedMinutes < 1
  ) {
    redirect(
      "/admin/lessons/new?error=Enter+a+valid+lesson+duration."
    );
  }

  const { error } = await supabase
    .from("lessons")
    .insert({
      title,
      slug,
      level,
      description,
      passage,
      estimated_minutes: estimatedMinutes,
      objectives,
      status,
      created_by: userId,
    });

  if (error) {
    redirect(
      `/admin/lessons/new?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  revalidatePath("/admin");
  revalidatePath("/lessons");

  redirect("/admin?success=Lesson+created+successfully.");
}