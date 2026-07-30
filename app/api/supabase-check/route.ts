import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      supabaseUrlPresent: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL
      ),
      supabaseKeyPresent: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
      vercelEnvironment: process.env.VERCEL_ENV ?? null,
      productionDomain:
        process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
      deploymentDomain: process.env.VERCEL_URL ?? null,
      repository: process.env.VERCEL_GIT_REPO_SLUG ?? null,
      commit:
        process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}