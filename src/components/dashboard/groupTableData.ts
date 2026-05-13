import type { Doc } from "../../../convex/_generated/dataModel"

export type GroupProduct = Doc<"products">

export type GroupRow = Doc<"groups"> & {
  products: GroupProduct[]
}

export type GroupStatus = GroupRow["status"]
