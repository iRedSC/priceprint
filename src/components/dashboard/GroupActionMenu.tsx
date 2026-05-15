import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getGroupActionMenuItems } from "./actionMenuData"
import { ActionDropdownMenuItems } from "./actionMenuItems"
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
  const items = getGroupActionMenuItems({ group, onOpen, onEdit, onDelete, onPrintGroup })

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
        <ActionDropdownMenuItems items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GroupActionMenu
