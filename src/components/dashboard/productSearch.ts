import type { ProductRow } from "./productTableData"

const searchableFields = ["name", "sku", "upc", "type", "vendor"] as const

function fuzzyMatch(value: string | undefined, query: string) {
  if (!value) {
    return false
  }

  const text = value.toLowerCase()
  let textIndex = 0

  for (const character of query.toLowerCase()) {
    textIndex = text.indexOf(character, textIndex)

    if (textIndex === -1) {
      return false
    }

    textIndex += 1
  }

  return true
}

export function filterProducts(products: ProductRow[], query: string) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return products
  }

  return products.filter((product) =>
    searchableFields.some((field) => fuzzyMatch(product[field], trimmedQuery))
  )
}
