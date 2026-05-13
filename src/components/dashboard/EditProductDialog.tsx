import { useRef, useState } from "react"
import type { FormEvent } from "react"

import ProductDialogField from "@/components/dashboard/ProductDialogField"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ProductInput, ProductRow } from "./productTableData"
import { productDialogFields } from "./productDialogFields"

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
  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        {product ? (
          <EditProductForm
            key={product._id}
            product={product}
            onOpenChange={onOpenChange}
            onUpdateProduct={onUpdateProduct}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type EditProductFormProps = {
  product: ProductRow
  onOpenChange: (open: boolean) => void
  onUpdateProduct: (productId: ProductRow["_id"], product: ProductInput) => Promise<void> | void
}

function EditProductForm({
  product,
  onOpenChange,
  onUpdateProduct,
}: EditProductFormProps) {
  const [name, setName] = useState(product.name)
  const [sku, setSku] = useState(product.sku ?? "")
  const [upc, setUpc] = useState(product.upc ?? "")
  const [type, setType] = useState(product.type ?? "")
  const [vendor, setVendor] = useState(product.vendor ?? "")
  const [price, setPrice] = useState(String(product.price))
  const [img, setImg] = useState(product.img ?? "")
  const [meta, setMeta] = useState(formatMeta(product.meta))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const values = {
    name,
    sku,
    upc,
    type,
    vendor,
    price,
    img,
    meta,
  }

  const changeHandlers = {
    name: setName,
    sku: setSku,
    upc: setUpc,
    type: setType,
    vendor: setVendor,
    price: setPrice,
    img: setImg,
    meta: setMeta,
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
    <>
      <DialogHeader>
        <DialogTitle>Edit product</DialogTitle>
        <DialogDescription>Update the product details for this row.</DialogDescription>
      </DialogHeader>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {productDialogFields.map((field, index) => (
          <ProductDialogField
            key={field.key}
            id={`edit-product-${field.key}`}
            config={field}
            value={values[field.key]}
            onChange={changeHandlers[field.key]}
            inputRef={(node) => {
              inputRefs.current[index] = node
            }}
            onAdvance={() => inputRefs.current[index + 1]?.focus()}
          />
        ))}
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </>
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
