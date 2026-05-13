import ProductMobileCard from "./ProductMobileCard"
import type { ProductRow } from "./productTableData"

type ProductMobileListProps = {
  products: ProductRow[]
  emptyMessage?: string
}

function ProductMobileList({
  products,
  emptyMessage = "No products scanned yet.",
}: ProductMobileListProps) {
  if (!products.length) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {products.map((product) => (
        <ProductMobileCard
          key={`${product.sku ?? product.upc ?? product.name}-${product.createdAt}`}
          product={product}
        />
      ))}
    </div>
  )
}

export default ProductMobileList
