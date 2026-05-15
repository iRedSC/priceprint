import { getGroupActionMenuItems } from "./actionMenuData"
import { ActionContextMenuItems } from "./actionMenuItems"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"

type GroupRowContextMenuProps = {
  group: GroupRow
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupRowContextMenu({
  group,
  onEdit,
  onDelete,
  onPrintGroup,
}: GroupRowContextMenuProps) {
  const items = getGroupActionMenuItems({ group, onEdit, onDelete, onPrintGroup })

  return <ActionContextMenuItems items={items} />
}

export default GroupRowContextMenu
