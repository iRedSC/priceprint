import { Button } from "@/components/ui/button"
import { formatGroupDate, formatGroupStatus } from "./groupFormat"
import type { GroupRow } from "./groupTableData"

type GroupMobileListProps = {
  groups: GroupRow[]
  emptyMessage: string
  onOpen: (group: GroupRow) => void
}

function GroupMobileList({ groups, emptyMessage, onOpen }: GroupMobileListProps) {
  if (!groups.length) {
    return <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="grid gap-3">
      {groups.map((group) => (
        <Button
          key={group._id}
          type="button"
          variant="outline"
          className="h-auto touch-manipulation justify-start rounded-xl p-4 text-left"
          onClick={() => onOpen(group)}
        >
          <span className="grid min-w-0 gap-1">
            <span className="truncate font-medium">{group.name}</span>
            <span className="flex gap-2 text-sm text-muted-foreground">
              <span>{group.products.length} products</span>
              <span>{formatGroupStatus(group.status)}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Updated {formatGroupDate(group.updatedAt ?? group.createdAt)}
            </span>
          </span>
        </Button>
      ))}
    </div>
  )
}

export default GroupMobileList
