import { useQuery } from "convex/react"
import type { FunctionReturnType } from "convex/server"

import type { AuthResult } from "@/authSession"
import { api } from "../../../convex/_generated/api"
import type { GroupRow } from "./groupTableData"
import type { ProductRow } from "./productTableData"

export type LabelLiveSettings = FunctionReturnType<typeof api.userPrefs.getLabelLiveSettings>
export type UndoablePrintTargets = FunctionReturnType<typeof api.printJobs.undoablePrintTargets>
export type DashboardData = {
  products: ProductRow[]
  groups: GroupRow[]
  labelLiveSettings: LabelLiveSettings
  undoablePrintTargets: UndoablePrintTargets
  shopifyConnections: FunctionReturnType<typeof api.shopify.myConnections>
  isReady: boolean
}

export function useDashboardData(session: AuthResult | null): DashboardData {
  const queryArgs = session ? { sessionToken: session.sessionToken } : "skip"

  const products = useQuery(api.products.list, queryArgs)
  const groups = useQuery(api.groups.list, queryArgs)
  const labelLiveSettings = useQuery(api.userPrefs.getLabelLiveSettings, queryArgs)
  const undoablePrintTargets = useQuery(api.printJobs.undoablePrintTargets, queryArgs)
  const shopifyConnections = useQuery(api.shopify.myConnections, queryArgs)

  const isReady =
    !session ||
    (products !== undefined &&
      groups !== undefined &&
      labelLiveSettings !== undefined &&
      undoablePrintTargets !== undefined &&
      shopifyConnections !== undefined)

  return {
    products: products ?? [],
    groups: groups ?? [],
    labelLiveSettings: labelLiveSettings ?? {
      designName: null,
      upcDesignName: null,
      skuDesignName: null,
      printerId: null,
    },
    undoablePrintTargets: undoablePrintTargets ?? { productIds: [], groupIds: [] },
    shopifyConnections: shopifyConnections ?? [],
    isReady,
  }
}
