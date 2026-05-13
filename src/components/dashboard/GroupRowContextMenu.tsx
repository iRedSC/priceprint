import { FolderOpen, Pencil, Trash2 } from "lucide-react"

import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import type { GroupRow } from "./groupTableData"

type GroupRowContextMenuProps = {
  group: GroupRow
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
}

function GroupRowContextMenu({
  group,
  onOpen,
  onEdit,
  onDelete,
}: GroupRowContextMenuProps) {
  return (
    <>
      <ContextMenuLabel className="max-w-52 truncate">{group.name}</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem onSelect={() => onOpen(group)}>
        <FolderOpen />
        Open
      </ContextMenuItem>
      <ContextMenuItem onSelect={() => onEdit(group)}>
        <Pencil />
        Edit
      </ContextMenuItem>
      <ContextMenuItem variant="destructive" onSelect={() => onDelete(group)}>
        <Trash2 />
        Delete
      </ContextMenuItem>
    </>
  )
}

export default GroupRowContextMenu
