import { FolderOpen, MoreHorizontal, Pencil, Printer, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"

type GroupActionMenuProps = {
  group: GroupRow
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupActionMenu({ group, onOpen, onEdit, onDelete, onPrintGroup }: GroupActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 touch-manipulation"
          aria-label={`Open actions for ${group.name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="max-w-52 truncate">{group.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onOpen(group)}>
          <FolderOpen />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(group)}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        {onPrintGroup ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onPrintGroup(group, "all")}>
              <Printer />
              Print all
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onPrintGroup(group, "out-of-date")}>
              <Printer />
              Print out of date
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onPrintGroup(group, "unprinted")}>
              <Printer />
              Print unprinted
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(group)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GroupActionMenu
