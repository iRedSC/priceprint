import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import GroupProductMobileCard from "./GroupProductMobileCard"
import GroupProductReorderHandle from "./GroupProductReorderHandle"
import type { GroupProduct } from "./groupTableData"

type GroupProductSortableMobileCardProps = {
  product: GroupProduct
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductSortableMobileCard({ product, onRemoveProduct }: GroupProductSortableMobileCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product._id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "touch-none opacity-80" : "touch-manipulation"}
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
