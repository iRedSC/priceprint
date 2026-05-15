import { getGroupActionMenuItems } from "./actionMenuData"
import { ActionContextMenuItems } from "./actionMenuItems"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"

type GroupRowContextMenuProps = {
  group: GroupRow
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupRowContextMenu({
  group,
  onOpen,
  onEdit,
  onDelete,
  onPrintGroup,
}: GroupRowContextMenuProps) {
  const items = getGroupActionMenuItems({ group, onOpen, onEdit, onDelete, onPrintGroup })

  return <ActionContextMenuItems items={items} />
}

export default GroupRowContextMenu
