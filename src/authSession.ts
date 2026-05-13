export type AuthResult = {
  email: string;
  sessionToken: string;
};

const STORAGE_KEY = "priceprint.session";

export const readStoredSession = () => {
  const value = window.localStorage.getItem(STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthResult;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const storeSession = (session: AuthResult) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
