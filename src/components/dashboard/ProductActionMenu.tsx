import { getProductActionMenuItems } from "./actionMenuData"
import type { ProductRow } from "./productTableData"
import ResponsiveActionMenu from "./ResponsiveActionMenu"

type ProductActionMenuProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint?: (product: ProductRow, opts?: { skipLabelCountModal?: boolean }) => void
  onMarkUpToDate?: (product: ProductRow) => void
  canUndoPrint?: boolean
  onUndoPrint?: (product: ProductRow) => void
}

function ProductActionMenu({
  product,
  onEdit,
  onDelete,
  onPrint,
  onMarkUpToDate,
  canUndoPrint,
  onUndoPrint,
}: ProductActionMenuProps) {
  const items = getProductActionMenuItems({
    product,
    onEdit,
    onDelete,
    onPrint,
    onMarkUpToDate,
    canUndoPrint,
    onUndoPrint,
  })
  const title = `Actions for ${product.name}`

  return <ResponsiveActionMenu items={items} title={title} ariaLabel={`Open actions for ${product.name}`} />
}

export default ProductActionMenu
