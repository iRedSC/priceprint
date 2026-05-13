import type { ProductPrintStatus, ProductRow } from "./productTableData"

export function getProductPrintStatus(product: ProductRow): ProductPrintStatus {
  if (typeof product.printData?.lastPrintedPrice !== "number") {
    return "not-printed"
  }

  return hasPrintedPriceDifference(product) ? "needs-reprinted" : "up-to-date"
}

export function hasPrintedPriceDifference(product: ProductRow) {
  return (
    typeof product.printData?.lastPrintedPrice === "number" &&
    product.printData.lastPrintedPrice !== product.price
  )
}
