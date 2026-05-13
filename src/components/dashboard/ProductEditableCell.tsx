import { useState } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ProductEditableField, ProductRow } from "./productTableData"

type ProductEditableCellProps = {
  product: ProductRow
  field: ProductEditableField
  value: string | number | undefined
  placeholder?: string
  prefix?: string
  step?: number
  type?: "text" | "number"
  onCommit: (product: ProductRow, field: ProductEditableField, value: string) => Promise<boolean> | boolean
}

function ProductEditableCell({
  product,
  field,
  value,
  placeholder,
  prefix,
  step = 1,
  type = "text",
  onCommit,
}: ProductEditableCellProps) {
  const [draft, setDraft] = useState(formatValue(value))
  const reset = () => setDraft(formatValue(value))
  const commit = async (valueToCommit = draft) => {
    const nextValue = valueToCommit.trim()

    if (nextValue === formatValue(value)) {
      return
    }

    const saved = await onCommit(product, field, nextValue)
    if (!saved) {
      reset()
    }
  }
  const bumpValue = (direction: 1 | -1) => {
    const currentValue = Number(draft || value || 0)
    const nextValue = String((Number.isFinite(currentValue) ? currentValue : 0) + direction * step)

    setDraft(nextValue)
    void commit(nextValue)
  }

  return (
    <div className="flex min-w-0 items-center">
      {prefix ? <span className="px-1 text-sm text-muted-foreground">{prefix}</span> : null}
      <Input
        type={type === "number" ? "text" : type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={draft}
        placeholder={placeholder}
        className={cn(
          "h-7 border-transparent bg-transparent px-1.5 shadow-none hover:border-input",
          "focus-visible:bg-background"
        )}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => void commit()}
        onKeyDown={(event) => {
          if (type === "number" && event.key === "ArrowUp") {
            event.preventDefault()
            bumpValue(1)
            return
          }

          if (type === "number" && event.key === "ArrowDown") {
            event.preventDefault()
            bumpValue(-1)
            return
          }

          if (event.key === "Enter") {
            event.currentTarget.blur()
          }

          if (event.key === "Escape") {
            reset()
            event.currentTarget.blur()
          }
        }}
      />
    </div>
  )
}

function formatValue(value: string | number | undefined) {
  return value === undefined ? "" : String(value)
}

export default ProductEditableCell
