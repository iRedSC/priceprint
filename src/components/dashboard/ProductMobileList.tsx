import DashboardMobileList from "./DashboardMobileList"
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
  return (
    <DashboardMobileList items={products} emptyMessage={emptyMessage}>
      {(product) => (
        <ProductMobileCard
          key={`${product.sku ?? product.upc ?? product.name}-${product.createdAt}`}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkUpToDate={onMarkUpToDate}
        />
      )}
    </DashboardMobileList>
  )
}

export default ProductMobileList
