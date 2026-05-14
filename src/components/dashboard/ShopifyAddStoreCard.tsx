import { Plus } from "lucide-react"

type ShopifyAddStoreCardProps = {
  onClick: () => void
  disabled?: boolean
}

function ShopifyAddStoreCard({ onClick, disabled }: ShopifyAddStoreCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/35 hover:text-foreground disabled:pointer-events-none disabled:opacity-50 touch-manipulation"
    >
      <Plus className="size-6 stroke-[2]" aria-hidden />
      <span className="text-[0.65rem] font-medium leading-tight">Add store</span>
    </button>
  )
}

export default ShopifyAddStoreCard
