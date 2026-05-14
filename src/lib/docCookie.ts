/** Minimal first-party cookie helpers for auth mirrors (not httpOnly; same XSS profile as localStorage). */

export function readDocumentCookie(name: string): string | null {
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const k = part.slice(0, eq);
    if (k !== name) continue;
    return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

export function writeDocumentCookie(name: string, value: string, maxAgeSec: number) {
  const encoded = encodeURIComponent(value);
  const secure = globalThis.location?.protocol === "https:";
  document.cookie = `${name}=${encoded}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${
    secure ? "; Secure" : ""
  }`;
}

export function clearDocumentCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
