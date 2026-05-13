import type { Doc } from "../../convex/_generated/dataModel";

type PrintableProduct = Doc<"products"> & {
  printData?: Doc<"printData"> | null;
};

/** Flat string variables for Label LIVE templates (maps to matching variable names in the design). */
export function productToLabelLiveVariables(product: PrintableProduct): Record<string, string> {
  const out: Record<string, string> = {
    _id: String(product._id),
    name: product.name,
    price: String(product.price),
    createdAt: String(product.createdAt),
    _creationTime: String(product._creationTime),
  }

  if (product.sku !== undefined) out.sku = product.sku;
  if (product.upc !== undefined) out.upc = product.upc;
  if (product.img !== undefined) out.img = product.img;
  if (product.type !== undefined) out.type = product.type;
  if (product.vendor !== undefined) out.vendor = product.vendor;

  if (product.updatedAt !== undefined) out.updatedAt = String(product.updatedAt);

  out.meta_json =
    product.meta === undefined
      ? ""
      : typeof product.meta === "string"
        ? product.meta
        : JSON.stringify(product.meta);

  const pd = product.printData;
  if (!pd) {
    return out;
  }

  out.printData_id = String(pd._id);
  out.printData_createdAt = String(pd.createdAt);
  if (pd.updatedAt !== undefined) out.printData_updatedAt = String(pd.updatedAt);
  if (pd.lastPrintedAt !== undefined) out.printData_lastPrintedAt = String(pd.lastPrintedAt);
  if (pd.lastPrintedPrice !== undefined) {
    out.printData_lastPrintedPrice = String(pd.lastPrintedPrice);
  }

  return out;
}
