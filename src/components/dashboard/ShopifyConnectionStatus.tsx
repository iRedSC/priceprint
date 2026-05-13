type ShopifyConnection = {
  shopDomain: string
  isActive: boolean
  scopes: string[]
  lastSyncAt?: number
  updatedAt?: number
  createdAt: number
}

type ShopifyConnectionStatusProps = {
  connection: ShopifyConnection | null | undefined
  hasSession: boolean
}

function ShopifyConnectionStatus({ connection, hasSession }: ShopifyConnectionStatusProps) {
  const status = getStatus(connection, hasSession)

  return (
    <div className="grid gap-2 rounded-xl border bg-muted/40 p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">Status</span>
        <span className={status.className}>{status.label}</span>
      </div>
      <p className="text-muted-foreground">{status.detail}</p>
      {connection ? (
        <dl className="grid gap-1 text-xs text-muted-foreground">
          <div className="flex justify-between gap-3">
            <dt>Store</dt>
            <dd className="text-right text-foreground">{connection.shopDomain}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Scopes</dt>
            <dd className="text-right text-foreground">{connection.scopes.join(", ")}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Updated</dt>
            <dd className="text-right text-foreground">
              {formatDate(connection.updatedAt ?? connection.createdAt)}
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  )
}

function getStatus(connection: ShopifyConnection | null | undefined, hasSession: boolean) {
  if (!hasSession) {
    return {
      label: "Sign in required",
      detail: "Sign in to check your Shopify connection.",
      className: "rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground",
    }
  }

  if (connection === undefined) {
    return {
      label: "Checking",
      detail: "Loading the latest Shopify connection status.",
      className: "rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground",
    }
  }

  if (!connection) {
    return {
      label: "Not connected",
      detail: "No Shopify store is connected yet.",
      className: "rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground",
    }
  }

  if (!connection.isActive) {
    return {
      label: "Disconnected",
      detail: "The saved Shopify connection is currently inactive.",
      className: "rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive",
    }
  }

  return {
    label: "Connected",
    detail: `Ready to sync products from ${connection.shopDomain}.`,
    className: "rounded-full bg-primary/10 px-2 py-1 text-xs text-primary",
  }
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value)
}

export default ShopifyConnectionStatus
