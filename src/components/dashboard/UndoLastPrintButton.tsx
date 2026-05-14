import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { Undo2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { api } from "../../../convex/_generated/api"

type UndoLastPrintButtonProps = {
  sessionToken: string | null
  className?: string
}

function UndoLastPrintButton({ sessionToken, className }: UndoLastPrintButtonProps) {
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const canUndo = useQuery(
    api.printJobs.hasUndoablePrintBatch,
    sessionToken ? { sessionToken } : "skip",
  )
  const undo = useMutation(api.printJobs.undoLatestPrintJob)

  const disabled =
    !sessionToken || canUndo === undefined || !canUndo || busy

  const handleClick = async () => {
    if (!sessionToken || !canUndo) return

    setBusy(true)
    try {
      await undo({ sessionToken })
      setConfirmOpen(false)
      toast.success("Last print batch was undone.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not undo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        aria-label="Undo last print batch"
        className={cn("touch-manipulation", className)}
        onClick={() => setConfirmOpen(true)}
      >
        <Undo2 />
      </Button>
      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!busy) {
            setConfirmOpen(open)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Undo last print batch?</DialogTitle>
            <DialogDescription>
              Print status for those products will revert.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={busy}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" disabled={busy} onClick={handleClick}>
              {busy ? "Undoing..." : "Undo batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UndoLastPrintButton
