import { FolderOpen, Pencil, Printer, Trash2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { GroupPrintScope } from "./groupPrintSelection"
import type { GroupRow } from "./groupTableData"
import type { ProductRow } from "./productTableData"

type ActionMenuEntry =
  | { type: "label"; id: string; label: string }
  | { type: "separator"; id: string }
  | {
      type: "item"
      id: string
      label: string
      icon: LucideIcon
      variant?: "default" | "destructive"
      onSelect: () => void
    }

type ProductActionHandlers = {
  product: ProductRow
  onEdit: (product: ProductRow) => void
  onDelete: (product: ProductRow) => void
  onPrint?: (product: ProductRow) => void
}

type GroupActionHandlers = {
  group: GroupRow
  onOpen: (group: GroupRow) => void
  onEdit: (group: GroupRow) => void
  onDelete: (group: GroupRow) => void
  onPrintGroup?: (group: GroupRow, scope: GroupPrintScope) => void
}

function getProductActionMenuItems({ product, onEdit, onDelete, onPrint }: ProductActionHandlers) {
  return compactActions([
    { type: "label", id: "name", label: product.name },
    { type: "separator", id: "primary-separator" },
    { type: "item", id: "edit", label: "Edit", icon: Pencil, onSelect: () => onEdit(product) },
    onPrint ? { type: "item", id: "print", label: "Print", icon: Printer, onSelect: () => onPrint(product) } : null,
    { type: "separator", id: "danger-separator" },
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

function getGroupActionMenuItems({ group, onOpen, onEdit, onDelete, onPrintGroup }: GroupActionHandlers) {
  return compactActions([
    { type: "label", id: "name", label: group.name },
    { type: "separator", id: "primary-separator" },
    { type: "item", id: "open", label: "Open", icon: FolderOpen, onSelect: () => onOpen(group) },
    { type: "item", id: "edit", label: "Edit", icon: Pencil, onSelect: () => onEdit(group) },
    onPrintGroup ? { type: "separator", id: "print-separator" } : null,
    onPrintGroup
      ? { type: "item", id: "print-all", label: "Print all", icon: Printer, onSelect: () => onPrintGroup(group, "all") }
      : null,
    onPrintGroup
      ? {
          type: "item",
          id: "print-out-of-date",
          label: "Print out of date",
          icon: Printer,
          onSelect: () => onPrintGroup(group, "out-of-date"),
        }
      : null,
    onPrintGroup
      ? {
          type: "item",
          id: "print-unprinted",
          label: "Print unprinted",
          icon: Printer,
          onSelect: () => onPrintGroup(group, "unprinted"),
        }
      : null,
    { type: "separator", id: "danger-separator" },
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
