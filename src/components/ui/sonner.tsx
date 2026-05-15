import { useTheme } from "next-themes"
import type * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/** Mirrors sonner VIEWPORT_OFFSET (24px) + iOS PWA safe area (notch / Dynamic Island). */
const toasterOffset: NonNullable<ToasterProps["offset"]> = {
  top: "calc(24px + env(safe-area-inset-top, 0px))",
  right: "calc(24px + env(safe-area-inset-right, 0px))",
  bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
  left: "calc(24px + env(safe-area-inset-left, 0px))",
}

/** Mirrors sonner MOBILE_VIEWPORT_OFFSET (16px) + safe area (see `toasterOffset`). */
const toasterMobileOffset: NonNullable<ToasterProps["mobileOffset"]> = {
  top: "calc(16px + env(safe-area-inset-top, 0px))",
  right: "calc(16px + env(safe-area-inset-right, 0px))",
  bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
  left: "calc(16px + env(safe-area-inset-left, 0px))",
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      offset={toasterOffset}
      mobileOffset={toasterMobileOffset}
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
