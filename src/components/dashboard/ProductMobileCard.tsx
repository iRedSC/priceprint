import { CalendarPlus, Layers, MapPin, RefreshCw, Tag } from "lucide-react"

import { CardDescription } from "@/components/ui/card"
import { MobileCatalogChip } from "./MobileDashboardPrimitives"
import ProductActionMenu from "./ProductActionMenu"
import ProductMobileCardBody from "./ProductMobileCardBody"
import { formatProductDate } from "./productFormat"
import type { ProductRow } from "./productTableData"

type ProductMobileCardProps = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onMarkUpToDate?: (product: ProductRow) => void
}

function ProductMobileCard({ product, onEdit, onDelete, onMarkUpToDate }: ProductMobileCardProps) {
  return (
    <ProductMobileCardBody
      product={product}
      headerClassName="grid-cols-[minmax(0,1fr)_auto_auto]"
      details={<CatalogDetails product={product} />}
      action={
        <ProductActionMenu
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkUpToDate={onMarkUpToDate}
        />
      }
      footerClassName="shrink-0"
      footer={<TimelineDates createdAt={product.createdAt} updatedAt={product.updatedAt} />}
    />
  )
}

function CatalogDetails({ product }: { product: ProductRow }) {
  return (
    <CardDescription className="mt-1 flex flex-wrap gap-1.5">
      {product.vendor ? <MobileCatalogChip icon={MapPin} value={product.vendor} /> : null}
      {product.type ? <MobileCatalogChip icon={Tag} value={product.type} /> : null}
      {product.variant ? <MobileCatalogChip icon={Layers} value={product.variant} /> : null}
      {!product.vendor && !product.type && !product.variant ? (
        <MobileCatalogChip value="No catalog details" />
      ) : null}
    </CardDescription>
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
