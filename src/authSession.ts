import {
  clearDocumentCookie,
  readDocumentCookie,
  writeDocumentCookie,
} from "@/lib/docCookie";

export type AuthResult = {
  email: string;
  sessionToken: string;
};

const STORAGE_KEY = "priceprint.session";
const SESSION_COOKIE = "pp_session";
/** Mirrors localStorage so Safari vs home-screen PWA can sometimes recover session (storage is often isolated per context on iOS). */
const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;

function writeSessionCookie(session: AuthResult) {
  writeDocumentCookie(
    SESSION_COOKIE,
    JSON.stringify(session),
    SESSION_MAX_AGE_SEC,
  );
}

function clearSessionCookie() {
  clearDocumentCookie(SESSION_COOKIE);
}

export const readStoredSession = () => {
  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage) {
    try {
      return JSON.parse(fromStorage) as AuthResult;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  const rawCookie = readDocumentCookie(SESSION_COOKIE);
  if (rawCookie) {
    try {
      const session = JSON.parse(rawCookie) as AuthResult;
      if (session?.sessionToken && session?.email) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        } catch {
          /* quota / private mode */
        }
        return session;
      }
    } catch {
      clearSessionCookie();
    }
  }

  return null;
};

export const storeSession = (session: AuthResult) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  writeSessionCookie(session);
};

export const clearStoredSession = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  clearSessionCookie();
};
