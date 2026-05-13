import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "../../../convex/_generated/api"

type UndoLastPrintButtonProps = {
  sessionToken: string | null
  className?: string
}

function UndoLastPrintButton({ sessionToken, className }: UndoLastPrintButtonProps) {
  const [busy, setBusy] = useState(false)
  const canUndo = useQuery(
    api.printJobs.hasUndoablePrintBatch,
    sessionToken ? { sessionToken } : "skip",
  )
  const undo = useMutation(api.printJobs.undoLatestPrintJob)

  const disabled =
    !sessionToken || canUndo === undefined || !canUndo || busy

  const handleClick = async () => {
    if (!sessionToken || !canUndo) return
    const ok = window.confirm(
      "Undo the last label print batch? Print status for those products will revert.",
    )
    if (!ok) return

    setBusy(true)
    try {
      await undo({ sessionToken })
      window.alert("Last print batch was undone.")
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not undo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={disabled}
      aria-label="Undo last print batch"
      className={cn("touch-manipulation", className)}
      onClick={handleClick}
    >
      <Undo2 />
    </Button>
  )
}

export default UndoLastPrintButton
