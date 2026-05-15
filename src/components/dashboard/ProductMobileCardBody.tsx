import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { MobileMonoField } from "./MobileDashboardPrimitives"
import ProductImage from "./ProductImage"
import ProductPrintedPriceNote from "./ProductPrintedPriceNote"
import ProductPrintStatusChip from "./ProductPrintStatusChip"
import { formatProductPrice } from "./productFormat"
import type { ProductRow } from "./productTableData"

type ProductMobileCardBodyProps = {
  product: ProductRow
  details?: ReactNode
  action?: ReactNode
  footer: ReactNode
  cardClassName?: string
  headerClassName: string
  footerClassName?: string
  footerIgnoresSwipe?: boolean
}

function ProductMobileCardBody({
  product,
  details,
  action,
  footer,
  cardClassName,
  headerClassName,
  footerClassName,
  footerIgnoresSwipe,
}: ProductMobileCardBodyProps) {
  return (
    <Card size="sm" className={cn("gap-2 py-3", cardClassName)}>
      <CardHeader className={cn("gap-2 px-3.5", headerClassName)}>
        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-2">
            <ProductImage src={product.img} alt={product.name} className="size-10 rounded-lg" />
            <CardTitle className="line-clamp-2 min-w-0 text-base">{product.name}</CardTitle>
          </div>
          {details}
        </div>
        <div className="min-w-20 text-right">
          <div className="flex items-center justify-end gap-0.5">
            <span className="text-lg font-semibold">{formatProductPrice(product.price)}</span>
            <ProductPrintedPriceNote product={product} />
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 px-3.5">
        <div className="grid min-w-0 gap-1">
          <MobileMonoField value={product.sku} />
          <MobileMonoField value={product.upc} />
        </div>
        <div className="flex justify-center">
          <ProductPrintStatusChip product={product} />
        </div>
        <div className={footerClassName} data-swipe-ignore={footerIgnoresSwipe || undefined}>
          {footer}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductMobileCardBody
