import { useState } from "react"
import { Package, Rows3, Settings } from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
} from "@/components/ui/tabs"
import SettingsPanel from "./SettingsPanel"

type DashboardPageProps = {
  onSignOut: () => void
}
import DashboardTabTrigger from "./DashboardTabTrigger"
import DashboardTabsDock from "./DashboardTabsDock"
import GroupsPanel from "./GroupsPanel"
import ProductsPanel from "./ProductsPanel"

type DashboardSection = "groups" | "products" | "settings"

const sectionLabels: Record<DashboardSection, string> = {
  groups: "Groups",
  products: "Products",
  settings: "Settings",
}

function isDashboardSection(value: string): value is DashboardSection {
  return value in sectionLabels
}

function DashboardPage({ onSignOut }: DashboardPageProps) {
  const [section, setSection] = useState<DashboardSection>("groups")

  const handleSectionChange = (value: string) => {
    if (isDashboardSection(value)) {
      setSection(value)
    }
  }

  return (
    <main className="safe-area-dashboard-page flex h-[100dvh] max-h-[100dvh] min-h-dvh flex-col overflow-hidden bg-muted/30 text-foreground">
      <div className="mx-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 flex-col gap-5">
        <header className="shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {sectionLabels[section]}
          </h1>
        </header>

        <Tabs
          value={section}
          onValueChange={handleSectionChange}
          className="flex min-h-0 min-w-0 flex-1 flex-col gap-4"
        >
          <DashboardTabsDock>
            <TabsList
              aria-label="Dashboard sections"
              className="h-16 w-full touch-manipulation max-md:rounded-3xl max-md:bg-background/95 max-md:p-2 max-md:shadow-lg max-md:ring-1 max-md:ring-foreground/10 max-md:backdrop-blur md:h-auto md:bg-muted md:p-1 md:shadow-none md:ring-0 md:backdrop-blur-none"
            >
              <DashboardTabTrigger value="groups" label="Groups" icon={Rows3} />
              <DashboardTabTrigger value="products" label="Products" icon={Package} />
              <DashboardTabTrigger
                value="settings"
                label="Settings"
                icon={Settings}
              />
            </TabsList>
          </DashboardTabsDock>
          <TabsContent
            value="groups"
            className="flex min-h-0 flex-1 flex-col overflow-hidden outline-none"
          >
            <GroupsPanel />
          </TabsContent>
          <TabsContent
            value="products"
            className="flex min-h-0 flex-1 flex-col overflow-hidden outline-none"
          >
            <ProductsPanel />
          </TabsContent>
          <TabsContent
            value="settings"
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain outline-none touch-manipulation"
          >
            <SettingsPanel onSignOut={onSignOut} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default DashboardPage
