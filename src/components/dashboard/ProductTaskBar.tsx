import AddProductDialog from "./AddProductDialog"
import DashboardSearchInput from "./DashboardSearchInput"
import ProductSortButton from "./ProductSortButton"
import RefreshProductsButton from "./RefreshProductsButton"
import UploadProductsDialog from "./UploadProductsDialog"
import type { ProductSort } from "./productSort"
import type { ProductInput, ProductUploadDuplicateMode, ProductUploadResult } from "./productTableData"

type ProductTaskBarProps = {
  search: string
  onSearchChange: (search: string) => void
  onAddProduct: (product: ProductInput) => Promise<void> | void
  onUploadProducts: (
    products: ProductInput[],
    duplicateMode: ProductUploadDuplicateMode
  ) => Promise<ProductUploadResult | void> | ProductUploadResult | void
  isRefreshingProducts: boolean
  onRefreshProducts: () => Promise<void> | void
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
}

function ProductTaskBar({
  search,
  onSearchChange,
  onAddProduct,
  onUploadProducts,
  isRefreshingProducts,
  onRefreshProducts,
  sort,
  onSortChange,
}: ProductTaskBarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="hidden gap-2 md:flex">
        <AddProductDialog onAddProduct={onAddProduct} />
        <UploadProductsDialog onUploadProducts={onUploadProducts} />
        <RefreshProductsButton
          isRefreshing={isRefreshingProducts}
          onRefreshProducts={onRefreshProducts}
        />
      </div>
      <div className="flex min-w-0 gap-2 sm:w-80">
        <DashboardSearchInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, SKU, UPC, type, or vendor"
          containerClassName="flex-1"
        />
        <div className="md:hidden">
          <RefreshProductsButton
            isRefreshing={isRefreshingProducts}
            onRefreshProducts={onRefreshProducts}
          />
        </div>
        <div className="md:hidden">
          <ProductSortButton
            sort={sort}
            onSortChange={onSortChange}
            triggerClassName="size-10"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductTaskBar
