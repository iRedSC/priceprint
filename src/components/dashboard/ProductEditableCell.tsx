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
  /** When set, used to render the committed value (e.g. fixed decimal places for price). */
  formatDisplay?: (value: string | number | undefined) => string
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
  formatDisplay,
  onCommit,
}: ProductEditableCellProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const formattedValue = formatDisplay ? formatDisplay(value) : formatValue(value)
  const displayValue = draft ?? formattedValue
  const reset = () => setDraft(null)
  const commit = async (valueToCommit = displayValue) => {
    const nextValue = valueToCommit.trim()

    if (nextValue === formattedValue) {
      setDraft(null)
      return
    }

    await onCommit(product, field, nextValue)
    setDraft(null)
  }
  const bumpValue = (direction: 1 | -1) => {
    const currentValue = Number(displayValue || 0)
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
        value={displayValue}
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
