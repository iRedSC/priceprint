import { useEffect, useRef, useState } from "react"

import AddProductDialog from "./AddProductDialog"
import ProductSortButton from "./ProductSortButton"
import type { ProductSort } from "./productSort"
import type { ProductInput } from "./productTableData"

type ProductMobileActionsProps = {
  onAddProduct: (product: ProductInput) => Promise<void> | void
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
}

function ProductMobileActions({
  onAddProduct,
  sort,
  onSortChange,
}: ProductMobileActionsProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<number | null>(null)
  const [interacting, setInteracting] = useState(false)

  useEffect(() => {
    const restoreAfterInteraction = () => {
      if (restoreRef.current) {
        window.clearTimeout(restoreRef.current)
      }

      restoreRef.current = window.setTimeout(() => setInteracting(false), 250)
    }
    const handlePress = (event: PointerEvent) => {
      if (actionsRef.current?.contains(event.target as Node)) {
        return
      }

      setInteracting(true)
    }
    const handleScroll = () => {
      setInteracting(true)
      restoreAfterInteraction()
    }

    window.addEventListener("pointerdown", handlePress)
    window.addEventListener("pointerup", restoreAfterInteraction)
    window.addEventListener("pointercancel", restoreAfterInteraction)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      if (restoreRef.current) {
        window.clearTimeout(restoreRef.current)
      }

      window.removeEventListener("pointerdown", handlePress)
      window.removeEventListener("pointerup", restoreAfterInteraction)
      window.removeEventListener("pointercancel", restoreAfterInteraction)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  return (
    <div
      ref={actionsRef}
      className={`fixed bottom-20 right-4 z-40 flex gap-2 rounded-2xl bg-background/95 p-2 shadow-lg ring-1 ring-foreground/10 backdrop-blur transition-opacity duration-150 md:hidden ${
        interacting ? "opacity-25" : "opacity-100"
      }`}
    >
      <AddProductDialog onAddProduct={onAddProduct} />
      <ProductSortButton sort={sort} onSortChange={onSortChange} />
    </div>
  )
}

export default ProductMobileActions
