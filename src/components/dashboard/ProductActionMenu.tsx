import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileTray } from "@/components/ui/mobile-tray"
import { useMinWidthMd } from "@/hooks/useMinWidthMd"
import { getProductActionMenuItems } from "./actionMenuData"
import { ActionDropdownMenuItems, ActionTrayMenuItems } from "./actionMenuItems"
import type { ProductRow } from "./productTableData"

type ProductActionMenuProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint?: (product: ProductRow) => void
  onMarkUpToDate?: (product: ProductRow) => void
}

function ProductActionMenu({ product, onEdit, onDelete, onPrint, onMarkUpToDate }: ProductActionMenuProps) {
  const isMd = useMinWidthMd()
  const [trayOpen, setTrayOpen] = useState(false)
  const items = getProductActionMenuItems({ product, onEdit, onDelete, onPrint, onMarkUpToDate })

  if (!isMd) {
    return (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 touch-manipulation"
          aria-label={`Open actions for ${product.name}`}
          onClick={() => setTrayOpen(true)}
        >
          <MoreHorizontal />
        </Button>
        <MobileTray
          open={trayOpen}
          onOpenChange={setTrayOpen}
          title={`Actions for ${product.name}`}
        >
          <ActionTrayMenuItems items={items} onAction={() => setTrayOpen(false)} />
        </MobileTray>
      </>
    )
  }

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
