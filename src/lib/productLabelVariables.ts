import type { Doc } from "../../convex/_generated/dataModel";

type PrintableProduct = Doc<"products"> & {
  printData?: Doc<"printData"> | null;
};

/**
 * Flat string variables for Label LIVE templates.
 * Keys are UPPERCASE to match Label LIVE’s Integrate / `labellive://print` convention
 * (e.g. NAME, SKU, PRICE, META — same as Data → Integrate in the app).
 */
export function productToLabelLiveVariables(product: PrintableProduct): Record<string, string> {
  const metaText =
    product.meta === undefined
      ? ""
      : typeof product.meta === "string"
        ? product.meta
        : JSON.stringify(product.meta);

  const out: Record<string, string> = {
    NAME: product.name,
    PRICE: String(product.price),
    ID: String(product._id),
    CREATED_AT: String(product.createdAt),
    CREATION_TIME: String(product._creationTime),
    META: metaText,
    IMG: product.img ?? "",
  };

  if (product.sku !== undefined) out.SKU = product.sku;
  if (product.upc !== undefined) out.UPC = product.upc;
  if (product.type !== undefined) out.TYPE = product.type;
  if (product.vendor !== undefined) out.VENDOR = product.vendor;
  if (product.updatedAt !== undefined) out.UPDATED_AT = String(product.updatedAt);

  const pd = product.printData;
  if (!pd) {
    return out;
  }

  out.PRINTDATA_ID = String(pd._id);
  out.PRINTDATA_CREATED_AT = String(pd.createdAt);
  if (pd.updatedAt !== undefined) out.PRINTDATA_UPDATED_AT = String(pd.updatedAt);
  if (pd.lastPrintedAt !== undefined) {
    out.PRINTDATA_LAST_PRINTED_AT = String(pd.lastPrintedAt);
  }
  if (pd.lastPrintedPrice !== undefined) {
    out.PRINTDATA_LAST_PRINTED_PRICE = String(pd.lastPrintedPrice);
  }

  return out;
}

/** User-visible names for Label LIVE templates; keys match `productToLabelLiveVariables`. */
export type LabelLiveProductVariableHelp = {
  name: string;
  description: string;
};

export const labelLiveProductVariableHelp: LabelLiveProductVariableHelp[] = [
  { name: "NAME", description: "Product name" },
  { name: "SKU", description: "SKU (if set)" },
  { name: "UPC", description: "UPC (if set)" },
  { name: "TYPE", description: "Type (if set)" },
  { name: "VENDOR", description: "Vendor (if set)" },
  { name: "PRICE", description: "Price" },
  { name: "IMG", description: "Image URL (empty string if unset)" },
  { name: "META", description: "Meta field as JSON text (empty if unset)" },
  { name: "ID", description: "Convex product id" },
  { name: "CREATED_AT", description: "Created timestamp (ms)" },
  { name: "CREATION_TIME", description: "Convex internal creation time (ms)" },
  { name: "UPDATED_AT", description: "Updated timestamp (if set)" },
  { name: "PRINTDATA_ID", description: "Print history row id (if printed before)" },
  { name: "PRINTDATA_CREATED_AT", description: "Print history created (ms)" },
  { name: "PRINTDATA_UPDATED_AT", description: "Print history updated (if set)" },
  { name: "PRINTDATA_LAST_PRINTED_AT", description: "Last print time (if set)" },
  { name: "PRINTDATA_LAST_PRINTED_PRICE", description: "Price at last print (if set)" },
];
