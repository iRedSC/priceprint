import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core"
import type { ComponentProps } from "react"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type GroupProductReorderHandleProps = Omit<ComponentProps<typeof Button>, "children"> & {
  attributes: DraggableAttributes
  listeners: DraggableSyntheticListeners
}

function GroupProductReorderHandle({
  attributes,
  listeners,
  className,
  ...props
}: GroupProductReorderHandleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "size-10 shrink-0 cursor-grab touch-manipulation active:cursor-grabbing",
        className,
      )}
      aria-label="Reorder product"
      {...attributes}
      {...listeners}
      {...props}
    >
      <GripVertical className="size-4 text-muted-foreground" />
    </Button>
  )
}

export default GroupProductReorderHandle
