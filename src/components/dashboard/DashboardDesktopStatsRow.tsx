import StatCard from "./StatCard"
import { formatStatCount } from "./formatStatCount"
import type { DashboardResume } from "./dashboardTypes"

type DashboardDesktopStatsRowProps = {
  resume: DashboardResume & { groupsWithPrintAttention: number }
  pending: boolean
}

function DashboardDesktopStatsRow({ resume, pending }: DashboardDesktopStatsRowProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatCard
        label="Print queue (groups)"
        value={formatStatCount(resume.groupsWithPrintAttention, pending)}
        helper="Groups with labels to print or re-print"
      />
      <StatCard
        label="Groups"
        value={formatStatCount(resume.groupCount, pending)}
        helper="Review tables on the Groups tab"
      />
      <StatCard
        label="Products"
        value={formatStatCount(resume.productCount, pending)}
        helper="Edit rows on the Products tab"
      />
    </div>
  )
}

export default DashboardDesktopStatsRow
