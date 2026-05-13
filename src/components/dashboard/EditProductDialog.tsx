import { useEffect, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductInput, ProductRow } from "./productTableData"

type EditProductDialogProps = {
  product: ProductRow | null
  onOpenChange: (open: boolean) => void
  onUpdateProduct: (productId: ProductRow["_id"], product: ProductInput) => Promise<void> | void
}

function EditProductDialog({
  product,
  onOpenChange,
  onUpdateProduct,
}: EditProductDialogProps) {
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [upc, setUpc] = useState("")
  const [type, setType] = useState("")
  const [vendor, setVendor] = useState("")
  const [price, setPrice] = useState("")
  const [img, setImg] = useState("")
  const [meta, setMeta] = useState("")

  useEffect(() => {
    if (!product) {
      return
    }

    setName(product.name)
    setSku(product.sku ?? "")
    setUpc(product.upc ?? "")
    setType(product.type ?? "")
    setVendor(product.vendor ?? "")
    setPrice(String(product.price))
    setImg(product.img ?? "")
    setMeta(formatMeta(product.meta))
  }, [product])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!product) {
      return
    }

    const parsedPrice = Number(price)
    if (!name.trim() || !price.trim() || !Number.isFinite(parsedPrice)) {
      return
    }

    await onUpdateProduct(product._id, {
      sku: sku.trim() || undefined,
      upc: upc.trim() || undefined,
      name: name.trim(),
      img: img.trim() || undefined,
      type: type.trim() || undefined,
      vendor: vendor.trim() || undefined,
      price: parsedPrice,
      meta: parseMeta(meta),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>Update the product details for this row.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <ProductField id="edit-product-name" label="Product name" value={name} onChange={setName} />
          <ProductField id="edit-product-sku" label="SKU" value={sku} onChange={setSku} />
          <ProductField id="edit-product-upc" label="UPC" value={upc} onChange={setUpc} />
          <ProductField id="edit-product-type" label="Type" value={type} onChange={setType} />
          <ProductField id="edit-product-vendor" label="Vendor" value={vendor} onChange={setVendor} />
          <ProductField id="edit-product-price" label="Price" type="number" value={price} onChange={setPrice} />
          <ProductField id="edit-product-img" label="Image URL" value={img} onChange={setImg} />
          <ProductField id="edit-product-meta" label="Meta JSON" value={meta} onChange={setMeta} />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
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

function formatMeta(meta: unknown) {
  if (!meta) {
    return ""
  }

  return typeof meta === "string" ? meta : JSON.stringify(meta)
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

export default EditProductDialog
