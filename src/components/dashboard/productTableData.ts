import type { Doc } from "../../../convex/_generated/dataModel"

export type ProductInput = {
  sku?: string
  upc?: string
  name: string
  img?: string
  type?: string
  vendor?: string
  price: number
  meta?: unknown
}

export type ProductRow = Doc<"products">
