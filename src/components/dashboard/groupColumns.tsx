import type { ColumnDef } from "@tanstack/react-table"

import { formatGroupDate, formatGroupStatus } from "./groupFormat"
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
      accessorKey: "status",
      header: "Status",
      size: 150,
      cell: ({ row }) => formatGroupStatus(row.original.status),
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
