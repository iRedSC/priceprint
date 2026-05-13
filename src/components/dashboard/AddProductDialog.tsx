import { useState } from "react"
import type { FormEvent } from "react"
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
import { Label } from "@/components/ui/label"
import type { ProductInput } from "./productTableData"

type AddProductDialogProps = {
  onAddProduct: (product: ProductInput) => Promise<void> | void
}

function AddProductDialog({ onAddProduct }: AddProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [upc, setUpc] = useState("")
  const [type, setType] = useState("")
  const [vendor, setVendor] = useState("")
  const [price, setPrice] = useState("")
  const [img, setImg] = useState("")
  const [meta, setMeta] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedPrice = Number(price)
    if (!name.trim() || !price.trim() || !Number.isFinite(parsedPrice)) {
      return
    }

    await onAddProduct({
      sku: sku.trim() || undefined,
      upc: upc.trim() || undefined,
      name: name.trim(),
      img: img.trim() || undefined,
      type: type.trim() || undefined,
      vendor: vendor.trim() || undefined,
      price: parsedPrice,
      meta: parseMeta(meta),
    })
    setName("")
    setSku("")
    setUpc("")
    setType("")
    setVendor("")
    setPrice("")
    setImg("")
    setMeta("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" aria-label="Add product" className="touch-manipulation">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>Enter product details for a manual label row.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <ProductField id="product-name" label="Product name" value={name} onChange={setName} />
          <ProductField id="product-sku" label="SKU" value={sku} onChange={setSku} />
          <ProductField id="product-upc" label="UPC" value={upc} onChange={setUpc} />
          <ProductField id="product-type" label="Type" value={type} onChange={setType} />
          <ProductField id="product-vendor" label="Vendor" value={vendor} onChange={setVendor} />
          <ProductField id="product-price" label="Price" type="number" value={price} onChange={setPrice} />
          <ProductField id="product-img" label="Image URL" value={img} onChange={setImg} />
          <ProductField id="product-meta" label="Meta JSON" value={meta} onChange={setMeta} />
          <DialogFooter>
            <Button type="submit">Add product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type ProductFieldProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
}

function ProductField({ id, label, type = "text", value, onChange }: ProductFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

function parseMeta(value: string) {
  if (!value.trim()) {
    return undefined
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export default AddProductDialog
