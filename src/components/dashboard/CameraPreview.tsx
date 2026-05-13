import type { RefObject } from "react"

type CameraPreviewProps = {
  error: string
  videoRef: RefObject<HTMLVideoElement | null>
}

function CameraPreview({ error, videoRef }: CameraPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-muted">
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
