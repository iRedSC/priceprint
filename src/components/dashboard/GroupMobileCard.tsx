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
import {
  countOutOfDateProducts,
  countUnprintedProducts,
  countUpToDateProducts,
} from "./groupPrintCounts"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"
import GroupActionMenu from "./GroupActionMenu"
import GroupStatusChips from "./GroupStatusChips"
import ProductImage from "./ProductImage"

type GroupMobileCardProps = {
  group: GroupRow
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onScan: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
}

function GroupMobileCard({ group, onOpen, onEdit, onDelete, onScan, onPrintGroup }: GroupMobileCardProps) {
  const unprinted = countUnprintedProducts(group)
  const upToDate = countUpToDateProducts(group)
  const outOfDate = countOutOfDateProducts(group)

  return (
    <Card
      size="sm"
      className="cursor-pointer gap-2 py-3 touch-manipulation"
      onClick={() => onOpen(group)}
    >
      <CardHeader className="grid-cols-[minmax(0,1fr)_auto] gap-2 px-3.5">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-2">
            <ProductImage
              src={group.products[0]?.img}
              alt={group.products[0]?.name ?? group.name}
              className="size-10 rounded-lg"
            />
            <CardTitle className="line-clamp-2 min-w-0 text-base">{group.name}</CardTitle>
          </div>
          <CardDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span>{group.products.length} products</span>
            <GroupStatusChips unprinted={unprinted} upToDate={upToDate} outOfDate={outOfDate} />
          </CardDescription>
        </div>
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <GroupActionMenu
            group={group}
            onEdit={onEdit}
            onDelete={onDelete}
            onPrintGroup={onPrintGroup}
          />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 px-3.5 text-xs text-muted-foreground">
        <Button
          size="sm"
          variant="outline"
          className="touch-manipulation"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onScan(group)
          }}
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
