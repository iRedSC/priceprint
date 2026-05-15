import { Layers, Trash2 } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"

import type { GroupProduct } from "./groupTableData"
import { MobileCatalogChip } from "./MobileDashboardPrimitives"
import ProductMobileCardBody from "./ProductMobileCardBody"
import SwipeRevealAction from "./SwipeRevealAction"

type GroupProductMobileCardProps = {
  product: GroupProduct
  reorderHandle?: ReactNode
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductMobileCard({ product, reorderHandle, onRemoveProduct }: GroupProductMobileCardProps) {
  return (
    <SwipeRevealAction
      action={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-full rounded-none text-destructive-foreground hover:bg-transparent hover:text-destructive-foreground"
          aria-label={`Remove ${product.name}`}
          onClick={() => onRemoveProduct(product)}
        >
          <Trash2 className="size-5" />
        </Button>
      }
    >
      <ProductMobileCardBody
        product={product}
        cardClassName="border border-border"
        headerClassName="grid-cols-[minmax(0,1fr)_auto]"
        details={<VariantDetails variant={product.variant} />}
        footerClassName="flex justify-end"
        footerIgnoresSwipe
        footer={reorderHandle}
      />
    </SwipeRevealAction>
  )
}

function VariantDetails({ variant }: { variant?: string }) {
  return variant ? (
    <CardDescription className="mt-1 flex flex-wrap gap-1.5">
      <MobileCatalogChip icon={Layers} value={variant} />
    </CardDescription>
  ) : null
}

export default GroupProductMobileCard
