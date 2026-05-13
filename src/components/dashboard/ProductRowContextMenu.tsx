import { Pencil, Printer, Trash2 } from "lucide-react"

import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import type { ProductRow } from "./productTableData"

type ProductRowContextMenuProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint: (product: ProductRow) => void
}

function ProductRowContextMenu({
  product,
  onEdit,
  onDelete,
  onPrint,
}: ProductRowContextMenuProps) {
  return (
    <>
      <ContextMenuLabel className="max-w-52 truncate">{product.name}</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem onSelect={() => onEdit(product)}>
        <Pencil />
        Edit
      </ContextMenuItem>
      <ContextMenuItem onSelect={() => onPrint(product)}>
        <Printer />
        Print
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onSelect={() => onDelete(product)}>
        <Trash2 />
        Delete
      </ContextMenuItem>
    </>
  )
}

export default ProductRowContextMenu
