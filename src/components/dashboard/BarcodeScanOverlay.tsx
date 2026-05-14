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
  const frameClassName = success ? "stroke-green-400" : "stroke-white/90"

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
            <rect x="8" y="30" width="84" height="40" rx="4" ry="4" fill="black" />
          </mask>
        </defs>
        <rect width="100" height="100" fill="rgba(0,0,0,0.58)" mask={`url(#${maskId})`} />
        <rect
          x="8"
          y="30"
          width="84"
          height="40"
          rx="4"
          ry="4"
          fill="none"
          className={cn(
            "transition-[stroke,stroke-width] duration-200 ease-out",
            success ? "stroke-green-400 stroke-[1.1]" : "stroke-white/90 stroke-[0.75]",
          )}
        />
        <path
          d="M14 42V36H24 M76 36H86V42 M86 58V64H76 M24 64H14V58"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("stroke-[1.4] transition-colors duration-200 ease-out", frameClassName)}
        />
        <line
          x1="18"
          y1="50"
          x2="82"
          y2="50"
          strokeLinecap="round"
          className={cn("stroke-[0.45] transition-colors duration-200 ease-out", frameClassName)}
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
