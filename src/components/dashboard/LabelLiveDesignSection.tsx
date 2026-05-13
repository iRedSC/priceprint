import { useMutation, useQuery } from "convex/react";
import { useEffect, useState, type FormEvent } from "react";

import { readStoredSession } from "@/authSession";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../convex/_generated/api";

function LabelLiveDesignSection() {
  const [session] = useState(readStoredSession);
  const serverName = useQuery(
    api.userPrefs.getLabelLiveDesign,
    session ? { sessionToken: session.sessionToken } : "skip",
  );
  const setDesign = useMutation(api.userPrefs.setLabelLiveDesignName);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (serverName !== undefined) {
      setInput(serverName ?? "");
    }
  }, [serverName]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!session) {
      setMessage("Sign in again to save this setting.");
      return;
    }

    setIsBusy(true);
    setMessage("");

    try {
      await setDesign({ sessionToken: session.sessionToken, designName: input });
      setMessage("Saved Label LIVE design name.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save design name.");
    } finally {
      setIsBusy(false);
    }
  };

  const disabled = Boolean(!session || serverName === undefined);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardDescription>Label printing</CardDescription>
          <CardTitle>Label LIVE design</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Enter the pinned design filename (without{" "}
            <code className="text-xs">.lsc</code>) from Label LIVE. Group print commands use{" "}
            <code className="text-xs">localhost:11180</code>
            {""} HTTP or{" "}
            <code className="text-xs">labellive://batch</code> if the app is blocking the request.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="label-live-design">Design name</Label>
            <Input
              id="label-live-design"
              disabled={disabled}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="my-price-label"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
        <CardFooter className="sm:flex sm:justify-end">
          <Button
            type="submit"
            disabled={disabled || isBusy}
            className="h-11 touch-manipulation"
          >
            {isBusy ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default LabelLiveDesignSection;
