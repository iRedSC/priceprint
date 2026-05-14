import type { ColumnDef } from "@tanstack/react-table"

import { formatGroupDate } from "./groupFormat"
import GroupStatusChips from "./GroupStatusChips"
import {
  countOutOfDateProducts,
  countUnprintedProducts,
  countUpToDateProducts,
} from "./groupPrintCounts"
import type { GroupRow } from "./groupTableData"

export function createGroupColumns(): ColumnDef<GroupRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Group",
      size: 260,
      cell: ({ row }) => <span className="truncate font-medium">{row.original.name}</span>,
    },
    {
      id: "productCount",
      accessorFn: (group) => group.products.length,
      header: "Products",
      size: 120,
    },
    {
      id: "printStatusCounts",
      header: "Status",
      size: 200,
      cell: ({ row }) => {
        const group = row.original
        return (
          <GroupStatusChips
            unprinted={countUnprintedProducts(group)}
            upToDate={countUpToDateProducts(group)}
            outOfDate={countOutOfDateProducts(group)}
          />
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      size: 140,
      cell: ({ row }) => formatGroupDate(row.original.updatedAt ?? row.original.createdAt),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 140,
      cell: ({ row }) => formatGroupDate(row.original.createdAt),
    },
  ]
}
