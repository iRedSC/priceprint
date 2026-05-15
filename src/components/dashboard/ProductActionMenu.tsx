import { getProductActionMenuItems } from "./actionMenuData"
import type { ProductRow } from "./productTableData"
import ResponsiveActionMenu from "./ResponsiveActionMenu"

type ProductActionMenuProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint?: (product: ProductRow) => void
  onMarkUpToDate?: (product: ProductRow) => void
}

function ProductActionMenu({ product, onEdit, onDelete, onPrint, onMarkUpToDate }: ProductActionMenuProps) {
  const items = getProductActionMenuItems({ product, onEdit, onDelete, onPrint, onMarkUpToDate })
  const title = `Actions for ${product.name}`

  return <ResponsiveActionMenu items={items} title={title} ariaLabel={`Open actions for ${product.name}`} />
}

export default ProductActionMenu
