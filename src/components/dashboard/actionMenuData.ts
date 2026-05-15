import { BadgeCheck, Pencil, Printer, Trash2, Undo2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { createElement, type ReactNode } from "react"

import { StatusCountChip } from "./GroupStatusChips"
import {
  countOutOfDateProducts,
  countUnprintedProducts,
  countUpToDateProducts,
} from "./groupPrintCounts"
import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"
import { getProductPrintStatus } from "./productPrintData"
import type { ProductRow } from "./productTableData"

type ActionMenuEntry =
  | { type: "label"; id: string; label: string }
  | { type: "separator"; id: string }
  | {
      type: "item"
      id: string
      label: string
      icon: LucideIcon
      variant?: "default" | "destructive" | "warning"
      onSelect: (event?: unknown) => void
      trailing?: ReactNode
    }

function hasShiftModifier(event?: unknown) {
  return typeof event === "object" && event !== null && "shiftKey" in event && (event as { shiftKey: boolean }).shiftKey
}

type ProductActionHandlers = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint?: (product: ProductRow, opts?: { skipLabelCountModal?: boolean }) => void
  onMarkUpToDate?: (product: ProductRow) => void
  canUndoPrint?: boolean
  onUndoPrint?: (product: ProductRow) => void
}

type GroupActionHandlers = {
  group: GroupRow
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
  canUndoPrint?: boolean
  onUndoPrint?: (group: GroupRow) => void
}

function getProductActionMenuItems({
  product,
  onEdit,
  onDelete,
  onPrint,
  onMarkUpToDate,
  canUndoPrint,
  onUndoPrint,
}: ProductActionHandlers) {
  const showMarkUpToDate =
    onMarkUpToDate !== undefined && getProductPrintStatus(product) !== "up-to-date"

  return compactActions([
    { type: "label", id: "name", label: product.name },
    { type: "separator", id: "primary-separator" },
    { type: "item", id: "edit", label: "Edit", icon: Pencil, onSelect: () => onEdit(product) },
    onPrint
      ? {
          type: "item",
          id: "print",
          label: "Print",
          icon: Printer,
          onSelect: (event) => onPrint(product, { skipLabelCountModal: hasShiftModifier(event) }),
        }
      : null,
    showMarkUpToDate
      ? {
          type: "item",
          id: "mark-up-to-date",
          label: "Mark up to date",
          icon: BadgeCheck,
          onSelect: () => onMarkUpToDate(product),
        }
      : null,
    { type: "separator", id: "danger-separator" },
    canUndoPrint && onUndoPrint
      ? {
          type: "item",
          id: "undo-print",
          label: "Undo last print",
          icon: Undo2,
          variant: "warning",
          onSelect: () => onUndoPrint(product),
        }
      : null,
    {
      type: "item",
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onSelect: () => onDelete(product),
    },
  ])
}

const groupPrintMenuChipCompact = "h-6 min-w-6 px-1.5 text-[10px]"

function getGroupActionMenuItems({
  group,
  onEdit,
  onDelete,
  onPrintGroup,
  canUndoPrint,
  onUndoPrint,
}: GroupActionHandlers) {
  const printCounts = onPrintGroup
    ? {
        unprinted: countUnprintedProducts(group),
        upToDate: countUpToDateProducts(group),
        outOfDate: countOutOfDateProducts(group),
      }
    : null

  return compactActions([
    { type: "label", id: "name", label: group.name },
    { type: "separator", id: "primary-separator" },
    { type: "item", id: "edit", label: "Edit", icon: Pencil, onSelect: () => onEdit(group) },
    onPrintGroup ? { type: "separator", id: "print-separator" } : null,
    onPrintGroup && printCounts
      ? {
          type: "item",
          id: "print-all",
          label: "Print all",
          icon: Printer,
          onSelect: () => onPrintGroup(group, "all"),
          trailing: createElement(StatusCountChip, {
            count: group.products.length,
            label: "Products",
            tone: "unprinted",
            className: `${groupPrintMenuChipCompact} ml-auto shrink-0`,
          }),
        }
      : null,
    onPrintGroup && printCounts
      ? {
          type: "item",
          id: "print-out-of-date",
          label: "Print out of date",
          icon: Printer,
          onSelect: () => onPrintGroup(group, "out-of-date"),
          trailing: createElement(StatusCountChip, {
            count: printCounts.outOfDate,
            label: "Out of date",
            tone: "outOfDate",
            className: `${groupPrintMenuChipCompact} ml-auto shrink-0`,
          }),
        }
      : null,
    onPrintGroup && printCounts
      ? {
          type: "item",
          id: "print-unprinted",
          label: "Print unprinted",
          icon: Printer,
          onSelect: () => onPrintGroup(group, "unprinted"),
          trailing: createElement(StatusCountChip, {
            count: printCounts.unprinted,
            label: "Unprinted",
            tone: "unprinted",
            className: `${groupPrintMenuChipCompact} ml-auto shrink-0`,
          }),
        }
      : null,
    { type: "separator", id: "danger-separator" },
    canUndoPrint && onUndoPrint
      ? {
          type: "item",
          id: "undo-print",
          label: "Undo last group print",
          icon: Undo2,
          variant: "warning",
          onSelect: () => onUndoPrint(group),
        }
      : null,
    {
      type: "item",
      id: "delete",
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      onSelect: () => onDelete(group),
    },
  ])
}

function compactActions(items: Array<ActionMenuEntry | null>) {
  return items.filter((item): item is ActionMenuEntry => item !== null)
}

export { getGroupActionMenuItems, getProductActionMenuItems }
export type { ActionMenuEntry }
