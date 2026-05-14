import { Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

type RefreshProductsButtonProps = {
  isRefreshing: boolean
  onRefreshProducts: () => Promise<void> | void
}

function RefreshProductsButton({
  isRefreshing,
  onRefreshProducts,
}: RefreshProductsButtonProps) {
  const Icon = isRefreshing ? Loader2 : RefreshCw

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-10 touch-manipulation"
      disabled={isRefreshing}
      aria-label="Refresh Shopify prices"
      title="Refresh Shopify prices"
      onClick={onRefreshProducts}
    >
      <Icon className={isRefreshing ? "size-4 animate-spin" : "size-4"} />
    </Button>
  )
}

export default RefreshProductsButton
