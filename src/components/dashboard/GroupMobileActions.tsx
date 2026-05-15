import AddGroupDialog from "./AddGroupDialog"
import DashboardMobileFab, { dashboardMobileFabTriggerClassName } from "./DashboardMobileFab"

type GroupMobileActionsProps = {
  onAddGroup: (name: string) => Promise<void> | void
}

function GroupMobileActions({ onAddGroup }: GroupMobileActionsProps) {
  return (
    <DashboardMobileFab>
      <AddGroupDialog
        onAddGroup={onAddGroup}
        triggerVariant="outline"
        triggerClassName={dashboardMobileFabTriggerClassName}
      />
    </DashboardMobileFab>
  )
}

export default GroupMobileActions
