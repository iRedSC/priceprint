import type { GroupStatus } from "./groupTableData"

const statusLabels: Record<GroupStatus, string> = {
  active: "Active",
  review: "Review",
  ready_to_print: "Ready to print",
  printed: "Printed",
}

export function formatGroupStatus(status: GroupStatus) {
  return statusLabels[status]
}

export function formatGroupDate(value?: number) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(value)
}
