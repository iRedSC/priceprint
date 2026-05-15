import type { Modifier } from "@dnd-kit/core"

/** Vertical list reorder: lock drag to Y so rows (and auto-scroll) don’t shift sideways. */
export const restrictGroupProductSortToYAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
})
