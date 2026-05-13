import { useState } from "react"
import type { FormEvent } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddGroupDialogProps = {
  onAddGroup: (name: string) => Promise<void> | void
  triggerClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function AddGroupDialog({ onAddGroup, triggerClassName, open: controlledOpen, onOpenChange }: AddGroupDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const controlled = controlledOpen !== undefined && onOpenChange !== undefined
  const open = controlled ? controlledOpen : uncontrolledOpen
  const setOpen = controlled ? onOpenChange : setUncontrolledOpen
  const [name, setName] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      return
    }

    await onAddGroup(name)
    setName("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlled ? (
        <DialogTrigger asChild>
          <Button
            size="icon"
            aria-label="Add group"
            className={cn("touch-manipulation", triggerClassName)}
          >
            <Plus />
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add group</DialogTitle>
          <DialogDescription>Create a working group for scanned products.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              autoFocus
              enterKeyHint="done"
              autoComplete="off"
              autoCapitalize="words"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddGroupDialog
