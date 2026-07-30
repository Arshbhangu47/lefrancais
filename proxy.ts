import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";
import {
  hashPreviewPassword,
  PREVIEW_COOKIE_NAME,
} from "./lib/preview-access";

const publicMaintenancePages = [
  "/coming-soon",
  "/preview-access",
];

export async function proxy(request: NextRequest) {
  const maintenanceMode =
    process.env.MAINTENANCE_MODE === "true";

  if (!maintenanceMode) {
    return updateSession(request);
  }

  const pathname = request.nextUrl.pathname;

  const isMaintenancePage = publicMaintenancePages.some(
    (page) =>
      pathname === page || pathname.startsWith(`${page}/`)
  );

  if (isMaintenancePage) {
    return NextResponse.next();
  }

  const previewPassword =
    process.env.SITE_PREVIEW_PASSWORD;

  const previewCookie = request.cookies.get(
    PREVIEW_COOKIE_NAME
  )?.value;

  if (previewPassword && previewCookie) {
    const expectedCookie =
      await hashPreviewPassword(previewPassword);

    if (previewCookie === expectedCookie) {
      return updateSession(request);
    }
  }

  const comingSoonUrl = request.nextUrl.clone();

  comingSoonUrl.pathname = "/coming-soon";
  comingSoonUrl.search = "";

  return NextResponse.redirect(comingSoonUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};