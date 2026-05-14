import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DashboardResponsiveList from "./DashboardResponsiveList"
import GroupProductMobileCard from "./GroupProductMobileCard"
import type { GroupProduct } from "./groupTableData"
import { formatProductPrice } from "./productFormat"

type GroupProductsTableProps = {
  products: GroupProduct[]
  onRemoveProduct: (product: GroupProduct) => Promise<void> | void
}

function GroupProductsTable({ products, onRemoveProduct }: GroupProductsTableProps) {
  if (!products.length) {
    return <p className="rounded-xl border p-4 text-sm text-muted-foreground">No products in this group yet.</p>
  }

  return (
    <DashboardResponsiveList
      mobile={products.map((product) => (
        <GroupProductMobileCard
          key={product._id}
          product={product}
          onRemoveProduct={onRemoveProduct}
        />
      ))}
      mobileClassName="grid gap-2"
      desktop={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>UPC</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku ?? "-"}</TableCell>
                <TableCell>{product.upc ?? "-"}</TableCell>
                <TableCell>{formatProductPrice(product.price)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="touch-manipulation"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => onRemoveProduct(product)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      desktopClassName="overflow-auto rounded-xl border touch-manipulation"
    />
  )
}

export default GroupProductsTable
