import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  style,
  onFocusCapture,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const closeRef = React.useRef<HTMLButtonElement | null>(null)
  const swipeRef = React.useRef<DialogSwipeState | null>(null)
  const [dragOffset, setDragOffset] = React.useState(0)

  React.useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [])

  const handleFocusCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event)
      if (event.defaultPrevented) {
        return
      }

      const target = event.target
      if (!(target instanceof HTMLElement) || !contentRef.current?.contains(target)) {
        return
      }

      window.requestAnimationFrame(() => {
        target.scrollIntoView({ block: "nearest", inline: "nearest" })
      })
    },
    [onFocusCapture]
  )

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented || event.pointerType === "mouse") {
        return
      }

      if (isInteractiveTarget(event.target)) {
        return
      }

      swipeRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        tracking: contentRef.current?.scrollTop === 0,
      }
    },
    [onPointerDown]
  )

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event)
      const swipe = swipeRef.current
      if (!swipe || swipe.pointerId !== event.pointerId || event.defaultPrevented) {
        return
      }

      const deltaX = event.clientX - swipe.startX
      const deltaY = event.clientY - swipe.startY
      swipe.lastY = event.clientY
      swipe.lastTime = event.timeStamp

      if (!swipe.tracking) {
        swipe.tracking = contentRef.current?.scrollTop === 0 && deltaY > 0
      }

      if (!swipe.tracking || Math.abs(deltaX) > Math.abs(deltaY) || deltaY <= 0) {
        setDragOffset(0)
        return
      }

      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      setDragOffset(Math.min(deltaY, 180))
    },
    [onPointerMove]
  )

  const finishSwipe = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const swipe = swipeRef.current
      onPointerUp?.(event)

      if (!swipe || swipe.pointerId !== event.pointerId) {
        return
      }

      const deltaY = event.clientY - swipe.startY
      const elapsed = Math.max(1, event.timeStamp - swipe.lastTime)
      const velocity = Math.max(0, event.clientY - swipe.lastY) / elapsed
      swipeRef.current = null
      setDragOffset(0)

      if (swipe.tracking && (deltaY > 96 || velocity > 0.8)) {
        closeRef.current?.click()
      }
    },
    [onPointerUp]
  )

  const cancelSwipe = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerCancel?.(event)
      swipeRef.current = null
      setDragOffset(0)
    },
    [onPointerCancel]
  )

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        ref={contentRef}
        className={cn(
          "fixed inset-0 z-50 grid h-[100svh] max-h-[100svh] gap-5 overflow-y-auto overscroll-contain border-0 bg-background px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] text-base shadow-lg transition-transform duration-200 ease-out touch-manipulation [scroll-padding-bottom:7rem] md:top-1/2 md:left-1/2 md:bottom-auto md:h-auto md:max-h-[calc(100dvh-2rem)] md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:border md:px-6 md:pt-6 md:text-sm md:[scroll-padding-bottom:1rem] [&_[data-slot=button]]:min-h-11 md:[&_[data-slot=button]]:min-h-8 [&_[data-slot=input]]:min-h-11 [&_[data-slot=input]]:px-3 md:[&_[data-slot=input]]:min-h-8 md:[&_[data-slot=input]]:px-2.5 [&_[data-slot=label]]:text-base md:[&_[data-slot=label]]:text-sm [&_[data-slot=table]]:text-base md:[&_[data-slot=table]]:text-sm",
          className
        )}
        style={{
          transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
          transition: dragOffset ? "none" : undefined,
          ...style,
        }}
        onFocusCapture={handleFocusCapture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={cancelSwipe}
        {...props}
      >
        <div
          aria-hidden="true"
          className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30 sm:hidden"
        />
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 inline-flex size-10 touch-manipulation items-center justify-center rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none md:top-3 md:size-8">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
        <DialogPrimitive.Close ref={closeRef} className="hidden" tabIndex={-1}>
          Close
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

type DialogSwipeState = {
  pointerId: number
  startX: number
  startY: number
  lastY: number
  lastTime: number
  tracking: boolean
}

function isInteractiveTarget(target: EventTarget) {
  return target instanceof HTMLElement && Boolean(target.closest("button, input, select, textarea, a"))
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 pr-10 text-left md:gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "sticky bottom-[calc(-1*max(1.25rem,env(safe-area-inset-bottom)))] -mx-5 mt-1 flex flex-col-reverse gap-3 border-t bg-background/95 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/85 md:static md:mx-0 md:flex-row md:justify-end md:gap-2 md:border-0 md:bg-transparent md:px-0 md:pt-0 md:pb-0 md:backdrop-blur-none [&_[data-slot=button]]:w-full md:[&_[data-slot=button]]:w-auto",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-xl leading-tight font-semibold md:text-lg", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-base leading-relaxed text-muted-foreground md:text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
