import {
  clearDocumentCookie,
  readDocumentCookie,
  writeDocumentCookie,
} from '@/lib/docCookie'

const KEY = 'priceprint.passkeyHintEmail'
const HINT_COOKIE = 'pp_pk_hint'
const HINT_MAX_AGE_SEC = 30 * 24 * 60 * 60

/** Best-effort hint that this device likely has a passkey (set after successful enrollment or passkey sign-in). */
export function readPasskeyHintEmail() {
  try {
    const fromStorage = window.localStorage.getItem(KEY)
    if (fromStorage && fromStorage.includes('@')) return fromStorage
  } catch {
    /* ignore */
  }
  const fromCookie = readDocumentCookie(HINT_COOKIE)
  if (fromCookie && fromCookie.includes('@')) {
    const normalized = fromCookie.trim().toLowerCase()
    try {
      window.localStorage.setItem(KEY, normalized)
    } catch {
      /* quota */
    }
    return normalized
  }
  return null
}

export function storePasskeyHintEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  try {
    window.localStorage.setItem(KEY, normalized)
  } catch {
    /* ignore quota / private mode */
  }
  writeDocumentCookie(HINT_COOKIE, normalized, HINT_MAX_AGE_SEC)
}

export function clearPasskeyHintEmail() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  clearDocumentCookie(HINT_COOKIE)
}
