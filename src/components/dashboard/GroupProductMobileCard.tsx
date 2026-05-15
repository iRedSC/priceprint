import { CalendarPlus, Layers, MapPin, RefreshCw, Tag, Trash2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
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
import { formatProductDate, formatProductPrice } from "./productFormat"
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
      <Card size="sm" className="gap-2 py-3 pr-11">
        <CardHeader className="grid-cols-[minmax(0,1fr)_auto] gap-2 px-3.5">
          <div className="min-w-0">
            <div className="flex min-w-0 items-start gap-2">
              <ProductImage src={product.img} alt={product.name} className="size-10 rounded-lg" />
              <CardTitle className="line-clamp-2 min-w-0 text-base">{product.name}</CardTitle>
            </div>
            <CardDescription className="mt-1 flex flex-wrap gap-1.5">
              {product.vendor ? <InfoChip icon={MapPin} value={product.vendor} /> : null}
              {product.type ? <InfoChip icon={Tag} value={product.type} /> : null}
              {product.variant ? <InfoChip icon={Layers} value={product.variant} /> : null}
              {!product.vendor && !product.type && !product.variant ? (
                <InfoChip value="No catalog details" />
              ) : null}
            </CardDescription>
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
            <CodeText value={product.sku} />
            <CodeText value={product.upc} />
          </div>
          <div className="flex justify-center">
            <ProductPrintStatusChip product={product} />
          </div>
          <TimelineDates createdAt={product.createdAt} updatedAt={product.updatedAt} />
        </CardContent>
        {reorderHandle ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1" data-swipe-ignore>
            {reorderHandle}
          </div>
        ) : null}
      </Card>
    </SwipeRevealAction>
  )
}

function InfoChip({ icon: Icon, value }: { icon?: LucideIcon; value: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-muted px-2 py-0.5 text-[0.76rem] leading-snug text-muted-foreground">
      {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
      {value}
    </span>
  )
}

function CodeText({ value }: { value?: string }) {
  return value ? (
    <div className="w-fit max-w-full truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[0.72rem] leading-tight text-muted-foreground">
      {value}
    </div>
  ) : null
}

type TimelineDatesProps = {
  createdAt: number
  updatedAt?: number
}

function TimelineDates({ createdAt, updatedAt }: TimelineDatesProps) {
  return (
    <div className="shrink-0 text-[0.75rem] leading-tight text-muted-foreground">
      <div className="flex items-center justify-end gap-1">
        <CalendarPlus className="size-3.5" />
        <span>{formatProductDate(createdAt)}</span>
      </div>
      <div className="flex items-center justify-end gap-1">
        <RefreshCw className="size-3.5" />
        <span>{formatProductDate(updatedAt)}</span>
      </div>
    </div>
  )
}

export default GroupProductMobileCard
