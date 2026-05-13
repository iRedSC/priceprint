export function formatStatCount(n: number, pending: boolean) {
  if (pending) {
    return "—"
  }

  return String(n)
}
