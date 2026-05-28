import { Loader2 } from "lucide-react"

function DashboardDataLoading() {
  return (
    <div
      className="grid flex-1 place-items-center gap-4 py-10 text-center"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-muted-foreground touch-manipulation" />
      <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
    </div>
  )
}

export default DashboardDataLoading
