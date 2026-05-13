import type { ProductInput } from "./productTableData"

export const productCsvExample =
  "name,sku,upc,type,vendor,price,img,meta\nOrganic apple juice,SKU-1001,092834761203,Beverage,North Market,4.99,,{}\nSourdough loaf,SKU-1002,092834761204,Bakery,Bakery Co,6.49,,{}\n"

function splitCsvLine(line: string) {
  return line.match(/("([^"]|"")*"|[^,]+)/g)?.map((value) =>
    value.replace(/^"|"$/g, "").replaceAll('""', '"').trim()
  ) ?? []
}

export function parseProductCsv(text: string): ProductInput[] {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/)
  if (!headerLine) {
    return []
  }

  const headers = splitCsvLine(headerLine).map((header) => header.toLowerCase())

  return rows
    .map((row) => {
      const values = splitCsvLine(row)
      const getValue = (key: string) => values[headers.indexOf(key)] ?? ""
      const price = Number(getValue("price"))
      return {
        name: getValue("name"),
        sku: getValue("sku") || undefined,
        upc: getValue("upc") || undefined,
        img: getValue("img") || undefined,
        type: getValue("type") || undefined,
        vendor: getValue("vendor") || undefined,
        price,
        meta: parseMeta(getValue("meta")),
      }
    })
    .filter((product) => product.name && Number.isFinite(product.price))
}

function parseMeta(value: string) {
  if (!value.trim()) {
    return undefined
  }

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
