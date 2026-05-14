import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { cn } from "@/lib/utils"

import GroupProductMobileCard from "./GroupProductMobileCard"
import GroupProductReorderHandle from "./GroupProductReorderHandle"
import type { GroupProduct } from "./groupTableData"
import { GROUP_PRODUCT_SORTABLE_TRANSITION } from "./GroupProductSortTransition"

type GroupProductSortableMobileCardProps = {
  product: GroupProduct
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductSortableMobileCard({ product, onRemoveProduct }: GroupProductSortableMobileCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product._id,
    transition: GROUP_PRODUCT_SORTABLE_TRANSITION,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "relative",
        isDragging ? "touch-none z-50 shadow-lg" : "touch-manipulation",
      )}
    >
      <GroupProductMobileCard
        leading={<GroupProductReorderHandle attributes={attributes} listeners={listeners} />}
        product={product}
        onRemoveProduct={onRemoveProduct}
      />
    </div>
  )
}

export default GroupProductSortableMobileCard
