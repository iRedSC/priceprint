/** Plain amount with two decimals (no symbol, no grouping) — table price cell + Label LIVE `PRICE`. */
export function formatProductPriceAmount(price: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(price)
}
