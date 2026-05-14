import { cn } from "@/lib/utils"

import ShopifyScopesTooltip from "./ShopifyScopesTooltip"
import { formatShopifyAddedDate } from "./shopifyConnectionFormat"

export type ShopifyStoreConnectionCardProps = {
  shopDomain: string
  createdAt: number
  isActive: boolean
  scopes: string[]
}

function ShopifyStoreConnectionCard({
  shopDomain,
  createdAt,
  isActive,
  scopes,
}: ShopifyStoreConnectionCardProps) {
  return (
    <div
      className={cn(
        "flex aspect-square flex-col overflow-hidden rounded-xl border bg-card text-left shadow-sm touch-manipulation",
        isActive ? "ring-2 ring-primary/35" : "ring-2 ring-destructive/25"
      )}
    >
      <div
        className={cn(
          "h-1.5 w-full shrink-0",
          isActive ? "bg-primary" : "bg-destructive"
        )}
        aria-hidden
      />
      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className="min-w-0 break-all text-sm font-medium leading-snug text-foreground"
            title={shopDomain}
          >
            {shopDomain}
          </span>
          <ShopifyScopesTooltip scopes={scopes} />
        </div>
        <p className="mt-auto text-xs text-muted-foreground">
          Added {formatShopifyAddedDate(createdAt)}
        </p>
      </div>
    </div>
  )
}

export default ShopifyStoreConnectionCard
