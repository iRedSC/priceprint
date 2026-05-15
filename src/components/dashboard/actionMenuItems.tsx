import {
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ActionMenuEntry } from "./actionMenuData"

function ActionContextMenuItems({ items }: { items: ActionMenuEntry[] }) {
  return items.map((item) => {
    if (item.type === "label") {
      return <ContextMenuLabel key={item.id} className="max-w-52 truncate">{item.label}</ContextMenuLabel>
    }
    if (item.type === "separator") {
      return <ContextMenuSeparator key={item.id} />
    }
    return (
      <ContextMenuItem
        key={item.id}
        variant={item.variant}
        className={cn(item.trailing && "gap-2")}
        onSelect={(e) => item.onSelect(e)}
      >
        <item.icon />
        <span className={cn("min-w-0", item.trailing ? "flex-1 truncate" : undefined)}>{item.label}</span>
        {item.trailing}
      </ContextMenuItem>
    )
  })
}

function ActionDropdownMenuItems({ items }: { items: ActionMenuEntry[] }) {
  return items.map((item) => {
    if (item.type === "label") {
      return <DropdownMenuLabel key={item.id} className="max-w-52 truncate">{item.label}</DropdownMenuLabel>
    }
    if (item.type === "separator") {
      return <DropdownMenuSeparator key={item.id} />
    }
    return (
      <DropdownMenuItem
        key={item.id}
        variant={item.variant}
        className={cn(item.trailing && "gap-2")}
        onSelect={(e) => item.onSelect(e)}
      >
        <item.icon />
        <span className={cn("min-w-0", item.trailing ? "flex-1 truncate" : undefined)}>{item.label}</span>
        {item.trailing}
      </DropdownMenuItem>
    )
  })
}

function ActionTrayMenuItems({ items, onAction }: { items: ActionMenuEntry[]; onAction?: () => void }) {
  return (
    <div className="grid gap-1">
      {items.map((item) => {
        if (item.type === "label") {
          return <div key={item.id} className="truncate px-2 pb-1 text-sm font-medium text-muted-foreground">{item.label}</div>
        }
        if (item.type === "separator") {
          return <div key={item.id} className="-mx-1 my-1 h-px bg-border" />
        }
        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              "flex min-h-11 w-full touch-manipulation items-center gap-3 rounded-lg px-3 text-left text-base outline-none transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:text-accent-foreground",
              item.variant === "destructive" && "text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10",
              item.variant === "warning" &&
                "text-orange-600 hover:bg-orange-500/10 focus-visible:bg-orange-500/10 dark:text-orange-400",
              item.trailing && "gap-2",
            )}
            onClick={(e) => {
              item.onSelect(e)
              onAction?.()
            }}
          >
            <item.icon className="size-5 shrink-0" />
            <span className={cn("min-w-0", item.trailing ? "flex-1 truncate" : undefined)}>{item.label}</span>
            {item.trailing}
          </button>
        )
      })}
    </div>
  )
}

export { ActionContextMenuItems, ActionDropdownMenuItems, ActionTrayMenuItems }
