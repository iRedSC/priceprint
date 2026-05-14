/** Masks an email for display (first character of local part + obscured remainder). */
export function maskEmail(email: string) {
  const trimmed = email.trim()
  const at = trimmed.indexOf('@')
  if (at <= 0) {
    return '•••••••'
  }

  const localEnd = trimmed.slice(0, at)
  const domain = trimmed.slice(at + 1)
  if (!domain) {
    return '•••••••'
  }

  const prefix =
    localEnd.length <= 1 ? `${localEnd || '•'}••••` : `${localEnd[0]}••••`

  return `${prefix}@${domain}`
}
