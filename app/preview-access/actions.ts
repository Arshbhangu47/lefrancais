"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  hashPreviewPassword,
  PREVIEW_COOKIE_NAME,
} from "../../lib/preview-access";

export async function unlockPreview(formData: FormData) {
  const submittedPassword = String(
    formData.get("password") ?? ""
  );

  const correctPassword =
    process.env.SITE_PREVIEW_PASSWORD;

  if (!correctPassword) {
    redirect(
      "/preview-access?error=Preview+password+is+not+configured."
    );
  }

  if (submittedPassword !== correctPassword) {
    redirect(
      "/preview-access?error=Incorrect+preview+password."
    );
  }

  const cookieStore = await cookies();

  const hashedPassword =
    await hashPreviewPassword(correctPassword);

  cookieStore.set(
    PREVIEW_COOKIE_NAME,
    hashedPassword,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  redirect("/");
}