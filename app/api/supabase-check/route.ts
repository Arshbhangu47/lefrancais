import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  const checks = {
    urlPresent: Boolean(supabaseUrl),
    keyPresent: Boolean(supabaseKey),
    urlValid: false,
    databaseReachable: false,
  };

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        checks,
        error: "Supabase environment variables are missing.",
      },
      { status: 500 }
    );
  }

  try {
    const parsedUrl = new URL(supabaseUrl);

    checks.urlValid =
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.endsWith(".supabase.co");
  } catch {
    return NextResponse.json(
      {
        ok: false,
        checks,
        error: "The Supabase project URL is invalid.",
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { error } = await supabase
      .from("lessons")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          checks,
          error: error.message,
        },
        { status: 500 }
      );
    }

    checks.databaseReachable = true;

    return NextResponse.json({
      ok: true,
      checks,
      message: "Supabase connection is working.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        checks,
        error:
          error instanceof Error
            ? error.message
            : "Unknown connection error.",
      },
      { status: 500 }
    );
  }
}