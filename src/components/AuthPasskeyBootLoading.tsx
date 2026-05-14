import { Loader2 } from "lucide-react";

function AuthPasskeyBootLoading() {
  return (
    <div
      className="grid place-items-center gap-4 py-10 text-center"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-muted-foreground touch-manipulation" />
      <p className="text-sm text-muted-foreground">Checking for a saved passkey…</p>
    </div>
  );
}

export default AuthPasskeyBootLoading;
