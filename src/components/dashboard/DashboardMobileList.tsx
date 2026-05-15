import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { DashboardEmptyPanel } from "./MobileDashboardPrimitives"

type DashboardMobileListProps<T> = {
  items: T[]
  emptyMessage: ReactNode
  children: (item: T) => ReactNode
  className?: string
  compactEmpty?: boolean
}

function DashboardMobileList<T>({
  items,
  emptyMessage,
  children,
  className,
  compactEmpty = false,
}: DashboardMobileListProps<T>) {
  if (!items.length) {
    return <DashboardEmptyPanel compact={compactEmpty}>{emptyMessage}</DashboardEmptyPanel>
  }

  return <div className={cn("grid gap-3", className)}>{items.map(children)}</div>
}

export default DashboardMobileList
