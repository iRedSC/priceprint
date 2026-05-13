import type { GroupRow } from "./groupTableData"

export function filterGroups(groups: GroupRow[], search: string) {
  const term = search.trim().toLowerCase()

  if (!term) {
    return groups
  }

  return groups.filter((group) =>
    [group.name, ...group.products.map((product) => product.name)]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term))
  )
}
