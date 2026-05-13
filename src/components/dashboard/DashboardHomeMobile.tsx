import { ScanBarcode } from "lucide-react"

import { Button } from "@/components/ui/button"

import AddGroupDialog from "./AddGroupDialog"
import DashboardMobileRecentGroups from "./DashboardMobileRecentGroups"
import DashboardMobileStatsRow from "./DashboardMobileStatsRow"
import type { DashboardRecentGroup, DashboardResume } from "./dashboardTypes"
import type { DashboardSection } from "./DashboardPage"

type DashboardHomeMobileProps = {
  resume: DashboardResume
  pending: boolean
  recentGroups: DashboardRecentGroup[]
  onNavigate: (section: DashboardSection) => void
  onAddGroup: (name: string) => Promise<void> | void
  addGroupOpen: boolean
  onAddGroupOpenChange: (open: boolean) => void
}

function DashboardHomeMobile({
  resume,
  pending,
  recentGroups,
  onNavigate,
  onAddGroup,
  addGroupOpen,
  onAddGroupOpenChange,
}: DashboardHomeMobileProps) {
  return (
    <>
      <DashboardMobileStatsRow resume={resume} pending={pending} />

      <Button
        type="button"
        size="lg"
        className="h-14 w-full gap-2 text-base touch-manipulation"
        onClick={() => onNavigate("groups")}
      >
        <ScanBarcode className="size-5 shrink-0" aria-hidden />
        Scan products
      </Button>

      <AddGroupDialog onAddGroup={onAddGroup} open={addGroupOpen} onOpenChange={onAddGroupOpenChange} />

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full touch-manipulation sm:max-w-xs"
        onClick={() => onAddGroupOpenChange(true)}
      >
        New scanning group…
      </Button>

      <DashboardMobileRecentGroups pending={pending} recentGroups={recentGroups} />

      {!resume.shopifyConnected && !pending ? (
        <p className="text-sm text-muted-foreground">
          Connect Shopify under{" "}
          <button
            type="button"
            className="touch-manipulation font-medium text-primary underline underline-offset-4"
            onClick={() => onNavigate("connections")}
          >
            Connections
          </button>{" "}
          before scanning pulls live catalog data.
        </p>
      ) : null}
    </>
  )
}

export default DashboardHomeMobile
