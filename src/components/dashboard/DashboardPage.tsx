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
    <main className="min-h-svh bg-muted/30 px-4 pb-24 pt-5 text-foreground sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-5">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {sectionLabels[section]}
          </h1>
        </header>

        <Tabs value={section} onValueChange={handleSectionChange} className="min-w-0">
          <TabsList
            aria-label="Dashboard sections"
            className="fixed inset-x-4 bottom-4 z-50 w-auto rounded-2xl bg-background/95 shadow-lg ring-1 ring-foreground/10 backdrop-blur sm:static sm:inset-auto sm:z-auto sm:w-full sm:rounded-xl sm:bg-muted sm:shadow-none sm:ring-0 sm:backdrop-blur-none"
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
