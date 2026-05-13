import AddGroupDialog from "./AddGroupDialog"

type GroupMobileActionsProps = {
  onAddGroup: (name: string) => Promise<void> | void
}

function GroupMobileActions({ onAddGroup }: GroupMobileActionsProps) {
  return (
    <div className="safe-area-group-actions fixed z-40 md:hidden">
      <AddGroupDialog
        onAddGroup={onAddGroup}
        triggerClassName="size-16 rounded-full shadow-xl ring-1 ring-foreground/10 [&_svg]:size-8"
      />
    </div>
  )
}

export default GroupMobileActions
