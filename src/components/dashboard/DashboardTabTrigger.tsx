import type { LucideIcon } from "lucide-react"

import { TabsTrigger } from "@/components/ui/tabs"

type DashboardTabTriggerProps = {
  icon: LucideIcon
  label: string
  value: string
}

function DashboardTabTrigger({
  icon: Icon,
  label,
  value,
}: DashboardTabTriggerProps) {
  return (
    <TabsTrigger value={value} className="flex-1 px-2" aria-label={label}>
      <Icon aria-hidden="true" className="size-4 sm:hidden" />
      <span className="hidden sm:inline">{label}</span>
    </TabsTrigger>
  )
}

export default DashboardTabTrigger
