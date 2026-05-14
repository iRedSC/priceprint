import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ShopifyScopesTooltipProps = {
  scopes: string[]
}

function ShopifyScopesTooltip({ scopes }: ShopifyScopesTooltipProps) {
  const label = scopes.length ? scopes.join(", ") : "No scopes recorded."

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 touch-manipulation text-muted-foreground hover:text-foreground"
          aria-label="OAuth scopes"
        >
          <Info className="size-4" strokeWidth={2} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-[min(calc(100vw-2rem),18rem)]">
        <span className="block whitespace-normal">{label}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export default ShopifyScopesTooltip
