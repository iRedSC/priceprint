import type { ProductRow } from "./productTableData"

export type ProductSort = "updated" | "name" | "price"

export const productSortLabels: Record<ProductSort, string> = {
  updated: "Recent",
  name: "Name",
  price: "Price",
}

export const productSortOptions: ProductSort[] = ["updated", "name", "price"]

export function sortProducts(products: ProductRow[], sort: ProductSort) {
  return [...products].sort((first, second) => {
    if (sort === "name") {
      return first.name.localeCompare(second.name)
    }

    if (sort === "price") {
      return first.price - second.price
    }

    return (second.updatedAt ?? second.createdAt) - (first.updatedAt ?? first.createdAt)
  })
}
