import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CameraPreview from "./CameraPreview"
import type { GroupRow } from "./groupTableData"
import LastScannedFeed from "./LastScannedFeed"
import type { ScanFeedItem } from "./LastScannedFeed"
import type { ProductInput } from "./productTableData"
import { useBarcodeScanner } from "./useBarcodeScanner"

type GroupScanDialogProps = {
  group: GroupRow | null
  onOpenChange: (open: boolean) => void
  onScanProduct: (group: GroupRow, code: string) => Promise<ProductInput>
}

function GroupScanDialog({ group, onOpenChange, onScanProduct }: GroupScanDialogProps) {
  const open = Boolean(group)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [holding, setHolding] = useState(false)
  const [feed, setFeed] = useState<ScanFeedItem[]>([])
  const [busy, setBusy] = useState(false)

  const updateFeed = (item: ScanFeedItem) => {
    setFeed((items) => [item, ...items.filter((current) => current.code !== item.code)].slice(0, 4))
  }

  useEffect(() => {
    if (!open) {
      setHolding(false)
      setFeed([])
    }
  }, [open])

  const handleCode = useCallback(async (code: string) => {
    if (!group || busy) {
      return
    }

    setHolding(false)
    setBusy(true)
    updateFeed({ code, detail: "Checking Shopify...", status: "loading" })

    try {
      const product = await onScanProduct(group, code)
      updateFeed({ code, detail: product.name, status: "added" })
    } catch (error) {
      updateFeed({
        code,
        detail: error instanceof Error ? error.message : "Could not add this product.",
        status: "error",
      })
    } finally {
      setBusy(false)
    }
  }, [busy, group, onScanProduct])

  const { cameraError, scanError } = useBarcodeScanner({
    active: holding && !busy,
    open,
    videoRef,
    onCode: handleCode,
  })

  const stopHolding = () => setHolding(false)
  const startHolding = () => {
    if (!busy && !cameraError) {
      setHolding(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:hidden">
        {feed.length > 0 && (
          <div className="pointer-events-none">
            <LastScannedFeed items={feed} />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Scan into {group?.name}</DialogTitle>
          <DialogDescription>
            Hold the scan button while the barcode is visible in the camera.
          </DialogDescription>
        </DialogHeader>
        <CameraPreview videoRef={videoRef} error={cameraError || scanError} />
        <Button
          className="h-14 touch-manipulation select-none text-base"
          disabled={busy || Boolean(cameraError)}
          type="button"
          onContextMenu={(event) => event.preventDefault()}
          onPointerCancel={stopHolding}
          onPointerDown={startHolding}
          onPointerLeave={stopHolding}
          onPointerUp={stopHolding}
        >
          {busy ? "Adding product..." : holding ? "Scanning..." : "Hold to scan"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default GroupScanDialog
