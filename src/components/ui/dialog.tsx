import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const viewportVars = useDialogViewportVars()

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed inset-x-0 bottom-[var(--dialog-keyboard-inset)] z-50 grid max-h-[calc(var(--dialog-viewport-height)-0.75rem)] gap-5 overflow-y-auto overscroll-contain rounded-t-3xl border bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-base shadow-lg touch-manipulation sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:p-6 sm:text-sm [&_[data-slot=button]]:min-h-11 sm:[&_[data-slot=button]]:min-h-8 [&_[data-slot=input]]:min-h-11 [&_[data-slot=input]]:px-3 sm:[&_[data-slot=input]]:min-h-8 sm:[&_[data-slot=input]]:px-2.5 [&_[data-slot=label]]:text-base sm:[&_[data-slot=label]]:text-sm [&_[data-slot=table]]:text-base sm:[&_[data-slot=table]]:text-sm",
          className
        )}
        style={{ ...viewportVars, ...style }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute top-3 right-3 inline-flex size-10 touch-manipulation items-center justify-center rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none sm:size-8">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

type DialogViewportVars = React.CSSProperties & {
  "--dialog-keyboard-inset": string
  "--dialog-viewport-height": string
}

function useDialogViewportVars(): DialogViewportVars {
  const [vars, setVars] = React.useState<DialogViewportVars>({
    "--dialog-keyboard-inset": "0px",
    "--dialog-viewport-height": "100dvh",
  })

  React.useLayoutEffect(() => {
    const updateVars = () => {
      const viewport = window.visualViewport
      const viewportHeight = viewport?.height ?? window.innerHeight
      const keyboardInset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0

      setVars({
        "--dialog-keyboard-inset": `${keyboardInset}px`,
        "--dialog-viewport-height": `${viewportHeight}px`,
      })
    }

    updateVars()
    window.addEventListener("resize", updateVars)
    window.visualViewport?.addEventListener("resize", updateVars)
    window.visualViewport?.addEventListener("scroll", updateVars)

    return () => {
      window.removeEventListener("resize", updateVars)
      window.visualViewport?.removeEventListener("resize", updateVars)
      window.visualViewport?.removeEventListener("scroll", updateVars)
    }
  }, [])

  return vars
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 pr-10 text-left sm:gap-1.5", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-2 [&_[data-slot=button]]:w-full sm:[&_[data-slot=button]]:w-auto",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-xl leading-tight font-semibold sm:text-lg", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-base leading-relaxed text-muted-foreground sm:text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
