import * as React from "react"
import { Slot } from "radix-ui"

import { useMinWidthMd } from "@/hooks/useMinWidthMd"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "./context-menu"
import { MobileTray } from "./mobile-tray"

type ResponsiveContextMenuProps = {
  children: React.ReactElement
  title?: string
  desktopContent: React.ReactNode
  mobileContent: (close: () => void) => React.ReactNode
}

function ResponsiveContextMenu({
  children,
  title,
  desktopContent,
  mobileContent,
}: ResponsiveContextMenuProps) {
  const isMd = useMinWidthMd()
  const [open, setOpen] = React.useState(false)

  if (isMd) {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent>{desktopContent}</ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <>
      <MobileContextMenuTrigger onOpen={() => setOpen(true)}>{children}</MobileContextMenuTrigger>
      <MobileTray open={open} onOpenChange={setOpen} title={title}>
        {mobileContent(() => setOpen(false))}
      </MobileTray>
    </>
  )
}

function MobileContextMenuTrigger({
  children,
  onOpen,
}: {
  children: React.ReactElement
  onOpen: () => void
}) {
  const timerRef = React.useRef<number | null>(null)
  const startRef = React.useRef<{ x: number; y: number } | null>(null)
  const openedFromPressRef = React.useRef(false)

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  React.useEffect(() => clearTimer, [clearTimer])

  return (
    <Slot.Root
      onContextMenu={(event) => {
        if (isInteractiveTarget(event.target)) {
          return
        }
        event.preventDefault()
        clearTimer()
        openedFromPressRef.current = true
        onOpen()
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" || isInteractiveTarget(event.target)) {
          return
        }
        openedFromPressRef.current = false
        startRef.current = { x: event.clientX, y: event.clientY }
        timerRef.current = window.setTimeout(() => {
          openedFromPressRef.current = true
          onOpen()
        }, 450)
      }}
      onPointerMove={(event) => {
        const start = startRef.current
        if (!start) {
          return
        }
        if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) {
          clearTimer()
        }
      }}
      onPointerUp={clearTimer}
      onPointerCancel={clearTimer}
      onClickCapture={(event) => {
        if (!openedFromPressRef.current) {
          return
        }
        openedFromPressRef.current = false
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      {children}
    </Slot.Root>
  )
}

function isInteractiveTarget(target: EventTarget) {
  return target instanceof HTMLElement && Boolean(target.closest("button, input, select, textarea, a"))
}

export { ResponsiveContextMenu }
