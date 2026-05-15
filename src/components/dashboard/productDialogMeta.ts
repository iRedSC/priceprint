export function formatMeta(meta: unknown) {
  if (!meta) {
    return ""
  }

  return typeof meta === "string" ? meta : JSON.stringify(meta)
}

export function parseMeta(value: string) {
  if (!value.trim()) {
    return undefined
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
