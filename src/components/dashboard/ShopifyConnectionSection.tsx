import { useState } from "react"
import type { FunctionReturnType } from "convex/server"

import { readStoredSession } from "@/authSession"
import { api } from "../../../convex/_generated/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"

import ShopifyAddStoreCard from "./ShopifyAddStoreCard"
import ShopifyConnectStoreDialog from "./ShopifyConnectStoreDialog"
import ShopifyStoreConnectionCard from "./ShopifyStoreConnectionCard"

type ShopifyConnectionSectionProps = {
  connections: FunctionReturnType<typeof api.shopify.myConnections>
}

function ShopifyConnectionSection({ connections }: ShopifyConnectionSectionProps) {
  const [session] = useState(readStoredSession)
  const [connectOpen, setConnectOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Store connections</CardDescription>
          <CardTitle>Shopify</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Connect Shopify stores to sync products for scanning, grouping, and label printing.
          </p>

          {!session ? (
            <p className="text-sm text-muted-foreground">Sign in to manage store connections.</p>
          ) : (
            <TooltipProvider delayDuration={200}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {connections.map((connection) => (
                  <ShopifyStoreConnectionCard
                    key={connection.shopDomain}
                    shopDomain={connection.shopDomain}
                    createdAt={connection.createdAt}
                    isActive={connection.isActive}
                    scopes={connection.scopes}
                  />
                ))}
                <ShopifyAddStoreCard onClick={() => setConnectOpen(true)} />
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      <ShopifyConnectStoreDialog open={connectOpen} onOpenChange={setConnectOpen} />
    </>
  )
}

export default ShopifyConnectionSection
