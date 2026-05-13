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
}

function GroupProductsDialog({
  group,
  products,
  onOpenChange,
  onAddProducts,
  onRemoveProduct,
}: GroupProductsDialogProps) {
  return (
    <Dialog open={Boolean(group)} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl">
        {group && (
          <>
            <DialogHeader>
              <DialogTitle>{group.name}</DialogTitle>
              <DialogDescription>
                Manage the products included in this working group.
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
