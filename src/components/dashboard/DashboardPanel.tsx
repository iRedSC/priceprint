import { Button } from "@/components/ui/button"
import ActionCard from "./ActionCard"
import StatCard from "./StatCard"

function DashboardPanel() {
  return (
    <section className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Active groups" value="6" helper="2 ready to print" />
        <StatCard label="Products" value="148" helper="12 scanned today" />
        <StatCard label="Connections" value="3" helper="Shopify synced" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ActionCard
          title="Start a scan group"
          detail="Create a group before scanning products in store."
          action="New group"
        />
        <ActionCard
          title="Print queue"
          detail="Review completed groups and send labels to the printer."
          action="Review"
        />
      </div>

      <Button size="lg" className="h-12 touch-manipulation md:hidden">
        Scan products
      </Button>
    </section>
  )
}

export default DashboardPanel
