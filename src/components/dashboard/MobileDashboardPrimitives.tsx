import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type MobileCatalogChipProps = {
  icon?: LucideIcon
  value: string
}

function MobileCatalogChip({ icon: Icon, value }: MobileCatalogChipProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-muted px-2 py-0.5 text-[0.76rem] leading-snug text-muted-foreground">
      {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
      {value}
    </span>
  )
}

function MobileMonoField({ value }: { value?: string }) {
  return value ? (
    <div className="w-fit max-w-full truncate rounded bg-muted px-1.5 py-0.5 font-mono text-[0.72rem] leading-tight text-muted-foreground">
      {value}
    </div>
  ) : null
}

type DashboardEmptyPanelProps = {
  children: ReactNode
  compact?: boolean
}

function DashboardEmptyPanel({ children, compact = false }: DashboardEmptyPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-center text-sm text-muted-foreground",
        compact ? "p-4" : "p-6",
      )}
    >
      {children}
    </div>
  )
}

export { DashboardEmptyPanel, MobileCatalogChip, MobileMonoField }
