import type { Doc } from "../../../convex/_generated/dataModel"
import type { ProductRow } from "./productTableData"

export type GroupProduct = ProductRow

export type GroupRow = Doc<"groups"> & {
  products: GroupProduct[]
}
