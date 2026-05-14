import { getProductPrintStatus } from "./productPrintData"
import type { GroupRow } from "./groupTableData"

export function countUnprintedProducts(group: GroupRow) {
  return group.products.filter((product) => getProductPrintStatus(product) === "not-printed")
    .length
}

export function countOutOfDateProducts(group: GroupRow) {
  return group.products.filter((product) => getProductPrintStatus(product) === "needs-reprinted")
    .length
}

export function countUpToDateProducts(group: GroupRow) {
  return group.products.filter((product) => getProductPrintStatus(product) === "up-to-date").length
}
