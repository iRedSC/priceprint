import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileTray } from "@/components/ui/mobile-tray"
import { useMinWidthMd } from "@/hooks/useMinWidthMd"
import { getGroupActionMenuItems } from "./actionMenuData"
import { ActionDropdownMenuItems, ActionTrayMenuItems } from "./actionMenuItems"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"

type GroupActionMenuProps = {
  group: GroupRow
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupActionMenu({ group, onEdit, onDelete, onPrintGroup }: GroupActionMenuProps) {
  const isMd = useMinWidthMd()
  const [trayOpen, setTrayOpen] = useState(false)
  const items = getGroupActionMenuItems({ group, onEdit, onDelete, onPrintGroup })

  if (!isMd) {
    return (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-10 touch-manipulation"
          aria-label={`Open actions for ${group.name}`}
          onClick={() => setTrayOpen(true)}
        >
          <MoreHorizontal />
        </Button>
        <MobileTray
          open={trayOpen}
          onOpenChange={setTrayOpen}
          title={`Actions for ${group.name}`}
        >
          <ActionTrayMenuItems items={items} onAction={() => setTrayOpen(false)} />
        </MobileTray>
      </>
    )
  }

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
