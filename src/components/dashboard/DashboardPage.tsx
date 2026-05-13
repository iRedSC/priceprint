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
import DashboardTabsDock from "./DashboardTabsDock"
import GroupsPanel from "./GroupsPanel"
import ProductsPanel from "./ProductsPanel"

export type DashboardSection = "dashboard" | "groups" | "products" | "connections"

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
    <main className="safe-area-dashboard-page min-h-dvh bg-muted/30 text-foreground">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-5">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {sectionLabels[section]}
          </h1>
        </header>

        <Tabs value={section} onValueChange={handleSectionChange} className="min-w-0">
          <DashboardTabsDock>
            <TabsList
              aria-label="Dashboard sections"
              className="h-16 w-full touch-manipulation max-md:rounded-3xl max-md:bg-background/95 max-md:p-2 max-md:shadow-lg max-md:ring-1 max-md:ring-foreground/10 max-md:backdrop-blur md:h-auto md:bg-muted md:p-1 md:shadow-none md:ring-0 md:backdrop-blur-none"
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
          </DashboardTabsDock>
          <TabsContent value="dashboard">
            <DashboardPanel onSelectSection={setSection} />
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
