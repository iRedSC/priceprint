import { useEffect, useRef, useState } from "react"

import AddProductDialog from "./AddProductDialog"
import type { ProductInput } from "./productTableData"

type ProductMobileActionsProps = {
  onAddProduct: (product: ProductInput) => Promise<void> | void
}

function ProductMobileActions({ onAddProduct }: ProductMobileActionsProps) {
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
      className={`safe-area-product-actions fixed z-40 transition-opacity duration-150 md:hidden ${
        interacting ? "opacity-25" : "opacity-100"
      }`}
    >
      <AddProductDialog
        onAddProduct={onAddProduct}
        triggerClassName="size-16 rounded-full shadow-xl ring-1 ring-foreground/10 [&_svg]:size-8"
      />
    </div>
  )
}

export default ProductMobileActions
