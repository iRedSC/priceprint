import type { ColumnDef } from "@tanstack/react-table"

import { formatProductDate, formatProductPrice } from "./productFormat"
import type { ProductRow } from "./productTableData"

export const productColumns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "img",
    header: "Image",
    size: 90,
    cell: ({ row }) => {
      const img = row.getValue<string | undefined>("img")

      return img ? (
        <a className="text-primary underline-offset-4 hover:underline" href={img}>
          View
        </a>
      ) : null
    },
  },
  {
    accessorKey: "name",
    header: "Product",
    size: 240,
  },
  {
    accessorKey: "sku",
    header: "SKU",
    size: 130,
  },
  {
    accessorKey: "upc",
    header: "UPC",
    size: 170,
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 130,
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
    size: 160,
  },
  {
    accessorKey: "price",
    header: "Price",
    size: 120,
    cell: ({ row }) => formatProductPrice(row.getValue<number>("price")),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 120,
    cell: ({ row }) => formatProductDate(row.getValue<number>("createdAt")),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    size: 120,
    cell: ({ row }) => formatProductDate(row.getValue<number | undefined>("updatedAt")),
  },
]
