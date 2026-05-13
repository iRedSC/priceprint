import AddGroupDialog from "./AddGroupDialog"

type GroupMobileActionsProps = {
  onAddGroup: (name: string) => Promise<void> | void
}

function GroupMobileActions({ onAddGroup }: GroupMobileActionsProps) {
  return (
    <div className="fixed right-4 bottom-24 z-40 md:hidden">
      <AddGroupDialog onAddGroup={onAddGroup} />
    </div>
  )
}

export default GroupMobileActions
