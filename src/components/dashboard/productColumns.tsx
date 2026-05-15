import type { ColumnDef } from "@tanstack/react-table"

import ProductEditableCell from "./ProductEditableCell"
import ProductImage from "./ProductImage"
import ProductPrintedPriceNote from "./ProductPrintedPriceNote"
import ProductPrintStatusChip from "./ProductPrintStatusChip"
import { formatProductDate, formatProductPriceAmount } from "./productFormat"
import { getProductPrintStatus } from "./productPrintData"
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
      size: 96,
      cell: ({ row }) => (
        <ProductImage
          src={row.getValue<string | undefined>("img")}
          alt={row.original.name}
          className="size-8"
        />
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      size: 130,
      cell: ({ row }) => (
        <ProductEditableCell
          key={getEditableCellKey(row.original, "sku")}
          product={row.original}
          field="sku"
          value={row.getValue<string | undefined>("sku")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Product",
      size: 240,
      cell: ({ row }) => (
        <ProductEditableCell
          key={getEditableCellKey(row.original, "name")}
          product={row.original}
          field="name"
          value={row.getValue<string>("name")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      accessorKey: "variant",
      header: "Variant",
      size: 130,
      cell: ({ row }) => (
        <ProductEditableCell
          key={getEditableCellKey(row.original, "variant")}
          product={row.original}
          field="variant"
          value={row.getValue<string | undefined>("variant")}
          onCommit={onFieldCommit}
        />
      ),
    },
    {
      id: "printStatus",
      accessorFn: getProductPrintStatus,
      header: "Status",
      size: 150,
      cell: ({ row }) => <ProductPrintStatusChip product={row.original} />,
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 140,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-0.5">
          <ProductEditableCell
            key={getEditableCellKey(row.original, "price")}
            product={row.original}
            field="price"
            value={row.getValue<number>("price")}
            prefix="$"
            step={1}
            type="number"
            formatDisplay={(v) =>
              v === undefined ? "" : formatProductPriceAmount(typeof v === "number" ? v : Number(v))
            }
            onCommit={onFieldCommit}
          />
          <ProductPrintedPriceNote product={row.original} />
        </div>
      ),
    },
    {
      accessorKey: "upc",
      header: "UPC",
      size: 170,
      cell: ({ row }) => (
        <ProductEditableCell
          key={getEditableCellKey(row.original, "upc")}
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
          key={getEditableCellKey(row.original, "type")}
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
          key={getEditableCellKey(row.original, "vendor")}
          product={row.original}
          field="vendor"
          value={row.getValue<string | undefined>("vendor")}
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

function getEditableCellKey(product: ProductRow, field: ProductEditableField) {
  return `${product._id}:${field}:${String(product[field] ?? "")}`
}
