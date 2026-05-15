"use client"

import { useRef } from "react"

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
  onOpenScan?: (group: GroupRow) => void
}

function GroupProductsDialog({
  group,
  products,
  onOpenChange,
  onAddProducts,
  onRemoveProduct,
  onReorderProducts,
  onOpenScan,
}: GroupProductsDialogProps) {
  const listScrollRef = useRef<HTMLDivElement | null>(null)

  return (
    <Dialog open={Boolean(group)} onOpenChange={onOpenChange}>
      <DialogContent
        swipeScrollRef={listScrollRef}
        className="flex h-[100svh] max-h-[100svh] flex-col overflow-hidden md:h-auto md:max-h-[calc(100dvh-2rem)] md:min-h-0 md:max-w-4xl"
      >
        {group && (
          <>
            <DialogHeader className="shrink-0">
              <DialogTitle>{group.name}</DialogTitle>
              <DialogDescription>
                Drag the grip handle to set print order (top prints first). On mobile, hold the grip briefly,
                then drag.
              </DialogDescription>
            </DialogHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="shrink-0">
                <GroupProductPicker
                  group={group}
                  products={products}
                  onAddProducts={(productIds) => onAddProducts(group, productIds)}
                  onOpenScan={onOpenScan ? () => onOpenScan(group) : undefined}
                />
              </div>
              <div
                ref={listScrollRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-manipulation"
              >
                <GroupProductsTable
                  products={group.products}
                  onReorderProducts={(orderedProductIds) => onReorderProducts(group, orderedProductIds)}
                  onRemoveProduct={(product) => onRemoveProduct(group, product)}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default GroupProductsDialog
