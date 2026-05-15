import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Extra classes for fixed mobile add triggers (outline variant set on the dialog trigger). */
export const dashboardMobileFabTriggerClassName =
  "size-12 rounded-xl [&_svg]:size-7 shadow-sm touch-manipulation"

type DashboardMobileFabProps = {
  children: ReactNode
  className?: string
}

function DashboardMobileFab({ children, className }: DashboardMobileFabProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<number | null>(null)
  const [interacting, setInteracting] = useState(false)

  useEffect(() => {
    const restoreAfterInteraction = () => {
      if (restoreRef.current) {
        window.clearTimeout(restoreRef.current)
      }

      restoreRef.current = window.setTimeout(() => setInteracting(false), 250)
    }
    const handlePress = (event: PointerEvent) => {
      if (actionsRef.current?.contains(event.target as Node)) {
        return
      }

      setInteracting(true)
    }
    const handleScroll = () => {
      setInteracting(true)
      restoreAfterInteraction()
    }

    window.addEventListener("pointerdown", handlePress)
    window.addEventListener("pointerup", restoreAfterInteraction)
    window.addEventListener("pointercancel", restoreAfterInteraction)
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      if (restoreRef.current) {
        window.clearTimeout(restoreRef.current)
      }

      window.removeEventListener("pointerdown", handlePress)
      window.removeEventListener("pointerup", restoreAfterInteraction)
      window.removeEventListener("pointercancel", restoreAfterInteraction)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  return (
    <div
      ref={actionsRef}
      className={cn(
        "safe-area-dashboard-fab fixed z-40 transition-opacity duration-150 md:hidden",
        interacting ? "opacity-25" : "opacity-100",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default DashboardMobileFab
