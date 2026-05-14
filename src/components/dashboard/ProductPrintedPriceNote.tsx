import { History } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatProductPrice } from "./productFormat"
import { hasPrintedPriceDifference } from "./productPrintData"
import type { ProductRow } from "./productTableData"

function ProductPrintedPriceNote({ product }: { product: ProductRow }) {
  const lastPrintedPrice = product.printData?.lastPrintedPrice

  if (!hasPrintedPriceDifference(product) || typeof lastPrintedPrice !== "number") {
    return null
  }

  const tooltip = `Last printed price ${formatProductPrice(lastPrintedPrice)}`

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex size-7 touch-manipulation items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={tooltip}
        >
          <History className="size-3.5 shrink-0" strokeWidth={2} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default ProductPrintedPriceNote
