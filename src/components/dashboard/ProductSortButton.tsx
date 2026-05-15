import { useState } from "react"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  productSortOptions,
  productSortLabels,
  type ProductSort,
} from "./productSort"

type ProductSortButtonProps = {
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
  triggerClassName?: string
}

function ProductSortButton({
  sort,
  onSortChange,
  triggerClassName,
}: ProductSortButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Sort products by ${productSortLabels[sort]}`}
          className={cn("size-10 touch-manipulation", triggerClassName)}
        >
          <ArrowUpDown />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sort products</DialogTitle>
          <DialogDescription>Choose how the mobile product list is ordered.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {productSortOptions.map((option) => (
            <Button
              key={option}
              type="button"
              variant={sort === option ? "default" : "outline"}
              size="responsive"
              className="justify-start"
              onClick={() => {
                onSortChange(option)
                setOpen(false)
              }}
            >
              {productSortLabels[option]}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductSortButton
