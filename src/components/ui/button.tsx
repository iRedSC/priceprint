import * as React from "react"
import { Slot } from "radix-ui"

import { buttonVariants, type ButtonVariants } from "@/components/ui/buttonVariants"
import { triggerHapticFeedback } from "@/lib/haptics"
import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  onPointerDown,
  ...props
}: React.ComponentProps<"button"> &
  ButtonVariants & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (event) => {
    const ariaDisabled = props["aria-disabled"]
    const disabled = props.disabled || ariaDisabled === true || ariaDisabled === "true"

    if (!disabled && event.button === 0) {
      triggerHapticFeedback()
    }

    onPointerDown?.(event)
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerDown={handlePointerDown}
      {...props}
    />
  )
}

export { Button }
