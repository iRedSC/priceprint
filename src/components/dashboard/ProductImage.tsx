import { useState } from "react"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"

type ProductImageProps = {
  src?: string
  alt: string
  className?: string
}

function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imageSrc = src?.trim()
  const failed = !!imageSrc && failedSrc === imageSrc

  if (!imageSrc || failed) {
    return (
      <div
        aria-label={imageSrc ? `Image unavailable for ${alt}` : `No image for ${alt}`}
        className={cn(
          "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground",
          className
        )}
      >
        <ImageOff className="size-4" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={cn("size-10 shrink-0 rounded-md border bg-muted object-cover", className)}
      onError={() => setFailedSrc(imageSrc)}
    />
  )
}

export default ProductImage
