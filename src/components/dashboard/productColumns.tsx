import type { ColumnDef } from "@tanstack/react-table"

import ProductEditableCell from "./ProductEditableCell"
import { formatProductDate } from "./productFormat"
import type { ProductEditableField, ProductRow } from "./productTableData"

type ProductColumnOptions = {
  onFieldCommit: (
    product: ProductRow,
    field: ProductEditableField,
    value: string
  ) => Promise<boolean> | boolean
}

export function createProductColumns({ onFieldCommit }: ProductColumnOptions): ColumnDef<ProductRow>[] {
  return [
    {
      accessorKey: "img",
      header: "Image",
      size: 180,
      cell: ({ row }) => {
        const img = row.getValue<string | undefined>("img")

        return (
          <ProductEditableCell
            product={row.original}
            field="img"
            value={img}
            onCommit={onFieldCommit}
          />
        )
      },
    },
    {
      accessorKey: "name",
      header: "Product",
      size: 240,
      cell: ({ row }) => (
        <ProductEditableCell
          product={row.original}
          field="name"
          value={row.getValue<string>("name")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      size: 130,
      cell: ({ row }) => (
        <ProductEditableCell
          product={row.original}
          field="sku"
          value={row.getValue<string | undefined>("sku")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "upc",
      header: "UPC",
      size: 170,
      cell: ({ row }) => (
        <ProductEditableCell
          product={row.original}
          field="upc"
          value={row.getValue<string | undefined>("upc")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      size: 130,
      cell: ({ row }) => (
        <ProductEditableCell
          product={row.original}
          field="type"
          value={row.getValue<string | undefined>("type")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      size: 160,
      cell: ({ row }) => (
        <ProductEditableCell
          product={row.original}
          field="vendor"
          value={row.getValue<string | undefined>("vendor")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 120,
      cell: ({ row }) => (
        <ProductEditableCell
          product={row.original}
          field="price"
          value={row.getValue<number>("price")}
          prefix="$"
          step={1}
          type="number"
          onCommit={onFieldCommit}
        />
      ),
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
}
