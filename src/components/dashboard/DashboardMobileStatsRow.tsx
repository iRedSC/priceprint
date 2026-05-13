import StatCard from "./StatCard"
import { formatStatCount } from "./formatStatCount"
import type { DashboardResume } from "./dashboardTypes"

type DashboardMobileStatsRowProps = {
  resume: DashboardResume
  pending: boolean
}

function DashboardMobileStatsRow({ resume, pending }: DashboardMobileStatsRowProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard
        label="Into groups today"
        value={formatStatCount(resume.scannedIntoGroupsToday, pending)}
        helper="Items scanned into groups (UTC day)"
      />
      <StatCard
        label="Groups"
        value={formatStatCount(resume.groupCount, pending)}
        helper="Open scanning sessions"
      />
      <StatCard
        label="Products"
        value={formatStatCount(resume.productCount, pending)}
        helper="Your catalog rows"
      />
    </div>
  )
}

export default DashboardMobileStatsRow
