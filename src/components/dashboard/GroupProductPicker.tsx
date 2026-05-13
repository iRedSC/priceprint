import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GroupRow } from "./groupTableData"
import { filterProducts } from "./productSearch"
import type { ProductRow } from "./productTableData"

type GroupProductPickerProps = {
  group: GroupRow
  products: ProductRow[]
  onAddProducts: (productIds: ProductRow["_id"][]) => Promise<void> | void
}

function GroupProductPicker({ group, products, onAddProducts }: GroupProductPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<ProductRow["_id"]>>(new Set())
  const availableProducts = useMemo(() => {
    const groupProductIds = new Set(group.products.map((product) => product._id))
    return products.filter((product) => !groupProductIds.has(product._id))
  }, [group.products, products])
  const filteredProducts = useMemo(
    () => filterProducts(availableProducts, search),
    [availableProducts, search]
  )

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearch("")
      setSelectedIds(new Set())
    }
  }

  const toggleProduct = (productId: ProductRow["_id"]) => {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(productId)) {
        nextIds.delete(productId)
      } else {
        nextIds.add(productId)
      }

      return nextIds
    })
  }

  const handleAddProducts = async () => {
    if (!selectedIds.size) {
      return
    }

    await onAddProducts([...selectedIds])
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="w-full touch-manipulation sm:w-fit">
          <Plus className="size-4" />
          Add Products
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add products</DialogTitle>
          <DialogDescription>Select one or more products to add to {group.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, SKU, UPC, type, or vendor"
            className="h-10"
          />
          <div className="max-h-[55svh] overflow-auto rounded-xl border touch-manipulation">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <span className="sr-only">Select</span>
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>UPC</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product._id}
                      className="cursor-pointer"
                      onClick={() => toggleProduct(product._id)}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          className="size-4 touch-manipulation"
                          checked={selectedIds.has(product._id)}
                          onChange={() => toggleProduct(product._id)}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`Select ${product.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku ?? "-"}</TableCell>
                      <TableCell>{product.upc ?? "-"}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No available products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" disabled={!selectedIds.size} onClick={handleAddProducts}>
            Add {selectedIds.size || ""} products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GroupProductPicker
