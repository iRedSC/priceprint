import type { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

/** iOS PWA: pin with bottom:0 and use padding for insets — avoids vw/svh jitter. */
function DashboardTabsDock({ children }: PropsWithChildren) {
  return (
    <div
      className={cn(
        "md:contents",
        "max-md:pointer-events-none max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-50",
        "max-md:flex max-md:w-full max-md:flex-col max-md:justify-end",
        "max-md:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]",
        "max-md:pl-[calc(1rem+env(safe-area-inset-left,0px))]",
        "max-md:pr-[calc(1rem+env(safe-area-inset-right,0px))]",
        "[&>*]:max-md:pointer-events-auto",
      )}
    >
      {children}
    </div>
  )
}

export default DashboardTabsDock
