export function formatGroupDate(value?: number) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(value)
}
