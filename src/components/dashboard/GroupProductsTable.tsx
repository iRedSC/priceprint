import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useCallback, useMemo } from "react"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMinWidthMd } from "@/hooks/useMinWidthMd"

import DashboardMobileList from "./DashboardMobileList"
import GroupProductSortableMobileCard from "./GroupProductSortableMobileCard"
import GroupProductSortableTableRow from "./GroupProductSortableTableRow"
import type { GroupProduct } from "./groupTableData"
import { useGroupProductsSortSensors } from "./GroupProductsSortSensors"
import { DashboardEmptyPanel } from "./MobileDashboardPrimitives"

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

  const sortableIds = useMemo(() => products.map((p) => p._id), [products])

  const handleDragEnd = useCallback(
    async ({ active, over }: DragEndEvent) => {
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

  if (!products.length) {
    return <DashboardEmptyPanel compact>No products in this group yet.</DashboardEmptyPanel>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(e) => {
        void handleDragEnd(e)
      }}
    >
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        {isMd ? (
          <div className="box-border min-w-0 w-full max-w-full rounded-xl border bg-card touch-manipulation">
            <Table className="table-fixed min-w-0 max-w-full">
              <colgroup>
                <col style={{ width: "2.5rem" }} />
                <col style={{ width: "4rem" }} />
                <col />
                <col style={{ width: "7.75rem" }} />
                <col style={{ width: "7.75rem" }} />
                <col style={{ width: "3rem" }} />
              </colgroup>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="w-10 px-2 text-center">
                    <span className="sr-only">Reorder</span>
                  </TableHead>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead className="min-w-0 truncate">Product</TableHead>
                  <TableHead className="min-w-0 truncate">Variant</TableHead>
                  <TableHead className="min-w-0 truncate">SKU</TableHead>
                  <TableHead className="w-12 text-center">
                    <span className="sr-only">Delete</span>
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
          <DashboardMobileList
            items={products}
            emptyMessage="No products in this group yet."
            className="gap-2"
          >
            {(product) => (
              <GroupProductSortableMobileCard
                key={product._id}
                product={product}
                onRemoveProduct={onRemoveProduct}
              />
            )}
          </DashboardMobileList>
        )}
      </SortableContext>
    </DndContext>
  )
}

export default GroupProductsTable
