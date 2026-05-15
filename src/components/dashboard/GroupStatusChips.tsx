import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type GroupStatusChipsProps = {
  className?: string
  chipClassName?: string
  unprinted: number
  upToDate: number
  outOfDate: number
}

const chipStyles = {
  unprinted: "border-muted-foreground/25 bg-muted text-muted-foreground",
  upToDate:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  outOfDate: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
} as const

export function StatusCountChip({
  count,
  label,
  tone,
  className,
}: {
  count: number
  label: string
  tone: keyof typeof chipStyles
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "inline-flex h-7 min-w-7 cursor-default touch-manipulation items-center justify-center rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums",
            chipStyles[tone],
            count === 0 && "opacity-40",
            className,
          )}
        >
          {count}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  )
}

function GroupStatusChips({
  className,
  chipClassName,
  unprinted,
  upToDate,
  outOfDate,
}: GroupStatusChipsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <StatusCountChip
        className={chipClassName}
        count={unprinted}
        label="Unprinted"
        tone="unprinted"
      />
      <StatusCountChip
        className={chipClassName}
        count={upToDate}
        label="Up to date"
        tone="upToDate"
      />
      <StatusCountChip
        className={chipClassName}
        count={outOfDate}
        label="Out of date"
        tone="outOfDate"
      />
    </div>
  )
}

export default GroupStatusChips
