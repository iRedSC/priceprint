import { DashboardEmptyPanel } from "./MobileDashboardPrimitives"
import ProductMobileCard from "./ProductMobileCard"
import type { ProductRow } from "./productTableData"

type ProductMobileListProps = {
  products: ProductRow[]
  emptyMessage?: string
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onMarkUpToDate?: (product: ProductRow) => void
}

function ProductMobileList({
  products,
  emptyMessage = "No products scanned yet.",
  onEdit,
  onDelete,
  onMarkUpToDate,
}: ProductMobileListProps) {
  if (!products.length) {
    return <DashboardEmptyPanel>{emptyMessage}</DashboardEmptyPanel>
  }

  return (
    <div className="grid gap-3">
      {products.map((product) => (
        <ProductMobileCard
          key={`${product.sku ?? product.upc ?? product.name}-${product.createdAt}`}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkUpToDate={onMarkUpToDate}
        />
      ))}
    </div>
  )
}

export default ProductMobileList
