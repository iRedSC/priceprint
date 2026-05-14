import { useRef, useState } from "react"
import type { FormEvent } from "react"
import { Plus } from "lucide-react"

import { readStoredSession } from "@/authSession"
import ProductDialogField from "@/components/dashboard/ProductDialogField"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ShopifySkuFetchButton, { type ShopifySkuImportPayload } from "./ShopifySkuFetchButton"
import type { ProductInput } from "./productTableData"
import { productDialogFields } from "./productDialogFields"

type AddProductDialogProps = {
  onAddProduct: (product: ProductInput) => Promise<void> | void
  triggerClassName?: string
}

function AddProductDialog({ onAddProduct, triggerClassName }: AddProductDialogProps) {
  const [session] = useState(readStoredSession)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [upc, setUpc] = useState("")
  const [type, setType] = useState("")
  const [variant, setVariant] = useState("")
  const [vendor, setVendor] = useState("")
  const [price, setPrice] = useState("")
  const [img, setImg] = useState("")
  const [meta, setMeta] = useState("")
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const values = {
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

  const applyShopifyImport = (product: ShopifySkuImportPayload) => {
    const empty = (value: string) => !value.trim()

    setName(empty(name) ? product.name : name)
    setSku(empty(sku) ? (product.sku ?? sku) : sku)
    setUpc(empty(upc) ? (product.upc ?? "") : upc)
    setType(empty(type) ? (product.type ?? "") : type)
    setVariant(empty(variant) ? (product.variant ?? "") : variant)
    setVendor(empty(vendor) ? (product.vendor ?? "") : vendor)
    setPrice(String(product.price))
    setImg(empty(img) ? (product.img ?? "") : img)
    setMeta(empty(meta) ? formatMeta(product.meta) : meta)
  }

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
      variant: variant.trim() || undefined,
      vendor: vendor.trim() || undefined,
      price: parsedPrice,
      meta: parseMeta(meta),
    })
    setName("")
    setSku("")
    setUpc("")
    setType("")
    setVariant("")
    setVendor("")
    setPrice("")
    setImg("")
    setMeta("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          aria-label="Add product"
          className={cn("size-10 touch-manipulation", triggerClassName)}
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>Enter product details for a manual label row.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {productDialogFields.map((field, index) => (
            <ProductDialogField
              key={field.key}
              id={`product-${field.key}`}
              config={field}
              value={values[field.key]}
              onChange={changeHandlers[field.key]}
              inputRef={(node) => {
                inputRefs.current[index] = node
              }}
              onAdvance={() => inputRefs.current[index + 1]?.focus()}
              trailingSlot={
                field.key === "sku" ? (
                  <ShopifySkuFetchButton
                    sku={sku}
                    sessionToken={session?.sessionToken ?? null}
                    onImported={applyShopifyImport}
                  />
                ) : undefined
              }
            />
          ))}
          <DialogFooter>
            <Button type="submit">Add product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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

export default AddProductDialog
