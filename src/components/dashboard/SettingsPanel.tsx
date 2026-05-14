import LabelLiveDesignSection from "./LabelLiveDesignSection"
import SettingsAccountSection from "./SettingsAccountSection"
import ShopifyConnectionSection from "./ShopifyConnectionSection"

type SettingsPanelProps = {
  onSignOut: () => void
}

function SettingsPanel({ onSignOut }: SettingsPanelProps) {
  return (
    <section className="grid gap-3">
      <ShopifyConnectionSection />
      <LabelLiveDesignSection />
      <SettingsAccountSection onSignOut={onSignOut} />
    </section>
  )
}

export default SettingsPanel
