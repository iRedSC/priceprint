import { useRef, useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import UploadDuplicateModeToggle from "./UploadDuplicateModeToggle"
import { parseProductCsv, productCsvExample } from "./productCsv"
import type { ProductInput, ProductUploadDuplicateMode, ProductUploadResult } from "./productTableData"

type UploadProductsDialogProps = {
  onUploadProducts: (
    products: ProductInput[],
    duplicateMode: ProductUploadDuplicateMode
  ) => Promise<ProductUploadResult | void> | ProductUploadResult | void
}

const exampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(productCsvExample)}`

function UploadProductsDialog({ onUploadProducts }: UploadProductsDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [duplicateMode, setDuplicateMode] = useState<ProductUploadDuplicateMode>("ignore")
  const [message, setMessage] = useState("CSV columns: name, sku, upc, type, vendor, price, img, meta")

  const handleFile = async (file?: File) => {
    if (!file) {
      return
    }

    try {
      const products = parseProductCsv(await file.text())

      if (!products.length) {
        setMessage("No products found. Check that name and upc columns are filled.")
        return
      }

      const result = await onUploadProducts(products, duplicateMode)
      setMessage(formatUploadMessage(file.name, products.length, result))
      setOpen(false)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not read that CSV file.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Upload CSV" className="size-10 touch-manipulation">
          <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload products</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <UploadDuplicateModeToggle value={duplicateMode} onChange={setDuplicateMode} />
        <button
          type="button"
          className={cn(
            "grid min-h-40 touch-manipulation place-items-center rounded-xl border border-dashed p-6 text-center text-sm transition-colors",
            dragging ? "border-ring bg-muted" : "border-border"
          )}
          onClick={() => inputRef.current?.click()}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            void handleFile(event.dataTransfer.files[0])
          }}
        >
          Drag file here, or tap to choose a CSV
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <a className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={exampleHref} download="products-example.csv">
          Download example CSV
        </a>
      </DialogContent>
    </Dialog>
  )
}

function formatUploadMessage(
  fileName: string,
  productCount: number,
  result: ProductUploadResult | void
) {
  if (!result) {
    return `${productCount} products imported from ${fileName}`
  }

  const parts = [
    `${result.inserted} added`,
    `${result.updated} overwritten`,
    `${result.ignored} ignored`,
  ]

  return `${parts.join(", ")} from ${fileName}`
}

export default UploadProductsDialog
