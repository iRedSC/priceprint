import { useRef } from "react"
import type { ReactNode } from "react"

import ProductDialogField from "@/components/dashboard/ProductDialogField"

import { productDialogFields, type ProductFieldKey } from "./productDialogFields"

export type ProductDialogValues = Record<ProductFieldKey, string>

type ProductDialogChangeHandlers = Record<ProductFieldKey, (value: string) => void>

type ProductDialogFormProps = {
  idPrefix: string
  values: ProductDialogValues
  changeHandlers: ProductDialogChangeHandlers
  trailingSlots?: Partial<Record<ProductFieldKey, ReactNode>>
}

function ProductDialogForm({
  idPrefix,
  values,
  changeHandlers,
  trailingSlots,
}: ProductDialogFormProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  return (
    <>
      {productDialogFields.map((field, index) => (
        <ProductDialogField
          key={field.key}
          id={`${idPrefix}-${field.key}`}
          config={field}
          value={values[field.key]}
          onChange={changeHandlers[field.key]}
          inputRef={(node) => {
            inputRefs.current[index] = node
          }}
          onAdvance={() => inputRefs.current[index + 1]?.focus()}
          trailingSlot={trailingSlots?.[field.key]}
        />
      ))}
    </>
  )
}

export default ProductDialogForm
