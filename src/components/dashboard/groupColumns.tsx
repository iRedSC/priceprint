import type { ColumnDef } from "@tanstack/react-table"

import { formatGroupDate } from "./groupFormat"
import { countOutOfDateProducts, countUnprintedProducts } from "./groupPrintCounts"
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
      id: "unprintedCount",
      accessorFn: countUnprintedProducts,
      header: "Unprinted",
      size: 120,
    },
    {
      id: "outOfDateCount",
      accessorFn: countOutOfDateProducts,
      header: "Out of date",
      size: 130,
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
