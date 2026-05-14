import ProductImage from "./ProductImage"
import { formatProductPrice } from "./productFormat"
import type { ProductRow } from "./productTableData"

type ProductModalSummaryProps = {
  product: ProductRow
}

function ProductModalSummary({ product }: ProductModalSummaryProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <ProductImage src={product.img} alt={product.name} className="size-11 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-medium leading-snug">{product.name}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>SKU {product.sku ?? "-"}</span>
          <span>UPC {product.upc ?? "-"}</span>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold">{formatProductPrice(product.price)}</p>
    </div>
  )
}

export default ProductModalSummary
