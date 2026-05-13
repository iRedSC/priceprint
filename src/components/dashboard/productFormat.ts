export function formatProductPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function formatProductDate(timestamp?: number) {
  if (!timestamp) {
    return "Not updated"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(timestamp)
}

export function formatProductMeta(meta: unknown) {
  if (!meta) {
    return undefined
  }

  return typeof meta === "string" ? meta : JSON.stringify(meta)
}
