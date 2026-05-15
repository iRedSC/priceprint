import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"
import DashboardMobileList from "./DashboardMobileList"
import GroupMobileCard from "./GroupMobileCard"

type GroupMobileListProps = {
  groups: GroupRow[]
  emptyMessage: string
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void | Promise<void>
}

function GroupMobileList({
  groups,
  emptyMessage,
  onOpen,
  onEdit,
  onDelete,
  onPrintGroup,
}: GroupMobileListProps) {
  return (
    <DashboardMobileList items={groups} emptyMessage={emptyMessage}>
      {(group) => (
        <GroupMobileCard
          key={group._id}
          group={group}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
          onPrintGroup={onPrintGroup}
        />
      )}
    </DashboardMobileList>
  )
}

export default GroupMobileList
