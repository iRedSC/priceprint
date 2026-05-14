import { cn } from "@/lib/utils"

import ShopifyConnectionStatusBadge from "./ShopifyConnectionStatusBadge"
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
        "flex aspect-square flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm touch-manipulation",
        isActive ? "border-primary/35" : "border-destructive/30"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2">
        <div className="flex items-start justify-between gap-1">
          <span
            className="min-w-0 break-all text-xs font-medium leading-snug text-foreground"
            title={shopDomain}
          >
            {shopDomain}
          </span>
          <ShopifyScopesTooltip scopes={scopes} />
        </div>
        <ShopifyConnectionStatusBadge isActive={isActive} />
        <p className="mt-auto text-[0.65rem] leading-tight text-muted-foreground">
          Added {formatShopifyAddedDate(createdAt)}
        </p>
      </div>
    </div>
  )
}

export default ShopifyStoreConnectionCard
