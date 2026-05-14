import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useCallback, useMemo, useState } from "react"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMinWidthMd } from "@/hooks/useMinWidthMd"

import GroupProductSortableMobileCard from "./GroupProductSortableMobileCard"
import GroupProductSortableTableRow from "./GroupProductSortableTableRow"
import type { GroupProduct } from "./groupTableData"
import { useGroupProductsSortSensors } from "./GroupProductsSortSensors"

type GroupProductsTableProps = {
  products: GroupProduct[]
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
  onReorderProducts: (orderedProductIds: GroupProduct["_id"][]) => Promise<void> | void
}

function GroupProductsTable({
  products,
  onRemoveProduct,
  onReorderProducts,
}: GroupProductsTableProps) {
  const isMd = useMinWidthMd()
  const sensors = useGroupProductsSortSensors()
  const [dragId, setDragId] = useState<GroupProduct["_id"] | null>(null)

  const sortableIds = useMemo(() => products.map((p) => p._id), [products])

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setDragId(active.id as GroupProduct["_id"])
  }, [])

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
      setDragId(null)
      if (!over || active.id === over.id) {
        return
      }
      const oldIndex = sortableIds.indexOf(active.id as GroupProduct["_id"])
      const newIndex = sortableIds.indexOf(over.id as GroupProduct["_id"])
      if (oldIndex === -1 || newIndex === -1) {
        return
      }
      const next = arrayMove(products, oldIndex, newIndex)
      await onReorderProducts(next.map((p) => p._id))
    },
    [products, sortableIds, onReorderProducts],
  )

  const handleDragCancel = useCallback(() => {
    setDragId(null)
  }, [])

  if (!products.length) {
    return (
      <p className="rounded-xl border p-4 text-sm text-muted-foreground">
        No products in this group yet.
      </p>
    )
  }

  const activeProduct = dragId ? products.find((p) => p._id === dragId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={(e) => {
        void handleDragEnd(e)
      }}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        {isMd ? (
          <div className="overflow-auto rounded-xl border touch-manipulation">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 px-2 text-center">
                    <span className="sr-only">Reorder</span>
                  </TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <GroupProductSortableTableRow
                    key={product._id}
                    product={product}
                    onRemoveProduct={onRemoveProduct}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-2">
            {products.map((product) => (
              <GroupProductSortableMobileCard
                key={product._id}
                product={product}
                onRemoveProduct={onRemoveProduct}
              />
            ))}
          </div>
        )}
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeProduct ? (
          <div className="rounded-xl border bg-card p-3 text-sm shadow-lg">{activeProduct.name}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default GroupProductsTable
