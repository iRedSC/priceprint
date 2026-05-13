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
    return null
  }

  const visibleItems = [...items].reverse()

  return (
    <div className="grid gap-2 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
      {visibleItems.map((item, index) => (
        <div
          key={item.code}
          className={`rounded-xl border bg-card/95 p-3 shadow-lg transition-all duration-300 ${getFadeClassName(index, visibleItems.length)}`}
        >
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

function getFadeClassName(index: number, itemCount: number) {
  if (itemCount < 3 || index === itemCount - 1) {
    return "opacity-100"
  }

  if (index === 0) {
    return "opacity-35"
  }

  return "opacity-70"
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
