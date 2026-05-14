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
import { parseProductCsv, productCsvExample } from "./productCsv"
import type { ProductInput } from "./productTableData"

type UploadProductsDialogProps = {
  onUploadProducts: (products: ProductInput[]) => Promise<void> | void
}

const exampleHref = `data:text/csv;charset=utf-8,${encodeURIComponent(productCsvExample)}`

function UploadProductsDialog({ onUploadProducts }: UploadProductsDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
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

      await onUploadProducts(products)
      setMessage(`${products.length} products imported from ${file.name}`)
      setOpen(false)
    } catch {
      setMessage("Could not read that CSV file.")
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

export default UploadProductsDialog
