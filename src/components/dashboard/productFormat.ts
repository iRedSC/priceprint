export { formatProductPriceAmount } from "@/lib/formatProductPriceAmount"

export function formatProductPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
