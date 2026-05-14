import { useAction } from "convex/react"
import { useState, type FormEvent } from "react"

import { readStoredSession } from "@/authSession"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ShopifyConnectStoreDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ShopifyConnectStoreDialog({ open, onOpenChange }: ShopifyConnectStoreDialogProps) {
  const startInstall = useAction(api.shopify.startShopifyInstall)
  const [session] = useState(readStoredSession)
  const [shopDomain, setShopDomain] = useState("")
  const [message, setMessage] = useState("")
  const [isBusy, setIsBusy] = useState(false)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setShopDomain("")
      setMessage("")
      setIsBusy(false)
    }
    onOpenChange(nextOpen)
  }

  const handleConnect = async (event: FormEvent) => {
    event.preventDefault()
    setIsBusy(true)
    setMessage("")

    try {
      const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL

      if (!session) {
        throw new Error("Sign in again to connect Shopify.")
      }

      if (!convexSiteUrl) {
        throw new Error("Missing VITE_CONVEX_SITE_URL in environment.")
      }

      const redirectUri = `${convexSiteUrl.replace(/\/$/, "")}/shopify/callback`
      const { authUrl } = await startInstall({
        shopDomain,
        redirectUri,
        sessionToken: session.sessionToken,
      })

      window.location.href = authUrl
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not start Shopify setup.")
      setIsBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Shopify store</DialogTitle>
          <DialogDescription>
            Enter your store domain. You will be redirected to Shopify to authorize access.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConnect} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="shopify-connect-domain">Shopify store</Label>
            <Input
              id="shopify-connect-domain"
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
          <div className="flex flex-col-reverse gap-3 pt-1 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground md:max-w-[60%]">
              Uses Convex env vars SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET.
            </p>
            <Button type="submit" className="touch-manipulation md:shrink-0" disabled={isBusy}>
              {isBusy ? "Connecting..." : "Continue to Shopify"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ShopifyConnectStoreDialog
