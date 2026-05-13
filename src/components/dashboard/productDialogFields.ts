import type * as React from "react"

export type ProductFieldKey =
  | "name"
  | "sku"
  | "upc"
  | "type"
  | "vendor"
  | "price"
  | "img"
  | "meta"

export type ProductFieldConfig = {
  key: ProductFieldKey
  label: string
  type?: React.HTMLInputTypeAttribute
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  enterKeyHint: React.HTMLAttributes<HTMLInputElement>["enterKeyHint"]
  autoComplete?: string
  autoCapitalize?: string
  spellCheck?: boolean
  step?: string
  pattern?: string
  autoFocus?: boolean
}

export const productDialogFields: ProductFieldConfig[] = [
  { key: "name", label: "Product name", enterKeyHint: "next", autoCapitalize: "words", autoFocus: true },
  { key: "sku", label: "SKU", enterKeyHint: "next", autoComplete: "off", autoCapitalize: "characters", spellCheck: false },
  { key: "upc", label: "UPC", inputMode: "numeric", enterKeyHint: "next", autoComplete: "off", pattern: "[0-9]*", spellCheck: false },
  { key: "type", label: "Type", enterKeyHint: "next", autoCapitalize: "words" },
  { key: "vendor", label: "Vendor", enterKeyHint: "next", autoComplete: "organization", autoCapitalize: "words" },
  { key: "price", label: "Price", type: "number", inputMode: "decimal", enterKeyHint: "next", autoComplete: "off", step: "0.01", spellCheck: false },
  { key: "img", label: "Image URL", type: "url", inputMode: "url", enterKeyHint: "next", autoComplete: "url", autoCapitalize: "none", spellCheck: false },
  { key: "meta", label: "Meta JSON", enterKeyHint: "done", autoComplete: "off", autoCapitalize: "none", spellCheck: false },
]
