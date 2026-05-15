import { Layers, Trash2 } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { GroupProduct } from "./groupTableData"
import { MobileCatalogChip, MobileMonoField } from "./MobileDashboardPrimitives"
import { formatProductPrice } from "./productFormat"
import ProductImage from "./ProductImage"
import ProductPrintedPriceNote from "./ProductPrintedPriceNote"
import ProductPrintStatusChip from "./ProductPrintStatusChip"
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
      <Card size="sm" className="gap-2 border border-border py-3">
        <CardHeader className="grid-cols-[minmax(0,1fr)_auto] gap-2 px-3.5">
          <div className="min-w-0">
            <div className="flex min-w-0 items-start gap-2">
              <ProductImage src={product.img} alt={product.name} className="size-10 rounded-lg" />
              <CardTitle className="line-clamp-2 min-w-0 text-base">{product.name}</CardTitle>
            </div>
            {product.variant ? (
              <CardDescription className="mt-1 flex flex-wrap gap-1.5">
                <MobileCatalogChip icon={Layers} value={product.variant} />
              </CardDescription>
            ) : null}
          </div>
          <div className="min-w-20 text-right">
            <div className="flex items-center justify-end gap-0.5">
              <span className="text-lg font-semibold">{formatProductPrice(product.price)}</span>
              <ProductPrintedPriceNote product={product} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 px-3.5">
          <div className="grid min-w-0 gap-1">
            <MobileMonoField value={product.sku} />
            <MobileMonoField value={product.upc} />
          </div>
          <div className="flex justify-center">
            <ProductPrintStatusChip product={product} />
          </div>
          <div className="flex justify-end" data-swipe-ignore>
            {reorderHandle}
          </div>
        </CardContent>
      </Card>
    </SwipeRevealAction>
  )
}

export default GroupProductMobileCard
