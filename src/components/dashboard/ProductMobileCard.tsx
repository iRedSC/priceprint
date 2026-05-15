import { CalendarPlus, Layers, MapPin, RefreshCw, Tag } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MobileCatalogChip, MobileMonoField } from "./MobileDashboardPrimitives"
import ProductActionMenu from "./ProductActionMenu"
import ProductImage from "./ProductImage"
import ProductPrintedPriceNote from "./ProductPrintedPriceNote"
import ProductPrintStatusChip from "./ProductPrintStatusChip"
import { formatProductDate, formatProductPrice } from "./productFormat"
import type { ProductRow } from "./productTableData"

type ProductMobileCardProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onMarkUpToDate?: (product: ProductRow) => void
}

function ProductMobileCard({ product, onEdit, onDelete, onMarkUpToDate }: ProductMobileCardProps) {
  return (
    <Card size="sm" className="gap-2 py-3">
      <CardHeader className="grid-cols-[minmax(0,1fr)_auto_auto] gap-2 px-3.5">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-2">
            <ProductImage
              src={product.img}
              alt={product.name}
              className="size-10 rounded-lg"
            />
            <CardTitle className="line-clamp-2 min-w-0 text-base">{product.name}</CardTitle>
          </div>
          <CardDescription className="mt-1 flex flex-wrap gap-1.5">
            {product.vendor ? <MobileCatalogChip icon={MapPin} value={product.vendor} /> : null}
            {product.type ? <MobileCatalogChip icon={Tag} value={product.type} /> : null}
            {product.variant ? <MobileCatalogChip icon={Layers} value={product.variant} /> : null}
            {!product.vendor && !product.type && !product.variant ? (
              <MobileCatalogChip value="No catalog details" />
            ) : null}
          </CardDescription>
        </div>
        <div className="min-w-20 text-right">
          <div className="flex items-center justify-end gap-0.5">
            <span className="text-lg font-semibold">{formatProductPrice(product.price)}</span>
            <ProductPrintedPriceNote product={product} />
          </div>
        </div>
        <ProductActionMenu
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkUpToDate={onMarkUpToDate}
        />
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 px-3.5">
        <div className="grid min-w-0 gap-1">
          <MobileMonoField value={product.sku} />
          <MobileMonoField value={product.upc} />
        </div>
        <div className="flex justify-center">
          <ProductPrintStatusChip product={product} />
        </div>
        <TimelineDates createdAt={product.createdAt} updatedAt={product.updatedAt} />
      </CardContent>
    </Card>
  )
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

export default ProductMobileCard
