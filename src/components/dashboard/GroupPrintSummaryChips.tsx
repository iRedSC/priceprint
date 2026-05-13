import { cn } from "@/lib/utils"

type GroupPrintSummaryChipsProps = {
  unprinted: number
  outOfDate: number
  className?: string
}

function GroupPrintSummaryChips({ unprinted, outOfDate, className }: GroupPrintSummaryChipsProps) {
  if (unprinted === 0 && outOfDate === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {unprinted > 0 ? (
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            "border-muted-foreground/25 bg-muted text-muted-foreground"
          )}
        >
          {unprinted} unprinted
        </span>
      ) : null}
      {outOfDate > 0 ? (
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          )}
        >
          {outOfDate} out of date
        </span>
      ) : null}
    </div>
  )
}

export default GroupPrintSummaryChips
