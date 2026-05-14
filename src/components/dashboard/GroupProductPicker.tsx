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
import DashboardResponsiveList from "./DashboardResponsiveList"
import GroupProductPickerMobileCard from "./GroupProductPickerMobileCard"
import type { GroupRow } from "./groupTableData"
import ProductImage from "./ProductImage"
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
      <DialogContent className="md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add products</DialogTitle>
          <DialogDescription>Select one or more products to add to {group.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="sticky top-0 z-10 -mx-5 bg-background px-5 pb-3 sm:static sm:mx-0 sm:px-0 sm:pb-0">
            <Input
              autoFocus
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, SKU, UPC, type, or vendor"
              className="h-11"
            />
          </div>
          <DashboardResponsiveList
            mobile={
              filteredProducts.length ? (
                <div className="grid gap-2">
                  {filteredProducts.map((product) => (
                    <GroupProductPickerMobileCard
                      key={product._id}
                      product={product}
                      selected={selectedIds.has(product._id)}
                      onToggle={toggleProduct}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
                  No available products found.
                </p>
              )
            }
            mobileClassName="max-h-[min(55svh,24rem)] overflow-auto overscroll-contain touch-manipulation"
            desktop={
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-14">
                      <span className="sr-only">Select</span>
                    </TableHead>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>SKU</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length ? (
                    filteredProducts.map((product) => (
                      <TableRow
                        key={product._id}
                        className="cursor-pointer touch-manipulation"
                        onClick={() => toggleProduct(product._id)}
                      >
                        <TableCell className="w-14 p-0">
                          <label
                            className="flex min-h-12 cursor-pointer items-center justify-center"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              className="size-5 touch-manipulation"
                              checked={selectedIds.has(product._id)}
                              onChange={() => toggleProduct(product._id)}
                              aria-label={`Select ${product.name}`}
                            />
                          </label>
                        </TableCell>
                        <TableCell>
                          <ProductImage src={product.img} alt={product.name} className="size-9" />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.variant ?? "-"}</TableCell>
                        <TableCell>{product.sku ?? "-"}</TableCell>
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
            }
            desktopClassName="max-h-[min(55svh,24rem)] overflow-auto overscroll-contain rounded-xl border touch-manipulation"
          />
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
