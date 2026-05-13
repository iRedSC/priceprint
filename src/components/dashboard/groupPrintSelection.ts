import { getProductPrintStatus } from "./productPrintData";
import type { GroupRow } from "./groupTableData";

export type GroupPrintScope = "all" | "out-of-date" | "unprinted";

export function selectGroupProductsForPrint(group: GroupRow, scope: GroupPrintScope) {
  switch (scope) {
    case "all":
      return group.products;
    case "out-of-date":
      return group.products.filter((p) => getProductPrintStatus(p) === "needs-reprinted");
    case "unprinted":
      return group.products.filter((p) => getProductPrintStatus(p) === "not-printed");
  }
}
