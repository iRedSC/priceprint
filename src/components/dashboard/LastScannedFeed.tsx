type ScanFeedItem = {
  code: string
  detail: string
  status: "added" | "error" | "loading"
}

type LastScannedFeedProps = {
  item: ScanFeedItem | null
}

function LastScannedFeed({ item }: LastScannedFeedProps) {
  if (!item) {
    return null
  }

  return (
    <div className="rounded-xl border bg-card/95 p-3 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between gap-2 text-sm font-medium">
        <span>{item.code}</span>
        <span className={getStatusClassName(item.status)}>{getStatusLabel(item.status)}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.detail}</p>
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
