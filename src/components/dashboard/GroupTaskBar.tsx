import AddGroupDialog from "./AddGroupDialog"
import DashboardSearchInput from "./DashboardSearchInput"
import UndoLastPrintButton from "./UndoLastPrintButton"

type GroupTaskBarProps = {
  search: string
  onSearchChange: (search: string) => void
  onAddGroup: (name: string) => Promise<void> | void
  sessionToken: string | null
}

function GroupTaskBar({
  search,
  onSearchChange,
  onAddGroup,
  sessionToken,
}: GroupTaskBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="hidden items-center gap-2 md:flex">
        <UndoLastPrintButton sessionToken={sessionToken} />
        <AddGroupDialog onAddGroup={onAddGroup} />
      </div>
      <DashboardSearchInput
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search groups or products"
        containerClassName="sm:w-80"
      />
    </div>
  )
}

export default GroupTaskBar
