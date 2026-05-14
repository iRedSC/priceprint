import { Card, CardContent } from "@/components/ui/card"
import type { ProductRow } from "./productTableData"
import ProductModalSummary from "./ProductModalSummary"

type GroupProductPickerMobileCardProps = {
  product: ProductRow
  selected: boolean
  onToggle: (productId: ProductRow["_id"]) => void
}

function GroupProductPickerMobileCard({
  product,
  selected,
  onToggle,
}: GroupProductPickerMobileCardProps) {
  return (
    <Card size="sm" className="py-3">
      <CardContent className="px-3.5">
        <label className="flex min-h-12 cursor-pointer items-center gap-3 touch-manipulation">
          <input
            type="checkbox"
            className="size-5 shrink-0 touch-manipulation"
            checked={selected}
            onChange={() => onToggle(product._id)}
            aria-label={`Select ${product.name}`}
          />
          <ProductModalSummary product={product} omitPrice />
        </label>
      </CardContent>
    </Card>
  )
}

export default GroupProductPickerMobileCard
