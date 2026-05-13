import { useId } from "react"

import { cn } from "@/lib/utils"

type BarcodeScanOverlayProps = {
  active: boolean
  success: boolean
  successKey: number
}

function BarcodeScanOverlay({ active, success, successKey }: BarcodeScanOverlayProps) {
  const rawId = useId()
  const maskId = `scan-mask-${rawId.replace(/:/g, "")}`

  const visible = active || success

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            <rect x="10" y="38" width="80" height="24" rx="2.5" ry="2.5" fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="rgba(0,0,0,0.52)" mask={`url(#${maskId})`} />
        <rect
          x="10"
          y="38"
          width="80"
          height="24"
          rx="2.5"
          ry="2.5"
          fill="none"
          className={cn(
            "transition-[stroke,stroke-width] duration-200 ease-out",
            success ? "stroke-green-400 stroke-[0.9]" : "stroke-white/85 stroke-[0.55]",
          )}
        />
      </svg>
      {success ? (
        <div
          key={successKey}
          className="pointer-events-none absolute inset-0 animate-barcode-scan-flash bg-green-500/30"
        />
      ) : null}
    </div>
  )
}

export default BarcodeScanOverlay
