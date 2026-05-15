import AddGroupDialog from "./AddGroupDialog"

type GroupMobileActionsProps = {
  onAddGroup: (name: string) => Promise<void> | void
}

function GroupMobileActions({ onAddGroup }: GroupMobileActionsProps) {
  const fabRing =
    "size-16 rounded-full shadow-xl ring-1 ring-foreground/10 [&_svg]:size-8 touch-manipulation"

  return (
    <div className="safe-area-group-actions fixed z-40 md:hidden">
      <div className="flex flex-row items-center justify-center gap-3">
        <AddGroupDialog onAddGroup={onAddGroup} triggerClassName={fabRing} />
      </div>
    </div>
  )
}

export default GroupMobileActions
