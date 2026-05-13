import { useState } from "react"
import { LayoutDashboard, Link2, Package, Rows3 } from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
} from "@/components/ui/tabs"
import ConnectionsPanel from "./ConnectionsPanel"
import DashboardPanel from "./DashboardPanel"
import DashboardTabTrigger from "./DashboardTabTrigger"
import GroupsPanel from "./GroupsPanel"
import ProductsPanel from "./ProductsPanel"

type DashboardSection = "dashboard" | "groups" | "products" | "connections"

const sectionLabels: Record<DashboardSection, string> = {
  dashboard: "Dashboard",
  groups: "Groups",
  products: "Products",
  connections: "Connections",
}

function isDashboardSection(value: string): value is DashboardSection {
  return value in sectionLabels
}

function DashboardPage() {
  const [section, setSection] = useState<DashboardSection>("dashboard")

  const handleSectionChange = (value: string) => {
    if (isDashboardSection(value)) {
      setSection(value)
    }
  }

  return (
    <main className="safe-area-dashboard-page min-h-svh bg-muted/30 text-foreground">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-5">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {sectionLabels[section]}
          </h1>
        </header>

        <Tabs value={section} onValueChange={handleSectionChange} className="min-w-0">
          <TabsList
            aria-label="Dashboard sections"
            className="safe-area-bottom-nav fixed z-50 h-16 w-auto rounded-3xl bg-background/95 p-2 shadow-lg ring-1 ring-foreground/10 backdrop-blur sm:h-auto sm:rounded-xl sm:p-1"
          >
            <DashboardTabTrigger
              value="dashboard"
              label="Dashboard"
              icon={LayoutDashboard}
            />
            <DashboardTabTrigger value="groups" label="Groups" icon={Rows3} />
            <DashboardTabTrigger value="products" label="Products" icon={Package} />
            <DashboardTabTrigger
              value="connections"
              label="Connections"
              icon={Link2}
            />
          </TabsList>
          <TabsContent value="dashboard">
            <DashboardPanel />
          </TabsContent>
          <TabsContent value="groups">
            <GroupsPanel />
          </TabsContent>
          <TabsContent value="products">
            <ProductsPanel />
          </TabsContent>
          <TabsContent value="connections">
            <ConnectionsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default DashboardPage
