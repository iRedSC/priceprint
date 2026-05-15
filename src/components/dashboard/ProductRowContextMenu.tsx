import { getProductActionMenuItems } from "./actionMenuData"
import { ActionContextMenuItems } from "./actionMenuItems"
import type { ProductRow } from "./productTableData"

type ProductRowContextMenuProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint: (product: ProductRow, opts?: { skipLabelCountModal?: boolean }) => void
  onMarkUpToDate?: (product: ProductRow) => void
}

function ProductRowContextMenu({
  product,
  onEdit,
  onDelete,
  onPrint,
  onMarkUpToDate,
}: ProductRowContextMenuProps) {
  const items = getProductActionMenuItems({ product, onEdit, onDelete, onPrint, onMarkUpToDate })

  return <ActionContextMenuItems items={items} />
}

export default ProductRowContextMenu
