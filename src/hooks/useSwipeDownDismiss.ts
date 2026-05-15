import { useCallback, useMemo, useRef, useState } from "react"
import type { CSSProperties, PointerEvent, RefObject } from "react"

type SwipeDownDismissOptions<TElement extends HTMLElement> = {
  onDismiss: () => void
  scrollRef?: RefObject<HTMLElement | null>
  enabled?: boolean
  maxOffset?: number
  distanceThreshold?: number
  velocityThreshold?: number
  canStart?: (event: PointerEvent<TElement>) => boolean
}

type SwipeState = {
  pointerId: number
  startX: number
  startY: number
  lastY: number
  lastTime: number
  tracking: boolean
}

export function useSwipeDownDismiss<TElement extends HTMLElement>({
  onDismiss,
  scrollRef,
  enabled = true,
  maxOffset = 180,
  distanceThreshold = 96,
  velocityThreshold = 0.8,
  canStart,
}: SwipeDownDismissOptions<TElement>) {
  const swipeRef = useRef<SwipeState | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  const isAtTop = useCallback(() => !scrollRef?.current || scrollRef.current.scrollTop <= 0, [scrollRef])

  const onPointerDown = useCallback(
    (event: PointerEvent<TElement>) => {
      if (
        !enabled ||
        event.defaultPrevented ||
        event.pointerType === "mouse" ||
        isInteractiveTarget(event.target) ||
        canStart?.(event) === false
      ) {
        return
      }

      swipeRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastY: event.clientY,
        lastTime: event.timeStamp,
        tracking: isAtTop(),
      }
    },
    [canStart, enabled, isAtTop],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<TElement>) => {
      const swipe = swipeRef.current
      if (!enabled || !swipe || swipe.pointerId !== event.pointerId || event.defaultPrevented) {
        return
      }

      const deltaX = event.clientX - swipe.startX
      const deltaY = event.clientY - swipe.startY
      swipe.lastY = event.clientY
      swipe.lastTime = event.timeStamp

      if (!swipe.tracking) {
        swipe.tracking = isAtTop() && deltaY > 0
      }

      if (!swipe.tracking || Math.abs(deltaX) > Math.abs(deltaY) || deltaY <= 0) {
        setDragOffset(0)
        return
      }

      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      setDragOffset(Math.min(deltaY, maxOffset))
    },
    [enabled, isAtTop, maxOffset],
  )

  const onPointerUp = useCallback(
    (event: PointerEvent<TElement>) => {
      const swipe = swipeRef.current
      if (!swipe || swipe.pointerId !== event.pointerId) {
        return
      }

      const deltaY = event.clientY - swipe.startY
      const elapsed = Math.max(1, event.timeStamp - swipe.lastTime)
      const velocity = Math.max(0, event.clientY - swipe.lastY) / elapsed
      swipeRef.current = null
      setDragOffset(0)

      if (enabled && swipe.tracking && (deltaY > distanceThreshold || velocity > velocityThreshold)) {
        onDismiss()
      }
    },
    [distanceThreshold, enabled, onDismiss, velocityThreshold],
  )

  const onPointerCancel = useCallback((event?: PointerEvent<TElement>) => {
    void event
    swipeRef.current = null
    setDragOffset(0)
  }, [])

  const style = useMemo<CSSProperties>(
    () => ({
      transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
      transition: dragOffset ? "none" : undefined,
    }),
    [dragOffset],
  )

  return {
    dragOffset,
    style,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  }
}

function isInteractiveTarget(target: EventTarget) {
  return target instanceof HTMLElement && Boolean(target.closest("button, input, select, textarea, a"))
}
