type DashboardShopifyBannerProps = {
  connected: boolean
  shopDomain?: string
  pending: boolean
}

function label(connected: boolean, shopDomain: string | undefined, pending: boolean) {
  if (pending) {
    return "Loading Shopify status…"
  }

  if (connected && shopDomain) {
    return `Synced with ${shopDomain}`
  }

  if (connected) {
    return "Connected"
  }

  return "Not linked — scans need a store"
}

function DashboardShopifyBanner({ connected, shopDomain, pending }: DashboardShopifyBannerProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      Shopify:{" "}
      <span className="font-medium text-foreground">{label(connected, shopDomain, pending)}</span>
    </div>
  )
}

export default DashboardShopifyBanner
