import { Button } from "@/components/ui/button"
import type { ProductUploadDuplicateMode } from "./productTableData"

type UploadDuplicateModeToggleProps = {
  value: ProductUploadDuplicateMode
  onChange: (value: ProductUploadDuplicateMode) => void
}

const duplicateModeOptions: Array<{
  value: ProductUploadDuplicateMode
  label: string
}> = [
  { value: "ignore", label: "Ignore existing" },
  { value: "overwrite", label: "Overwrite existing" },
]

function UploadDuplicateModeToggle({ value, onChange }: UploadDuplicateModeToggleProps) {
  return (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">When SKU/UPC already exists</span>
      <div className="grid grid-cols-2 gap-2">
        {duplicateModeOptions.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? "default" : "outline"}
            className="touch-manipulation"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default UploadDuplicateModeToggle
