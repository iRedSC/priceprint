import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type DashboardResponsiveListProps = {
  mobile: ReactNode
  desktop: ReactNode
  mobileClassName?: string
  desktopClassName?: string
}

function DashboardResponsiveList({
  mobile,
  desktop,
  mobileClassName,
  desktopClassName,
}: DashboardResponsiveListProps) {
  return (
    <>
      <div className={cn("md:hidden", mobileClassName)}>{mobile}</div>
      <div className={cn("hidden min-w-0 md:block", desktopClassName)}>{desktop}</div>
    </>
  )
}

export default DashboardResponsiveList
