import LabelLiveDesignSection from "./LabelLiveDesignSection"
import ShopifyConnectionSection from "./ShopifyConnectionSection"

function SettingsPanel() {
  return (
    <section className="grid gap-3">
      <ShopifyConnectionSection />
      <LabelLiveDesignSection />
    </section>
  )
}

export default SettingsPanel
