import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { GroupProduct } from "./groupTableData"
import ProductModalSummary from "./ProductModalSummary"

type GroupProductMobileCardProps = {
  product: GroupProduct
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductMobileCard({ product, onRemoveProduct }: GroupProductMobileCardProps) {
  return (
    <Card size="sm" className="py-3">
      <CardContent className="flex items-center gap-2 px-3.5">
        <ProductModalSummary product={product} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 touch-manipulation"
          aria-label={`Remove ${product.name}`}
          onClick={() => onRemoveProduct(product)}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default GroupProductMobileCard
