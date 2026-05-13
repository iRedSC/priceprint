import ActionCard from "./ActionCard"
import DashboardDesktopRecentGroups from "./DashboardDesktopRecentGroups"
import DashboardDesktopStatsRow from "./DashboardDesktopStatsRow"
import DashboardShopifyBanner from "./DashboardShopifyBanner"
import type { DashboardRecentGroup, DashboardResume } from "./dashboardTypes"
import type { DashboardSection } from "./DashboardPage"

type DashboardHomeDesktopProps = {
  resume: DashboardResume & { groupsWithPrintAttention: number }
  pending: boolean
  recentGroups: DashboardRecentGroup[]
  onNavigate: (section: DashboardSection) => void
}

function DashboardHomeDesktop({
  resume,
  pending,
  recentGroups,
  onNavigate,
}: DashboardHomeDesktopProps) {
  return (
    <>
      <DashboardDesktopStatsRow resume={resume} pending={pending} />

      <DashboardShopifyBanner
        connected={resume.shopifyConnected}
        shopDomain={resume.shopDomain}
        pending={pending}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <ActionCard
          title="Print & review groups"
          detail="Tables with print badges, SKU and price edits. Send labels when counts look right."
          action="Open groups"
          onAction={() => onNavigate("groups")}
        />
        <ActionCard
          title="Products sheet"
          detail="Bulk edits, uploads, and print status chips for the entire catalog."
          action="Open products"
          onAction={() => onNavigate("products")}
        />
      </div>

      {!resume.shopifyConnected && !pending ? (
        <ActionCard
          title="Finish Shopify OAuth"
          detail="Printing and scanning flows read catalog pricing from your connected storefront."
          action="Connections"
          onAction={() => onNavigate("connections")}
        />
      ) : null}

      <DashboardDesktopRecentGroups
        pending={pending}
        recentGroups={recentGroups}
        onViewAll={() => onNavigate("groups")}
      />
    </>
  )
}

export default DashboardHomeDesktop
