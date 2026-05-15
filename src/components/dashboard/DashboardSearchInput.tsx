import type { ComponentProps } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DashboardSearchInputProps = ComponentProps<typeof Input> & {
  containerClassName?: string
}

function DashboardSearchInput({
  className,
  containerClassName,
  ...props
}: DashboardSearchInputProps) {
  return (
    <div className={cn("relative min-w-0", containerClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground md:size-4" />
      <Input
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        className={cn("h-11 pl-10 text-base md:h-10 md:pl-9 md:text-sm", className)}
        {...props}
      />
    </div>
  )
}

export default DashboardSearchInput
