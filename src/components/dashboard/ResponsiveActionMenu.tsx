import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MobileTray } from "@/components/ui/mobile-tray"
import { useMinWidthMd } from "@/hooks/useMinWidthMd"
import type { ActionMenuEntry } from "./actionMenuData"
import { ActionDropdownMenuItems, ActionTrayMenuItems } from "./actionMenuItems"

type ResponsiveActionMenuProps = { items: ActionMenuEntry[]; title: string; ariaLabel: string; triggerTitle?: string }

export default function ResponsiveActionMenu({ items, title, ariaLabel, triggerTitle }: ResponsiveActionMenuProps) {
  const isMd = useMinWidthMd()
  const [trayOpen, setTrayOpen] = useState(false)
  const trigger = (
    <Button
      className="size-10 touch-manipulation"
      aria-label={ariaLabel}
      onClick={isMd ? undefined : () => setTrayOpen(true)}
      size="icon"
      title={triggerTitle}
      type="button"
      variant="ghost"
    >
      <MoreHorizontal />
    </Button>
  )

  if (!isMd) {
    return (
      <>
        {trigger}
        <MobileTray open={trayOpen} onOpenChange={setTrayOpen} title={title}>
          <ActionTrayMenuItems items={items} onAction={() => setTrayOpen(false)} />
        </MobileTray>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <ActionDropdownMenuItems items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
