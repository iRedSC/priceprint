import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { useSwipeDownDismiss } from "@/hooks/useSwipeDownDismiss"
import { cn } from "@/lib/utils"

type MobileTrayProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}

function MobileTray({
  open,
  onOpenChange,
  title = "Actions",
  description,
  className,
  children,
  ...props
}: MobileTrayProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const swipeDown = useSwipeDownDismiss<HTMLDivElement>({
    onDismiss: () => onOpenChange?.(false),
    scrollRef: contentRef,
  })

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0" />
        <DialogPrimitive.Content
          ref={contentRef}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[min(85svh,32rem)] overflow-y-auto overscroll-contain rounded-t-2xl border bg-popover p-3 pb-[max(1rem,env(safe-area-inset-bottom))] text-popover-foreground shadow-lg outline-none touch-manipulation data-closed:animate-out data-closed:slide-out-to-bottom data-open:animate-in data-open:slide-in-from-bottom",
            className,
          )}
          style={swipeDown.style}
          onPointerDown={swipeDown.handlers.onPointerDown}
          onPointerMove={swipeDown.handlers.onPointerMove}
          onPointerUp={swipeDown.handlers.onPointerUp}
          onPointerCancel={swipeDown.handlers.onPointerCancel}
        >
          <div aria-hidden="true" className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
          ) : null}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { MobileTray }
