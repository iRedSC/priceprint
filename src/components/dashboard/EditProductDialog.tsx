import { useState } from "react"
import type { FormEvent } from "react"

import ProductDialogForm, { type ProductDialogValues } from "@/components/dashboard/ProductDialogForm"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatMeta, parseMeta } from "./productDialogMeta"
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
  const [variant, setVariant] = useState(product.variant ?? "")
  const [vendor, setVendor] = useState(product.vendor ?? "")
  const [price, setPrice] = useState(String(product.price))
  const [img, setImg] = useState(product.img ?? "")
  const [meta, setMeta] = useState(formatMeta(product.meta))

  const values: ProductDialogValues = {
    name,
    sku,
    upc,
    type,
    variant,
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
    variant: setVariant,
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
      variant: variant.trim() || undefined,
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
        <ProductDialogForm idPrefix="edit-product" values={values} changeHandlers={changeHandlers} />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default EditProductDialog
