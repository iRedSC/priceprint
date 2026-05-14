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
      size="sm"
      className="h-10 touch-manipulation gap-2"
      disabled={isRefreshing}
      onClick={onRefreshProducts}
    >
      <Icon className={isRefreshing ? "size-4 animate-spin" : "size-4"} />
      <span className="hidden sm:inline">
        {isRefreshing ? "Refreshing..." : "Refresh prices"}
      </span>
      <span className="sm:hidden">Refresh</span>
    </Button>
  )
}

export default RefreshProductsButton
