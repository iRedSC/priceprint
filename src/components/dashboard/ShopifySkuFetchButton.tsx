import { useState } from "react"
import { useAction } from "convex/react"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { api } from "../../../convex/_generated/api"

export type ShopifySkuImportPayload = {
  name: string
  sku?: string
  upc?: string
  type?: string
  variant?: string
  vendor?: string
  price: number
  img?: string
  meta: unknown
}

type ShopifySkuFetchButtonProps = {
  sku: string
  sessionToken: string | null
  onImported: (product: ShopifySkuImportPayload) => void
}

function ShopifySkuFetchButton({ sku, sessionToken, onImported }: ShopifySkuFetchButtonProps) {
  const lookup = useAction(api.shopify.lookupProductBySku)
  const [busy, setBusy] = useState(false)
  const trimmed = sku.trim()

  const handleClick = async () => {
    if (!trimmed) {
      toast.error("Enter a SKU first.")
      return
    }
    if (!sessionToken) {
      toast.error("Sign in again to import from Shopify.")
      return
    }

    setBusy(true)
    try {
      const product = await lookup({ sessionToken, sku: trimmed })
      onImported({
        name: product.name,
        sku: product.sku,
        upc: product.upc,
        type: product.type,
        variant: product.variant,
        vendor: product.vendor,
        price: product.price,
        img: product.img,
        meta: product.meta,
      })
      toast.success("Loaded product from Shopify.")
    } catch (error) {
      toast.error("Could not load from Shopify.", {
        description: error instanceof Error ? error.message : "Try again.",
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-10 shrink-0 touch-manipulation"
      aria-label="Import product details from Shopify for this SKU"
      title="Import from Shopify"
      disabled={busy}
      onClick={handleClick}
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
    </Button>
  )
}

export default ShopifySkuFetchButton
