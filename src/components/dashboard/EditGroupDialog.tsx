import { useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { GroupRow } from "./groupTableData"

type EditGroupDialogProps = {
  group: GroupRow | null
  onOpenChange: (open: boolean) => void
  onUpdateGroup: (groupId: GroupRow["_id"], name: string) => Promise<void> | void
}

function EditGroupDialog({ group, onOpenChange, onUpdateGroup }: EditGroupDialogProps) {
  return (
    <Dialog open={!!group} onOpenChange={onOpenChange}>
      <DialogContent>
        {group ? (
          <EditGroupForm
            key={group._id}
            group={group}
            onOpenChange={onOpenChange}
            onUpdateGroup={onUpdateGroup}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type EditGroupFormProps = {
  group: GroupRow
  onOpenChange: (open: boolean) => void
  onUpdateGroup: (groupId: GroupRow["_id"], name: string) => Promise<void> | void
}

function EditGroupForm({ group, onOpenChange, onUpdateGroup }: EditGroupFormProps) {
  const [name, setName] = useState(group.name)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      return
    }

    await onUpdateGroup(group._id, name.trim())
    onOpenChange(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit group</DialogTitle>
        <DialogDescription>Update this working group's name.</DialogDescription>
      </DialogHeader>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="edit-group-name">Group name</Label>
          <Input
            id="edit-group-name"
            autoFocus
            enterKeyHint="done"
            autoComplete="off"
            autoCapitalize="words"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </>
  )
}

export default EditGroupDialog
