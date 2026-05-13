import type { DashboardRecentGroup } from "./dashboardTypes"

type DashboardMobileRecentGroupsProps = {
  pending: boolean
  recentGroups: DashboardRecentGroup[]
}

function DashboardMobileRecentGroups({ pending, recentGroups }: DashboardMobileRecentGroupsProps) {
  return (
    <section className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <h2 className="text-base font-semibold">Recent groups</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Continue in Groups to scan or reorder products.
      </p>
      {pending ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
      ) : recentGroups.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No groups yet</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {recentGroups.map((group) => (
            <li key={group._id} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">{group.name}</span>
              <span className="shrink-0 text-muted-foreground">
                {group.productCount} {group.productCount === 1 ? "product" : "products"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default DashboardMobileRecentGroups
