import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import AddProductDialog from "./AddProductDialog"
import UploadProductsDialog from "./UploadProductsDialog"
import type { ProductInput } from "./productTableData"

type ProductTaskBarProps = {
  search: string
  onSearchChange: (search: string) => void
  onAddProduct: (product: ProductInput) => Promise<void> | void
  onUploadProducts: (products: ProductInput[]) => Promise<void> | void
}

function ProductTaskBar({
  search,
  onSearchChange,
  onAddProduct,
  onUploadProducts,
}: ProductTaskBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="hidden gap-2 md:flex">
        <AddProductDialog onAddProduct={onAddProduct} />
        <UploadProductsDialog onUploadProducts={onUploadProducts} />
      </div>
      <div className="relative min-w-0 sm:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, SKU, UPC, type, or vendor"
          className="h-10 pl-9"
        />
      </div>
    </div>
  )
}

export default ProductTaskBar
