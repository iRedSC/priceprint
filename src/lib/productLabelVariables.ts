import type { Doc } from "../../convex/_generated/dataModel";

type PrintableProduct = Doc<"products"> & {
  printData?: Doc<"printData"> | null;
};

/**
 * Flat string variables for Label LIVE templates.
 * Keys are UPPERCASE to match Label LIVE’s Integrate / `labellive://print` convention
 * (e.g. NAME, SKU, VARIANT, PRICE, META — same as Data → Integrate in the app).
 */
export function productToLabelLiveVariables(product: PrintableProduct): Record<string, string> {
  const metaText =
    product.meta === undefined
      ? "{}"
      : typeof product.meta === "string"
        ? product.meta
        : JSON.stringify(product.meta);

  const out: Record<string, string> = {
    NAME: product.name,
  };

  if (product.sku !== undefined) out.SKU = product.sku;
  if (product.upc !== undefined) out.UPC = product.upc;
  if (product.type !== undefined) out.TYPE = product.type;
  if (product.variant !== undefined) out.VARIANT = product.variant;
  if (product.vendor !== undefined) out.VENDOR = product.vendor;
  out.PRICE = String(product.price);
  out.IMG = product.img ?? "";
  out.META = metaText;

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
  { name: "VARIANT", description: "Variant (if set)" },
  { name: "VENDOR", description: "Vendor (if set)" },
  { name: "PRICE", description: "Price" },
  { name: "IMG", description: "Image URL (empty string if unset)" },
  { name: "META", description: "Meta field as JSON text" },
];
