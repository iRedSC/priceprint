import { cn } from "@/lib/utils"
import { getProductPrintStatus } from "./productPrintData"
import type { ProductPrintStatus, ProductRow } from "./productTableData"

const printStatusLabels: Record<ProductPrintStatus, string> = {
  "up-to-date": "Up to date",
  "not-printed": "Not Printed",
  "needs-reprinted": "Needs reprinted",
}

const printStatusStyles: Record<ProductPrintStatus, string> = {
  "up-to-date": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "not-printed": "border-muted-foreground/25 bg-muted text-muted-foreground",
  "needs-reprinted": "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
}

function ProductPrintStatusChip({ product }: { product: ProductRow }) {
  const status = getProductPrintStatus(product)

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        printStatusStyles[status]
      )}
    >
      {printStatusLabels[status]}
    </span>
  )
}

export default ProductPrintStatusChip
