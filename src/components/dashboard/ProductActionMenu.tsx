import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProductActionMenuItems } from "./actionMenuData"
import { ActionDropdownMenuItems } from "./actionMenuItems"
import type { ProductRow } from "./productTableData"

type ProductActionMenuProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint?: (product: ProductRow) => void
}

function ProductActionMenu({ product, onEdit, onDelete, onPrint }: ProductActionMenuProps) {
  const items = getProductActionMenuItems({ product, onEdit, onDelete, onPrint })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 touch-manipulation"
          aria-label={`Open actions for ${product.name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ActionDropdownMenuItems items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProductActionMenu
