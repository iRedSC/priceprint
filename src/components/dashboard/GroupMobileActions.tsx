import AddGroupDialog from "./AddGroupDialog"

type GroupMobileActionsProps = {
  onAddGroup: (name: string) => Promise<void> | void
}

function GroupMobileActions({ onAddGroup }: GroupMobileActionsProps) {
  return (
    <div className="safe-area-group-actions fixed z-40 md:hidden">
      <AddGroupDialog onAddGroup={onAddGroup} />
    </div>
  )
}

export default GroupMobileActions
