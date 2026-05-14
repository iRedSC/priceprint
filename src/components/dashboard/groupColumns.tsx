import type { ColumnDef } from "@tanstack/react-table"

import { formatGroupDate } from "./groupFormat"
import GroupStatusChips from "./GroupStatusChips"
import ProductImage from "./ProductImage"
import {
  countOutOfDateProducts,
  countUnprintedProducts,
  countUpToDateProducts,
} from "./groupPrintCounts"
import type { GroupRow } from "./groupTableData"

export function createGroupColumns(): ColumnDef<GroupRow>[] {
  return [
    {
      id: "image",
      accessorFn: (group) => group.products[0]?.img,
      header: "Image",
      size: 96,
      cell: ({ row }) => {
        const first = row.original.products[0]
        return (
          <ProductImage
            src={first?.img}
            alt={first?.name ?? row.original.name}
            className="size-8"
          />
        )
      },
    },
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
