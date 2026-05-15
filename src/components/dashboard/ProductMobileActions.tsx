import AddProductDialog from "./AddProductDialog"
import DashboardMobileFab, { dashboardMobileFabTriggerClassName } from "./DashboardMobileFab"
import type { ProductInput } from "./productTableData"

type ProductMobileActionsProps = {
  onAddProduct: (product: ProductInput) => Promise<void> | void
}

function ProductMobileActions({ onAddProduct }: ProductMobileActionsProps) {
  return (
    <DashboardMobileFab>
      <AddProductDialog
        onAddProduct={onAddProduct}
        triggerVariant="outline"
        triggerClassName={dashboardMobileFabTriggerClassName}
      />
    </DashboardMobileFab>
  )
}

export default ProductMobileActions
