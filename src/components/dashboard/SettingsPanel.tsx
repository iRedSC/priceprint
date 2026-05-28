import LabelLiveDesignSection from "./LabelLiveDesignSection"
import SettingsAccountSection from "./SettingsAccountSection"
import ShopifyConnectionSection from "./ShopifyConnectionSection"
import type { LabelLiveSettings } from "./useDashboardData"
import type { FunctionReturnType } from "convex/server"
import { api } from "../../../convex/_generated/api"

type SettingsPanelProps = {
  onSignOut: () => void
  labelLiveSettings: LabelLiveSettings
  shopifyConnections: FunctionReturnType<typeof api.shopify.myConnections>
}

function SettingsPanel({ onSignOut, labelLiveSettings, shopifyConnections }: SettingsPanelProps) {
  return (
    <section className="grid gap-3">
      <ShopifyConnectionSection connections={shopifyConnections} />
      <LabelLiveDesignSection serverSettings={labelLiveSettings} />
      <SettingsAccountSection onSignOut={onSignOut} />
    </section>
  )
}

export default SettingsPanel
