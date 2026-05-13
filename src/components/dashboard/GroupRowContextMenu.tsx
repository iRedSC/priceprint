import { FolderOpen, Pencil, Printer, Trash2 } from "lucide-react"

import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
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
      <ContextMenuSeparator />
      <ContextMenuItem onSelect={() => onPrintGroup(group, "all")}>
        <Printer />
        Print all
      </ContextMenuItem>
      <ContextMenuItem onSelect={() => onPrintGroup(group, "out-of-date")}>
        <Printer />
        Print out of date
      </ContextMenuItem>
      <ContextMenuItem onSelect={() => onPrintGroup(group, "unprinted")}>
        <Printer />
        Print unprinted
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onSelect={() => onDelete(group)}>
        <Trash2 />
        Delete
      </ContextMenuItem>
    </>
  )
}

export default GroupRowContextMenu
