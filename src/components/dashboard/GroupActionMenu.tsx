import { getGroupActionMenuItems } from "./actionMenuData"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"
import ResponsiveActionMenu from "./ResponsiveActionMenu"

type GroupActionMenuProps = {
  group: GroupRow
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupActionMenu({ group, onEdit, onDelete, onPrintGroup }: GroupActionMenuProps) {
  const items = getGroupActionMenuItems({ group, onEdit, onDelete, onPrintGroup })
  const title = `Actions for ${group.name}`

  return <ResponsiveActionMenu items={items} title={title} ariaLabel={`Open actions for ${group.name}`} />
}

export default GroupActionMenu
