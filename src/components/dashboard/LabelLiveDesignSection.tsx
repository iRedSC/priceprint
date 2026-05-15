import { useMutation, useQuery } from "convex/react";
import { useState, type FormEvent } from "react";

import { readStoredSession, type AuthResult } from "@/authSession";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../convex/_generated/api";

import LabelLiveVariablesInfo from "./LabelLiveVariablesInfo";

type LabelLiveServerSettings = {
  designName?: string | null;
  printerId?: string | null;
} | undefined;

type LabelLiveDesignFormProps = {
  session: AuthResult | null;
  serverSettings: LabelLiveServerSettings;
  setSettings: (_args: {
    sessionToken: string;
    designName: string;
    printerId: string;
  }) => Promise<void | null>;
};

function LabelLiveDesignForm({
  session,
  serverSettings,
  setSettings,
}: LabelLiveDesignFormProps) {
  const [designName, setDesignName] = useState(
    () => serverSettings?.designName ?? "",
  );
  const [printerId, setPrinterId] = useState(() => serverSettings?.printerId ?? "");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!session) {
      setMessage("Sign in again to save this setting.");
      return;
    }

    setIsBusy(true);
    setMessage("");

    try {
      await setSettings({
        sessionToken: session.sessionToken,
        designName,
        printerId,
      });
      setMessage("Saved Label LIVE settings.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save Label LIVE settings.");
    } finally {
      setIsBusy(false);
    }
  };

  const disabled = Boolean(!session || serverSettings === undefined);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardDescription>Label printing</CardDescription>
          <CardTitle>Label LIVE design</CardTitle>
          <CardAction>
            <LabelLiveVariablesInfo />
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Enter the pinned design filename (without{" "}
            <code className="text-xs">.lsc</code>) and printer ID from Label LIVE. Print commands use{" "}
            <code className="text-xs">labellive://print</code>.
          </p>
          <div className="grid gap-2">
            <Label htmlFor="label-live-design">Design name</Label>
            <Input
              id="label-live-design"
              disabled={disabled}
              value={designName}
              onChange={(event) => setDesignName(event.target.value)}
              placeholder="retail-label"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label-live-printer">Printer ID</Label>
            <Input
              id="label-live-printer"
              disabled={disabled}
              value={printerId}
              onChange={(event) => setPrinterId(event.target.value)}
              placeholder="Rollo-USB-588U0461721"
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

function LabelLiveDesignSection() {
  const [session] = useState(readStoredSession);
  const serverSettings = useQuery(
    api.userPrefs.getLabelLiveSettings,
    session ? { sessionToken: session.sessionToken } : "skip",
  );
  const setSettings = useMutation(api.userPrefs.setLabelLiveSettings);

  const formKey =
    serverSettings === undefined
      ? "pending"
      : `${serverSettings.designName ?? ""}\0${serverSettings.printerId ?? ""}`;

  return (
    <LabelLiveDesignForm
      key={formKey}
      session={session}
      serverSettings={serverSettings}
      setSettings={setSettings}
    />
  );
}

export default LabelLiveDesignSection;
