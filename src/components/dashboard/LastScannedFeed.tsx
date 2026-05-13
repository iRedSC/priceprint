type ScanFeedItem = {
  code: string
  detail: string
  status: "added" | "error" | "loading"
}

type LastScannedFeedProps = {
  items: ScanFeedItem[]
}

function LastScannedFeed({ items }: LastScannedFeedProps) {
  if (!items.length) {
    return (
      <p className="rounded-xl border bg-card p-3 text-sm text-muted-foreground">
        Last scanned products will appear here.
      </p>
    )
  }

  return (
    <div className="grid gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Last scanned
      </p>
      {items.map((item) => (
        <div key={item.code} className="rounded-xl border bg-card p-3">
          <div className="flex items-center justify-between gap-2 text-sm font-medium">
            <span>{item.code}</span>
            <span className={getStatusClassName(item.status)}>{getStatusLabel(item.status)}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.detail}</p>
        </div>
      ))}
    </div>
  )
}

function getStatusClassName(status: ScanFeedItem["status"]) {
  return status === "error" ? "text-destructive" : "text-muted-foreground"
}

function getStatusLabel(status: ScanFeedItem["status"]) {
  if (status === "loading") {
    return "Looking up"
  }

  return status === "added" ? "Added" : "Not found"
}

export type { ScanFeedItem }
export default LastScannedFeed
