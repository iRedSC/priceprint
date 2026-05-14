export function formatShopifyAddedDate(createdAt: number) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(createdAt)
}
