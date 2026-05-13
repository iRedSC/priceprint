import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { labelLiveProductVariableHelp } from "@/lib/productLabelVariables"

function LabelLiveVariablesInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 touch-manipulation text-muted-foreground hover:text-foreground"
          aria-label="Label LIVE variables for products"
        >
          <Info className="size-4" strokeWidth={2} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={16}
        className="w-[min(calc(100vw-2rem),18rem)] max-h-[min(70vh,22rem)] gap-3 overflow-y-auto p-3"
      >
        <PopoverHeader className="gap-1">
          <PopoverTitle>Label LIVE variables</PopoverTitle>
          <PopoverDescription className="text-xs leading-snug">
            Use these exact names (UPPERCASE, like Label LIVE’s Data → Integrate) in your design so
            print jobs fill correctly.
          </PopoverDescription>
        </PopoverHeader>
        <ul className="grid gap-2 text-xs">
          {labelLiveProductVariableHelp.map((row) => (
            <li key={row.name} className="grid gap-0.5">
              <code className="font-mono text-[0.7rem] text-foreground">{row.name}</code>
              <span className="text-muted-foreground leading-snug">{row.description}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default LabelLiveVariablesInfo
