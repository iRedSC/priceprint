import { useState, type FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MAX_LABELS = 500

type ProductLabelCountFormProps = {
  productName: string
  onCancel: () => void
  onConfirm: (count: number) => void
}

export function ProductLabelCountForm({ productName, onCancel, onConfirm }: ProductLabelCountFormProps) {
  const [raw, setRaw] = useState("1")

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = Number.parseInt(raw, 10)
    if (!Number.isFinite(n) || n < 1 || n > MAX_LABELS) {
      toast.error(`Enter a number from 1 to ${MAX_LABELS}.`)
      return
    }
    onConfirm(n)
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <DialogHeader>
        <DialogTitle>Print labels</DialogTitle>
        <DialogDescription>
          How many labels for &quot;{productName}&quot;? Hold Shift while choosing Print to skip this and print one
          label.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-2">
        <Label htmlFor="label-count">Number of labels</Label>
        <Input
          id="label-count"
          inputMode="numeric"
          autoComplete="off"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
        <p className="text-muted-foreground text-sm">Between 1 and {MAX_LABELS}.</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" className="touch-manipulation" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="touch-manipulation">
          Print
        </Button>
      </DialogFooter>
    </form>
  )
}
