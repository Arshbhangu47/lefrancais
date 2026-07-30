export const PREVIEW_COOKIE_NAME = "lefrancais-preview-access";

export async function hashPreviewPassword(
  password: string
): Promise<string> {
  const encodedValue = new TextEncoder().encode(password);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encodedValue
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}