import type { Doc } from "../../../convex/_generated/dataModel"

export type ProductInput = {
  sku?: string
  upc?: string
  name: string
  img?: string
  type?: string
  variant?: string
  vendor?: string
  price: number
  meta?: unknown
}

export type ProductUploadDuplicateMode = "ignore" | "overwrite"

export type ProductUploadResult = {
  inserted: number
  updated: number
  ignored: number
}

export type ProductPrintStatus = "up-to-date" | "not-printed" | "needs-reprinted"
export type ProductRow = Doc<"products"> & {
  printData?: Doc<"printData"> | null
}
export type ProductEditableField =
  | "sku"
  | "upc"
  | "name"
  | "img"
  | "type"
  | "variant"
  | "vendor"
  | "price"
