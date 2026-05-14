const KEY = 'priceprint.passkeyHintEmail'

/** Best-effort hint that this device likely has a passkey (set after successful enrollment or passkey sign-in). */
export function readPasskeyHintEmail() {
  try {
    const v = window.localStorage.getItem(KEY)
    return v && v.includes('@') ? v : null
  } catch {
    return null
  }
}

export function storePasskeyHintEmail(email: string) {
  try {
    window.localStorage.setItem(KEY, email.trim().toLowerCase())
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearPasskeyHintEmail() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
