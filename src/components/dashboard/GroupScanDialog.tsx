import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { triggerHapticFeedback } from "@/lib/haptics"
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
  const scanSuccessTimeoutRef = useRef<number | null>(null)
  const [holding, setHolding] = useState(false)
  const [feed, setFeed] = useState<ScanFeedItem[]>([])
  const [busy, setBusy] = useState(false)
  const [scanSucceeded, setScanSucceeded] = useState(false)
  const [scanSuccessKey, setScanSuccessKey] = useState(0)

  const updateFeed = (item: ScanFeedItem) => {
    setFeed((items) => [item, ...items.filter((current) => current.code !== item.code)].slice(0, 4))
  }

  const flashScanSuccess = () => {
    if (scanSuccessTimeoutRef.current) {
      window.clearTimeout(scanSuccessTimeoutRef.current)
    }

    setScanSuccessKey((key) => key + 1)
    setScanSucceeded(true)
    triggerHapticFeedback()
    scanSuccessTimeoutRef.current = window.setTimeout(() => {
      setScanSucceeded(false)
      scanSuccessTimeoutRef.current = null
    }, 900)
  }

  useEffect(() => {
    if (!open) {
      if (scanSuccessTimeoutRef.current) {
        window.clearTimeout(scanSuccessTimeoutRef.current)
        scanSuccessTimeoutRef.current = null
      }
      setHolding(false)
      setFeed([])
      setScanSucceeded(false)
      setScanSuccessKey(0)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (scanSuccessTimeoutRef.current) {
        window.clearTimeout(scanSuccessTimeoutRef.current)
      }
    }
  }, [])

  const handleCode = useCallback(async (code: string) => {
    if (!group || busy) {
      return
    }

    setHolding(false)
    flashScanSuccess()
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
        <DialogHeader>
          <DialogTitle>Scan into {group?.name}</DialogTitle>
          <DialogDescription>
            Hold the scan button while the barcode is visible in the camera.
          </DialogDescription>
        </DialogHeader>
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-x-0 bottom-full z-10 mb-2 max-h-[min(30vh,10rem)] overflow-hidden">
            {feed.length > 0 ? <LastScannedFeed items={feed} /> : null}
          </div>
          <CameraPreview
            videoRef={videoRef}
            error={cameraError || scanError}
            scanning={holding && !busy}
            success={scanSucceeded}
            successKey={scanSuccessKey}
          />
        </div>
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
