import { hasPrintedPriceDifference } from "./productPrintData"
import { formatProductPrice } from "./productFormat"
import type { ProductRow } from "./productTableData"

function ProductPrintedPriceNote({ product }: { product: ProductRow }) {
  const lastPrintedPrice = product.printData?.lastPrintedPrice

  if (!hasPrintedPriceDifference(product) || typeof lastPrintedPrice !== "number") {
    return null
  }

  return (
    <div className="mt-0.5 text-[0.7rem] leading-none text-muted-foreground">
      Last printed price {formatProductPrice(lastPrintedPrice)}
    </div>
  )
}

export default ProductPrintedPriceNote
