export type DashboardResume = {
  groupCount: number
  scannedIntoGroupsToday: number
  productCount: number
  shopifyConnected: boolean
  shopDomain?: string
}

export type DashboardRecentGroup = {
  _id: string
  name: string
  productCount: number
}
