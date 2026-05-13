import { useAction } from "convex/react"
import { useState, type FormEvent } from "react"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ShopifyConnectionSection() {
  const startInstall = useAction(api.shopify.startShopifyInstall)
  const [shopDomain, setShopDomain] = useState("")
  const [message, setMessage] = useState("")
  const [isBusy, setIsBusy] = useState(false)

  const handleConnect = async (event: FormEvent) => {
    event.preventDefault()
    setIsBusy(true)
    setMessage("")

    try {
      const redirectUri = `${window.location.origin}/shopify/callback`
      const { authUrl } = await startInstall({ shopDomain, redirectUri })

      window.location.href = authUrl
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not start Shopify setup.")
      setIsBusy(false)
    }
  }

  return (
    <form onSubmit={handleConnect}>
      <Card>
        <CardHeader>
          <CardDescription>Store connection</CardDescription>
          <CardTitle>Shopify</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Connect a Shopify store to sync products for scanning, grouping, and label
            printing.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="shopify-domain">Shopify store</Label>
            <Input
              id="shopify-domain"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="url"
              onChange={(event) => setShopDomain(event.target.value)}
              placeholder="your-store.myshopify.com"
              required
              value={shopDomain}
            />
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
        <CardFooter className="grid gap-3 sm:flex sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Uses Convex env vars SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.
          </p>
          <Button type="submit" className="h-11 touch-manipulation" disabled={isBusy}>
            {isBusy ? "Connecting..." : "Connect Shopify"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default ShopifyConnectionSection
