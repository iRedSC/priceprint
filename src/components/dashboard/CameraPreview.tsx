import type { RefObject } from "react"

import BarcodeScanOverlay from "./BarcodeScanOverlay"

type CameraPreviewProps = {
  error: string
  scanning?: boolean
  success?: boolean
  successKey?: number
  videoRef: RefObject<HTMLVideoElement | null>
}

function CameraPreview({
  error,
  scanning = false,
  success = false,
  successKey = 0,
  videoRef,
}: CameraPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-muted">
      <video
        ref={videoRef}
        className="aspect-[4/3] w-full object-cover touch-manipulation"
        muted
        playsInline
      />
      {!error ? <BarcodeScanOverlay active={scanning} success={success} successKey={successKey} /> : null}
      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-background/90 p-4 text-center text-sm text-muted-foreground">
          {error}
        </div>
      ) : null}
    </div>
  )
}

export default CameraPreview
