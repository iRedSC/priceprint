import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ProductLabelCountForm } from "./ProductLabelCountForm"
import type { ProductRow } from "./productTableData"

type ProductLabelCountDialogProps = {
  product: ProductRow | null
  onOpenChange: (open: boolean) => void
  onConfirm: (count: number) => void
}

function ProductLabelCountDialog({ product, onOpenChange, onConfirm }: ProductLabelCountDialogProps) {
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        {product ? (
          <ProductLabelCountForm
            key={product._id}
            productName={product.name}
            onCancel={() => onOpenChange(false)}
            onConfirm={(count) => {
              onConfirm(count)
              onOpenChange(false)
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default ProductLabelCountDialog
