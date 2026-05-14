import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import GroupProductReorderHandle from "./GroupProductReorderHandle"
import type { GroupProduct } from "./groupTableData"
import { GROUP_PRODUCT_SORTABLE_TRANSITION } from "./GroupProductSortTransition"
import ProductImage from "./ProductImage"

type GroupProductSortableTableRowProps = {
  product: GroupProduct
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductSortableTableRow({ product, onRemoveProduct }: GroupProductSortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product._id,
    transition: GROUP_PRODUCT_SORTABLE_TRANSITION,
  })

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        isDragging &&
          "relative z-50 shadow-md outline outline-1 outline-ring bg-card/[0.98]",
      )}
    >
      <TableCell className="w-10 text-center align-middle">
        <GroupProductReorderHandle attributes={attributes} listeners={listeners} />
      </TableCell>
      <TableCell>
        <ProductImage src={product.img} alt={product.name} className="size-9" />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.variant ?? "-"}</TableCell>
      <TableCell>{product.sku ?? "-"}</TableCell>
      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 touch-manipulation"
          aria-label={`Remove ${product.name}`}
          onClick={() => onRemoveProduct(product)}
        >
          <Trash2 className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default GroupProductSortableTableRow
