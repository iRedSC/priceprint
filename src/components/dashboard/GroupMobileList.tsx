import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"
import GroupMobileCard from "./GroupMobileCard"

type GroupMobileListProps = {
  groups: GroupRow[]
  emptyMessage: string
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onScan: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupMobileList({
  groups,
  emptyMessage,
  onOpen,
  onEdit,
  onDelete,
  onScan,
  onPrintGroup,
}: GroupMobileListProps) {
  if (!groups.length) {
    return <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="grid gap-3">
      {groups.map((group) => (
        <GroupMobileCard
          key={group._id}
          group={group}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
          onScan={onScan}
          onPrintGroup={onPrintGroup}
        />
      ))}
    </div>
  )
}

export default GroupMobileList
