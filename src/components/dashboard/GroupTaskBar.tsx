import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import AddGroupDialog from "./AddGroupDialog"

type GroupTaskBarProps = {
  search: string
  onSearchChange: (search: string) => void
  onAddGroup: (name: string) => Promise<void> | void
}

function GroupTaskBar({ search, onSearchChange, onAddGroup }: GroupTaskBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="hidden gap-2 md:flex">
        <AddGroupDialog onAddGroup={onAddGroup} />
      </div>
      <div className="relative min-w-0 sm:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search groups or products"
          className="h-10 pl-9"
        />
      </div>
    </div>
  )
}

export default GroupTaskBar
