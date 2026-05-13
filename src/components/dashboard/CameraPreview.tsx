import type { RefObject } from "react"

import { cn } from "@/lib/utils"

type CameraPreviewProps = {
  error: string
  success?: boolean
  videoRef: RefObject<HTMLVideoElement | null>
}

function CameraPreview({ error, success = false, videoRef }: CameraPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-muted transition-colors",
        success && "border-green-500 ring-2 ring-green-500/40",
      )}
    >
      <video
        ref={videoRef}
        className="aspect-[4/3] w-full object-cover"
        muted
        playsInline
      />
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-background/90 p-4 text-center text-sm text-muted-foreground">
          {error}
        </div>
      )}
    </div>
  )
}

export default CameraPreview
