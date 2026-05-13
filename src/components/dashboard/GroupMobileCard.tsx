import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanBarcode } from "lucide-react"
import { formatGroupDate } from "./groupFormat"
import type { GroupRow } from "./groupTableData"
import GroupActionMenu from "./GroupActionMenu"

type GroupMobileCardProps = {
  group: GroupRow
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onScan: (group: GroupRow) => void
}

function GroupMobileCard({ group, onOpen, onEdit, onDelete, onScan }: GroupMobileCardProps) {
  return (
    <Card size="sm" className="gap-2 py-3">
      <CardHeader className="grid-cols-[minmax(0,1fr)_auto] gap-2 px-3.5">
        <div className="min-w-0">
          <CardTitle className="line-clamp-2 text-base">{group.name}</CardTitle>
          <CardDescription className="mt-1">
            {group.products.length} products
          </CardDescription>
        </div>
        <GroupActionMenu
          group={group}
          onOpen={onOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 px-3.5 text-xs text-muted-foreground">
        <Button
          size="sm"
          variant="outline"
          className="touch-manipulation"
          type="button"
          onClick={() => onScan(group)}
        >
          <ScanBarcode />
          Scan
        </Button>
        <span>Updated {formatGroupDate(group.updatedAt ?? group.createdAt)}</span>
      </CardContent>
    </Card>
  )
}

export default GroupMobileCard
