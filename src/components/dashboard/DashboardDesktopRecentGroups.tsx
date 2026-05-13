import type { DashboardRecentGroup } from "./dashboardTypes"

type DashboardDesktopRecentGroupsProps = {
  pending: boolean
  recentGroups: DashboardRecentGroup[]
  onViewAll: () => void
}

function DashboardDesktopRecentGroups({
  pending,
  recentGroups,
  onViewAll,
}: DashboardDesktopRecentGroupsProps) {
  return (
    <section className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Recently updated groups</h2>
        <button
          type="button"
          className="touch-manipulation text-sm font-medium text-primary underline underline-offset-4"
          onClick={onViewAll}
        >
          View all groups
        </button>
      </div>
      {pending ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
      ) : recentGroups.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Create a group, then attach scanned products before printing labels.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {recentGroups.map((group) => (
            <li
              key={group._id}
              className="flex items-center justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0"
            >
              <span className="font-medium">{group.name}</span>
              <span className="shrink-0 text-muted-foreground">
                {group.productCount} {group.productCount === 1 ? "SKU" : "SKUs"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default DashboardDesktopRecentGroups
