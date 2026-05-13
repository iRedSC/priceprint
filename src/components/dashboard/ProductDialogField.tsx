import type { KeyboardEvent, Ref } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { ProductFieldConfig } from "./productDialogFields"

type ProductDialogFieldProps = {
  id: string
  config: ProductFieldConfig
  value: string
  onChange: (value: string) => void
  inputRef?: Ref<HTMLInputElement>
  onAdvance?: () => void
}

function ProductDialogField({ id, config, value, onChange, inputRef, onAdvance }: ProductDialogFieldProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (config.enterKeyHint !== "next" || event.key !== "Enter" || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    event.preventDefault()
    onAdvance?.()
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{config.label}</Label>
      <Input
        ref={inputRef}
        id={id}
        type={config.type ?? "text"}
        inputMode={config.inputMode}
        enterKeyHint={config.enterKeyHint}
        autoComplete={config.autoComplete}
        autoCapitalize={config.autoCapitalize}
        spellCheck={config.spellCheck}
        pattern={config.pattern}
        step={config.step}
        autoFocus={config.autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default ProductDialogField
