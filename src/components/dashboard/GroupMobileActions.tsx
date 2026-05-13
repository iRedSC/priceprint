import AddGroupDialog from "./AddGroupDialog"
import UndoLastPrintButton from "./UndoLastPrintButton"

type GroupMobileActionsProps = {
  onAddGroup: (name: string) => Promise<void> | void
  sessionToken: string | null
}

function GroupMobileActions({ onAddGroup, sessionToken }: GroupMobileActionsProps) {
  const fabRing =
    "size-16 rounded-full shadow-xl ring-1 ring-foreground/10 [&_svg]:size-8 touch-manipulation"

  return (
    <div className="safe-area-group-actions fixed z-40 md:hidden">
      <div className="flex flex-row items-center justify-center gap-3">
        <UndoLastPrintButton sessionToken={sessionToken} className={fabRing} />
        <AddGroupDialog onAddGroup={onAddGroup} triggerClassName={fabRing} />
      </div>
    </div>
  )
}

export default GroupMobileActions
