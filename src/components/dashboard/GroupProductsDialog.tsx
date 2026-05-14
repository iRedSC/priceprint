import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import GroupProductPicker from "./GroupProductPicker"
import GroupProductsTable from "./GroupProductsTable"
import type { GroupProduct, GroupRow } from "./groupTableData"
import type { ProductRow } from "./productTableData"

type GroupProductsDialogProps = {
  group: GroupRow | null
  products: ProductRow[]
  onOpenChange: (open: boolean) => void
  onAddProducts: (group: GroupRow, productIds: ProductRow["_id"][]) => Promise<void> | void
  onRemoveProduct: (group: GroupRow, product: GroupProduct) => Promise<void> | void
  onReorderProducts: (group: GroupRow, orderedProductIds: GroupProduct["_id"][]) => Promise<void> | void
}

function GroupProductsDialog({
  group,
  products,
  onOpenChange,
  onAddProducts,
  onRemoveProduct,
  onReorderProducts,
}: GroupProductsDialogProps) {
  return (
    <Dialog open={Boolean(group)} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl">
        {group && (
          <>
            <DialogHeader>
              <DialogTitle>{group.name}</DialogTitle>
              <DialogDescription>
                Drag the grip handle to set print order (top prints first). On mobile, hold the grip briefly,
                then drag.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <GroupProductPicker
                group={group}
                products={products}
                onAddProducts={(productIds) => onAddProducts(group, productIds)}
              />
              <GroupProductsTable
                products={group.products}
                onReorderProducts={(orderedProductIds) => onReorderProducts(group, orderedProductIds)}
                onRemoveProduct={(product) => onRemoveProduct(group, product)}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default GroupProductsDialog
