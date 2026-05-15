import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type DashboardResponsiveListProps = {
  mobile: ReactNode
  desktop: ReactNode
  mobileClassName?: string
  desktopClassName?: string
  /** Grow with parent flex layout and scroll the mobile list vertically. */
  fillHeight?: boolean
}

function DashboardResponsiveList({
  mobile,
  desktop,
  mobileClassName,
  desktopClassName,
  fillHeight,
}: DashboardResponsiveListProps) {
  if (fillHeight) {
    return (
      <>
        <div className={cn("flex min-h-0 flex-1 flex-col md:hidden", mobileClassName)}>
          <div className="min-h-0 flex-1 touch-manipulation overscroll-contain overflow-y-auto">
            {mobile}
          </div>
        </div>
        <div className={cn("hidden min-h-0 flex-1 flex-col md:flex", desktopClassName)}>
          {desktop}
        </div>
      </>
    )
  }

  return (
    <>
      <div className={cn("md:hidden", mobileClassName)}>{mobile}</div>
      <div className={cn("hidden min-w-0 md:block", desktopClassName)}>{desktop}</div>
    </>
  )
}

export default DashboardResponsiveList
