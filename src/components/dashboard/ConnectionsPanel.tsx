import LabelLiveDesignSection from "./LabelLiveDesignSection";
import ShopifyConnectionSection from "./ShopifyConnectionSection";

function ConnectionsPanel() {
  return (
    <section className="grid gap-3">
      <ShopifyConnectionSection />
      <LabelLiveDesignSection />
    </section>
  );
}

export default ConnectionsPanel
