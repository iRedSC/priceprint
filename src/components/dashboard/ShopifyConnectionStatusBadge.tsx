import { Badge } from "@/components/ui/badge"

type ShopifyConnectionStatusBadgeProps = {
  isActive: boolean
}

function ShopifyConnectionStatusBadge({ isActive }: ShopifyConnectionStatusBadgeProps) {
  return (
    <Badge variant={isActive ? "default" : "destructive"} className="pointer-events-none">
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )
}

export default ShopifyConnectionStatusBadge
