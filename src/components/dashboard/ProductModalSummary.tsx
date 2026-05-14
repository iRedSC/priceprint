import ProductImage from "./ProductImage"
import { formatProductPrice } from "./productFormat"
import type { ProductRow } from "./productTableData"

type ProductModalSummaryProps = {
  product: ProductRow
  /** Hide trailing price — e.g. add-to-group picker matches desktop columns (no Price). */
  omitPrice?: boolean
}

function ProductModalSummary({ product, omitPrice = false }: ProductModalSummaryProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <ProductImage src={product.img} alt={product.name} className="size-11 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-medium leading-snug">{product.name}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Variant {product.variant ?? "-"}</span>
          <span>SKU {product.sku ?? "-"}</span>
          {!omitPrice ? <span>UPC {product.upc ?? "-"}</span> : null}
        </div>
      </div>
      {!omitPrice ? (
        <p className="shrink-0 text-sm font-semibold">{formatProductPrice(product.price)}</p>
      ) : null}
    </div>
  )
}

export default ProductModalSummary
