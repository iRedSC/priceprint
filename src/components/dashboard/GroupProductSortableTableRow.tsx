import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import GroupProductReorderHandle from "./GroupProductReorderHandle"
import type { GroupProduct } from "./groupTableData"
import ProductImage from "./ProductImage"
import { formatProductPrice } from "./productFormat"

type GroupProductSortableTableRowProps = {
  product: GroupProduct
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductSortableTableRow({ product, onRemoveProduct }: GroupProductSortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product._id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "z-50 bg-muted/30 opacity-80" : undefined}
    >
      <TableCell className="w-10 text-center align-middle">
        <GroupProductReorderHandle attributes={attributes} listeners={listeners} />
      </TableCell>
      <TableCell>
        <ProductImage src={product.img} alt={product.name} className="size-9" />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{product.sku ?? "-"}</TableCell>
      <TableCell>{formatProductPrice(product.price)}</TableCell>
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
