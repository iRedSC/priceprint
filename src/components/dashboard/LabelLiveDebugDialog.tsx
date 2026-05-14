import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { LabelLiveDebugMessage } from "@/lib/labelLiveDebug"

type LabelLiveDebugDialogProps = {
  message: LabelLiveDebugMessage | null
  onOpenChange: (open: boolean) => void
}

function LabelLiveDebugDialog({ message, onOpenChange }: LabelLiveDebugDialogProps) {
  return (
    <Dialog open={Boolean(message)} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-2xl">
        {message ? (
          <>
            <DialogHeader>
              <DialogTitle>{message.title}</DialogTitle>
              <DialogDescription>{message.description}</DialogDescription>
            </DialogHeader>
            <pre className="max-h-[55svh] overflow-auto rounded-lg border bg-muted p-3 text-xs whitespace-pre-wrap text-muted-foreground">
              {message.detail}
            </pre>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default LabelLiveDebugDialog
