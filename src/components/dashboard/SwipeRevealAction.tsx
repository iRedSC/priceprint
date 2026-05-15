import type { PointerEvent, ReactNode } from "react"
import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

const ACTION_WIDTH = 72
const OPEN_THRESHOLD = ACTION_WIDTH / 2

type SwipeRevealActionProps = {
  children: ReactNode
  action: ReactNode
  className?: string
}

function SwipeRevealAction({ children, action, className }: SwipeRevealActionProps) {
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const offsetRef = useRef(0)
  const gesture = useRef({ pointerId: -1, startX: 0, startY: 0, startOffset: 0, locked: false })

  const setSwipeOffset = (value: number) => {
    offsetRef.current = value
    setOffset(value)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isSwipeIgnored(event.target)) {
      return
    }

    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      locked: false,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!isDragging || current.pointerId !== event.pointerId) {
      return
    }

    const dx = event.clientX - current.startX
    const dy = event.clientY - current.startY
    if (!current.locked && Math.abs(dy) > Math.abs(dx)) {
      return
    }

    current.locked = true
    event.preventDefault()
    setSwipeOffset(clamp(current.startOffset + dx, -ACTION_WIDTH, 0))
  }

  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!isDragging || current.pointerId !== event.pointerId) {
      return
    }

    setIsDragging(false)
    setSwipeOffset(offsetRef.current <= -OPEN_THRESHOLD ? -ACTION_WIDTH : 0)
  }

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div className="absolute inset-y-0 right-0 flex w-[72px] items-center justify-center bg-destructive text-destructive-foreground">
        {action}
      </div>
      <div
        className={cn("relative", !isDragging && "transition-transform duration-200 ease-out")}
        style={{ transform: `translateX(${offset}px)`, touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={finishSwipe}
      >
        {children}
      </div>
    </div>
  )
}

function isSwipeIgnored(target: EventTarget) {
  return target instanceof HTMLElement && Boolean(target.closest("[data-swipe-ignore]"))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default SwipeRevealAction
